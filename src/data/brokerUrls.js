/**
 * Broker URLs for web scraping
 * This file contains categorized lists of broker websites for targeted scraping
 */

// Major international brokers
export const majorBrokers = [
  {
    name: 'IG Group',
    urls: [
      'https://www.ig.com/',
      'https://www.ig.com/en/forex',
      'https://www.ig.com/en/cfd-trading',
      'https://www.ig.com/en/about-us'
    ],
    region: 'UK',
    regulation: 'FCA'
  },
  {
    name: 'Plus500',
    urls: [
      'https://www.plus500.com/',
      'https://www.plus500.com/en/trading/forex',
      'https://www.plus500.com/en/trading/cfd',
      'https://www.plus500.com/en/help/aboutus'
    ],
    region: 'UK/Cyprus',
    regulation: 'FCA/CySEC'
  },
  {
    name: 'eToro',
    urls: [
      'https://www.etoro.com/',
      'https://www.etoro.com/trading/forex/',
      'https://www.etoro.com/trading/cfd/',
      'https://www.etoro.com/customer-service/about-etoro/'
    ],
    region: 'Cyprus',
    regulation: 'CySEC'
  },
  {
    name: 'XM Group',
    urls: [
      'https://www.xm.com/',
      'https://www.xm.com/forex',
      'https://www.xm.com/cfds',
      'https://www.xm.com/company'
    ],
    region: 'Cyprus',
    regulation: 'CySEC'
  },
  {
    name: 'FXCM',
    urls: [
      'https://www.fxcm.com/',
      'https://www.fxcm.com/markets/forex/',
      'https://www.fxcm.com/markets/indices/',
      'https://www.fxcm.com/about/'
    ],
    region: 'UK',
    regulation: 'FCA'
  }
];

// Regional brokers by area
export const regionalBrokers = {
  europe: [
    {
      name: 'Admiral Markets',
      urls: [
        'https://admiralmarkets.com/',
        'https://admiralmarkets.com/education',
        'https://admiralmarkets.com/trading/forex'
      ],
      region: 'Estonia',
      regulation: 'EFSA'
    },
    {
      name: 'Pepperstone',
      urls: [
        'https://pepperstone.com/',
        'https://pepperstone.com/en/trading/forex',
        'https://pepperstone.com/en/trading/cfds'
      ],
      region: 'UK/Australia',
      regulation: 'FCA/ASIC'
    }
  ],
  
  asia: [
    {
      name: 'OANDA',
      urls: [
        'https://www.oanda.com/',
        'https://www.oanda.com/forex-trading/',
        'https://www.oanda.com/trading/platforms/'
      ],
      region: 'Singapore/Japan',
      regulation: 'MAS/FSA'
    },
    {
      name: 'IC Markets',
      urls: [
        'https://www.icmarkets.com/',
        'https://www.icmarkets.com/global/en/trading/forex',
        'https://www.icmarkets.com/global/en/trading/cfds'
      ],
      region: 'Australia',
      regulation: 'ASIC'
    }
  ],
  
  americas: [
    {
      name: 'Interactive Brokers',
      urls: [
        'https://www.interactivebrokers.com/',
        'https://www.interactivebrokers.com/en/trading/products-forex.php',
        'https://www.interactivebrokers.com/en/trading/products-stocks.php'
      ],
      region: 'USA',
      regulation: 'SEC/FINRA'
    },
    {
      name: 'TD Ameritrade',
      urls: [
        'https://www.tdameritrade.com/',
        'https://www.tdameritrade.com/investment-products/forex-trading.html',
        'https://www.tdameritrade.com/why-td-ameritrade.html'
      ],
      region: 'USA',
      regulation: 'SEC/FINRA'
    }
  ]
};

// Broker review and comparison sites
export const reviewSites = [
  {
    name: 'ForexBrokers.com',
    urls: [
      'https://www.forexbrokers.com/',
      'https://www.forexbrokers.com/guides/best-forex-brokers',
      'https://www.forexbrokers.com/reviews'
    ],
    type: 'review_aggregator'
  },
  {
    name: 'BrokerChooser',
    urls: [
      'https://brokerchooser.com/',
      'https://brokerchooser.com/broker-reviews',
      'https://brokerchooser.com/compare'
    ],
    type: 'comparison_site'
  },
  {
    name: 'Investopedia Broker Reviews',
    urls: [
      'https://www.investopedia.com/best-online-brokers-4587872',
      'https://www.investopedia.com/best-forex-brokers-4770046'
    ],
    type: 'educational_reviews'
  }
];

// Regulatory and news sites
export const regulatorySites = [
  {
    name: 'FCA (UK)',
    urls: [
      'https://www.fca.org.uk/',
      'https://www.fca.org.uk/firms/financial-services-register'
    ],
    type: 'regulator',
    region: 'UK'
  },
  {
    name: 'CySEC (Cyprus)',
    urls: [
      'https://www.cysec.gov.cy/',
      'https://www.cysec.gov.cy/en-GB/entities/investment-firms/'
    ],
    type: 'regulator',
    region: 'Cyprus'
  },
  {
    name: 'ASIC (Australia)',
    urls: [
      'https://asic.gov.au/',
      'https://download.asic.gov.au/media/'
    ],
    type: 'regulator',
    region: 'Australia'
  }
];

// News and analysis sites
export const newsSites = [
  {
    name: 'ForexLive',
    urls: [
      'https://www.forexlive.com/',
      'https://www.forexlive.com/news/'
    ],
    type: 'news'
  },
  {
    name: 'Finance Magnates',
    urls: [
      'https://www.financemagnates.com/',
      'https://www.financemagnates.com/forex/'
    ],
    type: 'industry_news'
  }
];

// Scraping configuration for different site types
export const scrapingConfig = {
  brokers: {
    delay: 2000, // 2 second delay between requests
    timeout: 30000, // 30 second timeout
    retries: 3,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    extractors: {
      regulation: true,
      spreads: true,
      platforms: true,
      instruments: true,
      contact: true,
      ratings: true
    }
  },
  
  reviews: {
    delay: 1500,
    timeout: 25000,
    retries: 2,
    extractors: {
      ratings: true,
      reviews: true,
      comparisons: true,
      pros_cons: true
    }
  },
  
  regulatory: {
    delay: 3000, // Be more respectful to regulatory sites
    timeout: 45000,
    retries: 2,
    extractors: {
      licenses: true,
      warnings: true,
      announcements: true
    }
  },
  
  news: {
    delay: 1000,
    timeout: 20000,
    retries: 2,
    extractors: {
      headlines: true,
      content: true,
      dates: true,
      authors: true
    }
  }
};

// Helper functions to get URLs by category
export function getAllBrokerUrls() {
  const urls = [];
  
  // Add major brokers
  majorBrokers.forEach(broker => {
    broker.urls.forEach(url => {
      urls.push({
        url,
        broker: broker.name,
        region: broker.region,
        regulation: broker.regulation,
        type: 'broker',
        category: 'major'
      });
    });
  });
  
  // Add regional brokers
  Object.keys(regionalBrokers).forEach(region => {
    regionalBrokers[region].forEach(broker => {
      broker.urls.forEach(url => {
        urls.push({
          url,
          broker: broker.name,
          region: broker.region,
          regulation: broker.regulation,
          type: 'broker',
          category: 'regional',
          geographic_region: region
        });
      });
    });
  });
  
  return urls;
}

export function getReviewSiteUrls() {
  const urls = [];
  
  reviewSites.forEach(site => {
    site.urls.forEach(url => {
      urls.push({
        url,
        site: site.name,
        type: site.type,
        category: 'review'
      });
    });
  });
  
  return urls;
}

export function getRegulatoryUrls() {
  const urls = [];
  
  regulatorySites.forEach(site => {
    site.urls.forEach(url => {
      urls.push({
        url,
        site: site.name,
        type: site.type,
        region: site.region,
        category: 'regulatory'
      });
    });
  });
  
  return urls;
}

export function getNewsUrls() {
  const urls = [];
  
  newsSites.forEach(site => {
    site.urls.forEach(url => {
      urls.push({
        url,
        site: site.name,
        type: site.type,
        category: 'news'
      });
    });
  });
  
  return urls;
}

export function getAllUrls() {
  return [
    ...getAllBrokerUrls(),
    ...getReviewSiteUrls(),
    ...getRegulatoryUrls(),
    ...getNewsUrls()
  ];
}

// Priority URLs for initial scraping
export function getPriorityUrls() {
  return [
    // Top 5 major brokers - main pages only
    'https://www.ig.com/',
    'https://www.plus500.com/',
    'https://www.etoro.com/',
    'https://www.xm.com/',
    'https://www.fxcm.com/',
    
    // Key review sites
    'https://www.forexbrokers.com/',
    'https://brokerchooser.com/',
    
    // Important regulatory pages
    'https://www.fca.org.uk/firms/financial-services-register',
    'https://www.cysec.gov.cy/en-GB/entities/investment-firms/'
  ].map(url => ({ url, priority: 'high', category: 'priority' }));
}

export default {
  majorBrokers,
  regionalBrokers,
  reviewSites,
  regulatorySites,
  newsSites,
  scrapingConfig,
  getAllBrokerUrls,
  getReviewSiteUrls,
  getRegulatoryUrls,
  getNewsUrls,
  getAllUrls,
  getPriorityUrls
};