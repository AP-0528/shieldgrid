/**
 * useLocationTask
 *
 * A hook that manages background GPS polling via expo-task-manager and expo-location.
 * This registers the task at the TOP LEVEL of this module (required by TaskManager).
 * The hook exposes: isTracking, startTracking, stopTracking, permissionStatus.
 *
 * NOTE: Background location does NOT work in Expo Go — requires a Development Build.
 */

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

export const SHIELDGRID_LOCATION_TASK = 'SHIELDGRID_LOCATION_TASK';

// --- Task Definition (must be at module top-level, outside any component) ---
TaskManager.defineTask(SHIELDGRID_LOCATION_TASK, async ({ data, error }: TaskManager.TaskManagerTaskBody) => {
  if (error) {
    console.error('[ShieldGrid] Location task error:', error.message);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    
    // In production, this would stream to Redis or an ingest endpoint
    // For the prototype, we log the streaming payload structure
    const payload = locations.map(loc => ({
      lat: loc.coords.latitude,
      lon: loc.coords.longitude,
      speed: loc.coords.speed,
      timestamp: loc.timestamp
    }));
    
    console.log('[ShieldGrid Oracle Ping] Streaming location delta to backend:', payload);
    
    // Example: fetch('http://localhost:3000/ingest-location', { ... })
  }
});

// --- Hook ---

export type PermissionStatus = 'undetermined' | 'granted' | 'denied' | 'foreground-only';

interface LocationTaskState {
  isTracking: boolean;
  permissionStatus: PermissionStatus;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
}

export function useLocationTask(): LocationTaskState {
  const [isTracking, setIsTracking] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('undetermined');

  // On mount, check if we are already tracking from a previous session
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') return; // Web doesn't support background checks

      const alreadyTracking = await Location.hasStartedLocationUpdatesAsync(SHIELDGRID_LOCATION_TASK)
        .catch(() => false);
      setIsTracking(alreadyTracking);

      try {
        const fg = await Location.getForegroundPermissionsAsync();
        if (fg.status !== 'granted') {
          setPermissionStatus('denied');
          return;
        }
        const bg = await Location.getBackgroundPermissionsAsync();
        if (bg.status !== 'granted') {
          setPermissionStatus('foreground-only');
          return;
        }
        setPermissionStatus('granted');
      } catch (e) {
        console.warn('[ShieldGrid] Permission check failed:', e);
      }
    })();
  }, []);

  async function startTracking() {
    if (Platform.OS === 'web') {
      console.log('[ShieldGrid Demo] Web Fallback: Mocking location verified state.');
      setIsTracking(true);
      setPermissionStatus('granted');
      return;
    }

    try {
      // Step 1: Request foreground permission
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        setPermissionStatus('denied');
        console.warn('[ShieldGrid] Foreground location permission denied.');
        return;
      }

      // Step 2: Request background permission
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        setPermissionStatus('foreground-only');
        console.warn('[ShieldGrid] Background location permission denied. Tracking limited.');
        return;
      }

      setPermissionStatus('granted');

      // Step 3: Start background updates
      await Location.startLocationUpdatesAsync(SHIELDGRID_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30_000,       // Poll every 30 seconds
        distanceInterval: 50,        // Or every 50 meters
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'ShieldGrid is active',
          notificationBody: 'Your location is being verified for disruption coverage.',
          notificationColor: '#0A84FF',
        },
      });

      setIsTracking(true);
      console.log('[ShieldGrid] Background location tracking started.');
    } catch (e) {
      console.warn('[ShieldGrid] Could not start native tracking - falling back to Mock.');
      setIsTracking(true);
    }
  }

  async function stopTracking() {
    if (Platform.OS === 'web') {
      setIsTracking(false);
      return;
    }

    try {
      const running = await Location.hasStartedLocationUpdatesAsync(SHIELDGRID_LOCATION_TASK)
        .catch(() => false);
      if (running) {
        await Location.stopLocationUpdatesAsync(SHIELDGRID_LOCATION_TASK);
      }
    } catch (e) {
      console.log('[ShieldGrid] Native stop failed, silencing.');
    }
    setIsTracking(false);
    console.log('[ShieldGrid] Background location tracking stopped.');
  }

  return { isTracking, permissionStatus, startTracking, stopTracking };
}
