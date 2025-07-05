import { useState } from 'react'
import { Upload, FileText, Image, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'

const UploadPage = ({ user, credits, onLogout }) => {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  const onDrop = async (acceptedFiles) => {
    setUploading(true)
    
    // Simulate upload process
    for (const file of acceptedFiles) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUploadedFiles(prev => [...prev, {
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'completed'
      }])
    }
    
    setUploading(false)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 16 * 1024 * 1024 // 16MB
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-gray-900">Upload Materials</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Study Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                {isDragActive ? (
                  <p className="text-blue-600 font-medium">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag & drop your files here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports PDF, PNG, JPG, JPEG (max 16MB)
                    </p>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-blue-600"></div>
                    <span className="text-blue-800">Processing files...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded">
                        {file.type.includes('pdf') ? (
                          <FileText className="h-5 w-5 text-red-600" />
                        ) : (
                          <Image className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{file.name}</div>
                        <div className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Upload</h3>
                  <p className="text-sm text-gray-600">
                    Upload your PDFs, images, or study materials
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Process</h3>
                  <p className="text-sm text-gray-600">
                    AI extracts and analyzes your content
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Learn</h3>
                  <p className="text-sm text-gray-600">
                    Get personalized tutoring based on your materials
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UploadPage

