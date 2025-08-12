import { Link, useLocation } from 'react-router-dom'
import { useNavigation, useRouteUtils } from '@/contexts/NavigationContext'
import { cn } from '@/lib/style-utils'

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

interface MobileNavigationMenuProps {
  navigation: NavigationMenuItemData[]
  onItemClick: () => void
}

export function MobileNavigationMenu({ navigation, onItemClick }: MobileNavigationMenuProps) {
  const location = useLocation()
  const { trackNavigation } = useNavigation()
  const { isActiveRoute } = useRouteUtils()

  return (
    <nav role="navigation" aria-label="Mobile navigation" className="space-y-1">
      {navigation.map((item) => (
        <div key={item.name} className="border-b border-medium-grey/30 pb-4 mb-4 last:border-b-0">
          <Link
            to={item.href}
            className={cn(
              "flex items-center justify-between py-3 px-3 text-lg font-medium rounded-md transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-professional-black",
              isActiveRoute(item.href)
                ? "text-pure-white bg-accent-blue/10 border-l-4 border-accent-blue"
                : "text-light-grey hover:text-pure-white hover:bg-charcoal-grey/50"
            )}
            onClick={() => {
              trackNavigation({
                type: 'navigation_click',
                path: item.href,
                previousPath: location.pathname,
                metadata: { 
                  source: 'mobile_nav',
                  section: item.name
                }
              })
              onItemClick()
            }}
          >
            <span>{item.name}</span>
            {isActiveRoute(item.href) && (
              <div className="w-2 h-2 bg-accent-blue rounded-full" aria-hidden="true" />
            )}
          </Link>
          
          {/* Mobile Submenu - Horizontal Grid Layout */}
          <div className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-4">
              {item.sections.map((section) => (
                <div key={section.title} className="space-y-2" role="group" aria-labelledby={`mobile-${section.title.replace(/\s+/g, '-').toLowerCase()}-heading`}>
                  <h5 
                    id={`mobile-${section.title.replace(/\s+/g, '-').toLowerCase()}-heading`}
                    className="text-light-grey text-xs font-medium mb-2 uppercase tracking-wide"
                  >
                    {section.title}
                  </h5>
                  <div className="space-y-1">
                    {section.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className={cn(
                          "block py-2 px-3 text-sm rounded-md transition-all duration-200",
                          "focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-professional-black",
                          isActiveRoute(subItem.href)
                            ? "text-pure-white bg-accent-blue/10 border-l-2 border-accent-blue"
                            : "text-light-grey hover:text-pure-white hover:bg-medium-grey/20"
                        )}
                        onClick={() => {
                          trackNavigation({
                            type: 'navigation_click',
                            path: subItem.href,
                            previousPath: location.pathname,
                            metadata: { 
                              source: 'mobile_nav',
                              section: section.title,
                              parent: item.name
                            }
                          })
                          onItemClick()
                        }}
                      >
                        <span className="flex items-center justify-between">
                          {subItem.name}
                          {isActiveRoute(subItem.href) && (
                            <span className="text-xs text-accent-blue" aria-label="Current page">
                              •
                            </span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </nav>
  )
}
