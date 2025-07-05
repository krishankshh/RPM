import { useState } from 'react'
import { Send, Brain, ArrowLeft, CreditCard } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'
import { tutorAPI } from '../api'

const TutorPage = ({ user, credits, onLogout, updateCredits }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setLoading(true)

    // Add user message to chat
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newUserMessage])

    try {
      const response = await tutorAPI.sendMessage({
        message: userMessage,
        session_id: sessionId,
        topic: 'General Learning'
      })

      // Add AI response to chat
      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
        tokens_used: response.data.tokens_used
      }
      setMessages(prev => [...prev, aiMessage])

      // Update session ID and credits
      if (response.data.session_id) {
        setSessionId(response.data.session_id)
      }
      if (response.data.credits_remaining !== undefined) {
        updateCredits({ ...credits, remaining_credits: response.data.credits_remaining })
      }

    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

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
                <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-gray-900">AI Tutor</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <CreditCard className="h-3 w-3 mr-1" />
                {credits?.remaining_credits || 0} credits
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              AI Tutoring Session
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-2">Welcome to your AI tutoring session!</p>
                  <p className="text-sm text-gray-400">
                    Ask me anything about your studies. I'm here to help you learn!
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.isError
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.tokens_used && (
                        <div className="text-xs mt-2 opacity-70">
                          Tokens used: {message.tokens_used}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-blue-600"></div>
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex space-x-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your studies..."
                className="flex-1 min-h-[60px] max-h-[120px]"
                disabled={loading || (credits?.remaining_credits || 0) <= 0}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || loading || (credits?.remaining_credits || 0) <= 0}
                className="h-[60px] px-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {(credits?.remaining_credits || 0) <= 0 && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  You've used all your daily credits. They'll refresh in {credits?.next_reset ? 
                    new Date(credits.next_reset).toLocaleTimeString() : '24 hours'}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TutorPage

