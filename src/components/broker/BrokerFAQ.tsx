import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface BrokerFAQProps {
  faqs: FAQ[];
  brokerName: string;
}

export const BrokerFAQ: React.FC<BrokerFAQProps> = ({ faqs, brokerName }) => {
  const groupedFAQs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  // Generate FAQ structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <section className="py-12 bg-professional-black">
      <div className="content-container">
        <Card className="professional-card">
          <CardHeader>
            <CardTitle className="text-2xl text-pure-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6" />
              Frequently Asked Questions
            </CardTitle>
            <p className="text-light-grey">
              Common questions about {brokerName} answered by our experts
            </p>
          </CardHeader>
          <CardContent>
            {Object.keys(groupedFAQs).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-pure-white mb-4 capitalize">
                      {category} Questions
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      {categoryFAQs.map((faq, index) => (
                        <AccordionItem key={`${category}-${index}`} value={`faq-${category}-${index}`}>
                          <AccordionTrigger className="text-left hover:no-underline text-pure-white">
                            <span className="font-medium">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="prose prose-sm max-w-none">
                              <p className="text-light-grey leading-relaxed">{faq.answer}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-medium-grey mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-pure-white mb-2">No FAQ Available</h3>
                <p className="text-light-grey mb-4">
                  No frequently asked questions are available for this broker yet.
                </p>
                <p className="text-sm text-light-grey">
                  Have a question? Contact our support team and we'll add it to the FAQ.
                </p>
              </div>
            )}
            
            {/* FAQ Footer */}
            <div className="mt-8 pt-6 border-t border-medium-grey">
              <div className="bg-charcoal-grey p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-accent-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-pure-white mb-2">Need More Help?</h4>
                    <p className="text-light-grey text-sm leading-relaxed">
                      Can't find what you're looking for? Visit our Help Center or contact our 
                      support team for personalized assistance with {brokerName} or any other 
                      broker-related questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </section>
      
      {/* FAQ Structured Data (JSON-LD) */}
      {faqs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      )}
    </>
  );
};