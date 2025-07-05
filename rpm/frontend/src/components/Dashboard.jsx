import { useState, useEffect } from 'react'
import { Brain, MessageSquare, FileText, LogOut, CreditCard, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'

const Dashboard = ({ user, credits, onLogout, updateCredits }) => {
  const [timeUntilRefresh, setTimeUntilRefresh] = useState('')

  useEffect(() => {
    if (credits?.next_reset) {
      const updateTimer = () => {
        const now = new Date()
        const resetTime = new Date(credits.next_reset)
        const diff = resetTime - now

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          setTimeUntilRefresh(`${hours}h ${minutes}m`)
        } else {
          setTimeUntilRefresh('Refreshing...')
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 60000)
      return () => clearInterval(interval)
    }
  }, [credits])

  const creditPercentage = credits ? (credits.remaining_credits / credits.daily_limit) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI Tutoring Platform</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={user.picture || '/default-avatar.png'} 
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Ready to continue your learning journey with AI-powered tutoring?
          </p>
        </div>

        {/* Credits Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <CreditCard className="h-5 w-5 mr-2" />
              Daily Credits
            </CardTitle>
            <CardDescription>
              Your learning credits refresh every 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {credits?.remaining_credits || 0}
                </div>
                <div className="text-sm text-blue-700">
                  of {credits?.daily_limit || 500} credits remaining
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-blue-700 mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  Refreshes in {timeUntilRefresh}
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {credits?.used_today || 0} used today
                </Badge>
              </div>
            </div>
            <Progress value={creditPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/tutor">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700 group-hover:text-green-800">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Start Tutoring
                </CardTitle>
                <CardDescription>
                  Begin an AI-powered tutoring session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Get personalized help with your studies using advanced AI. Ask questions on any topic!
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/quiz">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700 group-hover:text-purple-800">
                  <FileText className="h-5 w-5 mr-2" />
                  Take Quiz
                </CardTitle>
                <CardDescription>
                  Test your knowledge with AI-generated quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Generate custom quizzes on any subject to test your understanding
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest learning sessions and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity yet.</p>
              <p className="text-sm">Start a tutoring session to see your progress here!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

