# Configuración de Google Auth para Android

## Archivos a modificar

### 1. android/build.gradle

```gradle
// Top-level build file
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.0.0'
        classpath 'com.google.gms:google-services:4.4.0'  // ← AGREGAR ESTA LÍNEA
    }
}

apply from: "variables.gradle"

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
```

### 2. android/app/build.gradle

Agregar al **FINAL** del archivo:

```gradle
apply plugin: 'com.google.gms.google-services'  // ← AGREGAR AL FINAL
```

### 3. android/app/google-services.json

Descargar desde Firebase Console y colocar en esta ubicación.

**Estructura del archivo**:

```json
{
  "project_info": {
    "project_number": "123456789",
    "project_id": "tu-proyecto",
    "storage_bucket": "tu-proyecto.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:123456789:android:abc123",
        "android_client_info": {
          "package_name": "io.ionic.starter"
        }
      },
      "oauth_client": [...],
      "api_key": [...],
      "services": {
        "appinvite_service": {...}
      }
    }
  ],
  "configuration_version": "1"
}
```

## Obtener SHA-1 Fingerprint

### Para Debug (desarrollo):

```bash
cd android
./gradlew signingReport
```

Busca en la salida:

```
Variant: debug
Config: debug
Store: ~/.android/debug.keystore
Alias: AndroidDebugKey
MD5: XX:XX:XX:...
SHA1: YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY  ← COPIAR ESTE
SHA-256: ZZ:ZZ:ZZ:...
```

### Para Release (producción):

```bash
keytool -list -v -keystore /path/to/release.keystore -alias your-key-alias
```

## Agregar SHA-1 en Firebase

1. Firebase Console → Project Settings
2. Your apps → Tu app Android
3. Scroll hasta **SHA certificate fingerprints**
4. Click en **Add fingerprint**
5. Pega el SHA-1
6. Guarda

## Verificar instalación

### Verificar google-services.json:

```bash
ls -la android/app/google-services.json
```

Debe existir y tener contenido.

### Verificar plugin en build.gradle:

```bash
grep "google-services" android/app/build.gradle
```

Debe mostrar: `apply plugin: 'com.google.gms.google-services'`

### Verificar classpath:

```bash
grep "google-services" android/build.gradle
```

Debe mostrar: `classpath 'com.google.gms:google-services:4.4.0'`

## Troubleshooting

### Error: "google-services plugin not found"

- Verifica que agregaste el classpath en android/build.gradle
- Verifica que está en la sección buildscript → dependencies

### Error: "File google-services.json is missing"

- Descarga el archivo desde Firebase Console
- Colócalo exactamente en: android/app/google-services.json
- Ejecuta: npx cap sync android

### Error: "Sign in failed" en el APK

- Verifica que agregaste el SHA-1 en Firebase Console
- Verifica que el package name coincida (io.ionic.starter)
- Asegúrate de estar usando un dispositivo real (no emulador)
- Reconstruye: npm run build && npx cap sync android

### Error: "API_KEY_INVALID"

- Verifica que google-services.json sea de tu proyecto correcto
- Verifica que las APIs estén habilitadas en Google Cloud Console

## Build final

```bash
# 1. Build web
npm run build

# 2. Sync con Android
npx cap sync android

# 3. Abrir Android Studio
npx cap open android

# 4. En Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
```

## Testing

1. Instala el APK en un dispositivo **físico** (no emulador)
2. Abre la app
3. Click en "Continuar con Google"
4. Selecciona tu cuenta Google
5. Acepta permisos
6. Deberías ver el dashboard con tu nombre

## Notas importantes

⚠️ Google Sign-In **NO funciona en emuladores Android**
⚠️ Necesitas un dispositivo físico para probar
⚠️ El SHA-1 debe ser del keystore que usas para firmar el APK
⚠️ Para producción, usa un keystore de release y agrega su SHA-1
