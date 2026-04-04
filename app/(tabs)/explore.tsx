import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PayoutRecord {
  id: string;
  date: string;
  payout: string;
  status: string;
  trigger: string;
  location: string;
  coverageWeek: string;
  txId: string;
}

function EmptyState({ theme }: { theme: typeof Colors.dark }) {
  return (
    <View style={emptyStyles.container}>
      <Ionicons name="shield-outline" size={56} color={theme.border} />
      <ThemedText style={emptyStyles.title}>No payouts yet</ThemedText>
      <ThemedText style={emptyStyles.subtitle}>
        Trigger events and validated payouts will appear here.
      </ThemedText>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 20,
  },
});

function PayoutCard({ item, theme }: { item: PayoutRecord; theme: typeof Colors.dark }) {
  const isCompleted = item.status === 'COMPLETED';
  const isPending = item.status === 'PENDING';
  const statusColor = isCompleted ? theme.success : isPending ? theme.warning : theme.danger;
  const iconName: keyof typeof Ionicons.glyphMap = isCompleted
    ? 'checkmark-circle'
    : isPending
    ? 'time'
    : 'close-circle';

  return (
    <ThemedView style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={22} color={statusColor} />
          <ThemedText style={styles.dateText}>{item.date}</ThemedText>
        </View>
        <View>
          <ThemedText type="title" style={[styles.payoutAmount, { color: statusColor }]}>
            {item.payout}
          </ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <ThemedText style={[styles.statusBadgeText, { color: statusColor }]}>
              {item.status}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.detailsContainer}>
        <ThemedText style={styles.detailLabel}>Trigger Event</ThemedText>
        <ThemedText style={styles.detailValue}>{item.trigger}</ThemedText>
      </View>
      <View style={styles.detailsContainer}>
        <ThemedText style={styles.detailLabel}>Validated Zone</ThemedText>
        <ThemedText style={styles.detailValue}>{item.location}</ThemedText>
      </View>
      <View style={styles.detailsContainer}>
        <ThemedText style={styles.detailLabel}>Coverage Week</ThemedText>
        <ThemedText style={styles.detailValue}>{item.coverageWeek}</ThemedText>
      </View>
      <View style={styles.detailsContainer}>
        <ThemedText style={styles.detailLabel}>Transaction Ref</ThemedText>
        <ThemedText style={[styles.detailValue, { opacity: 0.5, fontSize: 12 }]}>
          {item.txId}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

export default function HistoryScreen() {
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
      setHistory(data);
    } catch (e) {
      console.warn('History fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
    // Refresh every 5 seconds for the demo
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
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
          <ThemedText type="title" style={styles.title}>History</ThemedText>
          <ThemedText style={styles.subtitle}>Payout & Trigger Logs</ThemedText>
        </ThemedView>
      </ThemedView>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<EmptyState theme={theme} />}
        renderItem={({ item }) => <PayoutCard item={item} theme={theme} />}
        onRefresh={fetchHistory}
        refreshing={isLoading}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  banner: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  headerContent: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 14,
    marginTop: 2,
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
  },
  payoutAmount: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'right',
    lineHeight: 26,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    opacity: 0.2,
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  detailLabel: {
    opacity: 0.5,
    fontSize: 13,
    flexShrink: 0,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
});
