import axios from 'axios';
import { firebaseConfig } from '../firebase/FirebaseConfig';

export async function authenticateFirebase(user, authMode) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${authMode}?key=${firebaseConfig.apiKey}`;
  const email = user.email;
  const password = user.password;

  const response = await axios.post(url,
    //The object below will be converted to JSON automatically by axios.
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
  );

  const token = response.data.idToken;

  return token;
}