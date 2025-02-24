import { useContext } from 'react';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { AuthContext } from '../store/auth-context';

function LoginScreen() {
  const authCtx = useContext(AuthContext);

  if(authCtx.isAuthenticating) {
    return <LoadingOverlay message="Iniciando sesión"/>
  }

  return <AuthContent isLogin/>;
}

export default LoginScreen;
