import { MessageCircle, Phone, Mail, Trophy, Clock, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CustomerSupport() {
  const supportMethods = [
    {
      icon: MessageCircle,
      title: 'Chat',
      description: 'Live chat support'
    },
    {
      icon: Phone,
      title: 'Call',
      description: 'Phone support'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Email support'
    }
  ]

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Support Specialist',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bgColor: 'bg-green-500'
    },
    {
      name: 'Michael Chen',
      role: 'Technical Support Lead',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Customer Success Manager',
      avatar: 'https://i.pravatar.cc/150?img=3',
      bgColor: 'bg-blue-600'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-section-title text-professional-black mb-6">
              Need Assistance?
            </h2>
            
            <h3 className="text-2xl font-bold text-professional-black mb-6">
              We've got you covered
            </h3>
            
            <p className="text-lg text-medium-grey mb-8 leading-relaxed">
              ActivTrades provides 24hr award-winning support to its customers, 
              five days a week. No matter the time or day, you can rely on our 
              highly trained support staff to assist you in 14 different languages.
            </p>

            {/* Award Badge */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-professional-black">Best Customer Service</p>
                <p className="text-sm text-medium-grey">ADVFN International Financial Awards</p>
              </div>
            </div>

            {/* Support Methods */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {supportMethods.map((method, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center space-x-2 px-6 py-3 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white"
                >
                  <method.icon size={20} />
                  <span>{method.title}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Right - Team Photos with Floating Elements */}
          <div className="relative">
            {/* Main Support Representative */}
            <div className="relative z-10 mb-8">
              <div className="bg-green-500 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="flex items-center space-x-4">
                  <img
                    src={teamMembers[0].avatar}
                    alt={`${teamMembers[0].name} - ${teamMembers[0].role}`}
                    className="w-16 h-16 rounded-full border-4 border-white"
                    style={{ width: '64px', height: '64px' }}
                  />
                  <div>
                    <h4 className="font-bold text-lg">{teamMembers[0].name}</h4>
                    <p className="opacity-90">{teamMembers[0].role}</p>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4">
                  <Clock className="w-8 h-8 opacity-30" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/20 rounded-full"></div>
              </div>
            </div>

            {/* Secondary Team Members - Floating */}
            <div className="absolute -top-4 -right-4 z-20">
              <div className="bg-blue-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={teamMembers[1].avatar}
                    alt={`${teamMembers[1].name} - ${teamMembers[1].role}`}
                    className="w-12 h-12 rounded-full border-2 border-white"
                    style={{ width: '48px', height: '48px' }}
                  />
                  <div>
                    <p className="font-semibold text-sm">{teamMembers[1].name}</p>
                    <p className="text-xs opacity-90">{teamMembers[1].role}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-4 z-20">
              <div className="bg-blue-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={teamMembers[2].avatar}
                    alt={`${teamMembers[2].name} - ${teamMembers[2].role}`}
                    className="w-12 h-12 rounded-full border-2 border-white"
                    style={{ width: '48px', height: '48px' }}
                  />
                  <div>
                    <p className="font-semibold text-sm">{teamMembers[2].name}</p>
                    <p className="text-xs opacity-90">{teamMembers[2].role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Icons */}
            <div className="absolute top-1/2 -right-8 z-15">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <Phone className="w-6 h-6" />
              </div>
            </div>

            <div className="absolute bottom-4 right-8 z-15">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white shadow-lg">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>

            <div className="absolute top-8 left-8 z-15">
              <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <Mail className="w-6 h-6" />
              </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-green-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}