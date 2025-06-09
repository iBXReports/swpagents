-- Swissport Intranet Database Schema
-- This file contains the SQL commands to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE estado_turno_enum AS ENUM ('Disponible', 'En Colación', 'Fuera de Turno', 'Ocupado', 'En Vuelo');
CREATE TYPE grupo_enum AS ENUM ('Agente', 'Lobby', 'Líder', 'CREC', 'Back Office', 'Ventas', 'Ancillaries', 'DUTY MANAGER', 'ADMIN');
CREATE TYPE terminal_enum AS ENUM ('Terminal 1 NAC', 'Terminal 2 INTER');
CREATE TYPE tipo_asignacion_enum AS ENUM ('ZZ', 'Necesidades Especiales', 'LYF T1', 'LYF T2', 'Cobrador', 'Agente P1', 'Agente P2', 'Agente P3', 'Lobby Nacional', 'Lobby Inter', 'Líder Counter Nac', 'Líder Counter Inter');
CREATE TYPE tipo_vuelo_enum AS ENUM ('Nacional', 'Internacional', 'Doméstico');
CREATE TYPE estado_vuelo_enum AS ENUM ('Abierto', 'Cerrado', 'Cancelado', 'Retrasado');

-- Agentes table
CREATE TABLE agentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    usuario_sabre VARCHAR(50) UNIQUE NOT NULL,
    grupo grupo_enum NOT NULL DEFAULT 'Agente',
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    estado_turno estado_turno_enum DEFAULT 'Fuera de Turno',
    foto_perfil_url TEXT,
    foto_portada_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turnos table
CREATE TABLE turnos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_turno VARCHAR(100) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asignaciones table
CREATE TABLE asignaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
    turno_id UUID REFERENCES turnos(id),
    terminal terminal_enum NOT NULL,
    tipo_asignacion tipo_asignacion_enum NOT NULL,
    fecha_asignacion DATE NOT NULL DEFAULT CURRENT_DATE,
    tarea_detalle TEXT,
    asignado_por_id UUID REFERENCES agentes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Colaciones table
CREATE TABLE colaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
    hora_ingreso TIMESTAMP WITH TIME ZONE,
    hora_retorno TIMESTAMP WITH TIME ZONE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vuelos table
CREATE TABLE vuelos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_vuelo VARCHAR(20) NOT NULL,
    tipo_vuelo tipo_vuelo_enum NOT NULL,
    terminal terminal_enum NOT NULL,
    puente VARCHAR(10),
    estado estado_vuelo_enum DEFAULT 'Abierto',
    eta TIMESTAMP WITH TIME ZONE,
    etd TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gendecs table
CREATE TABLE gendecs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vuelo_id UUID REFERENCES vuelos(id) ON DELETE CASCADE,
    timbrada BOOLEAN DEFAULT FALSE,
    recibida BOOLEAN DEFAULT FALSE,
    erronea BOOLEAN DEFAULT FALSE,
    pax INTEGER DEFAULT 0,
    infantes INTEGER DEFAULT 0,
    fecha_procesamiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    procesado_por_id UUID REFERENCES agentes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notificaciones table
CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destinatario_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
    tipo VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Amistades table
CREATE TABLE amistades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agente_id_1 UUID REFERENCES agentes(id) ON DELETE CASCADE,
    agente_id_2 UUID REFERENCES agentes(id) ON DELETE CASCADE,
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'aceptada', 'rechazada'
    fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_respuesta TIMESTAMP WITH TIME ZONE,
    UNIQUE(agente_id_1, agente_id_2)
);

-- Mensajes privados table
CREATE TABLE mensajes_privados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emisor_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
    receptor_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts comunidad table
CREATE TABLE posts_comunidad (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    autor_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
    categoria VARCHAR(50) NOT NULL, -- 'General', 'Informativos', 'PYMES', 'Solicitudes'
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adjuntos comunidad table
CREATE TABLE adjuntos_comunidad (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts_comunidad(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL, -- 'imagen', 'archivo', 'video'
    url_archivo TEXT NOT NULL,
    tamaño INTEGER, -- en bytes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archivos informativos table
CREATE TABLE archivos_informativos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    url_archivo TEXT NOT NULL,
    tipo_archivo VARCHAR(20), -- 'pdf', 'doc', 'xls', etc.
    tamaño INTEGER, -- en bytes
    subido_por_id UUID REFERENCES agentes(id),
    fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Logros agentes table
CREATE TABLE logros_agentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
    logro VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Redes sociales agentes table
CREATE TABLE redes_sociales_agentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
    tipo_red VARCHAR(50) NOT NULL, -- 'facebook', 'instagram', 'twitter', 'linkedin', etc.
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ZZ (Retenidos) table
CREATE TABLE zz_retenidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agente_id UUID REFERENCES agentes(id),
    vuelo_id UUID REFERENCES vuelos(id),
    tipo VARCHAR(100) NOT NULL,
    destino VARCHAR(100),
    etd TIMESTAMP WITH TIME ZONE,
    eta TIMESTAMP WITH TIME ZONE,
    puente VARCHAR(10),
    observaciones TEXT,
    reportado_por_id UUID REFERENCES agentes(id),
    fecha_reporte TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_agentes_grupo ON agentes(grupo);
CREATE INDEX idx_agentes_estado_turno ON agentes(estado_turno);
CREATE INDEX idx_asignaciones_agente_fecha ON asignaciones(agente_id, fecha_asignacion);
CREATE INDEX idx_colaciones_agente_fecha ON colaciones(agente_id, fecha);
CREATE INDEX idx_vuelos_estado ON vuelos(estado);
CREATE INDEX idx_notificaciones_destinatario_leida ON notificaciones(destinatario_id, leida);
CREATE INDEX idx_posts_comunidad_categoria_fecha ON posts_comunidad(categoria, fecha);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_agentes_updated_at BEFORE UPDATE ON agentes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vuelos_updated_at BEFORE UPDATE ON vuelos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_comunidad_updated_at BEFORE UPDATE ON posts_comunidad FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default turnos
INSERT INTO turnos (nombre_turno, hora_inicio, hora_fin) VALUES
('Apertura', '05:00:00', '13:00:00'),
('Tarde', '13:00:00', '21:00:00'),
('Noche', '21:00:00', '05:00:00'),
('Saliente', '06:00:00', '14:00:00'),
('Libre', '00:00:00', '23:59:59'),
('Domingo Libre', '00:00:00', '23:59:59');

-- Enable Row Level Security (RLS)
ALTER TABLE agentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE colaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_privados ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts_comunidad ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Agentes can see all other agents but only update their own profile
CREATE POLICY "Agentes can view all agents" ON agentes FOR SELECT USING (true);
CREATE POLICY "Agentes can update own profile" ON agentes FOR UPDATE USING (auth.uid() = id);

-- Asignaciones are visible to all authenticated users
CREATE POLICY "Asignaciones are viewable by all" ON asignaciones FOR SELECT USING (auth.role() = 'authenticated');

-- Colaciones are visible to all but users can only insert/update their own
CREATE POLICY "Colaciones are viewable by all" ON colaciones FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage own colaciones" ON colaciones FOR ALL USING (auth.uid() = agente_id);

-- Notificaciones are only visible to the recipient
CREATE POLICY "Users can view own notifications" ON notificaciones FOR SELECT USING (auth.uid() = destinatario_id);
CREATE POLICY "Users can update own notifications" ON notificaciones FOR UPDATE USING (auth.uid() = destinatario_id);

-- Mensajes privados are only visible to sender and receiver
CREATE POLICY "Users can view own messages" ON mensajes_privados 
FOR SELECT USING (auth.uid() = emisor_id OR auth.uid() = receptor_id);
CREATE POLICY "Users can send messages" ON mensajes_privados 
FOR INSERT WITH CHECK (auth.uid() = emisor_id);

-- Posts comunidad are visible to all authenticated users
CREATE POLICY "Posts are viewable by all" ON posts_comunidad FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create posts" ON posts_comunidad FOR INSERT WITH CHECK (auth.uid() = autor_id);
CREATE POLICY "Users can update own posts" ON posts_comunidad FOR UPDATE USING (auth.uid() = autor_id);
