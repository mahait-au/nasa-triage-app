import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';

export default function InterventionScreen({ navigation, environment = 'Lunar Base' }) {
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    const baseSteps = [
      { id: 1, title: 'Administer Oxygen', instruction: 'Open the primary wall oxygen valve to 5 Liters/minute. Place the mask over the crew member\'s nose and mouth.', completed: false },
      { id: 2, title: 'Administer Medication', instruction: 'Open Medical Kit Alpha. Locate the Red Pouch. Give the crew member 1 Aspirin (325mg) to chew.', completed: false },
      { id: 3, title: 'Positioning', instruction: 'Keep the crew member seated upright to reduce pressure on the lungs. Do not let them lie flat.', completed: false }
    ];

    if (environment === 'Lunar Base') {
      baseSteps.push({ id: 4, title: 'Lunar Dust Mitigation', instruction: 'Ensure the habitat\'s lunar dust filtration system is running at maximum capacity to prevent respiratory compounding.', completed: false });
    } else if (environment === 'Spacecraft') {
      baseSteps.push({ id: 4, title: 'Zero-G Securing', instruction: 'Strap the crew member into the medical restraint system to prevent drift during chest compressions if required.', completed: false });
    }

    setChecklist(baseSteps);
  }, [environment]);

  const toggleStep = (id) => {
    setChecklist(checklist.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  const allStepsCompleted = checklist.length > 0 && checklist.every(step => step.completed);

  const handleTransmit = () => {
    Alert.alert(
      "Transmitting to Ground Control",
      "Telemetry and triage log successfully transmitted to Houston. Mars Ping Delay: 12 minutes.\n\nMaintain current stabilized condition.",
      [{ text: "ACKNOWLEDGE", onPress: () => navigation.navigate('HandOff') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emergencyText}>TRIAGE INTERVENTION</Text>
        <Text style={styles.subHeaderText}>Follow steps exactly in order.</Text>
      </View>

      <ScrollView style={styles.listContainer}>
        {checklist.map((step, index) => (
          <TouchableOpacity 
            key={step.id} 
            style={[styles.stepCard, step.completed && styles.stepCardCompleted]} 
            onPress={() => toggleStep(step.id)}
            activeOpacity={0.8}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, step.completed && styles.checkboxActive]}>
                {step.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={[styles.stepTitle, step.completed && styles.textCompleted]}>
                Step {index + 1}: {step.title}
              </Text>
              <Text style={[styles.stepInstruction, step.completed && styles.textCompleted]}>
                {step.instruction}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.transmitButton, !allStepsCompleted && styles.transmitButtonDisabled]} 
          disabled={!allStepsCompleted}
          onPress={handleTransmit}
        >
          <Text style={styles.transmitButtonText}>
            {allStepsCompleted ? "TRANSMIT LOG TO HOUSTON" : "COMPLETE ALL STEPS TO UNLOCK"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', padding: 20 },
  header: { borderBottomWidth: 2, borderBottomColor: '#FF3B30', paddingBottom: 15, marginBottom: 20 },
  emergencyText: { color: '#FF3B30', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  subHeaderText: { color: '#FFFFFF', fontSize: 16, textAlign: 'center', marginTop: 5 },
  listContainer: { flex: 1 },
  stepCard: { flexDirection: 'row', backgroundColor: '#1C1C1E', borderRadius: 10, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  stepCardCompleted: { backgroundColor: '#0A2A1A', borderColor: '#34C759' },
  checkboxContainer: { justifyContent: 'center', marginRight: 15 },
  checkbox: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#8E8E93', justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: '#34C759', borderColor: '#34C759' },
  checkmark: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  stepTextContainer: { flex: 1, justifyContent: 'center' },
  stepTitle: { color: '#0A84FF', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  stepInstruction: { color: '#E5E5EA', fontSize: 15, lineHeight: 22 },
  textCompleted: { color: '#8E8E93' },
  footer: { marginTop: 10, paddingBottom: 10 },
  transmitButton: { backgroundColor: '#0A84FF', paddingVertical: 20, borderRadius: 10, alignItems: 'center' },
  transmitButtonDisabled: { backgroundColor: '#333333' },
  transmitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});