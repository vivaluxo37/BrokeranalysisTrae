import React, { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle, ChevronRight, DollarSign, Shield, TrendingUp } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'range';
  options?: { value: string; label: string; icon?: React.ReactNode }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

type QuizAnswers = Record<string, string | string[] | number>;

interface BrokerRecommendation {
  name: string;
  logo: string;
  rating: number;
  minDeposit: string;
  spread: string;
  leverage: string;
  regulation: string;
  matchScore: number;
  reasons: string[];
  website: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'experience',
    question: 'What is your trading experience level?',
    type: 'single',
    options: [
      { value: 'beginner', label: 'Beginner (0-1 years)', icon: <TrendingUp className="w-5 h-5" /> },
      { value: 'intermediate', label: 'Intermediate (1-3 years)', icon: <BarChart3 className="w-5 h-5" /> },
      { value: 'advanced', label: 'Advanced (3+ years)', icon: <Shield className="w-5 h-5" /> }
    ]
  },
  {
    id: 'tradingStyle',
    question: 'What is your preferred trading style?',
    type: 'single',
    options: [
      { value: 'dayTrading', label: 'Day Trading (Multiple trades per day)' },
      { value: 'swingTrading', label: 'Swing Trading (Hold for days/weeks)' },
      { value: 'positionTrading', label: 'Position Trading (Hold for months)' },
      { value: 'scalping', label: 'Scalping (Very short-term trades)' }
    ]
  },
  {
    id: 'assets',
    question: 'Which assets do you want to trade? (Select all that apply)',
    type: 'multiple',
    options: [
      { value: 'forex', label: 'Forex (Currency Pairs)' },
      { value: 'stocks', label: 'Stocks & ETFs' },
      { value: 'crypto', label: 'Cryptocurrencies' },
      { value: 'commodities', label: 'Commodities (Gold, Oil, etc.)' },
      { value: 'indices', label: 'Stock Indices' },
      { value: 'cfd', label: 'CFDs' },
      { value: 'options', label: 'Options' },
      { value: 'futures', label: 'Futures' }
    ]
  },
  {
    id: 'budget',
    question: 'What is your initial trading budget?',
    type: 'range',
    min: 100,
    max: 50000,
    step: 100,
    unit: '$'
  },
  {
    id: 'riskTolerance',
    question: 'What is your risk tolerance?',
    type: 'single',
    options: [
      { value: 'low', label: 'Conservative (Low risk, steady returns)' },
      { value: 'medium', label: 'Moderate (Balanced risk and reward)' },
      { value: 'high', label: 'Aggressive (High risk, high potential returns)' }
    ]
  },
  {
    id: 'features',
    question: 'Which features are most important to you? (Select all that apply)',
    type: 'multiple',
    options: [
      { value: 'lowFees', label: 'Low Trading Fees' },
      { value: 'research', label: 'Research & Analysis Tools' },
      { value: 'education', label: 'Educational Resources' },
      { value: 'mobileApp', label: 'Mobile Trading App' },
      { value: 'customerSupport', label: '24/7 Customer Support' },
      { value: 'socialTrading', label: 'Social Trading Features' },
      { value: 'automation', label: 'Automated Trading' },
      { value: 'regulation', label: 'Strong Regulation' }
    ]
  },
  {
    id: 'platform',
    question: 'What type of trading platform do you prefer?',
    type: 'single',
    options: [
      { value: 'webBased', label: 'Web-based Platform' },
      { value: 'desktop', label: 'Desktop Application (MT4/MT5)' },
      { value: 'mobile', label: 'Mobile-first Trading' },
      { value: 'proprietary', label: 'Broker\'s Proprietary Platform' }
    ]
  }
];

const brokerRecommendations: BrokerRecommendation[] = [
  {
    name: 'IG',
    logo: '/images/brokers/ig.png',
    rating: 4.8,
    minDeposit: '$250',
    spread: '0.6 pips',
    leverage: '1:30',
    regulation: 'FCA, ASIC',
    matchScore: 0,
    reasons: [],
    website: 'https://www.ig.com'
  },
  {
    name: 'XTB',
    logo: '/images/brokers/xtb.png',
    rating: 4.7,
    minDeposit: '$100',
    spread: '0.8 pips',
    leverage: '1:30',
    regulation: 'FCA, CySEC',
    matchScore: 0,
    reasons: [],
    website: 'https://www.xtb.com'
  },
  {
    name: 'eToro',
    logo: '/images/brokers/etoro.png',
    rating: 4.6,
    minDeposit: '$200',
    spread: '1.0 pips',
    leverage: '1:30',
    regulation: 'FCA, CySEC',
    matchScore: 0,
    reasons: [],
    website: 'https://www.etoro.com'
  },
  {
    name: 'Interactive Brokers',
    logo: '/images/brokers/interactive-brokers.png',
    rating: 4.9,
    minDeposit: '$0',
    spread: '0.2 pips',
    leverage: '1:50',
    regulation: 'SEC, FCA',
    matchScore: 0,
    reasons: [],
    website: 'https://www.interactivebrokers.com'
  },
  {
    name: 'Saxo Bank',
    logo: '/images/brokers/saxo-bank.png',
    rating: 4.8,
    minDeposit: '$2000',
    spread: '0.4 pips',
    leverage: '1:30',
    regulation: 'FCA, DFSA',
    matchScore: 0,
    reasons: [],
    website: 'https://www.saxobank.com'
  }
];

const FindMyBrokerQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<BrokerRecommendation[]>([]);

  const handleAnswer = (questionId: string, answer: string | string[] | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateRecommendations();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateRecommendations = () => {
    const scoredBrokers = brokerRecommendations.map(broker => {
      let score = 0;
      const reasons: string[] = [];

      // Experience level scoring
      if (answers.experience === 'beginner') {
        if (['eToro', 'XTB'].includes(broker.name)) {
          score += 20;
          reasons.push('Beginner-friendly platform');
        }
      } else if (answers.experience === 'advanced') {
        if (['Interactive Brokers', 'Saxo Bank'].includes(broker.name)) {
          score += 20;
          reasons.push('Advanced trading tools');
        }
      }

      // Budget scoring
      const budget = answers.budget as number;
      const minDeposit = parseInt(broker.minDeposit.replace(/[^0-9]/g, ''));
      if (budget >= minDeposit) {
        score += 15;
        if (budget >= minDeposit * 2) {
          score += 5;
        }
      } else {
        score -= 10;
      }

      // Asset preferences
      const assets = answers.assets as string[];
      if (assets?.includes('crypto') && ['eToro', 'XTB'].includes(broker.name)) {
        score += 15;
        reasons.push('Crypto trading available');
      }
      if (assets?.includes('stocks') && ['Interactive Brokers', 'Saxo Bank'].includes(broker.name)) {
        score += 15;
        reasons.push('Extensive stock selection');
      }

      // Features scoring
      const features = answers.features as string[];
      if (features?.includes('lowFees') && ['Interactive Brokers'].includes(broker.name)) {
        score += 15;
        reasons.push('Low trading fees');
      }
      if (features?.includes('socialTrading') && broker.name === 'eToro') {
        score += 20;
        reasons.push('Social trading features');
      }
      if (features?.includes('regulation') && ['IG', 'Saxo Bank'].includes(broker.name)) {
        score += 10;
        reasons.push('Strong regulatory oversight');
      }

      // Risk tolerance
      if (answers.riskTolerance === 'low' && ['IG', 'Saxo Bank'].includes(broker.name)) {
        score += 10;
        reasons.push('Conservative trading options');
      }

      return {
        ...broker,
        matchScore: Math.min(100, Math.max(0, score)),
        reasons: reasons.slice(0, 3)
      };
    });

    const sortedBrokers = scoredBrokers
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    setRecommendations(sortedBrokers);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setRecommendations([]);
  };

  const renderQuestion = (question: QuizQuestion) => {
    const currentAnswer = answers[question.id];

    switch (question.type) {
      case 'single':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:border-blue-300 ${
                  currentAnswer === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                  {currentAnswer === option.value && (
                    <CheckCircle className="w-5 h-5 text-accent-blue ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'multiple':
        const multipleAnswers = (currentAnswer as string[]) || [];
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  const newAnswers = multipleAnswers.includes(option.value)
                    ? multipleAnswers.filter(a => a !== option.value)
                    : [...multipleAnswers, option.value];
                  handleAnswer(question.id, newAnswers);
                }}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:border-blue-300 ${
                  multipleAnswers.includes(option.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{option.label}</span>
                  {multipleAnswers.includes(option.value) && (
                    <CheckCircle className="w-5 h-5 text-accent-blue ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'range':
        const rangeValue = (currentAnswer as number) || question.min || 0;
        return (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-3xl font-bold text-accent-blue">
                {question.unit}{rangeValue.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={question.min}
              max={question.max}
              step={question.step}
              value={rangeValue}
              onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{question.unit}{question.min?.toLocaleString()}</span>
              <span>{question.unit}{question.max?.toLocaleString()}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isCurrentQuestionAnswered = () => {
    const answer = answers[quizQuestions[currentQuestion].id];
    if (quizQuestions[currentQuestion].type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer !== undefined && answer !== null;
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>Your Broker Recommendations 2025 | Find My Broker Quiz Results</title>
          <meta name="description" content="Discover your personalized broker recommendations for 2025 based on your trading preferences, experience level, and investment goals." />
          <meta name="keywords" content="broker recommendations 2025, personalized broker selection, trading platform comparison, best brokers for me" />
          <link rel="canonical" href="https://brokeranalysis.com/tools/find-my-broker" />
        </Helmet>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Personalized Broker Recommendations 2025
              </h1>
              <p className="text-xl text-gray-600">
                Based on your preferences, here are the best brokers for you
              </p>
            </div>

            <div className="space-y-6">
              {recommendations.map((broker, index) => (
                <div key={broker.name} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        #{index + 1} Match
                      </div>
                      <img src={broker.logo} alt={broker.name} className="w-12 h-12 object-contain" />
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{broker.name}</h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(broker.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-600">({broker.rating}/5)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{broker.matchScore}% Match</div>
                      <div className="text-sm text-gray-500">Compatibility Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Min Deposit</div>
                      <div className="font-semibold">{broker.minDeposit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Spread</div>
                      <div className="font-semibold">{broker.spread}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Max Leverage</div>
                      <div className="font-semibold">{broker.leverage}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Regulation</div>
                      <div className="font-semibold">{broker.regulation}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Why this broker matches you:</h4>
                    <ul className="space-y-1">
                      {broker.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-accent-blue" />
                          <span className="text-gray-700">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <a
                      href={broker.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Visit {broker.name}
                    </a>
                    <a
                      href={`/brokers/${broker.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="border border-blue-600 text-accent-blue px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Read Review
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={resetQuiz}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Find My Broker Quiz 2025 | Personalized Broker Recommendations</title>
        <meta name="description" content="Take our comprehensive broker quiz to find the perfect trading platform for your needs in 2025. Get personalized recommendations based on your experience, budget, and trading style." />
        <meta name="keywords" content="broker quiz 2025, find my broker, broker recommendation tool, trading platform selector, best broker for me" />
        <link rel="canonical" href="https://brokeranalysis.com/tools/find-my-broker" />
        <meta property="og:title" content="Find My Broker Quiz 2025 | Personalized Broker Recommendations" />
        <meta property="og:description" content="Take our comprehensive broker quiz to find the perfect trading platform for your needs in 2025." />
        <meta property="og:url" content="https://brokeranalysis.com/tools/find-my-broker" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Find My Broker Quiz 2025" />
        <meta name="twitter:description" content="Get personalized broker recommendations based on your trading preferences and experience level." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find My Broker Quiz 2025
            </h1>
            <p className="text-xl text-gray-600">
              Answer a few questions to get personalized broker recommendations
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {quizQuestions[currentQuestion].question}
            </h2>
            {renderQuestion(quizQuestions[currentQuestion])}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextQuestion}
              disabled={!isCurrentQuestionAnswered()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                !isCurrentQuestionAnswered()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <span>{currentQuestion === quizQuestions.length - 1 ? 'Get Results' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMyBrokerQuiz;
