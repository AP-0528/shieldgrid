import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PolicyRowProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

function PolicyRow({ label, value, icon, iconColor }: PolicyRowProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as 'light' | 'dark'];
  return (
    <View style={[rowStyles.container, { borderBottomColor: theme.border }]}>
      <View style={rowStyles.left}>
        <View style={[rowStyles.iconBox, { backgroundColor: iconColor + '18' }]}>
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>
        <ThemedText style={rowStyles.label}>{label}</ThemedText>
      </View>
      <ThemedText style={rowStyles.value}>{value}</ThemedText>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    opacity: 0.65,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },
});

export default function PolicyModal() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as 'light' | 'dark'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
        <ThemedText type="subtitle" style={styles.modalTitle}>Policy Details</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton} activeOpacity={0.7}>
          <Ionicons name="close" size={22} color={theme.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status banner */}
        <View style={[styles.statusBanner, { backgroundColor: theme.success + '15', borderColor: theme.success + '40' }]}>
          <Ionicons name="shield-checkmark" size={24} color={theme.success} />
          <View>
            <ThemedText style={[styles.statusTitle, { color: theme.success }]}>Policy Active</ThemedText>
            <ThemedText style={styles.statusSub}>Parametric cover is live for this week</ThemedText>
          </View>
        </View>

        {/* Policy rows */}
        <ThemedView style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <PolicyRow
            label="Policy Number"
            value="SG-BLR-2025-00412"
            icon="document-text-outline"
            iconColor={theme.primary}
          />
          <PolicyRow
            label="Coverage Period"
            value="Apr 01 – Apr 07, 2026"
            icon="calendar-outline"
            iconColor={theme.secondary}
          />
          <PolicyRow
            label="Weekly Limit"
            value="₹1,500"
            icon="cash-outline"
            iconColor={theme.success}
          />
          <PolicyRow
            label="Premium Paid"
            value="₹25 / week"
            icon="card-outline"
            iconColor={theme.warning}
          />
          <PolicyRow
            label="Covered Zone"
            value="Koramangala, BLR"
            icon="location-outline"
            iconColor={theme.danger}
          />
          <PolicyRow
            label="Platform Linked"
            value="Zomato"
            icon="bicycle-outline"
            iconColor={theme.primary}
          />
        </ThemedView>

        {/* Trigger conditions */}
        <ThemedText style={[styles.sectionHeading, { color: theme.icon }]}>Trigger Conditions</ThemedText>
        <ThemedView style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <PolicyRow
            label="Rainfall Trigger"
            value="> 50 mm / hr"
            icon="rainy-outline"
            iconColor={theme.primary}
          />
          <PolicyRow
            label="Heatwave Trigger"
            value="> 45 °C (IMD confirmed)"
            icon="thermometer-outline"
            iconColor={theme.danger}
          />
          <PolicyRow
            label="Civic Disruption"
            value="Verified Section 144"
            icon="warning-outline"
            iconColor={theme.warning}
          />
          <PolicyRow
            label="Traffic Velocity Drop"
            value="> 80% (Mapbox)"
            icon="car-outline"
            iconColor={theme.secondary}
          />
        </ThemedView>

        {/* Underwriter note */}
        <View style={[styles.noteBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="information-circle-outline" size={16} color={theme.icon} />
          <ThemedText style={[styles.noteText, { color: theme.icon }]}>
            ShieldGrid operates as a technology layer. Group Parametric Policy is underwritten by an
            IRDAI-licensed non-life insurer. Payouts are processed via Razorpay UPI within 2 hours
            of trigger validation.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  statusSub: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
    marginBottom: -8,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
    opacity: 0.7,
  },
});
