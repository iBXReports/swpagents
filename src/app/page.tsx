'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClientComponentClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Users,
  Plane,
  Clock,
  Coffee,
  CheckCircle,
  Calendar,
  FileText,
  TrendingUp
} from 'lucide-react'
import { formatDate, getStatusEmoji } from '@/lib/utils'

interface DashboardStats {
  agentesEnTurno: number
  agentesEnColacion: number
  vuelosAbiertos: number
  vuelosCerrados: number
  asignacionesHoy: number
}

interface RecentActivity {
  id: string
  tipo: string
  descripcion: string
  fecha: string
  agente?: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    agentesEnTurno: 0,
    agentesEnColacion: 0,
    vuelosAbiertos: 0,
    vuelosCerrados: 0,
    asignacionesHoy: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [agentesEnTurno, setAgentesEnTurno] = useState<Array<{
    id: string
    nombre: string
    grupo: string
    estado_turno: string
    foto_perfil_url?: string
  }>>([])
  const [loading, setLoading] = useState(true)

  const { agente } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchDashboardData()

    // Set up real-time subscriptions
    const channel = supabase
      .channel('dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agentes' }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vuelos' }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'asignaciones' }, fetchDashboardData)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      // Fetch agents stats
      const { data: agentes } = await supabase
        .from('agentes')
        .select('*')

      const agentesEnTurnoData = agentes?.filter(a => a.estado_turno === 'Disponible' || a.estado_turno === 'Ocupado') || []
      const agentesEnColacionData = agentes?.filter(a => a.estado_turno === 'En Colación') || []

      setAgentesEnTurno(agentesEnTurnoData)

      // Fetch flights stats (mock data for now)
      const vuelosAbiertos = 12
      const vuelosCerrados = 8

      // Fetch assignments for today
      const today = new Date().toISOString().split('T')[0]
      const { data: asignaciones } = await supabase
        .from('asignaciones')
        .select('*')
        .gte('fecha_asignacion', today)
        .lt('fecha_asignacion', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])

      setStats({
        agentesEnTurno: agentesEnTurnoData.length,
        agentesEnColacion: agentesEnColacionData.length,
        vuelosAbiertos,
        vuelosCerrados,
        asignacionesHoy: asignaciones?.length || 0,
      })

      // Mock recent activity
      setRecentActivity([
        {
          id: '1',
          tipo: 'Vuelo Cerrado',
          descripcion: 'Vuelo AV123 cerrado exitosamente',
          fecha: new Date().toISOString(),
          agente: 'Juan Pérez'
        },
        {
          id: '2',
          tipo: 'Nueva Asignación',
          descripcion: 'Agente asignado a Terminal 2',
          fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          agente: 'María García'
        },
        {
          id: '3',
          tipo: 'GENDEC Recibida',
          descripcion: 'GENDEC procesada para vuelo CM456',
          fecha: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          agente: 'Carlos López'
        }
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string
    value: number
    icon: React.ComponentType<{ className?: string }>
    color: string
    subtitle?: string
  }) => (
    <div className="glass-effect rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          {subtitle && (
            <p className="text-white/60 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (loading) {
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
        {/* Welcome Header */}
        <div className="glass-effect rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            ¡Bienvenido, {agente?.nombre}! 👋
          </h1>
          <p className="text-white/80">
            Aquí tienes un resumen de las operaciones en tiempo real
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Agentes en Turno"
            value={stats.agentesEnTurno}
            icon={Users}
            color="bg-green-500"
            subtitle="Disponibles y ocupados"
          />
          <StatCard
            title="En Colación"
            value={stats.agentesEnColacion}
            icon={Coffee}
            color="bg-orange-500"
            subtitle="Agentes en descanso"
          />
          <StatCard
            title="Vuelos Abiertos"
            value={stats.vuelosAbiertos}
            icon={Plane}
            color="bg-blue-500"
            subtitle="En proceso"
          />
          <StatCard
            title="Vuelos Cerrados"
            value={stats.vuelosCerrados}
            icon={CheckCircle}
            color="bg-purple-500"
            subtitle="Completados hoy"
          />
          <StatCard
            title="Asignaciones Hoy"
            value={stats.asignacionesHoy}
            icon={Calendar}
            color="bg-indigo-500"
            subtitle="Total del día"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agents on Duty */}
          <div className="glass-effect rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Agentes en Turno
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {agentesEnTurno.length === 0 ? (
                <p className="text-white/60 text-center py-4">
                  No hay agentes en turno actualmente
                </p>
              ) : (
                agentesEnTurno.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {agent.foto_perfil_url ? (
                        <img
                          src={agent.foto_perfil_url}
                          alt={agent.nombre}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {agent.nombre.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium text-sm">{agent.nombre}</p>
                        <p className="text-white/60 text-xs">{agent.grupo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{getStatusEmoji(agent.estado_turno)}</span>
                      <span className="text-white/70 text-xs">{agent.estado_turno}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-effect rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Actividad Reciente
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{activity.tipo}</p>
                      <p className="text-white/70 text-sm mt-1">{activity.descripcion}</p>
                      {activity.agente && (
                        <p className="text-white/50 text-xs mt-1">Por: {activity.agente}</p>
                      )}
                    </div>
                    <span className="text-white/50 text-xs">
                      {formatDate(activity.fecha)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
              <Calendar className="h-6 w-6 text-white mx-auto mb-2" />
              <span className="text-white text-sm">Ver Asignaciones</span>
            </button>
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
              <Coffee className="h-6 w-6 text-white mx-auto mb-2" />
              <span className="text-white text-sm">Ir a Colación</span>
            </button>
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
              <FileText className="h-6 w-6 text-white mx-auto mb-2" />
              <span className="text-white text-sm">Informativos</span>
            </button>
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
              <TrendingUp className="h-6 w-6 text-white mx-auto mb-2" />
              <span className="text-white text-sm">Reportes</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
