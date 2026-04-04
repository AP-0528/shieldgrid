import React, { useRef, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface RiskMeterProps {
  riskLevel: number; // 0 to 1
  location: string;
  description: string;
}

export function RiskMeter({ riskLevel, location, description }: RiskMeterProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const [meterWidth, setMeterWidth] = useState(0);

  const onMeterLayout = (e: LayoutChangeEvent) => {
    setMeterWidth(e.nativeEvent.layout.width);
  };

  // Clamp between 0..1
  const clampedLevel = Math.max(0, Math.min(1, riskLevel));
  // Calculate precise pixel offset instead of percentage string (Android fix)
  const indicatorLeft = meterWidth > 0 ? meterWidth * clampedLevel - 2 : 0;

  let iconName: keyof typeof Ionicons.glyphMap = 'sunny';
  let iconColor = theme.success;
  let statusText = 'Low Risk — Clear';

  if (clampedLevel > 0.6) {
    iconName = 'thunderstorm';
    iconColor = theme.danger;
    statusText = 'High Risk — Disruption Likely';
  } else if (clampedLevel > 0.3) {
    iconName = 'rainy';
    iconColor = theme.warning;
    statusText = 'Moderate Risk — Rain Expected';
  }

  return (
    <ThemedView style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <ThemedText type="subtitle">Risk Environment</ThemedText>
        <View style={[styles.riskPill, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={iconName} size={14} color={iconColor} />
          <ThemedText style={[styles.riskPillText, { color: iconColor }]}>
            {Math.round(clampedLevel * 100)}%
          </ThemedText>
        </View>
      </View>

      <View style={styles.riskContainer}>
        {/* Meter bar — use onLayout to get real pixel width */}
        <View style={styles.riskMeter} onLayout={onMeterLayout}>
          <LinearGradient
            colors={[theme.success, theme.warning, theme.danger]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.riskBar}
          />
          {/* Pixel-positioned indicator — avoids Android percentage-left bug */}
          {meterWidth > 0 && (
            <View
              style={[
                styles.riskIndicator,
                { left: indicatorLeft, backgroundColor: theme.text },
              ]}
            />
          )}
        </View>

        <View style={styles.riskInfo}>
          <Ionicons name={iconName} size={18} color={iconColor} />
          <ThemedText style={[styles.statusText, { color: iconColor }]}>{statusText}</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.description}>
        {description} — {location}
      </ThemedText>
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
    marginBottom: 16,
  },
  riskPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  riskPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  riskContainer: {
    marginBottom: 12,
  },
  riskMeter: {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(128,128,128,0.15)',
    borderRadius: 4,
    overflow: 'visible',
    marginBottom: 12,
  },
  riskBar: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
  },
  riskIndicator: {
    position: 'absolute',
    top: -5,
    width: 4,
    height: 18,
    borderRadius: 2,
  },
  riskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  statusText: {
    fontWeight: '600',
    fontSize: 14,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.55,
    marginTop: 4,
  },
});
