import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function InterventionScreen({ route, navigation }) {
  // Get the environment passed from Screen 1, default to Spacecraft if missing
  const environment = route.params?.environment || 'Spacecraft';
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    const baseSteps = [
      { id: 1, title: 'Administer Oxygen', instruction: 'Open the primary wall oxygen valve to 5 Liters/minute. Place the mask over the crew member\'s nose and mouth.', completed: false },
      { id: 2, title: 'Administer Medication', instruction: 'Open Medical Kit Alpha. Locate the Red Pouch. Give the crew member 1 Aspirin (325mg) to chew.', completed: false },
      { id: 3, title: 'Positioning', instruction: 'Keep the crew member seated upright to reduce pressure on the lungs. Do not let them lie flat.', completed: false }
    ];

    if (environment === 'Lunar Base') {
      baseSteps.push({ id: 4, title: 'Lunar Dust Mitigation', instruction: 'Ensure the habitat\'s lunar dust filtration system is running at maximum capacity to prevent respiratory compounding.', completed: false });
    } else if (environment === 'Spacecraft' || environment === 'Space Station') {
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

  // FIX: Navigate directly to Screen 3, bypassing the blocked web alert
  const handleTransmit = () => {
    navigation.navigate('HandOff', { environment });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emergencyText}>TRIAGE INTERVENTION</Text>
        <Text style={styles.subHeaderText}>Execute steps in exact order to stabilize.</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.contextCard}>
          <Text style={styles.contextTitle}>Active Environment:</Text>
          <Text style={styles.contextValue}>{environment}</Text>
        </View>

        {checklist.map((step, index) => (
          <TouchableOpacity 
            key={step.id} 
            style={[styles.stepCard, step.completed && styles.stepCardCompleted]} 
            onPress={() => toggleStep(step.id)}
            activeOpacity={0.9}
          >
            <View style={styles.stepHeader}>
              <View style={[styles.numberBadge, step.completed && styles.numberBadgeCompleted]}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepTitle, step.completed && styles.textCompleted]}>
                {step.title}
              </Text>
            </View>
            
            <Text style={[styles.stepInstruction, step.completed && styles.textCompleted]}>
              {step.instruction}
            </Text>

            <View style={[styles.confirmToggle, step.completed && styles.confirmToggleActive]}>
              <View style={[styles.checkbox, step.completed && styles.checkboxActive]}>
                {step.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.confirmToggleText, step.completed && styles.confirmToggleTextActive]}>
                {step.completed ? "Step Completed" : "Tap to mark as complete"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.transmitButton, !allStepsCompleted && styles.transmitButtonDisabled]} 
          disabled={!allStepsCompleted}
          onPress={handleTransmit}
        >
          <Text style={styles.transmitButtonText}>
            {allStepsCompleted ? "PROCEED TO HOUSTON UPLINK" : "COMPLETE ALL STEPS TO UNLOCK"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#333', backgroundColor: '#111' },
  emergencyText: { color: '#FF3B30', fontSize: 20, fontWeight: 'bold', textAlign: 'center', letterSpacing: 1 },
  subHeaderText: { color: '#8E8E93', fontSize: 14, textAlign: 'center', marginTop: 5 },
  scrollContent: { padding: 15 },
  
  contextCard: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#1C1C1E', padding: 12, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  contextTitle: { color: '#8E8E93', fontSize: 14, marginRight: 8, fontWeight: '600' },
  contextValue: { color: '#0A84FF', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },

  stepCard: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  stepCardCompleted: { backgroundColor: '#0A2A1A', borderColor: '#34C759' },
  
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  numberBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  numberBadgeCompleted: { backgroundColor: '#34C759' },
  numberText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  stepTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', flexShrink: 1 },
  textCompleted: { color: '#888' },
  
  stepInstruction: { color: '#D1D1D6', fontSize: 15, lineHeight: 22, marginBottom: 15 },
  
  confirmToggle: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2C2C2E', padding: 12, borderRadius: 8 },
  confirmToggleActive: { backgroundColor: 'transparent', padding: 0 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#8E8E93', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkboxActive: { backgroundColor: '#34C759', borderColor: '#34C759' },
  checkmark: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  confirmToggleText: { color: '#8E8E93', fontSize: 15, fontWeight: '600' },
  confirmToggleTextActive: { color: '#34C759' },
  
  transmitButton: { backgroundColor: '#0A84FF', paddingVertical: 18, borderRadius: 8, alignItems: 'center', marginTop: 10, elevation: 2 },
  transmitButtonDisabled: { backgroundColor: '#333' },
  transmitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }
});