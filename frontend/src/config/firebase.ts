import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBXZ6tZltXhBhOAl_KzsB5hLS4DiYivNmw",
  authDomain: "capstoneproject-34783.firebaseapp.com",
  projectId: "capstoneproject-34783",
  storageBucket: "capstoneproject-34783.firebasestorage.app",
  messagingSenderId: "1037841123912",
  appId: "1:1037841123912:web:cde01a430f805f8b8fa67d",
  measurementId: "G-81YZX3CMK3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;