# Configuración de Firebase

Este archivo contiene la configuración de Firebase para la aplicación.

## Cómo obtener tu configuración

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona o crea tu proyecto
3. Haz clic en el ícono de engranaje ⚙️ → **Project Settings**
4. En la sección **Your apps**, selecciona tu app web (o crea una nueva)
5. Copia los valores de configuración

## Valores a reemplazar en `firebase.ts`

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto-12345.firebaseapp.com",
  projectId: "tu-proyecto-12345",
  storageBucket: "tu-proyecto-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
};
```

## Habilitar Google Authentication

1. En Firebase Console, ve a **Authentication**
2. Haz clic en **Sign-in method**
3. Habilita **Google**
4. Guarda los cambios

## Configuración para Android

Para que funcione en tu APK:

1. Agrega tu app Android en Firebase Console
2. Descarga `google-services.json`
3. Colócalo en `android/app/google-services.json`
4. Agrega tu SHA-1 fingerprint (obtenerlo con `./gradlew signingReport`)

## Seguridad

⚠️ **Importante**:

- No compartas tu `apiKey` públicamente en repositorios públicos
- Configura reglas de seguridad en Firebase Console
- Limita los dominios autorizados en producción
