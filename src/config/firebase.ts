import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Reemplaza estos valores con los de tu proyecto Firebase
// Los obtienes en: Firebase Console → Project Settings → General → Your apps → Web app
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios de autenticación
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configurar el provider de Google para solicitar información adicional
googleProvider.setCustomParameters({
  prompt: "select_account", // Siempre mostrar selector de cuenta
});
