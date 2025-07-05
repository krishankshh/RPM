import { useState } from 'react'
import { GraduationCap, BookOpen, Target, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { authAPI } from '../api'

const OnboardingPage = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    academic_level: '',
    subject_interest: '',
    learning_goals: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.academic_level || !formData.subject_interest || !formData.learning_goals) {
      return
    }

    setLoading(true)
    try {
      await authAPI.completeProfile(formData)
      setUser({ ...user, profile_completed: true })
    } catch (error) {
      console.error('Profile completion failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-fit">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription className="text-base">
              Help us personalize your AI tutoring experience
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Academic Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Academic Level
                </label>
                <Select onValueChange={(value) => setFormData({...formData, academic_level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your academic level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">Elementary School</SelectItem>
                    <SelectItem value="middle">Middle School</SelectItem>
                    <SelectItem value="high">High School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Interest */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Primary Subject Interest
                </label>
                <Select onValueChange={(value) => setFormData({...formData, subject_interest: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your main subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English & Literature</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="computer_science">Computer Science</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="languages">Foreign Languages</SelectItem>
                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Learning Goals */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Learning Goals
                </label>
                <Textarea
                  placeholder="Tell us about your learning goals and what you'd like to achieve..."
                  value={formData.learning_goals}
                  onChange={(e) => setFormData({...formData, learning_goals: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.academic_level || !formData.subject_interest || !formData.learning_goals}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {loading ? (
                  'Setting up your profile...'
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OnboardingPage

