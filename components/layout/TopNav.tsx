'use client'

import { Bell, Search } from 'lucide-react'

interface TopNavProps {
  title: string
}

export function TopNav({ title }: TopNavProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="text-lg font-semibold text-[#0F1E3C]">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-[#F8F6F1] focus:outline-none focus:ring-2 focus:ring-[#D4A843] w-64"
          />
        </div>
        <button className="relative p-2 text-gray-500 hover:text-[#0F1E3C] hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4A843] rounded-full" />
        </button>
      </div>
    </header>
  )
}
