'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { createClientComponentClient } from '@/lib/supabase'
import { Sun, Moon, Plane, ArrowLeft, Mail } from 'lucide-react'

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const { theme, toggleTheme } = useTheme()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.')
      }
    } catch {
      setError('Error inesperado. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen swissport-gradient flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-full glass-effect hover:bg-opacity-20 transition-all duration-200"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-blue-600" />
        )}
      </button>

      {/* Back Button */}
      <Link
        href="/login"
        className="fixed top-4 left-4 p-2 rounded-full glass-effect hover:bg-opacity-20 transition-all duration-200 text-white"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
              <Plane className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Recuperar Contraseña
          </h1>
          <p className="text-white/80">
            Ingresa tu correo electrónico para recibir un enlace de recuperación
          </p>
        </div>

        {/* Recovery Form */}
        <div className="glass-effect rounded-lg p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-md text-sm">
                {message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu.email@swissport.com"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              ¿Recordaste tu contraseña?{' '}
              <Link
                href="/login"
                className="text-blue-300 hover:text-blue-200 transition-colors font-medium"
              >
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-xs">
            © 2024 Swissport International. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
