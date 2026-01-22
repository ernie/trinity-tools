import { formatNumber } from "../utils"

export interface StatItemProps {
  label: string
  value: number | string
  className?: string
  subscript?: number
  title?: string
}

export function StatItem({ label, value, className, subscript, title }: StatItemProps) {
  const displayValue = typeof value === 'number' ? formatNumber(value) : value
  const displaySubscript = subscript !== undefined && subscript > 0 ? formatNumber(subscript) : null

  return (
    <div className="stat-item" title={title}>
      <div className={`stat-value ${className ?? ''}`}>
        {displayValue}
        {displaySubscript && <sub>{displaySubscript}</sub>}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
