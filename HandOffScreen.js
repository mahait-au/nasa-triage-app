import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

export default function HandOffScreen({ environment = 'Deep Space Transit' }) {
  const [timeLeft, setTimeLeft] = useState(720);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionStatus, setTransmissionStatus] = useState('READY TO TRANSMIT');

  useEffect(() => {
    let timer;
    if (isTransmitting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTransmissionStatus('HOUSTON HAS RECEIVED DATA');
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isTransmitting, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTransmit = () => {
    setIsTransmitting(true);
    setTransmissionStatus('UPLINK IN PROGRESS...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>GROUND CONTROL HAND-OFF</Text>
        <Text style={styles.subHeaderText}>Environment: {environment}</Text>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Triage Log Summary</Text>
        <ScrollView style={styles.logBox}>
          <Text style={styles.logText}>[14:32:00] ALERT: Elevated HR (135 BPM) / Low SpO2 (92%)</Text>
          <Text style={styles.logText}>[14:33:15] SENSOR PLACEMENT VERIFIED</Text>
          <Text style={styles.logText}>[14:35:00] INTERVENTION 1: Oxygen Administered (5L/min)</Text>
          <Text style={styles.logText}>[14:36:10] INTERVENTION 2: Aspirin (325mg) Administered</Text>
          <Text style={styles.logText}>[14:36:45] INTERVENTION 3: Patient Positioned Upright</Text>
          <Text style={styles.logText}>[14:37:30] PATIENT STABILIZED. AWAITING GROUND ORDERS.</Text>
        </ScrollView>
      </View>

      <View style={styles.commsContainer}>
        <Text style={styles.sectionTitle}>Earth Communications Link</Text>
        <View style={styles.timerBox}>
          <Text style={styles.delayLabel}>Expected Ping Delay (One-Way):</Text>
          <Text style={[styles.timerText, isTransmitting && styles.timerActive]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={styles.statusText}>{transmissionStatus}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {!isTransmitting ? (
          <TouchableOpacity style={styles.transmitButton} onPress={handleTransmit}>
            <Text style={styles.transmitButtonText}>INITIATE DEEP SPACE UPLINK</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.transmittingState}>
            <Text style={styles.transmittingStateText}>DO NOT POWER DOWN - UPLINK ACTIVE</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', padding: 20 },
  header: { borderBottomWidth: 2, borderBottomColor: '#0A84FF', paddingBottom: 15, marginBottom: 20 },
  headerText: { color: '#0A84FF', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  subHeaderText: { color: '#8E8E93', fontSize: 16, textAlign: 'center', marginTop: 5 },
  summaryContainer: { flex: 1, marginBottom: 20 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  logBox: { backgroundColor: '#1C1C1E', borderRadius: 10, padding: 15, borderWidth: 1, borderColor: '#333' },
  logText: { color: '#34C759', fontSize: 14, fontFamily: 'monospace', marginBottom: 8 },
  commsContainer: { marginBottom: 30 },
  timerBox: { backgroundColor: '#1C1C1E', borderRadius: 10, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  delayLabel: { color: '#8E8E93', fontSize: 14, marginBottom: 10, textTransform: 'uppercase' },
  timerText: { color: '#FF4500', fontSize: 48, fontWeight: 'bold', fontFamily: 'monospace' },
  timerActive: { color: '#FF3B30' },
  statusText: { color: '#0A84FF', fontSize: 16, fontWeight: 'bold', marginTop: 15 },
  footer: { paddingBottom: 10 },
  transmitButton: { backgroundColor: '#FF3B30', paddingVertical: 20, borderRadius: 10, alignItems: 'center' },
  transmitButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  transmittingState: { backgroundColor: '#333333', paddingVertical: 20, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#FF3B30' },
  transmittingStateText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' }
});