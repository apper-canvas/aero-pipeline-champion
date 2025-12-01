import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { getRouteConfig } from "@/router/route.utils";
import Layout from "@/components/organisms/Layout";
import ErrorPage from "@/components/pages/ErrorPage";
import Root from "@/layouts/Root";

// Lazy load components
const PipelinePage = lazy(() => import('@/components/pages/Pipeline'))
const LeadsPage = lazy(() => import('@/components/pages/Leads'))
const ContactsPage = lazy(() => import('@/components/pages/Contacts'))
const CompaniesPage = lazy(() => import('@/components/pages/Companies'))
const QuotesPage = lazy(() => import('@/components/pages/Quotes'))
const SalesOrdersPage = lazy(() => import('@/components/pages/SalesOrders'))
const TasksPage = lazy(() => import('@/components/pages/Tasks'))
const ReportsPage = lazy(() => import('@/components/pages/Reports'))
const NotFoundPage = lazy(() => import('@/components/pages/NotFound'))
const LoginPage = lazy(() => import('@/components/pages/Login'))
const SignupPage = lazy(() => import('@/components/pages/Signup'))
const CallbackPage = lazy(() => import('@/components/pages/Callback'))
const ErrorPageLazy = lazy(() => import('@/components/pages/ErrorPage'))
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    </div>
  }>
    {children}
  </Suspense>
)

const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  // Get config for this route
  let configPath
  if (index) {
    configPath = "/"
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`
  }

  const config = getRouteConfig(configPath)
  const finalAccess = access || config?.allow

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <SuspenseWrapper>{element}</SuspenseWrapper> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  }

  if (children && children.length > 0) {
    route.children = children
  }

  return route
}

const mainRoutes = [
  createRoute({
    index: true,
    element: <PipelinePage />
  }),
createRoute({
    path: "leads",
    element: <LeadsPage />,
    title: 'Leads'
  }),
  createRoute({
    path: "contacts",
    element: <ContactsPage />
  }),
  createRoute({
    path: "companies",
    element: <CompaniesPage />
  }),
  createRoute({
    path: "quotes",
    element: <QuotesPage />
  }),
  createRoute({
    path: "sales-orders",
    element: <SalesOrdersPage />
  }),
createRoute({
    path: "tasks",
    element: <TasksPage />
  }),
  createRoute({
    path: "reports",
    element: <ReportsPage />,
    title: 'Reports'
  })
]
const authRoutes = [
  createRoute({
    path: "login",
    element: <LoginPage />
  }),
  createRoute({
    path: "signup", 
    element: <SignupPage />
  }),
  createRoute({
    path: "callback",
    element: <CallbackPage />
  }),
createRoute({
    path: "error",
    element: <ErrorPageLazy />
  })
]
const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: mainRoutes
      },
      ...authRoutes
]
  }
]

export const router = createBrowserRouter(routes)