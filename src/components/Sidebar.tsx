'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { canAccessModule, getStatusEmoji, getGroupColor } from '@/lib/utils'
import {
  Home,
  User,
  Calendar,
  Coffee,
  Plane,
  FileText,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronRight,
  Clock,
  LogOut,
  Building,
  BarChart3,
  Briefcase
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const { agente } = useAuth()
  const pathname = usePathname()

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const handleArrival = async () => {
    // TODO: Implement arrival logic
    console.log('Aviso de llegada')
  }

  const handleDeparture = async () => {
    // TODO: Implement departure logic
    console.log('Aviso de salida')
  }

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: Home,
      href: '/',
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: User,
      href: '/perfil',
    },
    {
      id: 'asignaciones',
      label: 'Asignaciones',
      icon: Calendar,
      href: '/asignaciones',
    },
    {
      id: 'colaciones',
      label: 'Colaciones',
      icon: Coffee,
      href: '/colaciones',
      submenu: [
        { label: 'Ingreso', href: '/colaciones/ingreso' },
        { label: 'Retorno', href: '/colaciones/retorno' },
        { label: 'Historial', href: '/colaciones/historial' },
      ]
    },
    {
      id: 'lobby',
      label: 'Lobby',
      icon: Building,
      href: '/lobby',
      requiresAccess: 'lobby',
      submenu: [
        { label: 'GENDEC', href: '/lobby/gendec' },
        { label: 'Cierres', href: '/lobby/cierres' },
      ]
    },
    {
      id: 'crec',
      label: 'CREC',
      icon: Plane,
      href: '/crec',
      requiresAccess: 'crec',
      submenu: [
        { label: 'Vuelos', href: '/crec/vuelos' },
        { label: 'ZZ', href: '/crec/zz' },
      ]
    },
    {
      id: 'backoffice',
      label: 'Back Office',
      icon: Briefcase,
      href: '/backoffice',
      requiresAccess: 'backoffice',
    },
    {
      id: 'ventas',
      label: 'Ventas',
      icon: BarChart3,
      href: '/ventas',
      requiresAccess: 'ventas',
    },
    {
      id: 'informativos',
      label: 'Informativos',
      icon: FileText,
      href: '/informativos',
    },
    {
      id: 'comunidad',
      label: 'Comunidad SWP',
      icon: MessageSquare,
      href: '/comunidad',
    },
    {
      id: 'admin',
      label: 'Administración',
      icon: Settings,
      href: '/admin',
      requiresAccess: 'admin',
    },
  ]

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.requiresAccess) return true
    return agente && canAccessModule(agente.grupo, item.requiresAccess)
  })

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-md border-r border-white/20 z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:z-auto"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">SW</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Swissport</h2>
                <p className="text-white/70 text-xs">Intranet</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          {agente && (
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center space-x-3">
                {agente.foto_perfil_url ? (
                  <img
                    src={agente.foto_perfil_url}
                    alt={agente.nombre}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {agente.nombre}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className={cn(
                      "inline-block w-2 h-2 rounded-full",
                      getGroupColor(agente.grupo)
                    )} />
                    <span className="text-white/70 text-xs">
                      {agente.grupo}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-sm">
                      {getStatusEmoji(agente.estado_turno)}
                    </span>
                    <span className="text-white/70 text-xs">
                      {agente.estado_turno}
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrival/Departure buttons */}
              <div className="mt-3 space-y-2">
                <button
                  onClick={handleArrival}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>Aviso de Llegada</span>
                </button>
                <button
                  onClick={handleDeparture}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Aviso de Salida</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => (
                <li key={item.id}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-white/20 text-white"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                        {expandedMenus.includes(item.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {expandedMenus.includes(item.id) && (
                        <ul className="mt-2 ml-6 space-y-1">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                onClick={onClose}
                                className={cn(
                                  "block px-3 py-2 rounded-md text-sm transition-colors",
                                  isActive(subItem.href)
                                    ? "bg-white/20 text-white"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                )}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}
