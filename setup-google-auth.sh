#!/bin/bash

# Script para configurar Google OAuth con Firebase

echo "🔥 Configuración de Firebase Authentication con Google"
echo "=================================================="
echo ""

# Paso 1: Instalar Firebase
echo "📦 Paso 1: Instalando Firebase..."
npm install firebase

if [ $? -eq 0 ]; then
    echo "✅ Firebase instalado correctamente"
else
    echo "❌ Error al instalar Firebase"
    exit 1
fi

echo ""
echo "=================================================="
echo "📝 Pasos siguientes (MANUAL):"
echo "=================================================="
echo ""
echo "1️⃣  Configurar Firebase Console:"
echo "   - Ve a https://console.firebase.google.com/"
echo "   - Crea un proyecto nuevo o selecciona uno existente"
echo "   - Habilita Authentication → Google"
echo ""
echo "2️⃣  Obtener credenciales:"
echo "   - En Firebase Console: ⚙️ Project Settings"
echo "   - Copia la configuración de tu Web App"
echo "   - Edita: src/config/firebase.ts"
echo "   - Reemplaza los valores de firebaseConfig"
echo ""
echo "3️⃣  Actualizar el store:"
echo "   - Abre: src/stores/auth.ts"
echo "   - Reemplaza el contenido con src/stores/auth.firebase.ts"
echo "   - O sigue las instrucciones en auth.firebase.ts"
echo ""
echo "4️⃣  Para Android (APK):"
echo "   - En Firebase Console, agrega Android app"
echo "   - Package name: io.ionic.starter"
echo "   - Descarga google-services.json"
echo "   - Colócalo en: android/app/google-services.json"
echo "   - Obtén SHA-1: cd android && ./gradlew signingReport"
echo "   - Agrega SHA-1 en Firebase Console"
echo ""
echo "5️⃣  Modificar build.gradle (Android):"
echo "   - android/build.gradle:"
echo "     buildscript {"
echo "       dependencies {"
echo "         classpath 'com.google.gms:google-services:4.4.0'"
echo "       }"
echo "     }"
echo ""
echo "   - android/app/build.gradle (al final):"
echo "     apply plugin: 'com.google.gms.google-services'"
echo ""
echo "6️⃣  Sincronizar y probar:"
echo "   npm run build"
echo "   npx cap sync android"
echo "   npx cap open android"
echo ""
echo "=================================================="
echo "📚 Documentación completa: GOOGLE_AUTH_GUIDE.md"
echo "=================================================="
echo ""
echo "✨ ¡Listo! Ahora configura tus credenciales de Firebase"
