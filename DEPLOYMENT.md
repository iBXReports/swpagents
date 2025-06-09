# 🚀 Guía de Despliegue - Swissport Intranet

Esta guía te ayudará a desplegar la aplicación Swissport Intranet en Vercel paso a paso.

## 📋 Prerrequisitos

1. **Cuenta de Vercel** - [Registrarse en vercel.com](https://vercel.com)
2. **Proyecto de Supabase** - [Crear proyecto en supabase.com](https://supabase.com)
3. **Repositorio Git** - Código subido a GitHub, GitLab o Bitbucket

## 🗄️ Paso 1: Configurar Supabase

### 1.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la información del proyecto:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **Anon Key**: Clave pública para el cliente
   - **Service Role Key**: Clave privada para operaciones del servidor

### 1.2 Configurar Base de Datos
1. Ve a **SQL Editor** en tu dashboard de Supabase
2. Copia y pega todo el contenido del archivo `database/schema.sql`
3. Ejecuta el script para crear todas las tablas y configuraciones

### 1.3 Verificar Configuración
- Ve a **Authentication > Settings**
- Asegúrate de que **Enable email confirmations** esté deshabilitado para desarrollo
- En **Authentication > URL Configuration**, agrega tu dominio de Vercel cuando lo tengas

## 🌐 Paso 2: Desplegar en Vercel

### 2.1 Conectar Repositorio
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Haz clic en **"New Project"**
3. Conecta tu repositorio Git donde está el código
4. Selecciona el repositorio `swissport-intranet`

### 2.2 Configurar Variables de Entorno
**IMPORTANTE**: Antes de hacer deploy, configura estas variables de entorno en Vercel:

1. En la página de configuración del proyecto, ve a **"Environment Variables"**
2. Agrega las siguientes variables:

```bash
# Variables de Supabase (REQUERIDAS)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# Variable de Base de Datos (OPCIONAL)
DATABASE_URL=postgresql://postgres:tu_password@db.tu-proyecto.supabase.co:5432/postgres
```

### 2.3 Configuración de Build
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install` (automático)

### 2.4 Hacer Deploy
1. Haz clic en **"Deploy"**
2. Espera a que termine el build (2-3 minutos)
3. ¡Tu aplicación estará lista!

## 🔧 Paso 3: Configuración Post-Deploy

### 3.1 Configurar URLs en Supabase
1. Ve a tu proyecto de Supabase
2. **Authentication > URL Configuration**
3. Agrega tu URL de Vercel:
   - **Site URL**: `https://tu-app.vercel.app`
   - **Redirect URLs**: `https://tu-app.vercel.app/**`

### 3.2 Probar la Aplicación
1. Ve a tu URL de Vercel
2. Intenta registrar un nuevo usuario
3. Verifica que el login funcione correctamente
4. Comprueba que el dashboard cargue datos

## 🐛 Solución de Problemas Comunes

### Error: "Environment Variable references Secret which does not exist"
**Solución**: No uses el formato `@secret_name` en las variables de entorno. Usa directamente los valores.

### Error: "Invalid API key"
**Solución**: 
1. Verifica que las claves de Supabase sean correctas
2. Asegúrate de usar la **Anon key** para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Usa la **Service role key** para `SUPABASE_SERVICE_ROLE_KEY`

### Error: "Failed to fetch"
**Solución**:
1. Verifica que la URL de Supabase sea correcta
2. Comprueba que las tablas estén creadas en la base de datos
3. Verifica que RLS (Row Level Security) esté configurado correctamente

### Error de Build: "Module not found"
**Solución**:
1. Asegúrate de que todas las dependencias estén en `package.json`
2. Verifica que no haya imports incorrectos
3. Revisa que los paths relativos sean correctos

## 📊 Paso 4: Monitoreo y Mantenimiento

### 4.1 Logs de Vercel
- Ve a **Functions** tab para ver logs de errores
- Usa **Real-time logs** para debugging en vivo

### 4.2 Métricas de Supabase
- Monitorea el uso de la base de datos
- Revisa los logs de autenticación
- Verifica las métricas de API

### 4.3 Actualizaciones
- Los deploys automáticos se activan con cada push a la rama principal
- Puedes hacer rollback desde el dashboard de Vercel
- Usa **Preview deployments** para probar cambios

## 🔒 Paso 5: Configuración de Seguridad

### 5.1 Variables de Entorno Seguras
- Nunca expongas la **Service Role Key** en el frontend
- Usa **Environment Variables** de Vercel, no hardcodees valores
- Considera usar **Vercel Secrets** para datos sensibles

### 5.2 Configuración de CORS
En Supabase, ve a **Settings > API** y configura:
```
Allowed origins: https://tu-app.vercel.app
```

### 5.3 Rate Limiting
- Configura límites de rate en Supabase si es necesario
- Considera usar Vercel Edge Functions para lógica adicional

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. **Revisa los logs** en Vercel Dashboard
2. **Verifica la configuración** de Supabase
3. **Consulta la documentación**:
   - [Vercel Docs](https://vercel.com/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [Next.js Docs](https://nextjs.org/docs)

## ✅ Checklist de Despliegue

- [ ] Proyecto de Supabase creado
- [ ] Base de datos configurada con schema.sql
- [ ] Variables de entorno configuradas en Vercel
- [ ] Aplicación desplegada exitosamente
- [ ] URLs configuradas en Supabase
- [ ] Registro de usuario probado
- [ ] Login funcionando
- [ ] Dashboard cargando datos
- [ ] Real-time updates funcionando

¡Una vez completados todos estos pasos, tu Intranet Swissport estará lista para usar en producción! 🎉
