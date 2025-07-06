import { useState } from 'react'
import { Brain, Eye, EyeOff, User, Mail, Phone, GraduationCap, BookOpen } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'

const RegisterPage = ({ onRegister, onSwitchToLogin, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    academic_level: '',
    subject_interest: '',
    custom_academic_level: '',
    custom_subject_interest: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const academicLevels = [
    { value: 'high_school', label: 'High School' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'graduate', label: 'Graduate' },
    { value: 'phd', label: 'PhD' },
    { value: 'professional', label: 'Professional' },
    { value: 'other', label: 'Other' }
  ]

  const subjects = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'computer_science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'economics', label: 'Economics' },
    { value: 'business', label: 'Business' },
    { value: 'literature', label: 'Literature' },
    { value: 'history', label: 'History' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'law', label: 'Law' },
    { value: 'arts', label: 'Arts' },
    { value: 'languages', label: 'Languages' },
    { value: 'other', label: 'Other' }
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.academic_level) {
      newErrors.academic_level = 'Academic level is required'
    } else if (formData.academic_level === 'other' && !formData.custom_academic_level.trim()) {
      newErrors.custom_academic_level = 'Please specify your academic level'
    }

    if (!formData.subject_interest) {
      newErrors.subject_interest = 'Subject interest is required'
    } else if (formData.subject_interest === 'other' && !formData.custom_subject_interest.trim()) {
      newErrors.custom_subject_interest = 'Please specify your subject interest'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Prepare data with custom values if "other" is selected
      const submitData = {
        ...formData,
        academic_level: formData.academic_level === 'other' ? formData.custom_academic_level : formData.academic_level,
        subject_interest: formData.subject_interest === 'other' ? formData.custom_subject_interest : formData.subject_interest
      }
      onRegister(submitData)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAcademicLevelChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      academic_level: value,
      custom_academic_level: value === 'other' ? prev.custom_academic_level : ''
    }))
    if (errors.academic_level) {
      setErrors(prev => ({ ...prev, academic_level: '' }))
    }
  }

  const handleSubjectChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      subject_interest: value,
      custom_subject_interest: value === 'other' ? prev.custom_subject_interest : ''
    }))
    if (errors.subject_interest) {
      setErrors(prev => ({ ...prev, subject_interest: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Hero Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Tutoring Platform
              </h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Join the Future of
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Personalized
              </span>
              <br />Learning
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Create your account and start your journey with AI-powered tutoring 
              tailored to your academic goals and learning style.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <span className="text-gray-700">500 free credits daily</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <span className="text-gray-700">Personalized AI tutoring</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <span className="text-gray-700">Upload your own materials</span>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription className="text-base">
                Join thousands of students learning with AI
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <Alert className="py-2">
                      <AlertDescription className="text-sm text-red-600">
                        {errors.name}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <Alert className="py-2">
                      <AlertDescription className="text-sm text-red-600">
                        {errors.email}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Phone (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Academic Level */}
                <div className="space-y-2">
                  <Label htmlFor="academic_level">Academic Level</Label>
                  <Select
                    value={formData.academic_level}
                    onValueChange={handleAcademicLevelChange}
                  >
                    <SelectTrigger className={errors.academic_level ? 'border-red-500' : ''}>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                        <SelectValue placeholder="Select your academic level" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {academicLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.academic_level && (
                    <Alert className="py-2">
                      <AlertDescription className="text-sm text-red-600">
                        {errors.academic_level}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Custom Academic Level Input */}
                  {formData.academic_level === 'other' && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Please specify your academic level"
                        value={formData.custom_academic_level}
                        onChange={(e) => handleInputChange('custom_academic_level', e.target.value)}
                        className={errors.custom_academic_level ? 'border-red-500' : ''}
                      />
                      {errors.custom_academic_level && (
                        <Alert className="py-2">
                          <AlertDescription className="text-sm text-red-600">
                            {errors.custom_academic_level}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </div>

                {/* Subject Interest */}
                <div className="space-y-2">
                  <Label htmlFor="subject_interest">Primary Subject Interest</Label>
                  <Select
                    value={formData.subject_interest}
                    onValueChange={handleSubjectChange}
                  >
                    <SelectTrigger className={errors.subject_interest ? 'border-red-500' : ''}>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                        <SelectValue placeholder="Select your primary subject" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subject_interest && (
                    <Alert className="py-2">
                      <AlertDescription className="text-sm text-red-600">
                        {errors.subject_interest}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Custom Subject Interest Input */}
                  {formData.subject_interest === 'other' && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Please specify your subject interest"
                        value={formData.custom_subject_interest}
                        onChange={(e) => handleInputChange('custom_subject_interest', e.target.value)}
                        className={errors.custom_subject_interest ? 'border-red-500' : ''}
                      />
                      {errors.custom_subject_interest && (
                        <Alert className="py-2">
                          <AlertDescription className="text-sm text-red-600">
                            {errors.custom_subject_interest}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <Alert className="py-2">
                      <AlertDescription className="text-sm text-red-600">
                        {errors.password}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <Alert className="py-2">
                      <AlertDescription className="text-sm text-red-600">
                        {errors.confirmPassword}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Sign in here
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    By creating an account, you agree to our{' '}
                    <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

