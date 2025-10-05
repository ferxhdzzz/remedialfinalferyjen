import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionItem({ descripcion, monto, fecha, tipo, categoria }) {
  const isGasto = tipo === 'Gasto';
  const color = isGasto ? styles.gastoText : styles.ingresoText;
  const signo = isGasto ? '-' : '+'; // Mostrar '-' explícitamente para gastos

  // Icono basado en la categoría (simplificado, puedes expandir esto)
  let iconName;
  switch (categoria) {
    case 'Comida': iconName = 'fast-food'; break;
    case 'Transporte': iconName = 'car'; break;
    case 'Hogar': iconName = 'home'; break;
    case 'Entretenimiento': iconName = 'game-controller'; break;
    case 'Salud': iconName = 'heart'; break;
    case 'Trabajo': iconName = 'briefcase'; break;
    case 'Inversión': iconName = 'trending-up'; break;
    default: iconName = isGasto ? 'remove-circle' : 'add-circle'; break;
  }

  return (
    <View style={styles.transactionContainer}>
      <View style={styles.iconWrapper}>
        <Ionicons name={iconName} size={24} color={isGasto ? '#FF6347' : '#3CB371'} />
      </View>
      <View style={styles.detailsWrapper}>
        <Text style={styles.transactionDescription}>{descripcion}</Text>
        <Text style={styles.transactionDetails}>{categoria} • {new Date(fecha).toLocaleDateString()}</Text>
      </View>
      <Text style={[styles.transactionMonto, color]}>
        {signo}${Math.abs(monto).toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  iconWrapper: {
    marginRight: 15,
    // Puedes añadir un fondo circular aquí si quieres
  },
  detailsWrapper: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  transactionDetails: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  transactionMonto: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  ingresoText: {
    color: '#3CB371',
  },
  gastoText: {
    color: '#FF6347',
  },
});