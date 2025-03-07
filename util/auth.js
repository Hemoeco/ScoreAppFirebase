import { auth } from '../firebase/FirebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export async function signIn(user) {
  const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
  return userCredential;
}

export async function createUser(user) {
  const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
  //Uncomment this when its necessary send an email verification.
  //const test = await sendEmailVerification(userCredential.user);

  return userCredential;
}

export async function logOff() {
  const logout = await signOut(auth);
  return logout;
}

