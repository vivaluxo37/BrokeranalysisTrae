import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const BrokerHeader: React.FC = () => {
  return (
    <header className="bg-professional-black border-b border-medium-grey sticky top-0 z-50">
      <div className="content-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-pure-white">
              BROKER<span className="text-accent-blue">CHOOSER</span>
            </h1>
          </div>

          {/* Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="flex items-center space-x-6">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-light-grey hover:text-pure-white">
                  Best brokers
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-96 p-4">
                    <div className="space-y-2">
                      <NavigationMenuLink className="block p-2 hover:bg-charcoal-grey rounded">
                        Best Overall Brokers
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block p-2 hover:bg-charcoal-grey rounded">
                        Best for Beginners
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block p-2 hover:bg-charcoal-grey rounded">
                        Best for Day Trading
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink className="text-light-grey hover:text-pure-white">
                  Broker reviews
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-light-grey hover:text-pure-white">
                  Tools
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-light-grey hover:text-pure-white">
                  For beginners
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-light-grey hover:text-pure-white">
                  About us
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey w-4 h-4" />
              <Input
                placeholder="Search brokers..."
                className="pl-10 w-64 bg-charcoal-grey border-medium-grey text-pure-white"
              />
            </div>

            {/* Language Selector */}
            <Select defaultValue="en">
              <SelectTrigger className="w-16 bg-charcoal-grey border-medium-grey">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="es">ES</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
                <SelectItem value="de">DE</SelectItem>
              </SelectContent>
            </Select>

            {/* CTA Button */}
            <Button className="bg-accent-blue hover:bg-blue-600 text-white font-medium">
              Match me
            </Button>
          </div>
        </div>
      </div>

      {/* Advertiser Disclosure */}
      <div className="bg-charcoal-grey border-b border-medium-grey">
        <div className="content-container">
          <div className="py-2 text-xs text-light-grey text-center">
            🛈 Advertiser disclosure
          </div>
        </div>
      </div>
    </header>
  );
};