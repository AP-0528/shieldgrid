import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProfileRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent: string;
}

function ProfileRow({ icon, label, value, accent }: ProfileRowProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as 'light' | 'dark'];
  return (
    <View style={[rowStyles.container, { borderBottomColor: theme.border }]}>
      <View style={[rowStyles.iconBox, { backgroundColor: accent + '15' }]}>
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <View style={rowStyles.textGroup}>
        <ThemedText style={rowStyles.label}>{label}</ThemedText>
        <ThemedText style={rowStyles.value}>{value}</ThemedText>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textGroup: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);

  const API_URL = 'http://localhost:3000';

  React.useEffect(() => {
    async function getSession() {
      const session = await AsyncStorage.getItem('user_session');
      if (session) setUser(JSON.parse(session));
    }
    getSession();
  }, []);

  const handleReset = async () => {
    try {
      // 1. Wipe Backend
      await fetch(`${API_URL}/demo/reset`, { method: 'POST' });
      // 2. Wipe Local
      await AsyncStorage.clear();
      // 3. Restart
      router.replace('/register');
    } catch (e) {
      console.warn('Reset failed:', e);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Gradient hero */}
      <LinearGradient
        colors={[theme.primary + 'CC', theme.background]}
        style={styles.hero}
      >
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <ThemedText type="title" style={styles.workerName}>{user?.fullName || 'Shield Worker'}</ThemedText>
        <ThemedText style={styles.workerRole}>Delivery Partner · {user?.linkedPlatform || 'ShieldGrid'}</ThemedText>
        <View style={[styles.verifiedBadge, { backgroundColor: theme.success + '25', borderColor: theme.success + '50' }]}>
          <Ionicons name="checkmark-circle" size={13} color={theme.success} />
          <ThemedText style={[styles.verifiedText, { color: theme.success }]}>KYC Verified</ThemedText>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Account details */}
        <ThemedText style={[styles.sectionLabel, { color: theme.icon }]}>Account</ThemedText>
        <ThemedView style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ProfileRow
            icon="person-outline"
            label="Full Name"
            value={user?.fullName || '...'}
            accent={theme.primary}
          />
          <ProfileRow
            icon="phone-portrait-outline"
            label="Mobile"
            value="+91 98765 43210"
            accent={theme.secondary}
          />
          <ProfileRow
            icon="mail-outline"
            label="Email"
            value={user?.fullName?.toLowerCase()?.replace(' ', '.') + '@gmail.com'}
            accent={theme.primary}
          />
          <ProfileRow
            icon="id-card-outline"
            label="Worker ID"
            value={user?.workerId || '...'}
            accent={theme.icon}
          />
        </ThemedView>

        {/* Payout details */}
        <ThemedText style={[styles.sectionLabel, { color: theme.icon }]}>Payout</ThemedText>
        <ThemedView style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ProfileRow
            icon="qr-code-outline"
            label="UPI ID (Masked)"
            value={user?.upiId ? `${user.upiId.slice(0, 4)}****@oksbi` : '...'}
            accent={theme.success}
          />
          <ProfileRow
            icon="business-outline"
            label="Linked Platform"
            value={user?.linkedPlatform || '...'}
            accent={theme.warning}
          />
          <ProfileRow
            icon="calendar-outline"
            label="Coverage Since"
            value="Apr 04, 2026"
            accent={theme.secondary}
          />
        </ThemedView>

        {/* Account actions */}
        <ThemedView style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity style={[styles.actionRow, { borderBottomColor: theme.border }]} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={20} color={theme.icon} />
            <ThemedText style={styles.actionLabel}>Notification Preferences</ThemedText>
            <Ionicons name="chevron-forward" size={16} color={theme.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionRow, { borderBottomColor: theme.border }]} activeOpacity={0.7}>
            <Ionicons name="document-outline" size={20} color={theme.icon} />
            <ThemedText style={styles.actionLabel}>Policy Archive</ThemedText>
            <Ionicons name="chevron-forward" size={16} color={theme.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionRow, { borderBottomColor: 'transparent' }]} activeOpacity={0.7} onPress={handleReset}>
            <Ionicons name="refresh-circle-outline" size={20} color={theme.danger} />
            <ThemedText style={[styles.actionLabel, { color: theme.danger }]}>Reset Demonstration</ThemedText>
            <Ionicons name="alert-circle" size={16} color={theme.danger} />
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  workerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  workerRole: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: -8,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});
