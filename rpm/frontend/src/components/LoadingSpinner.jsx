import { Brain } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="text-lg font-medium text-gray-700">Loading...</div>
        <div className="text-sm text-gray-500">Preparing your AI tutoring experience</div>
      </div>
    </div>
  )
}

export default LoadingSpinner

