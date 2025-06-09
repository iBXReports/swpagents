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
          turno_id: string
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
          turno_id: string
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
          turno_id?: string
          terminal?: string
          tipo_asignacion?: string
          fecha_asignacion?: string
          tarea_detalle?: string | null
          asignado_por_id?: string
          created_at?: string
        }
      }
      // Add more table types as needed
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
