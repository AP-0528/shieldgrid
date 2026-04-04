import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PLATFORMS = ['Zomato', 'Swiggy', 'Blinkit', 'Dunzo', 'Zepto'];
const ZONES = ['Koramangala, BLR', 'Whitefield, BLR', 'Indiranagar, BLR', 'HSR Layout, BLR'];

export default function RegisterScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('Zomato');
  const [selectedZone, setSelectedZone] = useState('Koramangala, BLR');
  const [premiumPreview, setPremiumPreview] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const API_URL = 'http://localhost:3000';
  const ML_URL = 'http://localhost:8000';

  const previewPremium = async (zone: string, platform: string) => {
    setIsPreviewing(true);
    try {
      const res = await fetch(`${ML_URL}/evaluate-zone-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone, platform })
      });
      if (res.ok) {
        const data = await res.json();
        setPremiumPreview(data);
      }
    } catch (e) {
      // ML Oracle offline — show fallback
      setPremiumPreview({ final_premium: 15, risk_multiplier: 1.0, zone_safety_discount: 0 });
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleZoneChange = (zone: string) => {
    setSelectedZone(zone);
    previewPremium(zone, selectedPlatform);
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    previewPremium(selectedZone, platform);
  };

  const handleRegister = async () => {
    if (!fullName || !workerId || !upiId) {
      Alert.alert('Missing Info', 'Please fill in all fields to secure your shield.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Onboard Worker
      const res = await fetch(`${API_URL}/users/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, workerId, upiId, linkedPlatform: selectedPlatform })
      });

      if (!res.ok) throw new Error('Onboarding failed');
      const user = await res.json();

      // 2. Save Session
      await AsyncStorage.setItem('user_session', JSON.stringify({
        ...user,
        linkedPlatform: selectedPlatform,
        zone: selectedZone
      }));

      // 3. Issue Policy with Zone & Platform
      await fetch(`${API_URL}/policy/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, zone: selectedZone, platform: selectedPlatform })
      });

      Alert.alert('✅ Shield Activated!', `Welcome, ${fullName}! Weekly premium: ₹${premiumPreview?.final_premium || 15}`);
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Error', 'Could not connect to ShieldGrid servers. Make sure the API is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.iconHeader}>
          <LinearGradient colors={[theme.primary, theme.primary + '80']} style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={40} color="#fff" />
          </LinearGradient>
          <ThemedText type="title" style={styles.title}>Secure Your Shield</ThemedText>
          <ThemedText style={styles.subtitle}>Enter your details to join the protection grid</ThemedText>
        </View>

        {/* Premium Preview Banner */}
        {premiumPreview && (
          <LinearGradient
            colors={[theme.primary + '20', theme.primary + '05']}
            style={[styles.premiumBanner, { borderColor: theme.primary + '40' }]}
          >
            <View style={styles.premiumRow}>
              <ThemedText style={styles.premiumLabel}>Weekly Premium</ThemedText>
              <ThemedText style={[styles.premiumValue, { color: theme.primary }]}>
                ₹{premiumPreview.final_premium}
              </ThemedText>
            </View>
            <View style={styles.premiumRow}>
              <ThemedText style={styles.premiumMeta}>Base ₹15 × {premiumPreview.risk_multiplier}x risk</ThemedText>
              {premiumPreview.zone_safety_discount > 0 && (
                <View style={[styles.discountBadge, { backgroundColor: theme.success + '20' }]}>
                  <Ionicons name="checkmark-circle" size={12} color={theme.success} />
                  <ThemedText style={[styles.discountText, { color: theme.success }]}>
                    -₹{premiumPreview.zone_safety_discount} Safe Zone
                  </ThemedText>
                </View>
              )}
            </View>
          </LinearGradient>
        )}

        <ThemedView style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor={theme.icon}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Worker ID */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Worker ID</ThemedText>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
              placeholder="e.g. SWG-ZOM-9921"
              placeholderTextColor={theme.icon}
              value={workerId}
              onChangeText={setWorkerId}
            />
          </View>

          {/* UPI ID */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>UPI ID (for Payouts)</ThemedText>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
              placeholder="e.g. name@paytm"
              placeholderTextColor={theme.icon}
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
            />
          </View>

          {/* Platform Selector */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Delivery Platform</ThemedText>
            <View style={styles.chipRow}>
              {PLATFORMS.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.chip,
                    { borderColor: selectedPlatform === p ? theme.primary : theme.border },
                    selectedPlatform === p && { backgroundColor: theme.primary + '15' }
                  ]}
                  onPress={() => handlePlatformChange(p)}
                >
                  <ThemedText style={[styles.chipText, selectedPlatform === p && { color: theme.primary, fontWeight: '700' }]}>
                    {p}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Zone Selector */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Operating Zone</ThemedText>
            <ThemedText style={[styles.labelHint, { color: theme.icon }]}>
              Safer zones get a premium discount
            </ThemedText>
            <View style={styles.chipRow}>
              {ZONES.map(z => (
                <TouchableOpacity
                  key={z}
                  style={[
                    styles.chip,
                    { borderColor: selectedZone === z ? theme.primary : theme.border },
                    selectedZone === z && { backgroundColor: theme.primary + '15' }
                  ]}
                  onPress={() => handleZoneChange(z)}
                >
                  <ThemedText style={[styles.chipText, selectedZone === z && { color: theme.primary, fontWeight: '700' }]}>
                    {z}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            <ThemedText style={styles.buttonText}>{isSubmitting ? 'Activating Shield...' : 'Get Coverage'}</ThemedText>
            {!isSubmitting && <Ionicons name="arrow-forward" size={18} color="#fff" />}
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 60, gap: 28, paddingBottom: 40 },
  iconHeader: { alignItems: 'center', gap: 12 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', textAlign: 'center' },
  subtitle: { fontSize: 15, opacity: 0.6, textAlign: 'center' },
  premiumBanner: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  premiumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  premiumLabel: { fontSize: 12, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '700' },
  premiumValue: { fontSize: 28, fontWeight: '900' },
  premiumMeta: { fontSize: 12, opacity: 0.5 },
  discountBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  discountText: { fontSize: 11, fontWeight: '700' },
  form: { gap: 20 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '700', opacity: 0.8, textTransform: 'uppercase', letterSpacing: 0.5 },
  labelHint: { fontSize: 11, opacity: 0.6, marginTop: -2 },
  input: { height: 52, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  chipText: { fontSize: 13 },
  button: { height: 56, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
