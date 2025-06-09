import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatTime(time: string) {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(`2000-01-01T${time}`))
}

export function getStatusEmoji(status: string) {
  const statusMap: Record<string, string> = {
    'Disponible': '🟢',
    'En Colación': '🍔',
    'Fuera de Turno': '🏠',
    'Ocupado': '🔴',
    'En Vuelo': '✈️',
  }
  return statusMap[status] || '⚪'
}

export function getGroupColor(group: string) {
  const groupColors: Record<string, string> = {
    'ADMIN': 'bg-red-500',
    'DUTY MANAGER': 'bg-purple-500',
    'Lobby': 'bg-blue-500',
    'Líder': 'bg-green-500',
    'CREC': 'bg-yellow-500',
    'Back Office': 'bg-orange-500',
    'Ventas': 'bg-pink-500',
    'Ancillaries': 'bg-gray-500',
    'Agente': 'bg-indigo-500',
  }
  return groupColors[group] || 'bg-gray-400'
}

export function hasPermission(userGroup: string, requiredGroups: string[]) {
  return requiredGroups.includes(userGroup)
}

export function canAccessModule(userGroup: string, module: string) {
  const modulePermissions: Record<string, string[]> = {
    'lobby': ['ADMIN', 'DUTY MANAGER', 'Lobby', 'Líder', 'CREC', 'Back Office'],
    'crec': ['ADMIN', 'DUTY MANAGER', 'CREC'],
    'backoffice': ['ADMIN', 'DUTY MANAGER', 'Back Office'],
    'ventas': ['ADMIN', 'DUTY MANAGER', 'Ventas', 'Lobby', 'Líder'],
    'admin': ['ADMIN', 'DUTY MANAGER'],
  }
  
  return modulePermissions[module]?.includes(userGroup) || false
}
