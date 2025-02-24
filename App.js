import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { Colors } from './consts/colors';
import IconButton from './components/UI/IconButton';
import RentEquipContextProvider from './store/rent-equip-context';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AllRentEquips from './screens/AllRentEquips';
import ManageRentEquips from './screens/ManageRentEquips';
import { useContext } from 'react';

const Stack = createNativeStackNavigator();

function Authenticated() {
  return (
    <RentEquipContextProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.accent300,
            borderBottomWidth: 2,
            borderBottomColor: Colors.accent400
          },
          contentStyle: { backgroundColor: Colors.accent200 }
        }}
      >
        <Stack.Screen
          name="AllRentEquips"
          component={AllRentEquips}
          options={({ navigation }) => ({
            title: 'Equipos renta',
            headerRight: ({ tintColor }) => (
              <IconButton
                icon="add"
                size={24}
                color={tintColor}
                onPress={() => navigation.navigate('ManageRentEquips')}
              />
            )
          })}
        />
        <Stack.Screen
          name="ManageRentEquips"
          component={ManageRentEquips}
        />
      </Stack.Navigator>
    </RentEquipContextProvider>
  );
}

function NotAuthenticated() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.accent400 },
        //headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.accent300 },
      }}
    >
      <Stack.Screen
        name="Login"
        options={({ navigation }) => ({
          title: 'Iniciar sesión'
        })}
        component={LoginScreen}
      />
      <Stack.Screen
        name="Signup"
        options={({ navigation }) => ({
          title: 'Crear usuario'
        })}
        component={SignupScreen}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {/* 
        To protect screens against unauthorized access we use the context created. 
        We check if the uses is authenticated, if false then we load the screens 
        for sign up/in, else we load the screen for welcome (in that we can have more
        screens, in this case is just one for welcome).
      */}
      {!authCtx.isAuthenticated && <NotAuthenticated />}
      {authCtx.isAuthenticated && <Authenticated />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}
