'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClientComponentClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Calendar, MapPin, Clock, User, Plus, Edit, Trash2 } from 'lucide-react'
import { canAccessModule } from '@/lib/utils'

interface Asignacion {
  id: string
  terminal: string
  tipo_asignacion: string
  fecha_asignacion: string
  tarea_detalle?: string
  agente: {
    nombre: string
    grupo: string
  }
  asignado_por: {
    nombre: string
  }
  created_at: string
}

export default function AsignacionesPage() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  const { agente } = useAuth()
  const supabase = createClientComponentClient()

  const canManageAssignments = agente && canAccessModule(agente.grupo, 'lobby')

  useEffect(() => {
    fetchAsignaciones()
  }, [selectedDate]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAsignaciones = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('asignaciones')
        .select(`
          *,
          agente:agentes!agente_id(nombre, grupo),
          asignado_por:agentes!asignado_por_id(nombre)
        `)
        .eq('fecha_asignacion', selectedDate)
        .order('created_at', { ascending: false })

      // If user is not a manager, only show their own assignments
      if (!canManageAssignments && agente) {
        query = query.eq('agente_id', agente.id)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching assignments:', error)
        return
      }

      setAsignaciones(data || [])
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTerminalColor = (terminal: string) => {
    return terminal === 'Terminal 1 NAC' ? 'bg-blue-500' : 'bg-green-500'
  }

  const getAssignmentTypeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'ZZ': 'bg-red-500',
      'Necesidades Especiales': 'bg-purple-500',
      'LYF T1': 'bg-blue-500',
      'LYF T2': 'bg-green-500',
      'Cobrador': 'bg-yellow-500',
      'Agente P1': 'bg-indigo-500',
      'Agente P2': 'bg-pink-500',
      'Agente P3': 'bg-orange-500',
      'Lobby Nacional': 'bg-cyan-500',
      'Lobby Inter': 'bg-teal-500',
      'Líder Counter Nac': 'bg-gray-500',
      'Líder Counter Inter': 'bg-slate-500',
    }
    return colors[tipo] || 'bg-gray-400'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Asignaciones</h1>
              <p className="text-white/80">
                {canManageAssignments 
                  ? 'Gestiona las asignaciones de todos los agentes'
                  : 'Consulta tus asignaciones'
                }
              </p>
            </div>
            {canManageAssignments && (
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                <Plus className="h-4 w-4" />
                <span>Nueva Asignación</span>
              </button>
            )}
          </div>
        </div>

        {/* Date Filter */}
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-white" />
            <label className="text-white font-medium">Fecha:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Assignments List */}
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Asignaciones para {new Date(selectedDate).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : asignaciones.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">No hay asignaciones para esta fecha</p>
            </div>
          ) : (
            <div className="space-y-4">
              {asignaciones.map((asignacion) => (
                <div key={asignacion.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-block w-3 h-3 rounded-full ${getTerminalColor(asignacion.terminal)}`} />
                        <span className="text-white font-medium">{asignacion.terminal}</span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getAssignmentTypeColor(asignacion.tipo_asignacion)}`}>
                          {asignacion.tipo_asignacion}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-white/70">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{asignacion.agente.nombre}</span>
                          <span className="text-white/50">({asignacion.agente.grupo})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(asignacion.created_at).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      </div>

                      {asignacion.tarea_detalle && (
                        <p className="text-white/80 text-sm mt-2">
                          <strong>Detalle:</strong> {asignacion.tarea_detalle}
                        </p>
                      )}

                      <p className="text-white/50 text-xs mt-2">
                        Asignado por: {asignacion.asignado_por.nombre}
                      </p>
                    </div>

                    {canManageAssignments && (
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-effect rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500 rounded-full">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Terminal 1 NAC</p>
                <p className="text-2xl font-bold text-white">
                  {asignaciones.filter(a => a.terminal === 'Terminal 1 NAC').length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500 rounded-full">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Terminal 2 INTER</p>
                <p className="text-2xl font-bold text-white">
                  {asignaciones.filter(a => a.terminal === 'Terminal 2 INTER').length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500 rounded-full">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Total Asignaciones</p>
                <p className="text-2xl font-bold text-white">{asignaciones.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
