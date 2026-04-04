import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RiskMeter } from '@/components/RiskMeter';
import { WalletCard } from '@/components/WalletCard';
import { useLocationTask } from '@/hooks/use-location-task';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const router = useRouter();
  const { isTracking, permissionStatus, startTracking, stopTracking } = useLocationTask();

  // Live Backend State
  const [workerName, setWorkerName] = useState('Loading...');
  const [premiumPaid, setPremiumPaid] = useState(0);
  const [policyStatus, setPolicyStatus] = useState<'LIVE' | 'INACTIVE'>('INACTIVE');
  const [isLoading, setIsLoading] = useState(true);
  const [currentRisk, setCurrentRisk] = useState(0.42);
  const [riskDesc, setRiskDesc] = useState('Moderate Risk — Rain Expected');

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (!session) {
          router.replace('/register');
          return;
        }

        const user = JSON.parse(session);
        setWorkerName(user.fullName);

        // Fetch latest policy for this user
        // For demo, we just re-issue or fetch. Let's assume we fetch.
        // Actually, we'll just use the onboarded user to show live stats.
        const policyRes = await fetch(`${API_URL}/policy/issue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, zone: "Koramangala, BLR" })
        });
        const policyData = await policyRes.json();
        
        setPremiumPaid(policyData.risk_assessment.final_premium || 15);
        setPolicyStatus('LIVE');
      } catch (e) {
        console.warn('Sync error:', e);
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, []);

  const refreshRisk = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/policy/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current', zone: "Koramangala, BLR" })
      });
      const data = await res.json();
      setPremiumPaid(data.risk_assessment.final_premium);
      Alert.alert('☁️ Oracle Sync', 'Hyperlocal risk recalculated using live XGBoost model.');
    } catch (e) {
      Alert.alert('Error', 'ML Oracle unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerMockDisaster = async () => {
    // Demo Validation Check
    if (!isTracking) {
      Alert.alert(
        "🚨 Verification Failed",
        "ShieldGrid cannot verify your presence in the disruption zone because Location Tracking is OFF. Please turn ON tracking to secure your payout."
      );
      return;
    }

    try {
      Alert.alert("🚨 Oracle Triggered", "Submitting mock 80mm rainfall event to ML Oracle...");
      
      // Visual Spike
      setCurrentRisk(1.0);
      setRiskDesc('EXTREME — Severe Rainfall Detected');

      const res = await fetch(`${API_URL}/payouts/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone: "Koramangala, BLR", event_type: "RAINFALL", value: 80.0 })
      });
      
      const data = await res.json();
      if (data.success) {
        Alert.alert("✅ Payout Processed", `Validation passed. UPI Payout released via Razorpay.`);
        setPolicyStatus('INACTIVE'); // Policy consumed
      }
    } catch (e) {
      Alert.alert("Error", "Could not reach API.");
      setCurrentRisk(0.42); // Reset on error
    }
  };

  const handleTrackingToggle = () => {
    if (isTracking) stopTracking();
    else startTracking();
  };

  const trackingColor = isTracking ? theme.success : theme.warning;
  const trackingIcon: keyof typeof Ionicons.glyphMap = isTracking ? 'radio' : 'radio-outline';
  const trackingLabel = isTracking ? 'Location Verified' : 'Tracking Off';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        <Image source={require('@/assets/images/shieldgrid_banner.png')} style={styles.banner} contentFit="cover" />
        <LinearGradient colors={['transparent', theme.background]} style={styles.gradient} />
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title" style={styles.title}>ShieldGrid</ThemedText>
          <ThemedText style={styles.subtitle}>Welcome back, {workerName}</ThemedText>
        </ThemedView>

        <TouchableOpacity
          style={[styles.trackingPill, { backgroundColor: trackingColor + '25', borderColor: trackingColor + '60' }]}
          onPress={handleTrackingToggle}
        >
          <Ionicons name={trackingIcon} size={13} color={trackingColor} />
          <ThemedText style={[styles.trackingLabel, { color: trackingColor }]}>{trackingLabel}</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.content}>
        {isLoading ? (
          <ThemedText style={styles.sectionLabel}>Syncing with Oracle...</ThemedText>
        ) : (
          <WalletCard
            status={policyStatus}
            weeklyLimit={1500}
            premiumPaid={premiumPaid}
            coveragePeriod={'Apr 01–07'}
            onPressDetails={() => router.push('/modal')}
          />
        )}

        <RiskMeter
          riskLevel={currentRisk}
          location="Koramangala, BLR"
          description={riskDesc}
        />

        <ThemedText style={styles.sectionLabel}>Quick Actions</ThemedText>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionItem, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={refreshRisk}
          >
            <Ionicons name="cloud-download-outline" size={24} color={theme.primary} />
            <ThemedText style={styles.actionLabel}>Refresh Risk</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="shield-checkmark-outline" size={24} color={theme.success} />
            <ThemedText style={styles.actionLabel}>Claims</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionItem, { backgroundColor: theme.danger + '10', borderColor: theme.danger }]}
            onPress={triggerMockDisaster}
          >
            <Ionicons name="thunderstorm-outline" size={24} color={theme.danger} />
            <ThemedText style={[styles.actionLabel, { color: theme.danger }]}>Trigger Storm</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="help-circle-outline" size={24} color={theme.icon} />
            <ThemedText style={styles.actionLabel}>Support</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 260, width: '100%', position: 'relative' },
  banner: { ...StyleSheet.absoluteFillObject },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 160 },
  headerContent: { position: 'absolute', bottom: 20, left: 20, backgroundColor: 'transparent' },
  title: { fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  subtitle: { opacity: 0.65, fontSize: 15, marginTop: 4 },
  trackingPill: { position: 'absolute', top: Platform.OS === 'ios' ? 56 : 36, right: 16, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  trackingLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  content: { padding: 20, gap: 20, marginTop: -10 },
  sectionLabel: { fontSize: 13, fontWeight: '700', opacity: 0.45, textTransform: 'uppercase', letterSpacing: 1, marginBottom: -8 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  actionItem: { width: '48%', paddingVertical: 18, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionLabel: { fontSize: 13, fontWeight: '600' },
});
