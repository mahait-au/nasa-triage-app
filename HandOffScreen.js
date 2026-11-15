import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

export default function HandOffScreen({ route, navigation }) {
  const environment = route.params?.environment || 'Deep Space Transit';
  
  const [timeLeft, setTimeLeft] = useState(12);
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

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* LOG SUMMARY CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Triage Log Summary</Text>
          <View style={styles.logBox}>
            <Text style={styles.logText}>[14:32:00] ALERT: Elevated HR (135 BPM) / Low SpO2 (92%)</Text>
            <Text style={styles.logText}>[14:33:15] SENSOR PLACEMENT VERIFIED</Text>
            <Text style={styles.logText}>[14:35:00] INTERVENTION 1: Oxygen Administered (5L/min)</Text>
            <Text style={styles.logText}>[14:36:10] INTERVENTION 2: Aspirin (325mg) Administered</Text>
            <Text style={styles.logText}>[14:36:45] INTERVENTION 3: Patient Positioned Upright</Text>
            <Text style={styles.logText}>[14:37:30] PATIENT STABILIZED. AWAITING GROUND ORDERS.</Text>
          </View>
        </View>

        {/* COMMS TIMER CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Earth Communications Link</Text>
          
          <View style={[styles.timerBox, isTransmitting && styles.timerBoxActive, timeLeft === 0 && styles.timerBoxComplete]}>
            <Text style={styles.delayLabel}>Mars-to-Earth Ping Delay (One-Way):</Text>
            <Text style={[styles.timerText, isTransmitting && styles.timerTextActive, timeLeft === 0 && styles.timerTextComplete]}>
              {formatTime(timeLeft)}
            </Text>
            <Text style={[styles.statusText, isTransmitting && styles.statusTextActive, timeLeft === 0 && styles.statusTextComplete]}>
              {transmissionStatus}
            </Text>
            
            <Text style={styles.demoNote}>
              * DEMO MODE: Timer accelerated to 12s. Real-world ping delay is ~12 minutes.
            </Text>
          </View>
        </View>

        {/* DYNAMIC ACTION BUTTONS */}
        {!isTransmitting ? (
          <TouchableOpacity style={styles.transmitButton} onPress={handleTransmit}>
            <Text style={styles.transmitButtonText}>INITIATE DEEP SPACE UPLINK</Text>
          </TouchableOpacity>
        ) : timeLeft > 0 ? (
          <View style={styles.transmittingState}>
            <ActivityIndicator size="small" color="#FF3B30" style={{ marginRight: 10 }} />
            <Text style={styles.transmittingStateText}>DO NOT POWER DOWN - UPLINK ACTIVE</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.transmitButton, { backgroundColor: '#0A84FF' }]} 
            onPress={() => navigation.navigate('Measurement')}
          >
            <Text style={styles.transmitButtonText}>RESET SIMULATION</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#333', backgroundColor: '#111' },
  headerText: { color: '#0A84FF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', letterSpacing: 1 },
  subHeaderText: { color: '#8E8E93', fontSize: 14, textAlign: 'center', marginTop: 5, textTransform: 'uppercase' },
  scrollContent: { padding: 15 },
  
  card: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  
  logBox: { backgroundColor: '#111', borderRadius: 8, padding: 15, borderWidth: 1, borderColor: '#444' },
  logText: { color: '#34C759', fontSize: 13, fontFamily: 'monospace', marginBottom: 8, lineHeight: 18 },
  
  timerBox: { backgroundColor: '#111', borderRadius: 8, padding: 25, alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  timerBoxActive: { borderColor: '#FF3B30', backgroundColor: '#2A0808' },
  timerBoxComplete: { borderColor: '#34C759', backgroundColor: '#0A2A1A' },
  delayLabel: { color: '#8E8E93', fontSize: 13, marginBottom: 10, textTransform: 'uppercase', fontWeight: 'bold' },
  
  timerText: { color: '#555', fontSize: 56, fontWeight: 'bold', fontFamily: 'monospace' },
  timerTextActive: { color: '#FF3B30' },
  timerTextComplete: { color: '#34C759' },
  
  statusText: { color: '#555', fontSize: 16, fontWeight: 'bold', marginTop: 15 },
  statusTextActive: { color: '#FF3B30' },
  statusTextComplete: { color: '#34C759' },

  demoNote: { color: '#0A84FF', fontSize: 13, marginTop: 15, textAlign: 'center', fontStyle: 'italic', fontWeight: '600' },
  
  transmitButton: { backgroundColor: '#FF3B30', paddingVertical: 18, borderRadius: 8, alignItems: 'center', elevation: 2, marginTop: 5 },
  transmitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  
  transmittingState: { flexDirection: 'row', backgroundColor: '#2A0808', paddingVertical: 18, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FF3B30', marginTop: 5 },
  transmittingStateText: { color: '#FF3B30', fontSize: 15, fontWeight: 'bold', letterSpacing: 1 }
});