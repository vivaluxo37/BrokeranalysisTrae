import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/layout/Layout'
import { SeoHead } from '@/components/common'
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Award, 
  Globe, 
  Clock, 
  CheckCircle,
  Target,
  Heart,
  Zap,
  Star,
  Mail,
  Linkedin,
  Twitter
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function AboutPage() {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former Goldman Sachs analyst with 15+ years in financial markets',
      image: '/assets/team/sarah-johnson.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Ex-Bloomberg engineer specializing in financial data systems',
      image: '/assets/team/michael-chen.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of Research',
      bio: 'PhD in Finance, former regulatory compliance officer',
      image: '/assets/team/emma-rodriguez.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'David Kim',
      role: 'Lead Analyst',
      bio: 'CFA charterholder with expertise in broker evaluation',
      image: '/assets/team/david-kim.jpg',
      linkedin: '#',
      twitter: '#'
    }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'We provide unbiased, comprehensive broker analysis with complete transparency in our methodology.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Our platform is built for traders, by traders. We prioritize community feedback and needs.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'We continuously innovate to provide the most advanced tools and insights for modern trading.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in data accuracy, analysis quality, and user experience.'
    }
  ]

  const milestones = [
    {
      year: '2019',
      title: 'Company Founded',
      description: 'BrokerAnalysis was founded with a mission to bring transparency to broker selection.'
    },
    {
      year: '2020',
      title: '100 Brokers Listed',
      description: 'Reached our first major milestone with comprehensive analysis of 100 brokers.'
    },
    {
      year: '2021',
      title: '1M Users',
      description: 'Crossed 1 million users, becoming a trusted resource for traders worldwide.'
    },
    {
      year: '2022',
      title: 'AI Integration',
      description: 'Launched AI-powered broker matching and fraud detection systems.'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded coverage to 500+ brokers across 50+ countries.'
    },
    {
      year: '2024',
      title: 'Industry Recognition',
      description: 'Recognized as the leading broker comparison platform by major financial publications.'
    }
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <SeoHead
          title="About BrokerAnalysis | Leading Broker Comparison Platform"
          description="Learn about BrokerAnalysis - the world's most trusted broker comparison platform. Our mission, team, and commitment to transparency."
        />

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5" />
            <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
            <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Heart className="w-6 h-6 text-red-400" />
                <span className="text-red-400 font-medium text-sm uppercase tracking-wider">
                  About Us
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Empowering Traders Worldwide
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-up">
                We're on a mission to bring transparency and trust to the world of online trading 
                by providing comprehensive, unbiased broker analysis and comparison tools.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-gray-300">Brokers Analyzed</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-500/20">
                <div className="text-3xl font-bold text-green-400 mb-2">2M+</div>
                <div className="text-gray-300">Users Served</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                <div className="text-gray-300">Countries</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-600/10 to-yellow-800/10 border border-yellow-500/20">
                <div className="text-3xl font-bold text-yellow-400 mb-2">5</div>
                <div className="text-gray-300">Years Experience</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          {/* Mission Statement */}
          <Card className="mb-16 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                To democratize access to financial markets by providing traders with the tools, 
                information, and insights they need to make informed decisions about broker selection. 
                We believe that transparency and education are the foundations of successful trading.
              </p>
            </CardContent>
          </Card>

          {/* Our Values */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <value.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Our Story Timeline */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From startup to industry leader - here's how we've grown
              </p>
            </div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{milestone.year}</span>
                    </div>
                  </div>
                  <Card className="flex-1 bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-300">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Industry experts dedicated to bringing you the best broker analysis
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-12 h-12 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{member.bio}</p>
                    <div className="flex justify-center gap-3">
                      <Button variant="ghost" size="sm" className="p-2">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2">
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Why Trust Us?</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We've built our reputation on accuracy, transparency, and user trust
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-500/20">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Verified Data</h3>
                  <p className="text-gray-300 leading-relaxed">
                    All broker information is verified through multiple sources and updated regularly 
                    to ensure accuracy and reliability.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/20">
                <CardContent className="p-8 text-center">
                  <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Unbiased Reviews</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our reviews are completely independent. We don't accept payment for positive 
                    reviews or rankings from brokers.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/20">
                <CardContent className="p-8 text-center">
                  <Star className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Industry Recognition</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Recognized by leading financial publications and trusted by millions of 
                    traders worldwide.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20">
            <CardContent className="p-12 text-center">
              <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Perfect Broker?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join millions of traders who trust BrokerAnalysis to help them make informed decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Link to="/brokers">
                    Browse Brokers
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Link to="/tools">
                    Try Our Tools
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}