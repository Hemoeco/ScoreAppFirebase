import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AllRentEquips from './screens/AllRentEquips';
import { Colors } from './consts/colors';
import IconButton from './components/UI/IconButton';
import ManageRentEquips from './screens/ManageRentEquips';
import RentEquipContextProvider from './store/rent-equip-context';


const Stack = createNativeStackNavigator();
//console.log(firebaseApp)

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <RentEquipContextProvider>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors.accent300,
                borderBottomWidth: 2,
                borderBottomColor: Colors.accent400
              },
              headerTintColor: 'black',
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
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
