# Sistema de Autenticación

## Descripción

Se ha implementado un sistema de autenticación completo para la aplicación de Finanzas con las siguientes características:

## Características Implementadas

### 1. Pantalla de Login (`LoginPage.vue`)

- **Ubicación**: `/src/views/auth/LoginPage.vue`
- **Ruta**: `/login`

#### Funcionalidades:

- ✅ Login con Google (simulado - listo para integración real)
- ✅ Login con Email y contraseña
- ✅ Diseño moderno con animaciones
- ✅ Validación de formularios
- ✅ Notificaciones toast de éxito/error
- ✅ Diseño responsive

#### Diseño:

- Fondo degradado verde (#20C997)
- Logo de la app con icono de billetera
- Botón de Google con logo oficial
- Formulario de email/contraseña
- Efectos de hover y animaciones suaves

### 2. Store de Autenticación (`auth.ts`)

- **Ubicación**: `/src/stores/auth.ts`

#### Estado:

```typescript
- user: Usuario autenticado actual
- isAuthenticated: Estado de autenticación
- isLoading: Estado de carga
```

#### Métodos:

- `loginWithGoogle()`: Autenticación con Google
- `loginWithEmail(email)`: Autenticación con email
- `logout()`: Cerrar sesión
- Persistencia en localStorage

### 3. Guardias de Navegación (Router)

- **Ubicación**: `/src/router/index.ts`

#### Protección de Rutas:

- ✅ Rutas protegidas requieren autenticación (`requiresAuth`)
- ✅ Ruta de login solo para invitados (`requiresGuest`)
- ✅ Redirección automática según estado de auth

#### Flujo:

```
Usuario no autenticado → /login
Usuario autenticado → /tabs/dashboard
```

### 4. Integración con ProfilePage

- Botón de "Cerrar Sesión" agregado
- Confirmación antes de cerrar sesión
- Redirección automática al login

### 5. Integración con DashboardPage

- Muestra el nombre del usuario autenticado
- Fallback al nombre del perfil si no hay usuario

## Cómo Usar

### Para Probar la Aplicación:

1. **Iniciar la aplicación**:

   ```bash
   npm run dev
   ```

2. **Acceder al login**:

   - La app redirige automáticamente a `/login`

3. **Iniciar sesión**:

   - **Opción 1**: Click en "Continuar con Google"
   - **Opción 2**: Ingresar email y contraseña, click en "Iniciar Sesión"

4. **Navegar en la app**:

   - Después del login, acceso completo a todas las funciones

5. **Cerrar sesión**:
   - Ir a Perfil → Cerrar Sesión

### Para Integrar Google Auth Real:

#### En Web:

```bash
npm install @google/oauth2
```

Modificar en `auth.ts`:

```typescript
import { GoogleAuth } from "@google/oauth2";

const loginWithGoogle = async () => {
  const auth = new GoogleAuth();
  const user = await auth.signIn();
  // Procesar usuario
};
```

#### En Android (APK):

1. Configurar OAuth en Google Cloud Console
2. Obtener Client ID para Android
3. Agregar al `capacitor.config.ts`:

```typescript
plugins: {
  GoogleAuth: {
    scopes: ['profile', 'email'],
    serverClientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
    forceCodeForRefreshToken: true,
  }
}
```

## Estructura de Archivos

```
src/
├── views/
│   └── auth/
│       └── LoginPage.vue          # Pantalla de login
├── stores/
│   └── auth.ts                    # Store de autenticación
└── router/
    └── index.ts                   # Rutas y guardias
```

## Estado Actual

✅ **Completado**:

- Pantalla de login funcional
- Sistema de autenticación simulado
- Guardias de navegación
- Persistencia de sesión
- Integración con perfil y dashboard
- Diseño moderno y responsive

⏳ **Pendiente para Producción**:

- Integrar API de Google Auth real
- Implementar backend para validación de email/password
- Agregar recuperación de contraseña
- Implementar registro de nuevos usuarios
- Agregar autenticación biométrica (huella/Face ID)

## Notas de Desarrollo

- El sistema actual usa autenticación **simulada** para desarrollo
- Los usuarios se guardan en localStorage
- No hay validación real de contraseñas
- Listo para integrar servicios de autenticación reales

## Build y Deploy

### Generar APK con Autenticación:

```bash
npm run build
npx cap sync android
npx cap open android
```

En Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

## Seguridad

⚠️ **Importante**:

- Este es un sistema de autenticación de desarrollo/demostración
- Para producción, implementar:
  - HTTPS obligatorio
  - Tokens JWT
  - Refresh tokens
  - Rate limiting
  - Validación server-side
  - Encriptación de datos sensibles
