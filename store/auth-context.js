import { createContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { authenticateFirebase } from "../util/auth"
import NetInfo from '@react-native-community/netinfo';

export const AuthContext = createContext({
  token: '',
  device: '',
  isConnected: false,
  isAuthenticated: false,
  isAuthenticating: false,
  authenticate: async (user, authMode) => { },
  logout: () => { }
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
      const token = await authenticateFirebase(user, authMode);
      setAuthToken(token);
    }
    catch (err) {
      if (Platform.OS !== 'web') {
        Alert.alert(
          '¡Falló la autenticación!',
          'Verifica que hayas ingresado tus datos correctamente.'
        );
      }
      else {
        window.alert(`Error: ${err.response.data.error.message}`);
      }
    }
    setIsAuthenticating(false);
  }

  function logout() {
    setAuthToken(null);
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