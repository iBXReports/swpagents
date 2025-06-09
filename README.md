# Intranet Swissport - Plataforma de Operaciones Aeroportuarias en Tiempo Real

Una plataforma robusta y dinámica diseñada para optimizar las operaciones diarias y mejorar la comunicación entre los agentes de Swissport.

## 🚀 Características Principales

### Tecnologías Utilizadas
- **Frontend**: Next.js 15 con React 18 y TypeScript
- **Backend**: Supabase (BaaS) con PostgreSQL
- **Tiempo Real**: Supabase Realtime WebSockets
- **Autenticación**: Supabase Auth con Row Level Security (RLS)
- **Estilos**: Tailwind CSS con temas personalizados
- **Iconos**: Lucide React

### Funcionalidades Implementadas

#### 🔐 Sistema de Autenticación
- Inicio de sesión con email/usuario Sabre
- Registro de nuevos usuarios
- Recuperación de contraseña
- Gestión de sesiones segura

#### 👥 Gestión de Roles
- **Agente**: Acceso básico a perfil y asignaciones
- **Lobby, Líder, CREC, Back Office**: Gestión operativa
- **Duty Manager**: Permisos elevados
- **ADMIN**: Acceso completo al sistema

#### 📊 Dashboard en Tiempo Real
- Estadísticas de agentes en turno
- Monitoreo de colaciones
- Estado de vuelos (abiertos/cerrados)
- Actividad reciente
- Actualizaciones automáticas vía WebSockets

#### 👤 Perfil de Usuario
- Información personal editable
- Foto de perfil
- Estado de turno
- Historial de actividad

#### 📋 Sistema de Asignaciones
- Visualización de asignaciones por fecha
- Gestión de terminales (T1 NAC, T2 INTER)
- Tipos de asignación (ZZ, LYF, Cobrador, etc.)
- Control de acceso por roles

#### 🎨 Temas Personalizados
- **Tema Oscuro**: Gradiente azul corporativo (#003366 → #006666)
- **Tema Claro**: Gradiente suave (#ffcccc → #ffffcc)
- Efectos de cristal (glass effect)
- Transiciones suaves

## 🛠️ Configuración del Proyecto

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd swissport-intranet
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://rlxhunyupikzxecpowgr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
```

4. **Configurar base de datos**
Ejecutar el script SQL en `database/schema.sql` en tu proyecto de Supabase.

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 📁 Estructura del Proyecto

```
swissport-intranet/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── login/             # Página de inicio de sesión
│   │   ├── registro/          # Página de registro
│   │   ├── perfil/            # Página de perfil
│   │   ├── asignaciones/      # Gestión de asignaciones
│   │   └── page.tsx           # Dashboard principal
│   ├── components/            # Componentes reutilizables
│   │   ├── Header.tsx         # Barra superior
│   │   ├── Sidebar.tsx        # Menú lateral
│   │   └── DashboardLayout.tsx # Layout principal
│   ├── contexts/              # Contextos de React
│   │   ├── AuthContext.tsx    # Gestión de autenticación
│   │   └── ThemeContext.tsx   # Gestión de temas
│   └── lib/                   # Utilidades y configuración
│       ├── supabase.ts        # Cliente de Supabase
│       └── utils.ts           # Funciones utilitarias
├── database/
│   └── schema.sql             # Esquema de base de datos
└── README.md
```

## 🗄️ Esquema de Base de Datos

### Tablas Principales
- **agentes**: Información de usuarios
- **turnos**: Definición de horarios
- **asignaciones**: Asignaciones de trabajo
- **colaciones**: Registro de descansos
- **vuelos**: Información de vuelos
- **gendecs**: Documentos de vuelo
- **notificaciones**: Sistema de notificaciones
- **posts_comunidad**: Foro interno

### Características de Seguridad
- Row Level Security (RLS) habilitado
- Políticas de acceso por usuario
- Autenticación JWT
- Encriptación de contraseñas

## 🔄 Funcionalidades en Tiempo Real

### Supabase Realtime
- Actualizaciones automáticas del dashboard
- Notificaciones instantáneas
- Cambios de estado en tiempo real
- Sincronización entre usuarios

### WebSockets
- Conexión persistente con la base de datos
- Eventos de cambio automáticos
- Baja latencia en actualizaciones

## 🎯 Próximas Funcionalidades

### Módulos Pendientes
- [ ] Sistema de colaciones completo
- [ ] Módulo Lobby (GENDEC, Cierres)
- [ ] Módulo CREC (Vuelos, ZZ)
- [ ] Back Office
- [ ] Ventas
- [ ] Informativos
- [ ] Comunidad SWP (Foro)
- [ ] Panel de administración

### Mejoras Técnicas
- [ ] Optimización de rendimiento
- [ ] Tests unitarios
- [ ] Documentación API
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t swissport-intranet .
docker run -p 3000:3000 swissport-intranet
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

© 2024 Swissport International. Todos los derechos reservados.

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo de Swissport.
