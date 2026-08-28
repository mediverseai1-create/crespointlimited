import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toLocaleString()
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ]
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export function kpiStatusColor(status: string): string {
  switch (status) {
    case 'on_track': return 'text-green-600 bg-green-50'
    case 'at_risk': return 'text-amber-600 bg-amber-50'
    case 'off_track': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-red-600 bg-red-50 border-red-200'
    case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'text-red-700 bg-red-100'
    case 'high': return 'text-orange-700 bg-orange-100'
    case 'medium': return 'text-amber-700 bg-amber-100'
    case 'low': return 'text-green-700 bg-green-100'
    default: return 'text-gray-700 bg-gray-100'
  }
}

export function roleColor(role: string): string {
  switch (role) {
    case 'owner': return 'bg-[#0F1E3C] text-white'
    case 'admin': return 'bg-[#D4A843] text-white'
    case 'manager': return 'bg-blue-600 text-white'
    case 'analyst': return 'bg-green-600 text-white'
    case 'member': return 'bg-gray-500 text-white'
    case 'viewer': return 'bg-gray-300 text-gray-700'
    default: return 'bg-gray-200 text-gray-700'
  }
}

export function impactColor(impact: string): string {
  switch (impact) {
    case 'very_high': return 'text-purple-700 bg-purple-100'
    case 'high': return 'text-green-700 bg-green-100'
    case 'medium': return 'text-amber-700 bg-amber-100'
    case 'low': return 'text-gray-700 bg-gray-100'
    default: return 'text-gray-700 bg-gray-100'
  }
}
