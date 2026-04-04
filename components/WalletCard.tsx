import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface WalletCardProps {
  status: 'LIVE' | 'INACTIVE';
  weeklyLimit: number;
  premiumPaid: number;
  coveragePeriod: string;
  onPressDetails: () => void;
}

export function WalletCard({
  status,
  weeklyLimit,
  premiumPaid,
  coveragePeriod,
  onPressDetails,
}: WalletCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as 'light' | 'dark'];

  const isLive = status === 'LIVE';
  const statusColor = isLive ? theme.success : theme.danger;

  return (
    <ThemedView style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <ThemedText type="subtitle">Active Coverage</ThemedText>
        <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
          {isLive && (
            <View style={[styles.liveDot, { backgroundColor: statusColor }]} />
          )}
          <ThemedText style={[styles.badgeText, { color: statusColor }]}>
            {status}
          </ThemedText>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <ThemedText style={styles.statLabel}>Weekly Limit</ThemedText>
          <ThemedText type="title" style={[styles.statValue, { color: theme.primary }]}>
            ₹{weeklyLimit.toLocaleString('en-IN')}
          </ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.stat}>
          <ThemedText style={styles.statLabel}>Premium</ThemedText>
          <ThemedText type="title" style={styles.statValue}>
            ₹{premiumPaid}
          </ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.stat}>
          <ThemedText style={styles.statLabel}>This Week</ThemedText>
          <ThemedText style={styles.coveragePeriod}>{coveragePeriod}</ThemedText>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={onPressDetails}
        activeOpacity={0.85}
      >
        <Ionicons name="document-text-outline" size={16} color="#fff" />
        <ThemedText style={styles.buttonText}>View Policy Details</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 4,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.55,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  coveragePeriod: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  divider: {
    width: 1,
    height: 36,
    opacity: 0.25,
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
