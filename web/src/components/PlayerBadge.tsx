import { useVerifiedPlayers } from '../hooks/useVerifiedPlayers'

interface PlayerBadgeProps {
  playerId: number
  isVR?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
)

export function PlayerBadge({ playerId, isVR, size = 'sm' }: PlayerBadgeProps) {
  const { isVerifiedById, isAdminById } = useVerifiedPlayers()
  const verified = isVerifiedById(playerId)
  const admin = isAdminById(playerId)
  const sizeClass = `player-badge-${size}`

  // Unverified player: show placeholder badge
  if (!verified && !isVR) {
    return (
      <span
        className={`player-badge ${sizeClass} unverified`}
        title="Unverified"
      />
    )
  }

  // VR only (not verified): VR icon with dotted outline
  if (isVR && !verified) {
    return (
      <span className={`player-badge ${sizeClass} unverified vr`} title="Unverified (VR)">
        <img src="/assets/vr/vr.png" alt="VR" />
      </span>
    )
  }

  // Verified only (no VR)
  if (!isVR) {
    return (
      <span
        className={`player-badge ${sizeClass} ${admin ? 'admin' : 'user'}`}
        title={admin ? 'Verified Admin' : 'Verified User'}
      >
        {admin ? <StarIcon /> : <CheckIcon />}
      </span>
    )
  }

  // Both VR + verified: symbol on top of VR icon background
  return (
    <span
      className={`player-badge ${sizeClass} ${admin ? 'admin' : 'user'} vr`}
      title={admin ? 'Verified Admin (VR)' : 'Verified User (VR)'}
    >
      {admin ? <StarIcon /> : <CheckIcon />}
    </span>
  )
}
