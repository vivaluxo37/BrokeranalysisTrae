import {
  NavigationMenuItem as RadixNavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu'
import { useRouteUtils } from '@/contexts/NavigationContext'
import { NavigationSubmenu } from './NavigationSubmenu'
import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

interface NavigationMenuItemData {
  name: string
  href: string
  sections: NavigationSection[]
}

interface NavigationMenuItemProps {
  item: NavigationMenuItemData
  className?: string
}

export function NavigationMenuItem({ item, className }: NavigationMenuItemProps) {
  const { isActiveRoute } = useRouteUtils()

  // Get active navigation item class
  const getNavItemClass = (href: string, exact = false): string => {
    const baseClass = "professional-nav-item focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-professional-black rounded-md transition-colors"
    const activeClass = "text-pure-white bg-charcoal-grey/50 border-b-2 border-accent-blue"
    const inactiveClass = "text-light-grey hover:text-pure-white"
    
    return cn(baseClass, isActiveRoute(href, exact) ? activeClass : inactiveClass)
  }

  return (
    <RadixNavigationMenuItem className={className}>
      <NavigationMenuTrigger 
        className={getNavItemClass(item.href)}
        aria-expanded="false"
        aria-haspopup="true"
        data-active={isActiveRoute(item.href)}
      >
        <span className="flex items-center gap-1">
          {item.name}
          {isActiveRoute(item.href) && (
            <div className="w-1 h-1 bg-accent-blue rounded-full" aria-hidden="true" />
          )}
        </span>
      </NavigationMenuTrigger>
      <NavigationMenuContent 
        className="bg-charcoal-grey border-medium-grey shadow-xl left-0"
        role="menu"
        aria-label={`${item.name} submenu`}
      >
        <NavigationSubmenu 
          sections={item.sections}
          parentName={item.name}
        />
      </NavigationMenuContent>
    </RadixNavigationMenuItem>
  )
}
