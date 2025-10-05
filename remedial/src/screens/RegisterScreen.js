import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; // Necesitas instalar esta librería
import DateTimePicker from '@react-native-community/datetimepicker'; // Y esta para el selector de fecha
import { Ionicons } from '@expo/vector-icons';
import { transactionCategories } from '../data/categories';

// Instalar Picker y DateTimePicker:
// npm install @react-native-picker/picker @react-native-community/datetimepicker

export default function RegisterScreen({ route }) {
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Gasto'); // 'Gasto' o 'Ingreso'
  const [category, setCategory] = useState(transactionCategories[0].value);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Obtener la función para agregar transacción desde la ruta (Home Screen)
  const addTransaction = route.params?.addTransaction;

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleRegister = () => {
    if (!description || !amount || parseFloat(amount) <= 0) {
      alert('Por favor, ingresa una descripción y un monto válido.');
      return;
    }

    const newTransaction = {
      id: Date.now(), // ID único simple
      descripcion: description,
      monto: type === 'Gasto' ? -parseFloat(amount) : parseFloat(amount),
      tipo: type,
      fecha: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
      categoria: category,
    };

    addTransaction(newTransaction); // Llama a la función pasada desde Home
    navigation.goBack(); // Regresa a la pantalla principal
  };

  // Filtrar categorías según el tipo seleccionado
  const filteredCategories = transactionCategories.filter(cat => cat.type === type);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Registrar Movimiento</Text>

          {/* Tipo de Movimiento (Gasto / Ingreso) */}
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[styles.typeButton, type === 'Gasto' && styles.typeButtonActive]}
              onPress={() => setType('Gasto')}
            >
              <Text style={[styles.typeButtonText, type === 'Gasto' && styles.typeButtonTextActive]}>Gasto</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeButton, type === 'Ingreso' && styles.typeButtonActive]}
              onPress={() => setType('Ingreso')}
            >
              <Text style={[styles.typeButtonText, type === 'Ingreso' && styles.typeButtonTextActive]}>Ingreso</Text>
            </TouchableOpacity>
          </View>

          {/* Campo Descripción */}
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Café, Salario, Alquiler..."
            value={description}
            onChangeText={setDescription}
          />

          {/* Campo Monto */}
          <Text style={styles.label}>Monto</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Selector de Categoría */}
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {filteredCategories.map(cat => (
                <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
              ))}
            </Picker>
          </View>

          {/* Selector de Fecha */}
          <Text style={styles.label}>Fecha</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerButtonText}>{date.toLocaleDateString()}</Text>
            <Ionicons name="calendar-outline" size={24} color="#1E90FF" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Botón de Registro */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Registrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '600',
    marginTop: 15,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden', // Para asegurar que el borde se vea bien
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  picker: {
    height: 50, // Ajusta la altura del Picker
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    color: '#333333',
  },
  datePickerButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333333',
  },
  registerButton: {
    backgroundColor: '#1E90FF', // Azul Primario
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: "#1E90FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    marginBottom: 20,
    marginTop: 10,
    overflow: 'hidden',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#1E90FF', // Azul para el botón activo
    borderRadius: 25, // Asegura que se vea bien si es activo
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  typeButtonTextActive: {
    color: 'white',
  },
});