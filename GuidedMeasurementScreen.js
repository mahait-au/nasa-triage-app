import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';

const osdrData = require('./data/mockOsdrData.json');

export default function GuidedMeasurementScreen({ navigation }) {
  const [isReading, setIsReading] = useState(false);
  const [environment, setEnvironment] = useState('Spacecraft');
  const [sensorsConfirmed, setSensorsConfirmed] = useState(false);
  
  // New state to control the UI transition after reading
  const [scanComplete, setScanComplete] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({ heartRate: null, spO2: null, radiation: null });

  const startTelemetryIngest = () => {
    setIsReading(true);
    setScanComplete(false);
    
    setTimeout(() => {
      const ecgAssay = osdrData.assays.find(a => a.measurement_type === "Electrocardiography (ECG)");
      const oximetryAssay = osdrData.assays.find(a => a.measurement_type === "Pulse Oximetry");
      const dosimetryAssay = osdrData.assays.find(a => a.measurement_type === "Dosimetry");

      const currentHR = ecgAssay.data_points[ecgAssay.data_points.length - 1].heart_rate_bpm;
      const currentSpO2 = oximetryAssay.data_points[oximetryAssay.data_points.length - 1].blood_oxygen_saturation_spo2;
      const currentRad = dosimetryAssay.data_points[dosimetryAssay.data_points.length - 1].current_flux_rate_msv_hr;

      setLiveMetrics({ heartRate: currentHR, spO2: currentSpO2, radiation: currentRad });
      setIsReading(false);
      
      // Instead of an alert popup, we trigger the UI to show the results
      setScanComplete(true);
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emergencyText}>PATIENT TRIAGE INITIALIZATION</Text>
        <Text style={styles.subHeaderText}>Follow the 3 steps below to begin.</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* STEP 1: ENVIRONMENT */}
        <View style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.numberBadge}><Text style={styles.numberText}>1</Text></View>
            <Text style={styles.sectionTitle}>Confirm Location</Text>
          </View>
          <Text style={styles.instructionText}>Select the current operational environment to load correct protocols:</Text>
          <View style={styles.envToggleContainer}>
            {['Spacecraft', 'Space Station', 'Lunar Base'].map((env) => (
              <TouchableOpacity 
                key={env} 
                style={[styles.envButton, environment === env && styles.envButtonActive]}
                onPress={() => setEnvironment(env)}
              >
                <Text style={[styles.envButtonText, environment === env && styles.envButtonTextActive]}>{env}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* STEP 2: SENSORS */}
        <View style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.numberBadge}><Text style={styles.numberText}>2</Text></View>
            <Text style={styles.sectionTitle}>Attach Biosensors</Text>
          </View>
          
          <View style={styles.sensorBulletItem}>
            <Text style={styles.sensorIcon}>🔵</Text>
            <Text style={styles.sensorText}><Text style={{fontWeight: 'bold'}}>Blue ECG Pad:</Text> Place on the bare center of the chest.</Text>
          </View>
          <View style={styles.sensorBulletItem}>
            <Text style={styles.sensorIcon}>⚪</Text>
            <Text style={styles.sensorText}><Text style={{fontWeight: 'bold'}}>White Oximeter Clip:</Text> Attach to the left index finger.</Text>
          </View>

          <TouchableOpacity 
            style={[styles.confirmToggle, sensorsConfirmed && styles.confirmToggleActive]} 
            onPress={() => setSensorsConfirmed(!sensorsConfirmed)}
          >
            <View style={[styles.checkbox, sensorsConfirmed && styles.checkboxActive]}>
              {sensorsConfirmed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.confirmToggleText, sensorsConfirmed && styles.confirmToggleTextActive]}>
              I confirm sensors are attached
            </Text>
          </TouchableOpacity>
        </View>

        {/* STEP 3: ACTION */}
        {!scanComplete && (
          <View style={[styles.card, !sensorsConfirmed && styles.cardDisabled]}>
            <View style={styles.stepHeader}>
              <View style={[styles.numberBadge, !sensorsConfirmed && styles.numberBadgeDisabled]}><Text style={styles.numberText}>3</Text></View>
              <Text style={[styles.sectionTitle, !sensorsConfirmed && styles.textDisabled]}>Initiate Scan</Text>
            </View>
            
            {isReading ? (
              <View style={styles.readingContainer}>
                <ActivityIndicator size="large" color="#0A84FF" />
                <Text style={styles.readingText}>Pulling data from sensors...</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, !sensorsConfirmed && styles.actionButtonDisabled]} 
                onPress={startTelemetryIngest}
                disabled={!sensorsConfirmed}
              >
                <Text style={styles.actionButtonText}>
                  {sensorsConfirmed ? "START TELEMETRY SCAN" : "COMPLETE STEP 2 FIRST"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* STEP 4: ON-SCREEN RESULTS (Replaces Popup) */}
        {scanComplete && (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <Text style={styles.alertTitle}>CRITICAL VITALS DETECTED</Text>
            </View>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>HEART RATE</Text>
                <Text style={styles.metricValueAlert}>{liveMetrics.heartRate} BPM</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>BLOOD O2 (SpO2)</Text>
                <Text style={styles.metricValueAlert}>{liveMetrics.spO2}%</Text>
              </View>
            </View>

            <Text style={styles.alertSubText}>NASA thresholds exceeded. Immediate intervention required.</Text>

            <TouchableOpacity 
              style={styles.criticalButton} 
              onPress={() => navigation.navigate('Intervention', { environment })}
            >
              <Text style={styles.criticalButtonText}>START TRIAGE PROTOCOL</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#333', backgroundColor: '#111' },
  emergencyText: { color: '#FFF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', letterSpacing: 1 },
  subHeaderText: { color: '#8E8E93', fontSize: 14, textAlign: 'center', marginTop: 5 },
  scrollContent: { padding: 15 },
  
  card: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  cardDisabled: { opacity: 0.6 },
  
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  numberBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#0A84FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  numberBadgeDisabled: { backgroundColor: '#444' },
  numberText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  textDisabled: { color: '#888' },
  
  instructionText: { color: '#D1D1D6', fontSize: 15, marginBottom: 15 },
  
  envToggleContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 },
  envButton: { flex: 1, minWidth: '30%', borderWidth: 1, borderColor: '#444', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  envButtonActive: { backgroundColor: '#0A84FF', borderColor: '#0A84FF' },
  envButtonText: { color: '#8E8E93', fontSize: 14, fontWeight: '600' },
  envButtonTextActive: { color: '#FFF' },
  
  sensorBulletItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15, paddingRight: 20 },
  sensorIcon: { fontSize: 20, marginRight: 12, marginTop: -2 },
  sensorText: { color: '#E5E5EA', fontSize: 16, lineHeight: 22, flexShrink: 1 },
  
  confirmToggle: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2C2C2E', padding: 15, borderRadius: 8, marginTop: 5 },
  confirmToggleActive: { backgroundColor: '#0A2A1A', borderWidth: 1, borderColor: '#34C759' },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#8E8E93', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  checkboxActive: { backgroundColor: '#34C759', borderColor: '#34C759' },
  checkmark: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  confirmToggleText: { color: '#8E8E93', fontSize: 16, fontWeight: '600' },
  confirmToggleTextActive: { color: '#34C759' },
  
  actionButton: { backgroundColor: '#0A84FF', paddingVertical: 18, borderRadius: 8, alignItems: 'center', elevation: 2 },
  actionButtonDisabled: { backgroundColor: '#333' },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  
  readingContainer: { alignItems: 'center', paddingVertical: 15, backgroundColor: '#2C2C2E', borderRadius: 8 },
  readingText: { color: '#0A84FF', fontSize: 16, marginTop: 12, fontWeight: 'bold' },

  // New Alert Card Styles
  alertCard: { backgroundColor: '#2A0808', borderRadius: 12, padding: 20, marginBottom: 15, borderWidth: 2, borderColor: '#FF3B30' },
  alertHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  alertIcon: { fontSize: 24, marginRight: 10 },
  alertTitle: { color: '#FF3B30', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metricBox: { flex: 1, backgroundColor: '#111', padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5, borderWidth: 1, borderColor: '#444' },
  metricLabel: { color: '#8E8E93', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  metricValueAlert: { color: '#FF3B30', fontSize: 28, fontWeight: 'bold' },
  alertSubText: { color: '#FFF', fontSize: 15, textAlign: 'center', marginBottom: 20, paddingHorizontal: 10 },
  criticalButton: { backgroundColor: '#FF3B30', paddingVertical: 18, borderRadius: 8, alignItems: 'center' },
  criticalButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }
});