import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Platform } from "react-native";

// Pantallas
import Home from "../screens/HomeScreen";
import Registro from "../screens/RegisterScreen";
import Welcome from "../screens/WelcomeScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#ffff", // Azul claro (activo)
        tabBarInactiveTintColor: "#ffff", // Gris azulado (inactivo)
        tabBarStyle: {
          backgroundColor: "#84b6f4", // Azul marino de fondo
          height: Platform.OS === "ios" ? 80 : 60,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case "Welcome":
              iconName = focused ? "people" : "people-outline";
              break;
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;

              case "Registro":
              iconName = focused ? "pencil" : "pencil-outline";
              break;
           
          }

          return <Ionicons name={iconName} color={color} size={26} />;
        },
      })}
    >
      <Tab.Screen name="Welcome" component={Welcome} options={{ title: "Bienvenida" }} />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ title: "Inicio" }}
      />
       <Tab.Screen
        name="Registro"
        component={Registro}
        options={{ title: "registro" }}
      />
    
    </Tab.Navigator>
  );
};

export default TabNavigator;
