import { Outlet, Navigate } from '@tanstack/react-router'
import { userStore } from '../store/userStore.ts'
import { useStore } from '@tanstack/react-store'

export default function PrivateRouteLayout() {
  const accessToken = useStore(userStore).accessToken
  return accessToken ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/auth" />
  )
}
