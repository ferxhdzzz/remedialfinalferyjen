import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import TransactionItem from '../components/TransactionItem';
import { PieChart } from 'react-native-chart-kit'; // Para la gráfica
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para persistir datos

// Instalar AsyncStorage
// npm install @react-native-async-storage/async-storage

// --- DATOS DE EJEMPLO INICIALES ---
const initialTransactions = [
  { id: 1, descripcion: 'Salario Octubre', monto: 3500, tipo: 'Ingreso', fecha: '2025-10-01', categoria: 'Salario' },
  { id: 2, descripcion: 'Almuerzo con colegas', monto: -12.5, tipo: 'Gasto', fecha: '2025-10-03', categoria: 'Comida' },
  { id: 3, descripcion: 'Suscripción Netflix', monto: -5.99, tipo: 'Gasto', fecha: '2025-10-02', categoria: 'Entretenimiento' },
  { id: 4, descripcion: 'Pasaje bus', monto: -2.00, tipo: 'Gasto', fecha: '2025-10-03', categoria: 'Transporte' },
  { id: 5, descripcion: 'Venta de libro', monto: 25.00, tipo: 'Ingreso', fecha: '2025-10-04', categoria: 'Otros Ingresos' },
  { id: 6, descripcion: 'Cena en restaurante', monto: -45.00, tipo: 'Gasto', fecha: '2025-10-04', categoria: 'Comida' },
  { id: 7, descripcion: 'Recarga celular', monto: -10.00, tipo: 'Gasto', fecha: '2025-10-05', categoria: 'Hogar' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);

  // Cargar transacciones al iniciar o al enfocar la pantalla
  useFocusEffect(
    React.useCallback(() => {
      const loadTransactions = async () => {
        try {
          const storedTransactions = await AsyncStorage.getItem('transactions');
          if (storedTransactions !== null) {
            setTransactions(JSON.parse(storedTransactions));
          } else {
            setTransactions(initialTransactions); // Cargar iniciales si no hay nada guardado
          }
        } catch (error) {
          console.error("Error loading transactions:", error);
          setTransactions(initialTransactions); // Fallback
        }
      };
      loadTransactions();
    }, [])
  );

  // Guardar transacciones cada vez que cambian
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
      } catch (error) {
        console.error("Error saving transactions:", error);
      }
    };
    saveTransactions();
  }, [transactions]);


  const addTransaction = (newTransaction) => {
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  };

  const balanceTotal = transactions.reduce((acc, item) => acc + item.monto, 0);
  const totalIngresos = transactions.filter(t => t.tipo === 'Ingreso').reduce((acc, t) => acc + t.monto, 0);
  const totalGastos = transactions.filter(t => t.tipo === 'Gasto').reduce((acc, t) => acc + Math.abs(t.monto), 0);

  // --- PREPARAR DATOS PARA LA GRÁFICA DE GASTOS POR CATEGORÍA ---
  const getChartData = () => {
    const gastosPorCategoria = transactions
      .filter(t => t.tipo === 'Gasto')
      .reduce((acc, t) => {
        const categoria = t.categoria || 'Sin Categoría';
        acc[categoria] = (acc[categoria] || 0) + Math.abs(t.monto);
        return acc;
      }, {});

    const chartColors = ['#FF6347', '#FFA07A', '#FFD700', '#ADFF2F', '#7FFFD4', '#40E0D0', '#87CEEB', '#BA55D3', '#DA70D6'];
    let colorIndex = 0;

    const data = Object.keys(gastosPorCategoria).map((categoria) => {
      const color = chartColors[colorIndex % chartColors.length];
      colorIndex++;
      return {
        name: categoria,
        population: gastosPorCategoria[categoria], // `population` es el valor para la gráfica
        color: color,
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      };
    }).sort((a,b) => b.population - a.population); // Ordenar de mayor a menor gasto

    return data;
  };

  const chartData = getChartData();
  
  // Configuración para la gráfica
  const chartConfig = {
    backgroundGradientFrom: '#F5F5F5',
    backgroundGradientTo: '#F5F5F5',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color del texto de la leyenda
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER DE BALANCE */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Balance Total</Text>
          <Text style={styles.balanceText}>
            ${balanceTotal.toFixed(2)}
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Ionicons name="arrow-up-circle-outline" size={20} color="#3CB371" />
              <Text style={styles.summaryLabel}>Ingresos</Text>
              <Text style={styles.summaryValueIngreso}>+${totalIngresos.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryBox}>
              <Ionicons name="arrow-down-circle-outline" size={20} color="#FF6347" />
              <Text style={styles.summaryLabel}>Gastos</Text>
              <Text style={styles.summaryValueGasto}>-${totalGastos.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* SECCIÓN DE GRÁFICA DE GASTOS */}
        {chartData.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Gastos por Categoría</Text>
            <PieChart
              data={chartData}
              width={styles.chartContainer.width}
              height={200}
              chartConfig={chartConfig}
              accessor="population" // Propiedad que contiene el valor para la gráfica
              backgroundColor="transparent"
              paddingLeft="15" // Ajusta el padding para la leyenda
              absolute // Muestra los valores absolutos
            />
          </View>
        )}
        {chartData.length === 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Gastos por Categoría</Text>
            <Text style={styles.noDataText}>No hay gastos registrados para mostrar en la gráfica.</Text>
          </View>
        )}
        

        {/* LISTA DE TRANSACCIONES */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Movimientos Recientes</Text>
          {transactions.sort((a,b) => new Date(b.fecha) - new Date(a.fecha)).map(t => ( // Ordenar por fecha descendente
            <TransactionItem key={t.id} {...t} />
          ))}
          {transactions.length === 0 && (
            <Text style={styles.noDataText}>No hay movimientos registrados.</Text>
          )}
        </View>
      </ScrollView>

      {/* BOTÓN FLOTANTE para añadir transacción */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Register', { addTransaction })} // Pasar la función
      >
        <Ionicons name="add-circle" size={50} color="#1E90FF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Fondo principal
  },
  scrollContent: {
    paddingBottom: 100, // Espacio para que el FAB no cubra contenido
  },
  
  // Estilos del Encabezado (Balance Total)
  header: {
    padding: 20,
    backgroundColor: '#1E90FF', // Azul Primario
    marginBottom: 10,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.8,
  },
  balanceText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  summaryBox: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  summaryValueIngreso: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4EDDA', // Un verde más claro para armonizar con el azul
    marginTop: 3,
  },
  summaryValueGasto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8D7DA', // Un rojo más claro
    marginTop: 3,
  },

  // Estilos generales de sección
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    marginLeft: 15,
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
  },

  // Estilos de la Sección de Gráfica
  chartSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  chartContainer: {
    width: '100%', // El ancho del PieChart necesita ser numérico, no string
  },

  // Estilos de la Sección de Transacciones
  transactionsSection: {
    marginTop: 10,
    paddingHorizontal: 15, // Padding para los items de la lista
  },

  // Estilos del Botón de Acción Flotante (FAB - Floating Action Button)
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'white', 
    borderRadius: 50,
    padding: 5, 
    shadowColor: "#1E90FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, 
  },
});