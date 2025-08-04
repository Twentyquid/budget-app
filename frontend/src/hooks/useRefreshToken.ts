import api from '../api/api.ts'
import { userStore } from '@/store/userStore.ts'

const useRefreshToken = () => {
  const refresh = async (): Promise<string> => {
    try {
      const response = await api.get('/auth/refresh', {
        withCredentials: true,
      })
      const { accessToken } = response.data

      // ✅ TanStack way to update store
      userStore.setState({ accessToken })

      return accessToken
    } catch (error) {
      console.error('Failed to refresh token', error)
      throw error
    }
  }

  return refresh
}

export default useRefreshToken
