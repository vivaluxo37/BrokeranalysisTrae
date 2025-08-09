import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    id: 1,
    question: "How do you rank and review forex brokers?",
    answer: "Our ranking methodology evaluates brokers across 10 major criteria including regulatory compliance, trading costs, platform quality, customer support, educational resources, and user feedback. Each broker undergoes a comprehensive 30-day review process by our expert analysts who have years of experience in financial markets."
  },
  {
    id: 2,
    question: "Are all brokers on your platform regulated?",
    answer: "Yes, we only feature brokers that are regulated by reputable financial authorities such as FCA (UK), CySEC (Cyprus), ASIC (Australia), SEC (US), and other recognized regulatory bodies. We verify each broker's regulatory status and update this information regularly to ensure compliance."
  },
  {
    id: 3,
    question: "Is your broker comparison service really free?",
    answer: "Absolutely! Our comparison tools, broker reviews, educational content, and market analysis are completely free for all users. We earn revenue through affiliate partnerships with brokers, but this never influences our reviews or rankings. Our editorial independence is maintained at all times."
  },
  {
    id: 4,
    question: "How often do you update broker information?",
    answer: "We update broker information continuously. Trading conditions, spreads, and promotional offers are monitored daily. Comprehensive broker reviews are updated quarterly or whenever significant changes occur. Our team also responds immediately to any regulatory changes or major broker announcements."
  },
  {
    id: 5,
    question: "What makes TopForex.Trade different from other comparison sites?",
    answer: "Our team consists of former traders and financial industry professionals with over 15 years of combined experience. We provide unbiased reviews, comprehensive educational content through our Forex Academy, and use advanced filtering tools to match traders with brokers based on their specific needs and trading style."
  },
  {
    id: 6,
    question: "Do you provide trading advice or signals?",
    answer: "No, we focus exclusively on broker analysis and education. We do not provide trading signals, investment advice, or portfolio management services. Our goal is to help you find the right broker and provide educational resources to improve your trading knowledge and skills."
  }
]

export function FaqSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <section className="section-padding cosmic-void neural-network" aria-labelledby="faq-heading">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16 animate-fade-in">
          <h2 id="faq-heading" className="text-5xl font-bold cosmic-text mb-6 text-glow">
            Frequently Asked Questions
          </h2>
          <p className="text-xl neural-text max-w-3xl mx-auto leading-relaxed">
            Get answers to common questions about our broker comparison platform, 
            review methodology, and services from our expert team.
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card key={faq.id} className="topforex-card topforex-card-hover floating-node" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-0">
                <button
                  className="w-full p-8 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300 rounded-3xl"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={openItems.includes(faq.id)}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <h3 className="cosmic-text font-semibold text-xl pr-4">
                    {faq.question}
                  </h3>
                  <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center flex-shrink-0">
                    {openItems.includes(faq.id) ? (
                      <ChevronUp className="w-5 h-5 text-topforex-accent" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-topforex-accent" />
                    )}
                  </div>
                </button>
                {openItems.includes(faq.id) && (
                  <div 
                    id={`faq-answer-${faq.id}`}
                    className="px-8 pb-8 neural-text leading-relaxed text-lg animate-slide-up"
                  >
                    {faq.answer}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Card className="glass-card max-w-2xl mx-auto cosmic-glow">
            <CardContent className="p-8">
              <p className="neural-text text-lg mb-6">
                Still have questions? We're here to help.
              </p>
              <Button className="bg-topforex-accent hover:bg-topforex-accent/80 text-white px-8 py-4 text-lg rounded-full">
                Contact Our Support Team
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}