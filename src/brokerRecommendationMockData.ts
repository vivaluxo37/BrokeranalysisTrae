// Mock data for broker recommendation wizard

export const mockStore = {
  currentStep: 1,
  totalSteps: 6,
  userPreferences: {
    country: '',
    assets: [],
    experience: '',
    feePreference: '',
    frequency: '',
    depositAmount: ''
  },
  isWizardCompleted: false
};

export const mockQuery = {
  countries: [
    { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' }
  ],
  brokerRecommendations: [
    {
      id: '1',
      name: 'Interactive Brokers',
      logo: 'https://images.unsplash.com/photo-1635241161466-541f065683ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxsb2dvJTIwZmluYW5jZSUyMHRyYWRpbmd8ZW58MHwyfHx8MTc1NTAwNTc1Nnww&ixlib=rb-4.1.0&q=85',
      rank: 1,
      score: 95
    },
    {
      id: '2', 
      name: 'TradeStation Global',
      logo: 'https://images.unsplash.com/photo-1578432850726-f75e5a710e2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxsb2dvJTIwZmluYW5jZSUyMHRyYWRpbmd8ZW58MHwyfHxibHVlfDE3NTUwMDU3NTZ8MA&ixlib=rb-4.1.0&q=85',
      rank: 2,
      score: 92
    },
    {
      id: '3',
      name: 'XTB',
      logo: 'https://images.unsplash.com/photo-1595877703399-36c7cab84925?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsb2dvJTIwZmluYW5jZSUyMHRyYWRpbmd8ZW58MHwyfHxyZWR8MTc1NTAwNTc1Nnww&ixlib=rb-4.1.0&q=85',
      rank: 3,
      score: 90
    },
    {
      id: '4',
      name: 'Trading 212',
      logo: 'https://images.unsplash.com/photo-1630565131301-2aa3beff018e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsb2dvJTIwZmluYW5jZSUyMHRyYWRpbmd8ZW58MHwyfHx8MTc1NTAwNTc1Nnww&ixlib=rb-4.1.0&q=85',
      rank: 4,
      score: 88
    },
    {
      id: '5',
      name: 'Alpaca Trading',
      logo: 'https://images.unsplash.com/photo-1537191964442-37b06a2ae991?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxsb2dvJTIwZmluYW5jZSUyMHRyYWRpbmd8ZW58MHwyfHx5ZWxsb3d8MTc1NTAwNTc1Nnww&ixlib=rb-4.1.0&q=85',
      rank: 5,
      score: 86
    },
    {
      id: '6',
      name: 'TradeZero',
      logo: 'https://images.unsplash.com/photo-1635241161466-541f065683ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxsb2dvJTIwZmluYW5jZSUyMHRyYWRpbmd8ZW58MHwyfHx8MTc1NTAwNTc1Nnww&ixlib=rb-4.1.0&q=85',
      rank: 6,
      score: 84
    },
    {
      id: '7',
      name: 'Swissquote',
      logo: 'https://images.unsplash.com/photo-1578432850726-f75e5a710e2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxsb2dvJTIwZmluYW5jZSUyMHRyYWRpbmd8ZW58MHwyfHxibHVlfDE3NTUwMDU3NTZ8MA&ixlib=rb-4.1.0&q=85',
      rank: 7,
      score: 82
    },
    {
      id: '8',
      name: 'Zacks Trade',
      logo: 'https://images.unsplash.com/photo-1595877703399-36c7cab84925?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsb2dvJTIwZmluYW5jZSUyMHRyYWRpbmd8ZW58MHwyfHxyZWR8MTc1NTAwNTc1Nnww&ixlib=rb-4.1.0&q=85',
      rank: 8,
      score: 80
    },
    {
      id: '9',
      name: 'CapTrader',
      logo: 'https://images.unsplash.com/photo-1630565131301-2aa3beff018e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsb2dvJTIwZmluYW5jZSUyMHRyYWRpbmd8ZW58MHwyfHx8MTc1NTAwNTc1Nnww&ixlib=rb-4.1.0&q=85',
      rank: 9,
      score: 78
    },
    {
      id: '10',
      name: 'MEXEM',
      logo: 'https://images.unsplash.com/photo-1537191964442-37b06a2ae991?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxsb2dvJTIwZmluYW5jZSUyMHRyYWRpbmd8ZW58MHwyfHx5ZWxsb3d8MTc1NTAwNTc1Nnww&ixlib=rb-4.1.0&q=85',
      rank: 10,
      score: 76
    }
  ]
};

export const mockRootProps = {
  onComplete: () => console.log('Wizard completed'),
  onSaveResults: () => console.log('Save results requested'),
  initialStep: 1 as const
};