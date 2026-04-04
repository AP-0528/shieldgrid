import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface PayoutRecord {
  id: string;
  date: string;
  payout: string;
  amount: number;
  status: string;
  trigger: string;
  location: string;
  coverageWeek: string;
  txId: string;
}

// Trigger type config for icons and colors
const TRIGGER_CONFIG: Record<string, { icon: keyof typeof Ionicons.glyphMap; label: string; colorKey: 'danger' | 'warning' | 'primary' | 'secondary' | 'success' }> = {
  RAINFALL:     { icon: 'rainy',          label: 'Severe Rainfall',   colorKey: 'primary' },
  HEATWAVE:     { icon: 'thermometer',    label: 'Heatwave Alert',    colorKey: 'danger' },
  TRAFFIC_JAM:  { icon: 'car',           label: 'Traffic Gridlock',  colorKey: 'warning' },
  AQI_HAZARD:   { icon: 'cloud-offline', label: 'Air Quality Hazard', colorKey: 'secondary' },
  CIVIC_CURFEW: { icon: 'ban',           label: 'Civic Curfew',      colorKey: 'danger' },
};

function EmptyState({ theme }: { theme: typeof Colors.dark }) {
  return (
    <View style={emptyStyles.container}>
      <Ionicons name="receipt-outline" size={48} color={theme.icon} style={{ opacity: 0.35 }} />
      <ThemedText style={emptyStyles.title}>No Claims Yet</ThemedText>
      <ThemedText style={emptyStyles.subtitle}>
        When a disruption event triggers a payout, your claim records will appear here automatically.
      </ThemedText>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 60, gap: 12 },
  title: { fontSize: 18, fontWeight: '700', opacity: 0.7 },
  subtitle: { fontSize: 14, opacity: 0.4, textAlign: 'center', lineHeight: 22 },
});

function ClaimCard({ item, theme }: { item: PayoutRecord; theme: typeof Colors.dark }) {
  const config = TRIGGER_CONFIG[item.trigger] || { icon: 'flash', label: item.trigger, colorKey: 'primary' as const };
  const accentColor = theme[config.colorKey];
  const isCompleted = item.status === 'COMPLETED';

  return (
    <View style={[cardStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {/* Header Row */}
      <View style={cardStyles.header}>
        <View style={[cardStyles.triggerBadge, { backgroundColor: accentColor + '15' }]}>
          <Ionicons name={config.icon} size={16} color={accentColor} />
          <ThemedText style={[cardStyles.triggerLabel, { color: accentColor }]}>
            {config.label}
          </ThemedText>
        </View>
        <View style={[cardStyles.statusBadge, { backgroundColor: isCompleted ? theme.success + '15' : theme.warning + '15' }]}>
          <View style={[cardStyles.statusDot, { backgroundColor: isCompleted ? theme.success : theme.warning }]} />
          <ThemedText style={[cardStyles.statusText, { color: isCompleted ? theme.success : theme.warning }]}>
            {item.status}
          </ThemedText>
        </View>
      </View>

      {/* Payout Amount */}
      <View style={cardStyles.amountRow}>
        <ThemedText style={[cardStyles.amount, { color: theme.success }]}>{item.payout}</ThemedText>
        <ThemedText style={cardStyles.dateText}>{item.date}</ThemedText>
      </View>

      {/* Divider */}
      <View style={[cardStyles.divider, { backgroundColor: theme.border }]} />

      {/* Meta Row */}
      <View style={cardStyles.metaGrid}>
        <View style={cardStyles.metaItem}>
          <Ionicons name="location-outline" size={12} color={theme.icon} />
          <ThemedText style={cardStyles.metaText}>{item.location}</ThemedText>
        </View>
        <View style={cardStyles.metaItem}>
          <Ionicons name="calendar-outline" size={12} color={theme.icon} />
          <ThemedText style={cardStyles.metaText}>{item.coverageWeek}</ThemedText>
        </View>
      </View>

      {/* Transaction ID */}
      <View style={[cardStyles.txRow, { borderColor: theme.border }]}>
        <Ionicons name="checkmark-circle" size={12} color={theme.success} />
        <ThemedText style={cardStyles.txText} numberOfLines={1}>
          Txn: {item.txId}
        </ThemedText>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: { borderRadius: 20, padding: 18, borderWidth: 1, gap: 12, marginBottom: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  triggerBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  triggerLabel: { fontSize: 12, fontWeight: '700' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  amount: { fontSize: 32, fontWeight: '900' },
  dateText: { fontSize: 12, opacity: 0.5, marginBottom: 4 },
  divider: { height: 1 },
  metaGrid: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, opacity: 0.55 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 8, borderTopWidth: 1 },
  txText: { fontSize: 11, opacity: 0.4, fontFamily: 'monospace', flex: 1 },
});

// Coverage Catalog — shows all 5 triggers
const TRIGGER_CATALOG = [
  { event: 'RAINFALL', label: 'Severe Rainfall', desc: '>50mm/hr', payout: '₹800' },
  { event: 'HEATWAVE', label: 'Heatwave', desc: '>45°C', payout: '₹600' },
  { event: 'TRAFFIC_JAM', label: 'Traffic Gridlock', desc: '<5 km/h', payout: '₹500' },
  { event: 'AQI_HAZARD', label: 'Air Quality', desc: 'AQI >300', payout: '₹400' },
  { event: 'CIVIC_CURFEW', label: 'Civic Curfew', desc: 'Section 144', payout: '₹1000' },
];

function CoverageCatalog({ theme }: { theme: typeof Colors.dark }) {
  return (
    <View style={catalogStyles.container}>
      <ThemedText style={[catalogStyles.title, { color: theme.icon }]}>Covered Disruptions</ThemedText>
      <View style={[catalogStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {TRIGGER_CATALOG.map((t, idx) => {
          const cfg = TRIGGER_CONFIG[t.event];
          const accent = theme[cfg.colorKey];
          return (
            <View key={t.event} style={[catalogStyles.row, idx < TRIGGER_CATALOG.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
              <View style={[catalogStyles.iconBox, { backgroundColor: accent + '15' }]}>
                <Ionicons name={cfg.icon} size={16} color={accent} />
              </View>
              <View style={catalogStyles.textGroup}>
                <ThemedText style={catalogStyles.rowLabel}>{t.label}</ThemedText>
                <ThemedText style={catalogStyles.rowDesc}>{t.desc}</ThemedText>
              </View>
              <ThemedText style={[catalogStyles.rowPayout, { color: theme.success }]}>{t.payout}</ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const catalogStyles = StyleSheet.create({
  container: { gap: 10 },
  title: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: -2 },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  textGroup: { flex: 1 },
  rowLabel: { fontSize: 13, fontWeight: '600' },
  rowDesc: { fontSize: 11, opacity: 0.45 },
  rowPayout: { fontSize: 14, fontWeight: '800' },
});

export default function ClaimsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const [history, setHistory] = React.useState<PayoutRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const API_URL = 'http://localhost:3000';

  const fetchHistory = async () => {
    try {
      const session = await AsyncStorage.getItem('user_session');
      if (!session) return;
      const user = JSON.parse(session);

      const res = await fetch(`${API_URL}/payouts/${user.id}`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('History fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Banner Header */}
      <ThemedView style={styles.header}>
        <Image
          source={require('@/assets/images/history_banner.png')}
          style={styles.banner}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', theme.background]}
          style={styles.gradient}
        />
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title" style={styles.title}>Claims</ThemedText>
          <ThemedText style={styles.subtitle}>Zero-Touch Payout History</ThemedText>
        </ThemedView>
      </ThemedView>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<CoverageCatalog theme={theme} />}
        ListHeaderComponentStyle={{ marginBottom: 20 }}
        ListEmptyComponent={!isLoading ? <EmptyState theme={theme} /> : null}
        renderItem={({ item }) => <ClaimCard item={item} theme={theme} />}
        onRefresh={fetchHistory}
        refreshing={isLoading}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 220, width: '100%', position: 'relative' },
  banner: { ...StyleSheet.absoluteFillObject },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 },
  headerContent: { position: 'absolute', bottom: 20, left: 20, backgroundColor: 'transparent' },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  subtitle: { opacity: 0.55, fontSize: 14, marginTop: 2 },
  listContainer: { padding: 20, paddingBottom: 40 },
});
