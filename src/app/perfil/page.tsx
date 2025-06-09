'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/DashboardLayout'
import { User, Mail, Phone, Building, Edit, Save, X, Camera } from 'lucide-react'
import { getGroupColor, getStatusEmoji } from '@/lib/utils'

export default function PerfilPage() {
  const { agente, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    nombre: agente?.nombre || '',
    email: agente?.email || '',
    telefono: agente?.telefono || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await updateProfile(formData)

    if (error) {
      setError(error)
    } else {
      setSuccess('Perfil actualizado exitosamente')
      setIsEditing(false)
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      nombre: agente?.nombre || '',
      email: agente?.email || '',
      telefono: agente?.telefono || '',
    })
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!agente) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture and Basic Info */}
          <div className="glass-effect rounded-lg p-6">
            <div className="text-center">
              <div className="relative inline-block">
                {agente.foto_perfil_url ? (
                  <img
                    src={agente.foto_perfil_url}
                    alt={agente.nombre}
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <User className="h-16 w-16 text-white" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-white mt-4">{agente.nombre}</h2>
              <p className="text-white/70">{agente.usuario_sabre}</p>
              
              <div className="flex items-center justify-center space-x-2 mt-2">
                <span className={`inline-block w-3 h-3 rounded-full ${getGroupColor(agente.grupo)}`} />
                <span className="text-white/80 text-sm">{agente.grupo}</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mt-2">
                <span className="text-lg">{getStatusEmoji(agente.estado_turno)}</span>
                <span className="text-white/80 text-sm">{agente.estado_turno}</span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 glass-effect rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Información Personal</h3>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-md text-sm mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Teléfono/WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Grupo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={agente.grupo}
                    disabled
                    className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 opacity-50"
                  />
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                </div>
                <p className="text-white/60 text-xs mt-1">
                  El grupo no puede ser modificado. Contacta al administrador si necesitas cambios.
                </p>
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Guardando...' : 'Guardar'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="glass-effect rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Información Adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-white/70 text-sm">Fecha de Registro</p>
              <p className="text-white font-medium">
                {new Date(agente.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Última Actualización</p>
              <p className="text-white font-medium">
                {new Date(agente.updated_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
