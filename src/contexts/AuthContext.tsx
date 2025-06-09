'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClientComponentClient } from '@/lib/supabase'

interface Agente {
  id: string
  nombre: string
  usuario_sabre: string
  grupo: string
  email: string
  telefono?: string
  estado_turno: string
  foto_perfil_url?: string
  foto_portada_url?: string
}

interface UserData {
  nombre: string
  usuario_sabre: string
  grupo: string
  email: string
  telefono?: string
  password: string
}

interface AuthContextType {
  user: User | null
  agente: Agente | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (userData: UserData) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Agente>) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [agente, setAgente] = useState<Agente | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchAgentData(session.user.id)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchAgentData(session.user.id)
        } else {
          setAgente(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAgentData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('agentes')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching agent data:', error)
        return
      }

      setAgente(data)
    } catch (error) {
      console.error('Error fetching agent data:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch {
      return { error: 'Error inesperado al iniciar sesión' }
    }
  }

  const signUp = async (userData: UserData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        // Create agent record
        const { error: insertError } = await supabase
          .from('agentes')
          .insert({
            id: data.user.id,
            nombre: userData.nombre,
            usuario_sabre: userData.usuario_sabre,
            grupo: userData.grupo,
            email: userData.email,
            telefono: userData.telefono,
            estado_turno: 'Fuera de Turno',
          })

        if (insertError) {
          return { error: insertError.message }
        }
      }

      return {}
    } catch {
      return { error: 'Error inesperado al registrarse' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (data: Partial<Agente>) => {
    try {
      if (!user) return { error: 'No hay usuario autenticado' }

      const { error } = await supabase
        .from('agentes')
        .update(data)
        .eq('id', user.id)

      if (error) {
        return { error: error.message }
      }

      // Refresh agent data
      await fetchAgentData(user.id)
      return {}
    } catch {
      return { error: 'Error inesperado al actualizar perfil' }
    }
  }

  const value = {
    user,
    agente,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
