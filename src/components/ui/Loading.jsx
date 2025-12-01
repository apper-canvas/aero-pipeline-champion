const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-navy-500/20 border-t-navy-500 mx-auto"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-coral-500 animate-spin [animation-duration:0.8s] [animation-direction:reverse] mx-auto"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-navy-500">Loading Pipeline Pro</h3>
          <p className="text-gray-600">Preparing your sales pipeline...</p>
        </div>
      </div>
    </div>
  )
}

export default Loading