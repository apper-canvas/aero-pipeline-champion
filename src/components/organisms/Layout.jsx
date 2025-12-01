import { Outlet, Link, useLocation } from 'react-router-dom'
import React, { useState } from 'react'
import Header from '@/components/organisms/Header'
import ApperIcon from '@/components/ApperIcon'

const navigation = [
  { name: "Pipeline", href: "/pipeline", icon: "BarChart3" },
  { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
  { name: "Contacts", href: "/contacts", icon: "Users" },
  { name: "Companies", href: "/companies", icon: "Building2" },
  { name: "Quotes", href: "/quotes", icon: "FileText" },
  { name: "Sales Orders", href: "/sales-orders", icon: "ShoppingCart" }
]

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

return (
    <div className="h-screen bg-background grid grid-cols-1 md:grid-cols-[256px_1fr] grid-rows-[auto_1fr] md:grid-rows-1">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:shadow-none md:z-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-navy-500">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href === "/pipeline" && location.pathname === "/")
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-coral-500 to-red-500 text-white shadow-lg"
                      : "text-navy-500 hover:bg-navy-50 hover:text-navy-600"
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col min-h-0 col-span-1 row-span-1">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout