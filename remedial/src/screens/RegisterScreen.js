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
// import { Picker } from '@react-native-picker/picker'; // Ya no se usa
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
          {/* HEADER AZUL */}
          <View style={styles.header}>
            <Text style={styles.title}>Registrar Movimiento</Text>
          </View>

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
          <View style={styles.categoryContainer}>
            {filteredCategories.map(cat => {
              // Icono basado en la categoría
              let iconName;
              switch (cat.value) {
                case 'Comida': iconName = 'fast-food'; break;
                case 'Transporte': iconName = 'car'; break;
                case 'Hogar': iconName = 'home'; break;
                case 'Entretenimiento': iconName = 'game-controller'; break;
                case 'Salud': iconName = 'heart'; break;
                case 'Educacion': iconName = 'school'; break;
                case 'Ropa': iconName = 'shirt'; break;
                case 'Salario': iconName = 'briefcase'; break;
                case 'Bonos': iconName = 'gift'; break;
                case 'Inversion': iconName = 'trending-up'; break;
                case 'Regalo': iconName = 'gift'; break;
                default: iconName = 'ellipse'; break;
              }

              return (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryButton,
                    category === cat.value && styles.categoryButtonActive
                  ]}
                  onPress={() => setCategory(cat.value)}
                >
                  <Ionicons 
                    name={iconName} 
                    size={16} 
                    color={category === cat.value ? 'white' : '#1E90FF'} 
                    style={styles.categoryIcon}
                  />
                  <Text style={[
                    styles.categoryButtonText,
                    category === cat.value && styles.categoryButtonTextActive
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1E90FF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '600',
    marginTop: 20,
    marginLeft: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    gap: 10,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: '#1E90FF',
    borderColor: '#1E90FF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  categoryIcon: {
    marginRight: 6,
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
    marginHorizontal: 20,
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
    backgroundColor: '#1E90FF',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
    marginHorizontal: 20,
    marginBottom: 20,
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
    marginTop: 20,
    marginHorizontal: 20,
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