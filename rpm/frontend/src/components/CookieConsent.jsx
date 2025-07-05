import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowConsent(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cookie className="h-5 w-5 text-blue-600" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Cookie Consent</h3>
                <p className="text-sm text-gray-600">
                  We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
                  By continuing to use our site, you consent to our use of cookies.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={acceptCookies}
                  className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
                >
                  Accept All
                </Button>
                <Button 
                  onClick={declineCookies}
                  variant="outline"
                  className="flex-1 h-8 text-xs"
                >
                  Decline
                </Button>
              </div>
              
              <div className="text-xs text-gray-500">
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                {' • '}
                <a href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>
              </div>
            </div>
            
            <Button
              onClick={declineCookies}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CookieConsent

