import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight, Star } from 'lucide-react'

export function ModernHero() {
  return (
    <div className="hero-background min-h-screen flex flex-col items-center justify-center relative">
      {/* Spotlight Effect */}
      <div className="hero-spotlight"></div>
      
      {/* Decorative Background Cards */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left side cards */}
        <div className="decor-card decor-card-left absolute left-8 top-1/4 w-64 h-40 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1621629057099-c7cf1fb8ca1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwZGFzaGJvYXJkJTIwY2hhcnRzJTIwaW50ZXJmYWNlJTIwZmluYW5jaWFsfGVufDB8MHx8fDE3NTUzOTc0MTZ8MA&ixlib=rb-4.1.0&q=85"
            alt="Modern trading interface dashboard with charts and data, dark theme, blurred background element - Sajad Nori on Unsplash"
            className="w-full h-full object-cover"
            style={{ width: '256px', height: '160px' }}
          />
        </div>
        
        <div className="decor-card decor-card-left absolute left-16 bottom-1/4 w-48 h-32 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1742076553114-cfd4f27de46f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxMHx8ZmluYW5jaWFsJTIwY2hhcnQlMjBjYW5kbGVzdGljayUyMHRyYWRpbmclMjBncmFwaHxlbnwwfDF8fHwxNzU1Mzk3NDE2fDA&ixlib=rb-4.1.0&q=85"
            alt="Financial chart with candlesticks and indicators, modern interface, dark background - Скачко Виталий on Unsplash"
            className="w-full h-full object-cover"
            style={{ width: '192px', height: '128px' }}
          />
        </div>

        {/* Right side cards */}
        <div className="decor-card decor-card-right absolute right-8 top-1/3 w-56 h-36 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1635236190542-d43e4d4b9e4b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHx0cmFkaW5nJTIwZGFzaGJvYXJkJTIwY2hhcnRzJTIwaW50ZXJmYWNlJTIwZmluYW5jaWFsfGVufDB8MHx8fDE3NTUzOTc0MTZ8MA&ixlib=rb-4.1.0&q=85"
            alt="Modern trading interface dashboard with charts and data, dark theme, blurred background element - rc.xyz NFT gallery on Unsplash"
            className="w-full h-full object-cover"
            style={{ width: '224px', height: '144px' }}
          />
        </div>

        <div className="decor-card decor-card-right absolute right-12 bottom-1/3 w-52 h-32 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1642751226315-e6dc6b47fd54?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHxmaW5hbmNpYWwlMjBjaGFydCUyMGNhbmRsZXN0aWNrJTIwdHJhZGluZyUyMGdyYXBofGVufDB8MXx8fDE3NTUzOTc0MTZ8MA&ixlib=rb-4.1.0&q=85"
            alt="Financial chart with candlesticks and indicators, modern interface, dark background - Niranjan _ Photographs on Unsplash"
            className="w-full h-full object-cover"
            style={{ width: '208px', height: '128px' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
        {/* Micro Pill */}
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
          <span className="text-white/70 text-sm font-medium">Manage projects end-to-end</span>
          <ArrowRight size={14} className="text-white/70" />
        </div>

        {/* Hero Heading */}
        <h1 className="text-hero text-white mb-6">
          Learn, Trade, Profit<br />
          Repeat This
        </h1>

        {/* Subheading */}
        <p className="text-xl text-white/75 mb-8 max-w-2xl mx-auto leading-relaxed">
          Create a clear roadmap, track progress, and smoothly guide your
          project from idea to successful launch.
        </p>

        {/* CTA Button */}
        <a href="/get-started" className="btn-cta inline-flex items-center space-x-2">
          <span>Get Funded Now</span>
        </a>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-4 mt-8 trust-strip">
          <span className="text-white/60 text-sm font-medium">Excellent</span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-accent-green fill-current" />
            ))}
          </div>
          <span className="text-white/60 text-sm">436 reviews on</span>
          <img
            src="https://images.unsplash.com/photo-1650814222184-eae8b5a083f1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHx0cnVzdHBpbG90JTIwbG9nbyUyMGJyYW5kfGVufDB8MHx8d2hpdGV8MTc1NTM5NzQxNnww&ixlib=rb-4.1.0&q=85"
            alt="Trustpilot brand logo in white or light color for dark background - Mohammad Hosein Qaedi on Unsplash"
            className="h-4 opacity-60"
            style={{ width: 'auto', height: '16px' }}
          />
        </div>
      </div>

      {/* Brand Logos Strip */}
      <div className="absolute bottom-32 left-0 right-0 trust-strip">
        <div className="flex items-center justify-center space-x-12 max-w-4xl mx-auto px-6">
          <img
            src="https://images.unsplash.com/photo-1659560893493-9b565e1a26a5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxsb2dvcyUyMGJyYW5kcyUyMGZpbmFuY2lhbCUyMHRyYWRpbmclMjBwbGF0Zm9ybXN8ZW58MHwwfHx3aGl0ZXwxNzU1Mzk3NDE3fDA&ixlib=rb-4.1.0&q=85"
            alt="Collection of financial and trading platform logos in white/light colors for dark background - 2H Media on Unsplash"
            className="h-8 opacity-20"
            style={{ width: 'auto', height: '32px' }}
          />
        </div>
      </div>

      {/* Bottom Emblem Section */}
      <div className="absolute bottom-16 left-0 right-0">
        <div className="emblem-platform">
          <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">QT</span>
          </div>
        </div>
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 noise-texture pointer-events-none opacity-30"></div>
    </div>
  )
}