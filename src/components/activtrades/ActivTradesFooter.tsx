import { Facebook, Twitter, Youtube, Linkedin } from 'lucide-react'

export function ActivTradesFooter() {
  const paymentMethods = [
    'mastercard', 'bank-transfer', 'visa', 'neteller', 'skrill'
  ]

  const countries = [
    {
      flag: '🇬🇧',
      name: 'UNITED KINGDOM',
      address: 'The Loom 2-6, 14 Gower\'s Walk, London, E1 8PY',
      regulation: 'Regulated by FCA'
    },
    {
      flag: '🇧🇸',
      name: 'BAHAMAS',
      address: '209 & 210 Church Street, Sandyport, 1 P.O. Box SP 64388 Nassau, Bahamas',
      regulation: 'Regulated by SCB'
    },
    {
      flag: '🇮🇹',
      name: 'ITALY',
      address: 'Via Borgonuovo 14/16, 20121 Milano, Italia',
      regulation: 'Regulated by CMVM & registered with CONSOB'
    },
    {
      flag: '🇧🇬',
      name: 'BULGARIA',
      address: 'Bul. Bulgaria 69 1404 Sofia, Bulgaria',
      regulation: ''
    },
    {
      flag: '🇵🇹',
      name: 'PORTUGAL',
      address: 'Rua Duque de Palmela, n. 37, 1A - 1250-097 Lisboa',
      regulation: 'Regulated by CMVM'
    },
    {
      flag: '🇧🇷',
      name: 'BRASIL',
      address: 'Av. Mauro Ramos, 1512, Ático 1 e 2 Centro, Florianópolis - SC Brasil 88020-302',
      regulation: 'Regulated by Bacen'
    },
    {
      flag: '🇲🇺',
      name: 'MAURITIUS',
      address: '1st Floor River Court, 6 St. Denis Street, 11328, Port Louis, Mauritius',
      regulation: 'Regulated by FSC'
    }
  ]

  return (
    <footer className="bg-charcoal-grey text-white">
      {/* Red Bull Partnership Section */}
      <div className="bg-white py-8">
        <div className="content-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="text-professional-black font-bold text-2xl">ACTIVTRADES</span>
              <span className="text-medium-grey">/</span>
              <span className="text-professional-black font-bold text-2xl">NL</span>
              <span className="text-medium-grey text-sm">NIKOLA TSOLOV<br />OFFICIAL PARTNER</span>
            </div>
            <div className="flex-1 flex justify-end">
              <img
                src="https://images.unsplash.com/photo-1727127445534-8c1127a4418f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxmb3JtdWxhJTIwMSUyMHJhY2luZyUyMGNhciUyMHJlZCUyMGJ1bGwlMjBtb3RvcnNwb3J0fGVufDB8MHx8fDE3NTQ5NzY1OTV8MA&ixlib=rb-4.1.0&q=85"
                alt="Red Bull F1 Racing Car - Jake Banasik on Unsplash"
                className="h-24 object-contain"
                style={{ height: '96px', width: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-professional-black py-6">
        <div className="content-container">
          <div className="flex justify-center items-center space-x-8">
            {paymentMethods.map((method, index) => (
              <div key={index} className="text-white opacity-70 hover:opacity-100 transition-opacity">
                <span className="text-sm uppercase font-medium">{method}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Countries and Regulations */}
      <div className="py-12">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.map((country, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{country.flag}</span>
                  <h4 className="font-bold text-white">{country.name}</h4>
                </div>
                <p className="text-light-grey text-sm leading-relaxed">
                  {country.address}
                </p>
                {country.regulation && (
                  <p className="text-green-400 text-sm font-medium">
                    {country.regulation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-medium-grey py-8">
        <div className="content-container">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <a href="#" className="text-light-grey hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">Cookie privacy</a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">Contact us</a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">Legal Documents</a>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="text-light-grey hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Legal */}
      <div className="bg-professional-black py-8">
        <div className="content-container">
          <div className="space-y-4 text-sm text-light-grey">
            <p>© 2018 - 2025 ActivTrades Corp & ActivTrades Markets, All rights reserved</p>
            
            <div className="space-y-2">
              <p>
                CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 82% 
                of retail investor accounts lose money when trading CFDs with this provider. You should consider 
                whether you understand how CFDs work and whether you can afford to take the high risk of losing 
                your money.
              </p>
              
              <p>
                ActivTrades Markets Ltd., a Global Business Company, is a company registered in Mauritius with the 
                Licence number GB24203277, authorised and regulated by The Financial Services Commission, 
                Mauritius.
              </p>
              
              <p>
                ActivTrades Corp is authorised and regulated by The Securities Commission of the Bahamas. 
                ActivTrades Corp is an international business company registered in the Commonwealth of the 
                Bahamas, registration number 199667 B.
              </p>
              
              <p>
                ActivTrades PLC is authorised and regulated by the Financial Conduct Authority, registration number 
                434413. ActivTrades PLC is a company registered in England & Wales, registration number 05367727.
              </p>
              
              <p>
                Android is a trademark of Google Inc. Windows Mobile is a trademark of Microsoft Corporation in the 
                United States and other countries. iPhone, iPad and iPod Touch are trademarks of Apple Inc., 
                registered in the U.S. and other countries. App Store is a service mark of Apple Inc. Trademarks and 
                brands are the property of their respective owners.
              </p>
              
              <p>
                The information contained herein is not intended for distribution to residents in any country where 
                such distribution or use would contravene any local law or regulatory requirement, such as Japan, US, 
                Canada and Brazil.
              </p>
            </div>

            {/* TradingView Badge */}
            <div className="flex justify-center pt-4">
              <div className="bg-charcoal-grey px-4 py-2 rounded">
                <span className="text-white font-medium">TradingView</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}