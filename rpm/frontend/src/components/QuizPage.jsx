import { useState } from 'react'
import { FileText, ArrowLeft, CheckCircle, X } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'

const QuizPage = ({ user, credits, onLogout, updateCredits }) => {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  // Sample quiz data - in real app this would come from AI
  const sampleQuiz = {
    topic: "Mathematics - Algebra",
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "What is the value of x in the equation 2x + 5 = 13?",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
        correct: 1
      },
      {
        id: 2,
        type: "multiple_choice", 
        question: "Which of the following is equivalent to (x + 3)²?",
        options: ["x² + 6x + 9", "x² + 3x + 9", "x² + 6x + 6", "x² + 9"],
        correct: 0
      }
    ]
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    })
  }

  const nextQuestion = () => {
    if (currentQuestion < sampleQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    sampleQuiz.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correct++
      }
    })
    return correct
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-lg font-bold text-gray-900">AI Quiz</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready for a Quiz?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Test your knowledge with an AI-generated quiz on any topic you'd like to study.
                </p>
                <Badge variant="secondary" className="mb-4">
                  Sample Quiz: {sampleQuiz.topic}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Quiz Features:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Multiple choice and short answer questions</li>
                    <li>• Instant feedback and explanations</li>
                    <li>• Personalized difficulty based on your level</li>
                    <li>• Track your progress over time</li>
                  </ul>
                </div>
              </div>

              <Button 
                onClick={() => setQuizStarted(true)}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / sampleQuiz.questions.length) * 100)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Complete! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {score}/{sampleQuiz.questions.length}
                </div>
                <div className="text-xl text-gray-700 mb-4">
                  {percentage}% Correct
                </div>
                <Badge variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"}>
                  {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Practicing!"}
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Review:</h3>
                {sampleQuiz.questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-2 mb-2">
                      {answers[index] === question.correct ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Correct answer: {question.options[question.correct]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={() => {
                    setQuizStarted(false)
                    setCurrentQuestion(0)
                    setAnswers({})
                    setShowResults(false)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Take Another Quiz
                </Button>
                <Link to="/tutor" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500">
                    Continue Learning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const question = sampleQuiz.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-gray-900">Quiz in Progress</h1>
              </div>
            </div>
            <Badge variant="secondary">
              Question {currentQuestion + 1} of {sampleQuiz.questions.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={nextQuestion}
              disabled={answers[currentQuestion] === undefined}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {currentQuestion < sampleQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default QuizPage

