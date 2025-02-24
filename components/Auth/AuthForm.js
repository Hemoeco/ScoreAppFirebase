import { useContext, useState } from 'react';
import { Alert, StyleSheet, TextInput, View, Text, Platform } from 'react-native';

import Button from '../UI/Button';
import { User } from "../../models/user";
import { Colors } from '../../consts/colors';
import { AuthContext } from '../../store/auth-context';
import { AuthModes } from '../../consts/auth';

function AuthForm({ isLogin }) {
  const authCtx = useContext(AuthContext);
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue.trim());
        break;
      case 'confirmEmail':
        setEnteredConfirmEmail(enteredValue.trim());
        break;
      case 'password':
        setEnteredPassword(enteredValue.trim());
        break;
      case 'confirmPassword':
        setEnteredConfirmPassword(enteredValue.trim());
        break;
    }
  }

  function submitHandler() {
    const user = new User(enteredEmail, enteredPassword);
    setValidEmail(true);
    setValidPassword(true);
    //If the user is creating an account, then set the values for the confirm inputs
    if (!isLogin) {
      user.__setConfirmEmail(enteredConfirmEmail);
      user.__setConfirmPassword(enteredConfirmPassword);
    }

    if (!user.emailIsValid()) {
      setValidEmail(false);
      if (authCtx.device !== 'web'){
        Alert.alert('Error', 'El email ingresado no es válido.');
      }
      else{
        window.alert('El email ingresado no es válido.');
      }
      return;
    }
    
    if (!user.passwordIsValid()) {
      setValidPassword(false);
      Alert.alert('Error', 'La contraseña no es válida, debe tener al menos 6 caracteres.');
      return;
    }

    if (!isLogin) {
      if (!user.emailsAreEqual()) {
        setValidEmail(false);
        Alert.alert('Error', 'Los email no coinciden.');
        return;
      }

      if (!user.passwordsAreEqual()) {
        setValidPassword(false);
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
      }
    }

    authCtx.authenticate(user, isLogin ? AuthModes.login : AuthModes.create);    
  }

  return (
    <View>
      <Text style={[styles.label, !validEmail && styles.invalidLabel]}>
        Email
      </Text>
      <TextInput
        style={[styles.input, !validEmail && styles.invalidInput]}
        onChangeText={updateInputValueHandler.bind(this, 'email')}
        value={enteredEmail}
        keyboardType="email-address"
      />
      {!isLogin && (
        <View>
          <Text style={[styles.label, !validEmail && styles.invalidLabel]}>
            Confirmar email
          </Text>
          <TextInput
            style={[styles.input, !validEmail && styles.invalidInput]}
            onChangeText={updateInputValueHandler.bind(this, 'confirmEmail')}
            value={enteredConfirmEmail}
            keyboardType="email-address"
          />
        </View>
      )}
      <Text style={[styles.label, !validPassword && styles.invalidLabel]}>
        Contraseña
      </Text>
      <TextInput
        style={[styles.input, !validPassword && styles.invalidInput]}
        onChangeText={updateInputValueHandler.bind(this, 'password')}
        secureTextEntry={true}
        value={enteredPassword}
      />
      {!isLogin && (
        <View>
          <Text style={[styles.label, !validPassword && styles.invalidLabel]}>
            Confirmar contraseña
          </Text>
          <TextInput
            style={[styles.input, !validPassword && styles.invalidInput]}
            onChangeText={updateInputValueHandler.bind(
              this,
              'confirmPassword'
            )}
            secureTextEntry={true}
            value={enteredConfirmPassword}
          />
        </View>
      )}
      <View style={styles.buttons}>
        <Button 
          onPress={submitHandler}
          icon={isLogin ? "log-in" : "person-add"}
          size={19}
        >
          {isLogin ? 'Iniciar sesión' : 'Crear usuario'}
        </Button>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 2,
    //borderColor: Colors.accent400,
    backgroundColor: Colors.accent300,
    borderRadius: 4
  },
  invalidLabel: {
    color: 'red'
  },
  invalidInput: {
    backgroundColor: '#fa775c'
  },
});
