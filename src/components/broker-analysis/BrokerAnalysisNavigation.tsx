import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  ChevronDown,
  Menu,
  Search,
  User,
  Globe,
  TrendingUp,
  Wand2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Target,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavigationItem {
  name: string;
  href: string;
  description?: string;
  dropdown?: NavigationItem[];
}

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

export function BrokerAnalysisNavigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
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
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation: NavigationItem[] = [
    {
      name: 'Compare Brokers',
      href: '/compare',
      dropdown: [
        { name: 'By Asset', href: '/compare/assets', description: 'Forex, Stocks, Crypto, CFDs, Options, Futures' },
        { name: 'By Region', href: '/compare/regions', description: 'US, UK, EU, Australia, Canada brokers' },
        { name: 'By Regulation', href: '/compare/regulation', description: 'FCA, ASIC, CySEC, NFA, SEC, IIROC' },
        { name: 'Side-by-side Compare', href: '/compare/tool', description: 'Compare up to 4 brokers directly' },
        { name: 'Recommendation Wizard', href: '/wizard', description: 'Find your perfect broker match' },
      ],
    },
    {
      name: 'Broker Reviews',
      href: '/reviews',
      dropdown: [
        { name: 'Latest Reviews', href: '/reviews/latest', description: 'Most recent broker reviews' },
        { name: 'Top Rated', href: '/reviews/top-rated', description: 'Highest rated brokers' },
        { name: 'New Brokers', href: '/reviews/new', description: 'Recently added brokers' },
      ],
    },
    {
      name: 'Tools & Calculators',
      href: '/tools',
      dropdown: [
        { name: 'Fee Calculator', href: '/tools/fee-calculator', description: 'Calculate trading costs' },
        { name: 'Leverage Calculator', href: '/tools/leverage-calculator', description: 'Calculate margin requirements' },
        { name: 'Position Calculator', href: '/tools/position-calculator', description: 'Calculate position sizes' },
        { name: 'Correlation Matrix', href: '/tools/correlation-matrix', description: 'Analyze asset correlations' },
        { name: 'Economic Calendar', href: '/tools/economic-calendar', description: 'Track market events' },
      ],
    },
    {
      name: 'Learn',
      href: '/education',
      dropdown: [
        { name: 'Broker Selection Guide', href: '/education/broker-guide', description: 'How to choose the right broker' },
        { name: 'Regulation & Safety', href: '/education/regulation', description: 'Understanding broker regulation' },
        { name: 'Trading Basics', href: '/education/basics', description: 'Learn fundamental trading concepts' },
        { name: 'Advanced Strategies', href: '/education/strategies', description: 'Professional trading techniques' },
      ],
    },
    { name: 'About', href: '/about' },
  ];

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
            {assetOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg border border-medium-grey hover:border-light-grey transition-colors">
                <Checkbox
                  id={option.id}
                  checked={wizardData.assetClasses.includes(option.id)}
                  onCheckedChange={(checked) => handleAssetChange(option.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={option.id} className="font-medium text-pure-white cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-text mt-1">{option.description}</p>
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

  const isActiveRoute = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log('Search:', searchQuery);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-professional-black/95 backdrop-blur-md border-b border-charcoal-grey">
      {/* Utility Bar */}
      <div className="border-b border-charcoal-grey/50">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center space-x-4 text-muted-text">
              <span>100+ brokers analyzed</span>
              <span>•</span>
              <span>50+ regulators tracked</span>
              <span>•</span>
              <Link to="/methodology" className="hover:text-pure-white transition-colors">
                Methodology
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/affiliates" className="text-muted-text hover:text-pure-white transition-colors">
                Affiliate disclosure
              </Link>
              <div className="flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <select className="bg-transparent text-muted-text text-xs border-none outline-none">
                  <option value="en">EN</option>
                  <option value="es">ES</option>
                  <option value="fr">FR</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-pure-white">BrokerAnalysis</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.dropdown ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent text-light-grey hover:text-pure-white data-[state=open]:text-pure-white">
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-80 p-4">
                          <div className="grid gap-2">
                            {item.dropdown.map((subItem) => (
                              <NavigationMenuLink key={subItem.name} asChild>
                                <Link
                                  to={subItem.href}
                                  className="block p-3 rounded-lg hover:bg-charcoal-grey transition-colors"
                                >
                                  <div className="font-medium text-pure-white">{subItem.name}</div>
                                  {subItem.description && (
                                    <div className="text-xs text-muted-text mt-1">
                                      {subItem.description}
                                    </div>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          isActiveRoute(item.href)
                            ? 'text-pure-white bg-charcoal-grey'
                            : 'text-light-grey hover:text-pure-white hover:bg-charcoal-grey/50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-text w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search brokers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                    className="pl-10 w-64"
                    autoFocus
                  />
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="text-light-grey hover:text-pure-white"
                >
                  <Search className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-light-grey hover:text-pure-white">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                      Sign out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/signin')}>
                      Sign in
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/signup')}>
                      Sign up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA Button */}
            <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent-blue text-white hover:bg-accent-blue/90 font-medium">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Get Recommendation
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
                      onClick={() => setIsWizardOpen(false)} 
                      className="bg-accent-blue hover:bg-accent-blue/90"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-light-grey">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold">BrokerAnalysis</span>
                    </div>
                    <form onSubmit={handleSearch} className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search brokers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </form>
                  </SheetHeader>
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        <Link
                          to={item.href}
                          className={`block px-4 py-2 text-base font-medium transition-colors rounded-md ${
                            isActiveRoute(item.href)
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          {item.name}
                        </Link>
                        {item.dropdown && (
                          <div className="ml-4 mt-1 space-y-1">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className="block px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="pt-4">
                      <DialogTrigger asChild>
                        <Button className="w-full bg-accent-blue text-white hover:bg-accent-blue/90">
                          <Wand2 className="w-4 h-4 mr-2" />
                          Get Recommendation
                        </Button>
                      </DialogTrigger>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}