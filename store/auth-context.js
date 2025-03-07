import { createContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { createUser, signIn, logOff } from "../util/auth"
import NetInfo from '@react-native-community/netinfo';
import { AuthModes } from "../consts/auth";

export const AuthContext = createContext({
  token: '',
  device: '',
  isConnected: false,
  isAuthenticated: false,
  isAuthenticating: false,
  authenticate: async (user, authMode) => { },
  logout: async () => { }
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    // Subscribe to network state updates
    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
  }, []);

  async function authenticate(user, authMode) {
    setIsAuthenticating(true);
    try {
      let userCredentials;
      if (authMode === AuthModes.login) {
        userCredentials = await signIn(user);
      }
      else {
        userCredentials = await createUser(user);
      }
      setAuthToken(userCredentials.user.accessToken);
    }
    catch (err) {
      if (Platform.OS !== 'web') {
        Alert.alert(
          '¡Falló la autenticación!',
          'Verifica que hayas ingresado tus datos correctamente.'
        );
      }
      else {
        console.log(err);
        window.alert(`Error: ${err}`);
      }
    }
    setIsAuthenticating(false);
  }

  async function logout() {
    try {
      const test = await logOff();
      setAuthToken(null);
    } catch (error) {
      console.log(error);
    }
  }

  const value = {
    token: authToken,
    device: Platform.OS,
    isAuthenticated: !!authToken,
    isAuthenticating: isAuthenticating,
    isConnected: isConnected,
    authenticate: authenticate,
    logout: logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider;