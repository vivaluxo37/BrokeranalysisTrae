import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Share2, Bookmark, Download, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Layout } from '@/components/layout/Layout'
import { SeoHead } from '@/components/common'

interface BaseToolPageProps {
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  features: string[]
  children: ReactNode
  onSave?: () => void
  onShare?: () => void
  onExport?: () => void
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'intermediate':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'advanced':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    default:
      return 'bg-medium-grey/20 text-light-grey border-medium-grey'
  }
}

export function BaseToolPage({
  title,
  description,
  category,
  difficulty,
  features,
  children,
  onSave,
  onShare,
  onExport,
  seoTitle,
  seoDescription,
  seoKeywords
}: BaseToolPageProps) {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <SeoHead
          title={seoTitle || `${title} | BrokerAnalysis Trading Tools`}
          description={seoDescription || description}
          keywords={seoKeywords || `${title.toLowerCase()}, trading tools, ${category.toLowerCase()}, broker analysis`}
        />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/community"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Tools</span>
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-gray-300 border-gray-600">
                      {category}
                    </Badge>
                    <Badge className={`text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                      {difficulty}
                    </Badge>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {title}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
                  {description}
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-gray-400 border-gray-600 hover:border-gray-500"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                {onSave && (
                  <Button
                    onClick={onSave}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save Tool
                  </Button>
                )}
                {onShare && (
                  <Button
                    onClick={onShare}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                )}
                {onExport && (
                  <Button
                    onClick={onExport}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tool Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Tool Interface</CardTitle>
                </CardHeader>
                <CardContent>
                  {children}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* How to Use */}
              <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <p className="text-gray-300">Enter your trading parameters in the form</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <p className="text-gray-300">Review the calculated results</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <p className="text-gray-300">Save or export your results for future reference</p>
                  </div>
                </CardContent>
              </Card>

              {/* Related Tools */}
              <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Related Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    to="/tools/position-calculator"
                    className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="text-white font-medium">Position Size Calculator</div>
                    <div className="text-gray-400 text-sm">Calculate optimal position sizes</div>
                  </Link>
                  <Link
                    to="/tools/pip-calculator"
                    className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="text-white font-medium">Pip Calculator</div>
                    <div className="text-gray-400 text-sm">Calculate pip values</div>
                  </Link>
                  <Link
                    to="/tools/profit-calculator"
                    className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="text-white font-medium">Profit Calculator</div>
                    <div className="text-gray-400 text-sm">Calculate potential profits</div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
