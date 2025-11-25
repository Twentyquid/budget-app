import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import App from './App.tsx'
import SubmitTransaction from './routes/SubmitTransaction.tsx'
import ViewTransactions from './routes/ViewTransactions.tsx'
import CreateAccount from './routes/CreateAccount.tsx'
import Auth from './routes/Auth.tsx'
import PrivateRouteLayout from './components/PrivateRouteLayout.tsx'
import PersistLogin from './components/PersistLogin.tsx'
import CreateCategory from './routes/CreateCategory.tsx'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/',
  component: App,
})

const persistRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: PersistLogin,
  id: 'persist-login',
})

const privateRoute = createRoute({
  getParentRoute: () => persistRoute,
  id: 'private-route',
  component: PrivateRouteLayout,
})

const submitTransactionRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/submit-transaction',
  component: SubmitTransaction,
})

const viewTransactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions',
  component: ViewTransactions,
})

const createAccountRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/create-account',
  component: CreateAccount,
})
const createCategorytRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/create-category',
  component: CreateCategory,
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: Auth,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  submitTransactionRoute,
  privateRoute,
  viewTransactionsRoute,
  persistRoute,
  createAccountRoute,
  createCategorytRoute,
  authRoute,
])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
