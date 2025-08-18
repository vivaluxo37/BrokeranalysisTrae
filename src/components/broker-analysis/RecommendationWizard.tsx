import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Wand2, ArrowRight, ArrowLeft, CheckCircle, Star, Target } from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

interface WizardData {
  assetClasses: string[];
  experience: string;
  tradingStyle: string;
  priority: string;
  country: string;
  fundingOptions: string[];
  minDeposit: number;
}

export function RecommendationWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    assetClasses: [],
    experience: '',
    tradingStyle: '',
    priority: '',
    country: '',
    fundingOptions: [],
    minDeposit: 0
  });

  const steps: WizardStep[] = [
    {
      id: 'assets',
      title: 'What do you want to trade?',
      description: 'Select the instruments you\'re interested in trading'
    },
    {
      id: 'experience',
      title: 'What\'s your trading experience?',
      description: 'Help us understand your skill level'
    },
    {
      id: 'style',
      title: 'What\'s your trading style?',
      description: 'How often do you plan to trade?'
    },
    {
      id: 'priority',
      title: 'What\'s most important to you?',
      description: 'Choose your top priority when selecting a broker'
    },
    {
      id: 'location',
      title: 'Where are you located?',
      description: 'This helps us show brokers available in your region'
    },
    {
      id: 'results',
      title: 'Your Recommendations',
      description: 'Based on your preferences, here are our top picks'
    }
  ];

  const assetOptions = [
    { id: 'forex', label: 'Forex', description: 'Currency pairs trading' },
    { id: 'stocks', label: 'Stocks', description: 'Individual company shares' },
    { id: 'crypto', label: 'Cryptocurrency', description: 'Bitcoin, Ethereum, altcoins' },
    { id: 'cfds', label: 'CFDs', description: 'Contracts for difference' },
    { id: 'options', label: 'Options', description: 'Options contracts' },
    { id: 'futures', label: 'Futures', description: 'Futures contracts' }
  ];

  const experienceOptions = [
    { id: 'beginner', label: 'Beginner', description: 'New to trading' },
    { id: 'intermediate', label: 'Intermediate', description: '1-3 years experience' },
    { id: 'advanced', label: 'Advanced', description: '3+ years experience' },
    { id: 'professional', label: 'Professional', description: 'Professional trader' }
  ];

  const styleOptions = [
    { id: 'scalping', label: 'Scalping', description: 'Multiple trades per day' },
    { id: 'day', label: 'Day Trading', description: 'Daily trades, no overnight positions' },
    { id: 'swing', label: 'Swing Trading', description: 'Hold positions for days/weeks' },
    { id: 'long-term', label: 'Long-term', description: 'Buy and hold strategy' }
  ];

  const priorityOptions = [
    { id: 'fees', label: 'Lowest Fees', description: 'Minimize trading costs' },
    { id: 'platforms', label: 'Best Platforms', description: 'Advanced trading tools' },
    { id: 'regulation', label: 'Strong Regulation', description: 'Maximum safety and protection' },
    { id: 'education', label: 'Education', description: 'Learning resources and support' }
  ];

  const countryOptions = [
    { id: 'us', label: 'United States' },
    { id: 'uk', label: 'United Kingdom' },
    { id: 'eu', label: 'European Union' },
    { id: 'au', label: 'Australia' },
    { id: 'ca', label: 'Canada' },
    { id: 'other', label: 'Other' }
  ];

  const mockRecommendations = [
    {
      id: 'interactive-brokers',
      name: 'Interactive Brokers',
      rating: 4.8,
      match: 95,
      reasons: ['Lowest fees', 'Global markets', 'Professional tools'],
      logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100'
    },
    {
      id: 'td-ameritrade',
      name: 'TD Ameritrade',
      rating: 4.6,
      match: 88,
      reasons: ['Great education', 'thinkorswim platform', 'US regulation'],
      logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100'
    },
    {
      id: 'etoro',
      name: 'eToro',
      rating: 4.4,
      match: 82,
      reasons: ['Social trading', 'Crypto support', 'User-friendly'],
      logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100'
    }
  ];

  const handleAssetChange = (assetId: string, checked: boolean) => {
    setWizardData(prev => ({
      ...prev,
      assetClasses: checked 
        ? [...prev.assetClasses, assetId]
        : prev.assetClasses.filter(id => id !== assetId)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'assets':
        return (
          <div className="space-y-4">
            {assetOptions.map((asset) => (
              <div key={asset.id} className="flex items-start space-x-3 p-3 rounded-lg border border-medium-grey hover:border-light-grey transition-colors">
                <Checkbox
                  id={asset.id}
                  checked={wizardData.assetClasses.includes(asset.id)}
                  onCheckedChange={(checked) => handleAssetChange(asset.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={asset.id} className="font-medium text-pure-white cursor-pointer">
                    {asset.label}
                  </Label>
                  <p className="text-sm text-muted-text mt-1">{asset.description}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'experience':
        return (
          <RadioGroup 
            value={wizardData.experience} 
            onValueChange={(value) => setWizardData(prev => ({ ...prev, experience: value }))}
            className="space-y-4"
          >
            {experienceOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg border border-medium-grey hover:border-light-grey transition-colors">
                <RadioGroupItem value={option.id} id={option.id} />
                <div className="flex-1">
                  <Label htmlFor={option.id} className="font-medium text-pure-white cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-text mt-1">{option.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        );

      case 'style':
        return (
          <RadioGroup 
            value={wizardData.tradingStyle} 
            onValueChange={(value) => setWizardData(prev => ({ ...prev, tradingStyle: value }))}
            className="space-y-4"
          >
            {styleOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg border border-medium-grey hover:border-light-grey transition-colors">
                <RadioGroupItem value={option.id} id={option.id} />
                <div className="flex-1">
                  <Label htmlFor={option.id} className="font-medium text-pure-white cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-text mt-1">{option.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        );

      case 'priority':
        return (
          <RadioGroup 
            value={wizardData.priority} 
            onValueChange={(value) => setWizardData(prev => ({ ...prev, priority: value }))}
            className="space-y-4"
          >
            {priorityOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg border border-medium-grey hover:border-light-grey transition-colors">
                <RadioGroupItem value={option.id} id={option.id} />
                <div className="flex-1">
                  <Label htmlFor={option.id} className="font-medium text-pure-white cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-text mt-1">{option.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        );

      case 'location':
        return (
          <RadioGroup 
            value={wizardData.country} 
            onValueChange={(value) => setWizardData(prev => ({ ...prev, country: value }))}
            className="space-y-4"
          >
            {countryOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg border border-medium-grey hover:border-light-grey transition-colors">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="font-medium text-pure-white cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'results':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-accent-blue mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-pure-white mb-2">
                Perfect! We found {mockRecommendations.length} brokers for you
              </h3>
              <p className="text-muted-text">
                Based on your preferences, here are our top recommendations
              </p>
            </div>

            <div className="space-y-4">
              {mockRecommendations.map((broker, index) => (
                <Card key={broker.id} className="professional-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={broker.logo}
                            alt={`${broker.name} logo`}
                            className="w-12 h-12 rounded-lg"
                            style={{ width: '48px', height: '48px' }}
                          />
                          <Badge className="absolute -top-2 -right-2 bg-accent-blue text-white text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-semibold text-pure-white">{broker.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-light-grey">{broker.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4 text-accent-blue" />
                              <span className="text-sm text-accent-blue">{broker.match}% match</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-muted-text mb-2">Why this broker:</p>
                      <div className="flex flex-wrap gap-1">
                        {broker.reasons.map((reason, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-medium-grey text-light-grey">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button className="bg-accent-blue hover:bg-accent-blue/90">
                Save Results & Create Account
              </Button>
              <p className="text-xs text-muted-text mt-2">
                Save your recommendations and get notified of new brokers that match your criteria
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="professional-section bg-charcoal-grey">
      <div className="w-full px-6 lg:px-12">
        <div className="text-center mb-8">
          <h2 className="text-section-title text-pure-white mb-4">
            Get Personalized Recommendations
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto mb-8">
            Answer a few quick questions and we'll recommend the best brokers 
            tailored to your trading style and preferences.
          </p>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-accent-blue hover:bg-accent-blue/90 text-lg px-8 py-4">
                <Wand2 className="w-5 h-5 mr-2" />
                Start Recommendation Wizard
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-pure-white">
                  {steps[currentStep].title}
                </DialogTitle>
                <p className="text-muted-text">{steps[currentStep].description}</p>
              </DialogHeader>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-text">
                  <span>Step {currentStep + 1} of {steps.length}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>

              {/* Step Content */}
              <div className="py-6">
                {renderStepContent()}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button onClick={nextStep} className="bg-accent-blue hover:bg-accent-blue/90">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setIsOpen(false)} 
                    className="bg-accent-blue hover:bg-accent-blue/90"
                  >
                    Close
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Teaser Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent-blue/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-accent-blue" />
              </div>
              <h3 className="font-semibold text-pure-white mb-2">Personalized Matching</h3>
              <p className="text-sm text-muted-text">
                Get broker recommendations tailored to your specific trading needs and preferences
              </p>
            </CardContent>
          </Card>

          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent-blue/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-accent-blue" />
              </div>
              <h3 className="font-semibold text-pure-white mb-2">Expert Analysis</h3>
              <p className="text-sm text-muted-text">
                Our recommendations are based on comprehensive analysis of fees, regulation, and features
              </p>
            </CardContent>
          </Card>

          <Card className="professional-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent-blue/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-accent-blue" />
              </div>
              <h3 className="font-semibold text-pure-white mb-2">Save & Track</h3>
              <p className="text-sm text-muted-text">
                Save your results and get notified when new brokers match your criteria
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}