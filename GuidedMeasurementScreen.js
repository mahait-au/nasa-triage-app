import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';

const osdrData = require('./data/mockOsdrData.json');

export default function GuidedMeasurementScreen({ navigation }) {
  const [isReading, setIsReading] = useState(false);
  const [environment, setEnvironment] = useState('Space Station');
  
  const [liveMetrics, setLiveMetrics] = useState({
    heartRate: null,
    spO2: null,
    radiation: null,
  });

  const startTelemetryIngest = () => {
    setIsReading(true);
    
    setTimeout(() => {
      const ecgAssay = osdrData.assays.find(a => a.measurement_type === "Electrocardiography (ECG)");
      const oximetryAssay = osdrData.assays.find(a => a.measurement_type === "Pulse Oximetry");
      const dosimetryAssay = osdrData.assays.find(a => a.measurement_type === "Dosimetry");

      const latestECG = ecgAssay.data_points[ecgAssay.data_points.length - 1];
      const latestOximetry = oximetryAssay.data_points[oximetryAssay.data_points.length - 1];
      const latestRadiation = dosimetryAssay.data_points[dosimetryAssay.data_points.length - 1];

      const currentHR = latestECG.heart_rate_bpm;
      const currentSpO2 = latestOximetry.blood_oxygen_saturation_spo2;
      const currentRad = latestRadiation.current_flux_rate_msv_hr;

      setLiveMetrics({ heartRate: currentHR, spO2: currentSpO2, radiation: currentRad });
      setIsReading(false);

      if (currentHR > 100 || currentSpO2 < 95) {
        Alert.alert(
          "Critical Telemetry Alert",
          `Environment: ${environment}\nHeart Rate: ${currentHR} BPM\nSpO2: ${currentSpO2}%\nRadiation Flux: ${currentRad} mSv/hr\n\nThreshold exceeded per NASA HRP guidelines. Proceed to Triage Intervention.`,
          [{ text: "PROCEED TO INTERVENTION", onPress: () => navigation.navigate('Intervention') }]
        );
      } else {
        Alert.alert("Telemetry Normal", "All vitals are within standard operational parameters.");
      }
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emergencyText}>MEDICAL EMERGENCY</Text>
        <Text style={styles.subHeaderText}>Symptom: Chest Pain</Text>
        
        <View style={styles.envToggleContainer}>
          {['Spacecraft', 'Space Station', 'Lunar Base'].map((env) => (
            <TouchableOpacity 
              key={env} 
              style={[styles.envButton, environment === env && styles.envButtonActive]}
              onPress={() => setEnvironment(env)}
            >
              <Text style={styles.envButtonText}>{env}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.sectionTitle}>1. Sensor Placement</Text>
        <View style={styles.diagramPlaceholder}>
          <Text style={styles.diagramText}>[ 3D Torso Diagram ]</Text>
          <Text style={styles.diagramSubText}>Blue Sensor: Center Chest</Text>
          <Text style={styles.diagramSubText}>White Sensor: Left Index Finger</Text>
        </View>
        <Text style={styles.bodyText}>
          Place the blue ECG sensor pad directly on the center of the bare chest. Clip the white pulse oximeter sensor to the left index finger.
        </Text>
      </View>

      {liveMetrics.heartRate && (
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Live Telemetry</Text>
          <Text style={styles.metricText}>Heart Rate: {liveMetrics.heartRate} BPM</Text>
          <Text style={styles.metricText}>Oxygen (SpO2): {liveMetrics.spO2}%</Text>
        </View>
      )}

      <View style={styles.actionContainer}>
        {isReading ? (
          <View style={styles.readingContainer}>
            <ActivityIndicator size="large" color="#FF3B30" />
            <Text style={styles.readingText}>Ingesting Telemetry...</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={startTelemetryIngest}>
            <Text style={styles.actionButtonText}>SENSORS ATTACHED - START READING</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', padding: 20 },
  header: { borderBottomWidth: 2, borderBottomColor: '#FF3B30', paddingBottom: 15, marginBottom: 20 },
  emergencyText: { color: '#FF3B30', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  subHeaderText: { color: '#FFFFFF', fontSize: 18, textAlign: 'center', marginBottom: 15 },
  envToggleContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  envButton: { borderWidth: 1, borderColor: '#444', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 },
  envButtonActive: { backgroundColor: '#333', borderColor: '#0A84FF' },
  envButtonText: { color: '#FFF', fontSize: 12 },
  instructionContainer: { marginBottom: 25 },
  sectionTitle: { color: '#0A84FF', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  diagramPlaceholder: { height: 150, backgroundColor: '#1C1C1E', borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderRadius: 10 },
  diagramText: { color: '#8E8E93', fontSize: 18, fontWeight: 'bold' },
  diagramSubText: { color: '#8E8E93', fontSize: 14, marginTop: 5 },
  bodyText: { color: '#E5E5EA', fontSize: 16, lineHeight: 24 },
  metricsContainer: { marginBottom: 20, padding: 15, backgroundColor: '#1C1C1E', borderRadius: 10, borderColor: '#FF3B30', borderWidth: 1 },
  metricText: { color: '#FFF', fontSize: 18, fontWeight: '600', marginBottom: 5 },
  actionContainer: { flex: 1, justifyContent: 'flex-end', marginBottom: 20 },
  actionButton: { backgroundColor: '#FF3B30', paddingVertical: 20, borderRadius: 10, alignItems: 'center' },
  actionButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  readingContainer: { alignItems: 'center', paddingVertical: 20 },
  readingText: { color: '#FF3B30', fontSize: 18, marginTop: 10, fontWeight: 'bold' }
});