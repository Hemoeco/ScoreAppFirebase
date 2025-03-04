import { useState } from 'react';
import { Alert, Image, StyleSheet, View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AuthForm from './AuthForm';
import { Colors } from '../../consts/colors';
import Button from '../UI/Button';

function AuthContent({ isLogin }) {
  const navigation = useNavigation();

  function switchAuthModeHandler() {
    if (isLogin) {
      /*
        "navigate" go to a different screen and give us a back button.
        "replace" go to a different screen but doesn't give us a back button.
      */
      navigation.replace('Signup');
    } else {
      navigation.replace('Login');
    }

  }

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <View style={styles.authContent}>
        <View style={styles.center}>
          <Text style={styles.text}>SCORE 2.0</Text>
          <Image style={styles.imageContainer} source={require('../UI/simbol.png')} />
        </View>
        <AuthForm
          isLogin={isLogin}
        />
        <View style={styles.buttons}>
          <Button 
            onPress={switchAuthModeHandler} 
            icon={isLogin ? "person-add": "log-in"}
            size={19}
          >
            {isLogin ? 'Crear usuario' : 'Regresar a iniciar sesión'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 45,
    marginBottom: 45,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.accent300,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    alignItems: 'center',
    width: '100%',
    marginTop: 3,
  },
  imageContainer: {
    //flex: 1,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#353535',
    width: 45,
    height: 50,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 30,
    paddingRight: 10
  }
});
