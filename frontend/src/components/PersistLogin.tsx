import { Outlet } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import useRefreshToken from '@/hooks/useRefreshToken'
import { userStore } from '@/store/userStore'
import { useStore } from '@tanstack/react-store'

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const accessToken = useStore(userStore).accessToken
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (error) {
        console.error('Failed to refresh token', error)
      } finally {
        setIsLoading(false)
      }
    }

    !accessToken ? verifyRefreshToken() : setIsLoading(false)
  }, [])
  return <>{isLoading ? <div>Loading...</div> : <Outlet />}</>
}

export default PersistLogin
