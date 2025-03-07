import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from '@react-navigation/drawer';
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from 'react';

import { Colors } from './consts/colors';
import IconButton from './components/UI/IconButton';
import RentEquipContextProvider from './store/rent-equip-context';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AllRentEquips from './screens/AllRentEquips';
import ManageRentEquips from './screens/ManageRentEquips';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const authCtx = useContext(AuthContext);
  return (
    <DrawerContentScrollView
      {...props}
      style={{
        backgroundColor: Colors.accent300
      }}
    >
      <DrawerItemList {...props} />
      <DrawerItem
        label="Cerrar sesión"
        labelStyle={{
          color: 'black',
          fontSize: 15
        }}
        icon={() => (
          <Ionicons name="log-out-outline" size={25} />
        )}
        onPress={() => authCtx.logout()}
      />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.accent300,
        },
        sceneStyle: { backgroundColor: Colors.accent200 },
        drawerActiveTintColor: 'black',
        drawerActiveBackgroundColor: Colors.accent200,
        keyboardHandlingEnabled: false
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
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
          ),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          )
        })}
      />
    </Drawer.Navigator>
  );
}

function Authenticated() {
  const [dbInitialized, setDbInitialized] = useState(false);

  //useEffect(() => {
  //  init()
  //    .then(() => {
  //      setDbInitialized(true);
  //    })
  //    .catch((err) => {
  //      console.log(err);
  //    });
  //}, []);

  return (
    <RentEquipContextProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.accent300,
          },
          contentStyle: { backgroundColor: Colors.accent200 }
        }}
      >
        {<Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{
            headerShown: false
          }}
        />}
        {/*<Stack.Screen
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
        />*/}
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
        headerStyle: { backgroundColor: Colors.accent300 },
        contentStyle: { backgroundColor: Colors.accent200 },
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
  console.log(authCtx.isConnected);

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
      {/*<Authenticated />*/}
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
