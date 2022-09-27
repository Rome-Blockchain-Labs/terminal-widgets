import { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useWallets must be used within a useWalletsProvider')
  }
  return context
}
