import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function Logo({ href = '/', size = 'md', showText = true, className }: LogoProps) {
  const sizes = { sm: 28, md: 36, lg: 44 }
  const dim = sizes[size]
  const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' }

  const content = (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Image src="/logo.svg" alt="CrestPoint Logo" width={dim} height={dim} priority />
      {showText && (
        <div>
          <span className={cn('font-bold text-[#0F1E3C]', textSizes[size])}>
            Crest<span className="text-[#D4A843]">Point</span>
          </span>
          <span className="block text-[10px] text-[#64748B] font-medium tracking-widest uppercase -mt-1">
            Limited
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}
