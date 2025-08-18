// Mock data for the cryptocurrency landing page
import { CryptoCurrency, FAQCategory } from './enums';

export const mockStore = {
  user: null,
  isAuthenticated: false,
  theme: 'dark' as const
};

export const mockQuery = {
  cryptoPrices: [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 94595.33,
      change24h: 1.71,
      icon: 'bitcoin'
    },
    {
      id: 'solana', 
      name: 'Solana',
      symbol: 'SOL',
      price: 194.46,
      change24h: -0.65,
      icon: 'solana'
    },
    {
      id: 'dash',
      name: 'Dash', 
      symbol: 'DASH',
      price: 24.68,
      change24h: 1.71,
      icon: 'dash'
    },
    {
      id: 'xrp',
      name: 'XRP',
      symbol: 'XRP', 
      price: 2.407,
      change24h: 1.66,
      icon: 'xrp'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 2609.21,
      change24h: 1.66,
      icon: 'ethereum'
    }
  ],
  testimonials: [
    {
      id: 1,
      quote: "Cryptix makes crypto trading effortless. Fast transactions, low fees, and a sleek interface—exactly what I needed.",
      author: "Alex M.",
      position: "Blockchain Analyst at NovaChain",
      avatar: "https://i.pravatar.cc/150?img=1"
    }
  ],
  faqItems: [
    {
      id: 1,
      question: "What is Cryptix?",
      answer: "Cryptix is a comprehensive cryptocurrency trading platform that offers secure, fast, and seamless trading experiences for all major cryptocurrencies.",
      category: FAQCategory.GENERAL
    },
    {
      id: 2, 
      question: "Is Cryptix secure?",
      answer: "Yes, Cryptix uses cutting-edge security protocols and industry-leading encryption to protect your assets and personal information.",
      category: FAQCategory.SECURITY
    },
    {
      id: 3,
      question: "Which cryptocurrencies are supported?",
      answer: "We support all major cryptocurrencies including Bitcoin, Ethereum, Solana, XRP, Dash, and many more popular digital assets.",
      category: FAQCategory.GENERAL
    },
    {
      id: 4,
      question: "What are the fees for transactions?",
      answer: "We offer some of the lowest fees in the market with transparent pricing and no hidden costs.",
      category: FAQCategory.GENERAL
    },
    {
      id: 5,
      question: "How fast are transactions?",
      answer: "Transactions are processed in real-time with instant confirmations for most supported cryptocurrencies.",
      category: FAQCategory.TECHNICAL
    },
    {
      id: 6,
      question: "Do I need to verify my identity?",
      answer: "Identity verification is required for enhanced security and compliance with regulatory requirements.",
      category: FAQCategory.SECURITY
    },
    {
      id: 7,
      question: "Can I access Cryptix on mobile?",
      answer: "Yes, Cryptix is fully responsive and works seamlessly on all devices including mobile phones and tablets.",
      category: FAQCategory.TECHNICAL
    },
    {
      id: 8,
      question: "How can I contact support?",
      answer: "You can reach our support team 24/7 through live chat, email, or our comprehensive help center.",
      category: FAQCategory.SUPPORT
    }
  ]
};

export const mockRootProps = {
  initialCryptoPrices: mockQuery.cryptoPrices,
  testimonials: mockQuery.testimonials,
  faqItems: mockQuery.faqItems
};