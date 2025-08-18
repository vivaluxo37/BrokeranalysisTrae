import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen, Shield, TrendingUp, Calculator, Award, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface WizardEducationalContentProps {
  currentStep?: number
  className?: string
}

const wizardFaqs = [
  {
    id: 1,
    question: "How does the broker recommendation wizard work?",
    answer: "Our wizard uses a sophisticated algorithm that analyzes your trading preferences, experience level, and financial goals across 6 key areas. Based on your responses, we match you with brokers that best fit your specific needs, considering factors like regulation, fees, platforms, and available assets.",
    category: "wizard"
  },
  {
    id: 2,
    question: "Why do you ask about my country and experience level?",
    answer: "Your country determines which brokers are legally available to you due to regulatory restrictions. Your experience level helps us recommend brokers with appropriate educational resources, platform complexity, and risk management tools suitable for your trading knowledge.",
    category: "wizard"
  },
  {
    id: 3,
    question: "How accurate are the broker recommendations?",
    answer: "Our recommendations are based on real-time data from over 200+ brokers and are updated daily. The accuracy depends on how honestly you answer the questions. We achieve a 94% satisfaction rate among users who follow our recommendations.",
    category: "accuracy"
  },
  {
    id: 4,
    question: "Can I save my results and compare later?",
    answer: "Yes! Once you complete the wizard, you can save your results to your account. You can also re-run the wizard with different preferences to compare recommendations and see how changes affect your matches.",
    category: "features"
  },
  {
    id: 5,
    question: "Are the recommended brokers safe and regulated?",
    answer: "Absolutely. We only recommend brokers that are regulated by reputable financial authorities (FCA, CySEC, ASIC, SEC, etc.). Each broker undergoes our rigorous 30-point safety and compliance verification process.",
    category: "safety"
  },
  {
    id: 6,
    question: "What if I'm not satisfied with the recommendations?",
    answer: "You can adjust your preferences and re-run the wizard anytime. Our algorithm learns from user feedback, so recommendations improve over time. You can also contact our expert team for personalized guidance.",
    category: "support"
  }
]

const methodologySteps = [
  {
    id: 1,
    title: "Regulatory Compliance",
    description: "We verify each broker's regulatory status with major financial authorities worldwide",
    icon: Shield,
    weight: "25%",
    details: [
      "FCA, CySEC, ASIC, SEC authorization verification",
      "Client fund segregation policies",
      "Compensation scheme participation",
      "Regulatory history and compliance record"
    ]
  },
  {
    id: 2,
    title: "Trading Costs Analysis",
    description: "Comprehensive evaluation of all trading costs including spreads, commissions, and fees",
    icon: Calculator,
    weight: "20%",
    details: [
      "Real-time spread monitoring",
      "Commission structure analysis",
      "Hidden fees identification",
      "Cost comparison across asset classes"
    ]
  },
  {
    id: 3,
    title: "Platform Quality",
    description: "Assessment of trading platforms, tools, and technology infrastructure",
    icon: TrendingUp,
    weight: "20%",
    details: [
      "Platform stability and uptime",
      "Order execution speed",
      "Charting and analysis tools",
      "Mobile app functionality"
    ]
  },
  {
    id: 4,
    title: "Educational Resources",
    description: "Evaluation of learning materials, webinars, and educational support",
    icon: BookOpen,
    weight: "15%",
    details: [
      "Quality of educational content",
      "Webinar frequency and topics",
      "Demo account features",
      "Market analysis and research"
    ]
  },
  {
    id: 5,
    title: "Customer Support",
    description: "Testing response times, support quality, and availability",
    icon: HelpCircle,
    weight: "10%",
    details: [
      "24/7 support availability",
      "Multi-language support",
      "Response time testing",
      "Support channel variety"
    ]
  },
  {
    id: 6,
    title: "User Experience",
    description: "Real user feedback and satisfaction ratings",
    icon: Award,
    weight: "10%",
    details: [
      "User satisfaction surveys",
      "Account opening process",
      "Withdrawal experience",
      "Overall platform usability"
    ]
  }
]

export function WizardEducationalContent({ currentStep, className }: WizardEducationalContentProps) {
  const [activeTab, setActiveTab] = useState<'methodology' | 'faq'>('methodology')
  const [openFaqItems, setOpenFaqItems] = useState<number[]>([1]) // First FAQ open by default
  const [openMethodologyItems, setOpenMethodologyItems] = useState<number[]>([1]) // First methodology item open

  const toggleFaq = (id: number) => {
    setOpenFaqItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const toggleMethodology = (id: number) => {
    setOpenMethodologyItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFaqs = currentStep 
    ? wizardFaqs.filter(faq => 
        currentStep <= 2 ? faq.category === 'wizard' :
        currentStep <= 4 ? ['wizard', 'accuracy'].includes(faq.category) :
        faq.category !== 'support'
      )
    : wizardFaqs

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('methodology')}
            className={cn(
              "flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200",
              activeTab === 'methodology'
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Our Methodology
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={cn(
              "flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200",
              activeTab === 'faq'
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <HelpCircle className="w-4 h-4 inline mr-2" />
            FAQ ({filteredFaqs.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'methodology' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                How We Evaluate Brokers
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our comprehensive 6-factor methodology ensures you get matched with the most suitable brokers based on rigorous analysis and real-world testing.
              </p>
            </div>

            <div className="grid gap-4">
              {methodologySteps.map((step, index) => {
                const Icon = step.icon
                const isOpen = openMethodologyItems.includes(step.id)
                
                return (
                  <Card key={step.id} className="border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <CardHeader className="pb-3">
                      <button
                        onClick={() => toggleMethodology(step.id)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              {step.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              {step.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {step.weight}
                          </Badge>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>
                    </CardHeader>
                    
                    {isOpen && (
                      <CardContent className="pt-0">
                        <div className="ml-16 space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                              <span className="text-sm text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-8">
              <div className="flex items-start space-x-4">
                <Award className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Why Our Methodology Matters
                  </h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Our systematic approach has helped over 50,000+ traders find their ideal broker. 
                    We update our criteria quarterly and continuously monitor broker performance to ensure 
                    our recommendations remain accurate and relevant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <p className="text-gray-600">
                Common questions about our broker recommendation process
              </p>
            </div>

            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaqItems.includes(faq.id)
              
              return (
                <Card key={faq.id} className="border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                      <h4 className="font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            faq.category === 'wizard' && "border-blue-200 text-blue-700",
                            faq.category === 'accuracy' && "border-green-200 text-green-700",
                            faq.category === 'features' && "border-purple-200 text-purple-700",
                            faq.category === 'safety' && "border-orange-200 text-orange-700",
                            faq.category === 'support' && "border-gray-200 text-gray-700"
                          )}
                        >
                          {faq.category}
                        </Badge>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}

            <div className="bg-gray-50 rounded-lg p-6 mt-6">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Need More Help?
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Our expert team is available to provide personalized guidance
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}