import { Clock, Mail, Users, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

const WaitlistPage = ({ user }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-fit">
              <Clock className="h-12 w-12 text-white" />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-900">
                You're on the Waitlist!
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Thanks for your interest in our AI Tutoring Platform
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* User Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img 
                src={user.picture || '/default-avatar.png'} 
                alt={user.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <div className="font-semibold text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
            </div>

            {/* Status */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full">
                <Users className="h-4 w-4" />
                <span className="font-medium">Position in queue: #247</span>
              </div>
              
              <p className="text-gray-600">
                We're currently in limited beta and carefully onboarding users to ensure 
                the best experience. You'll receive an email when it's your turn!
              </p>
            </div>

            {/* What to Expect */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 text-center">
                What to expect when you get access:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">500 Daily Credits</div>
                    <div className="text-sm text-blue-700">Free credits that refresh every 24 hours</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-purple-900">AI Tutoring</div>
                    <div className="text-sm text-purple-700">Personalized learning with DeepSeek AI</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900">File Upload</div>
                    <div className="text-sm text-green-700">Upload PDFs and images for custom tutoring</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-lg">
                  <Users className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-indigo-900">Quiz Generation</div>
                    <div className="text-sm text-indigo-700">AI-generated quizzes and assessments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Wait Time */}
            <div className="text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="text-2xl font-bold text-amber-900 mb-2">
                Estimated wait time: 3-5 days
              </div>
              <div className="text-sm text-amber-700">
                We're onboarding users in batches to maintain quality service
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.open('mailto:support@aitutoring.com', '_blank')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              
              <Button 
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                onClick={() => window.location.reload()}
              >
                <Clock className="h-4 w-4 mr-2" />
                Check Status
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              We'll send you an email at <strong>{user.email}</strong> when you're approved.
              <br />
              Make sure to check your spam folder!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WaitlistPage

