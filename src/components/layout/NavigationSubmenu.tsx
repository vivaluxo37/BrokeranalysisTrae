import { Link, useLocation } from 'react-router-dom'
import { useNavigation, useRouteUtils } from '@/contexts/NavigationContext'
import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

interface NavigationSubmenuProps {
  sections: NavigationSection[]
  parentName: string
  className?: string
}

export function NavigationSubmenu({ sections, parentName, className }: NavigationSubmenuProps) {
  const location = useLocation()
  const { trackNavigation } = useNavigation()
  const { isActiveRoute } = useRouteUtils()

  return (
    <div className={cn("p-6 w-full min-w-[600px] max-w-[800px]", className)}>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section) => (
          <div key={section.title} role="group" aria-labelledby={`${section.title.replace(/\s+/g, '-').toLowerCase()}-heading`}>
            <h4 
              id={`${section.title.replace(/\s+/g, '-').toLowerCase()}-heading`}
              className="text-pure-white font-medium mb-3 text-sm uppercase tracking-wide"
            >
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.items.map((subItem) => (
                <Link
                  key={subItem.name}
                  to={subItem.href}
                  className={cn(
                    "block text-sm rounded-sm px-3 py-2 transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-charcoal-grey",
                    isActiveRoute(subItem.href) 
                      ? "text-pure-white bg-accent-blue/10 border-l-2 border-accent-blue" 
                      : "text-light-grey hover:text-pure-white hover:bg-medium-grey/20"
                  )}
                  role="menuitem"
                  onClick={() => trackNavigation({
                    type: 'navigation_click',
                    path: subItem.href,
                    previousPath: location.pathname,
                    metadata: { 
                      source: 'desktop_nav',
                      section: section.title,
                      parent: parentName
                    }
                  })}
                >
                  {subItem.name}
                  {isActiveRoute(subItem.href) && (
                    <span className="ml-2 text-xs text-accent-blue" aria-label="Current page">
                      •
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}