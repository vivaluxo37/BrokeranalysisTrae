import { BrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { BrokerAnalysisLogo, LanguageSwitcher } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ProfessionalBadge, 
  ProfessionalProgress, 
  ProfessionalHero, 
  ProfessionalSearchFilter,
  ProfessionalCategoryCard,
  ProfessionalLearningPath,
  ProfessionalNewsletter
} from '@/components/ui/professional-components'
import { BookOpen, TrendingUp, Shield, Award, Calculator, Target } from 'lucide-react'

// Preview component to showcase all UI elements with consistent black/white/grey theme
export default function AppPreview() {
  return (
    <BrowserRouter>
      <Layout>
        <div className="min-h-screen bg-professional-black text-pure-white">
          {/* Header Preview */}
          <section className="professional-section">
            <div className="content-container">
              <h1 className="text-section-title mb-8">BrokerAnalysis - Fixed Consistent Styling</h1>
              
              {/* Logo Showcase */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-pure-white">Logo Variations (Professional Black/White)</h2>
                  <div className="flex flex-wrap items-center gap-8 p-6 bg-charcoal-grey rounded-lg">
                    <BrokerAnalysisLogo size="sm" />
                    <BrokerAnalysisLogo size="md" />
                    <BrokerAnalysisLogo size="lg" />
                    <BrokerAnalysisLogo size="xl" />
                  </div>
                </div>

                {/* Language Switcher Showcase */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-pure-white">Language Switcher (Top 15 Languages)</h2>
                  <div className="flex flex-wrap items-center gap-4 p-6 bg-charcoal-grey rounded-lg">
                    <LanguageSwitcher variant="desktop" />
                  </div>
                </div>

                {/* Professional Components Showcase */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-pure-white">Professional Components (Black/White/Grey Only)</h2>
                  
                  {/* Professional Badges */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-pure-white">Professional Badges</h3>
                    <div className="flex flex-wrap gap-3 p-4 bg-charcoal-grey rounded-lg">
                      <ProfessionalBadge variant="default">Default</ProfessionalBadge>
                      <ProfessionalBadge variant="secondary">Secondary</ProfessionalBadge>
                      <ProfessionalBadge variant="outline">Outline</ProfessionalBadge>
                      <ProfessionalBadge variant="level" level="Beginner">Beginner</ProfessionalBadge>
                      <ProfessionalBadge variant="level" level="Intermediate">Intermediate</ProfessionalBadge>
                      <ProfessionalBadge variant="level" level="Advanced">Advanced</ProfessionalBadge>
                    </div>
                  </div>

                  {/* Professional Progress */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-pure-white">Professional Progress Bars</h3>
                    <div className="space-y-4 p-4 bg-charcoal-grey rounded-lg">
                      <ProfessionalProgress value={25} showPercentage />
                      <ProfessionalProgress value={60} showPercentage />
                      <ProfessionalProgress value={90} showPercentage />
                    </div>
                  </div>

                  {/* Professional Hero */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-pure-white">Professional Hero Section</h3>
                    <ProfessionalHero
                      title="Professional Hero Example"
                      subtitle="Consistent Black/White/Grey Theme"
                      description="This hero section uses only professional colors without any bright or colorful elements."
                      icon={<BookOpen className="w-16 h-16" />}
                    >
                      <div className="flex gap-4">
                        <Button className="btn-professional-primary">Primary Action</Button>
                        <Button className="btn-professional-secondary">Secondary Action</Button>
                      </div>
                    </ProfessionalHero>
                  </div>

                  {/* Professional Search Filter */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-pure-white">Professional Search & Filter</h3>
                    <ProfessionalSearchFilter
                      searchValue=""
                      onSearchChange={() => {}}
                      filters={[
                        {
                          label: 'Level',
                          value: 'All',
                          options: ['All', 'Beginner', 'Intermediate', 'Advanced'],
                          onChange: () => {}
                        }
                      ]}
                      resultsCount={25}
                      totalCount={50}
                    />
                  </div>

                  {/* Professional Learning Path */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-pure-white">Professional Learning Path Card</h3>
                    <div className="max-w-md">
                      <ProfessionalLearningPath
                        title="Complete Beginner Path"
                        description="Start your trading journey from zero to confident trader"
                        level="Beginner"
                        duration="4-6 weeks"
                        modules={8}
                        completedModules={3}
                        icon={<BookOpen className="w-6 h-6" />}
                      />
                    </div>
                  </div>

                  {/* Professional Category Card */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-pure-white">Professional Category Card</h3>
                    <div className="max-w-md">
                      <ProfessionalCategoryCard
                        title="Trading Basics"
                        description="Essential knowledge for new traders starting their journey"
                        icon={<BookOpen className="w-10 h-10" />}
                        level="Beginner"
                        articles={[
                          { title: 'How to Choose a Broker', slug: 'broker-guide', duration: '8 min' },
                          { title: 'Understanding Spreads', slug: 'spreads-guide', duration: '6 min' },
                          { title: 'Risk Management', slug: 'risk-guide', duration: '10 min' }
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Button Showcase - Consistent Colors */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-pure-white">Consistent Button Styles (No Colors)</h2>
                  <div className="flex flex-wrap items-center gap-4 p-6 bg-charcoal-grey rounded-lg">
                    <Button className="btn-professional-primary">
                      Primary Button
                    </Button>
                    <Button className="btn-professional-secondary">
                      Secondary Button
                    </Button>
                    <Button variant="ghost" className="text-pure-white hover:text-light-grey">
                      Ghost Button
                    </Button>
                  </div>
                </div>

                {/* Card Showcase */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-pure-white">Professional Cards</h2>
                  <div className="professional-grid professional-grid-3">
                    <Card className="professional-card">
                      <CardHeader>
                        <CardTitle className="text-pure-white">Interactive Brokers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-light-grey">
                          Professional trading platform with advanced tools and low fees.
                        </p>
                        <div className="mt-4 space-y-2">
                          <ProfessionalBadge variant="level" level="Advanced">Advanced</ProfessionalBadge>
                          <Button className="btn-professional-primary w-full">
                            View Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="professional-card">
                      <CardHeader>
                        <CardTitle className="text-pure-white">eToro</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-light-grey">
                          Social trading platform perfect for beginners and copy trading.
                        </p>
                        <div className="mt-4 space-y-2">
                          <ProfessionalBadge variant="level" level="Beginner">Beginner</ProfessionalBadge>
                          <Button className="btn-professional-primary w-full">
                            View Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="professional-card">
                      <CardHeader>
                        <CardTitle className="text-pure-white">XTB</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-light-grey">
                          Award-winning broker with excellent customer service and education.
                        </p>
                        <div className="mt-4 space-y-2">
                          <ProfessionalBadge variant="level" level="Intermediate">Intermediate</ProfessionalBadge>
                          <Button className="btn-professional-primary w-full">
                            View Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Fixed Issues Summary */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-pure-white">Fixed Styling Issues</h2>
                  <div className="p-6 bg-charcoal-grey rounded-lg">
                    <ul className="space-y-2 text-light-grey">
                      <li>✅ Removed all colorful buttons (blue, green, red, purple, etc.)</li>
                      <li>✅ Converted all badges to professional black/white/grey variants</li>
                      <li>✅ Fixed progress bars to use white instead of colored fills</li>
                      <li>✅ Updated hero sections to use charcoal grey backgrounds</li>
                      <li>✅ Standardized all cards with professional styling</li>
                      <li>✅ Created reusable professional components</li>
                      <li>✅ Applied consistent black/white/grey theme throughout</li>
                      <li>✅ Fixed education pages with professional styling</li>
                      <li>✅ All icons now use monochrome colors only</li>
                    </ul>
                  </div>
                </div>

                {/* Color Palette Showcase */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-pure-white">Professional Color Palette (Only These Colors Used)</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-4 bg-professional-black border border-medium-grey rounded-lg text-center">
                      <div className="w-full h-12 bg-professional-black rounded mb-2"></div>
                      <span className="text-xs text-light-grey">Professional Black</span>
                    </div>
                    <div className="p-4 bg-charcoal-grey border border-medium-grey rounded-lg text-center">
                      <div className="w-full h-12 bg-charcoal-grey rounded mb-2"></div>
                      <span className="text-xs text-light-grey">Charcoal Grey</span>
                    </div>
                    <div className="p-4 bg-medium-grey border border-medium-grey rounded-lg text-center">
                      <div className="w-full h-12 bg-medium-grey rounded mb-2"></div>
                      <span className="text-xs text-professional-black">Medium Grey</span>
                    </div>
                    <div className="p-4 bg-light-grey border border-medium-grey rounded-lg text-center">
                      <div className="w-full h-12 bg-light-grey rounded mb-2"></div>
                      <span className="text-xs text-professional-black">Light Grey</span>
                    </div>
                    <div className="p-4 bg-pure-white border border-medium-grey rounded-lg text-center">
                      <div className="w-full h-12 bg-pure-white rounded mb-2"></div>
                      <span className="text-xs text-professional-black">Pure White</span>
                    </div>
                  </div>
                </div>

                {/* Newsletter Example */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-pure-white">Professional Newsletter Section</h2>
                  <ProfessionalNewsletter
                    title="Stay Updated with Professional Content"
                    description="Get the latest updates with our consistent, professional black and white design."
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </BrowserRouter>
  )
}
