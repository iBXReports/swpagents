import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Browser client for client components
export function createClientComponentClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Database types
export interface Database {
  public: {
    Tables: {
      agentes: {
        Row: {
          id: string
          nombre: string
          usuario_sabre: string
          grupo: string
          email: string
          telefono: string | null
          password_hash: string
          estado_turno: string
          foto_perfil_url: string | null
          foto_portada_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          usuario_sabre: string
          grupo: string
          email: string
          telefono?: string | null
          password_hash: string
          estado_turno?: string
          foto_perfil_url?: string | null
          foto_portada_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          usuario_sabre?: string
          grupo?: string
          email?: string
          telefono?: string | null
          password_hash?: string
          estado_turno?: string
          foto_perfil_url?: string | null
          foto_portada_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      turnos: {
        Row: {
          id: string
          nombre_turno: string
          hora_inicio: string
          hora_fin: string
          created_at: string
        }
        Insert: {
          id?: string
          nombre_turno: string
          hora_inicio: string
          hora_fin: string
          created_at?: string
        }
        Update: {
          id?: string
          nombre_turno?: string
          hora_inicio?: string
          hora_fin?: string
          created_at?: string
        }
      }
      asignaciones: {
        Row: {
          id: string
          agente_id: string
          turno_id: string | null
          terminal: string
          tipo_asignacion: string
          fecha_asignacion: string
          tarea_detalle: string | null
          asignado_por_id: string
          created_at: string
        }
        Insert: {
          id?: string
          agente_id: string
          turno_id?: string | null
          terminal: string
          tipo_asignacion: string
          fecha_asignacion: string
          tarea_detalle?: string | null
          asignado_por_id: string
          created_at?: string
        }
        Update: {
          id?: string
          agente_id?: string
          turno_id?: string | null
          terminal?: string
          tipo_asignacion?: string
          fecha_asignacion?: string
          tarea_detalle?: string | null
          asignado_por_id?: string
          created_at?: string
        }
      }
      vuelos: {
        Row: {
          id: string
          numero_vuelo: string
          tipo_vuelo: string
          terminal: string
          puente: string | null
          estado: string
          eta: string | null
          etd: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_vuelo: string
          tipo_vuelo: string
          terminal: string
          puente?: string | null
          estado?: string
          eta?: string | null
          etd?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_vuelo?: string
          tipo_vuelo?: string
          terminal?: string
          puente?: string | null
          estado?: string
          eta?: string | null
          etd?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notificaciones: {
        Row: {
          id: string
          destinatario_id: string
          tipo: string
          contenido: string
          leida: boolean
          fecha: string
        }
        Insert: {
          id?: string
          destinatario_id: string
          tipo: string
          contenido: string
          leida?: boolean
          fecha?: string
        }
        Update: {
          id?: string
          destinatario_id?: string
          tipo?: string
          contenido?: string
          leida?: boolean
          fecha?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
