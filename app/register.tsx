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

export default function RegisterScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = 'http://localhost:3000';

  const handleRegister = async () => {
    if (!fullName || !workerId || !upiId) {
      Alert.alert('Missing Info', 'Please fill in all fields to secure your shield.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Onboard Worker in Backend
      const res = await fetch(`${API_URL}/users/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, workerId, upiId })
      });

      if (!res.ok) throw new Error('Onboarding failed');
      const user = await res.json();

      // 2. Save Session Locally
      await AsyncStorage.setItem('user_session', JSON.stringify(user));

      // 3. Issue Initial Policy
      await fetch(`${API_URL}/policy/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, zone: 'Koramangala, BLR' })
      });

      Alert.alert('✅ Success', `Welcome, ${fullName}! Your shield is now active.`);
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Error', 'Could not connect to ShieldGrid servers.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconHeader}>
          <LinearGradient colors={[theme.primary, theme.primary + '80']} style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={40} color="#fff" />
          </LinearGradient>
          <ThemedText type="title" style={styles.title}>Secure Your Shield</ThemedText>
          <ThemedText style={styles.subtitle}>Enter your details to join the grid</ThemedText>
        </View>

        <ThemedView style={styles.form}>
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

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary }]} 
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            <ThemedText style={styles.buttonText}>{isSubmitting ? 'Syncing...' : 'Get Coverage'}</ThemedText>
            {!isSubmitting && <Ionicons name="arrow-forward" size={18} color="#fff" />}
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 60, gap: 40 },
  iconHeader: { alignItems: 'center', gap: 12 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', textAlign: 'center' },
  subtitle: { fontSize: 16, opacity: 0.6, textAlign: 'center' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, fontWeight: '700', opacity: 0.8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { height: 56, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  button: { height: 56, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
