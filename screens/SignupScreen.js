import { useContext } from 'react';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { AuthContext } from '../store/auth-context';

function SignupScreen() {
  const authCtx = useContext(AuthContext);

  if(authCtx.isAuthenticating) {
    return <LoadingOverlay message="Creando usuario"/>
  }

  return <AuthContent />;
}

export default SignupScreen;
