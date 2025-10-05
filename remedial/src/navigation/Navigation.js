import { NavigationContainer } from "@react-navigation/native"; // Importa el contenedor de navegación
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Importa el creador de stack navigator
 
import Home from "../screens/HomeScreen.js"; // Importa la pantalla de Sesión
import Registro from "../screens/RegisterScreen.js"; // Importa la pantalla de Sesión
import Welcome from "../screens/WelcomeScreen.js"; // Importa la pantalla de Sesión
import TabNavigator from "../navigation/NavigationTab.js"; // Importa el navegador de pestañas
 
export default function Navigation() {
  const Stack = createNativeStackNavigator(); // Crea una instancia del stack navigator
 
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome" // Establece 'SplashScreen' como la ruta inicial
        screenOptions={{
          headerShown: false, // Oculta el header por defecto
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}