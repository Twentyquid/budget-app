import { apiWithCredentials } from '@/api/api'

import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import { userStore } from '@/store/userStore'
import { useStore } from '@tanstack/react-store'

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const accessToken = useStore(userStore).accessToken
  useEffect(() => {
    const requestIntercept = apiWithCredentials.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )
    const responseIntercept = apiWithCredentials.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          userStore.setState({ accessToken: newAccessToken })
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return apiWithCredentials(prevRequest)
        }
        return Promise.reject(error)
      },
    )
    return () => {
      apiWithCredentials.interceptors.request.eject(requestIntercept)
      apiWithCredentials.interceptors.response.eject(responseIntercept)
    }
  }, [accessToken, refresh])
  return apiWithCredentials
}

export default useAxiosPrivate
