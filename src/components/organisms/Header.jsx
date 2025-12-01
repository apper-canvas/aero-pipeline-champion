import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
const Header = () => {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("")


  const handleSearch = (query) => {
    setSearchQuery(query)
    // Search functionality would be implemented here
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-coral-500 to-red-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy-500">Pipeline Pro</h1>
              <p className="text-xs text-gray-500">CRM for Small Business</p>
            </div>
          </div>

{/* Search */}
          <div className="flex items-center gap-4">
            <SearchBar
              placeholder="Search contacts & deals..."
              onSearch={handleSearch}
              className="w-64 hidden sm:block"
            />
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg text-navy-500 hover:bg-navy-50">
              <ApperIcon name="Menu" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="px-4 py-2">
          <SearchBar
            placeholder="Search..."
            onSearch={handleSearch}
            className="mb-2 sm:hidden"
          />
        </div>
      </div>
    </header>
  )
}

export default Header;