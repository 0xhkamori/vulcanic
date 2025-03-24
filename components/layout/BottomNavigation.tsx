import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Calendar,
  GraduationCap,
  House,
  Notepad,
  ClockCounterClockwise,
  User,
  Warning,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react';
import axios from 'axios';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: House },
  { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar, checkSubstitutions: true },
  { name: 'Grades', href: '/dashboard/grades', icon: GraduationCap },
  { name: 'Homework', href: '/dashboard/homework', icon: Notepad },
  { name: 'Attendance', href: '/dashboard/attendance', icon: ClockCounterClockwise },
  { name: 'Profile', href: '/dashboard/profile', icon: User }
  // Add more items as needed - the navbar now supports scrolling
];

const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const [hasSubstitutions, setHasSubstitutions] = useState(false);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Store scroll position in session storage when navigating
  const saveScrollPosition = () => {
    if (navRef.current) {
      sessionStorage.setItem('navScrollPosition', String(navRef.current.scrollLeft));
    }
  };

  // Check scroll buttons visibility
  const checkScrollButtons = () => {
    if (!navRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
    setShowLeftScroll(scrollLeft > 10);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Scroll handlers
  const scrollLeft = () => {
    if (!navRef.current) return;
    navRef.current.scrollBy({ left: -100, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!navRef.current) return;
    navRef.current.scrollBy({ left: 100, behavior: 'smooth' });
  };

  // Scroll active tab into view
  const scrollActiveTabIntoView = () => {
    if (!navRef.current) return;
    
    setTimeout(() => {
      const navElement = navRef.current;
      if (!navElement) return;
      
      const activeTab = navElement.querySelector('.bg-primary\\/20');
      if (!activeTab) return;
      
      const navRect = navElement.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      
      // Check if active tab is not fully visible
      if (tabRect.left < navRect.left || tabRect.right > navRect.right) {
        // Get tab's position relative to its container
        const tabOffsetLeft = tabRect.left - navRect.left + navElement.scrollLeft;
        // Center the tab
        const scrollPosition = tabOffsetLeft - (navRect.width / 2) + (tabRect.width / 2);
        
        navElement.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
      
      checkScrollButtons();
    }, 100);
  };

  // Restore scroll position on component mount
  useEffect(() => {
    if (navRef.current) {
      const savedPosition = sessionStorage.getItem('navScrollPosition');
      if (savedPosition) {
        navRef.current.scrollLeft = Number(savedPosition);
        // Check if scroll buttons should be shown after restoring position
        checkScrollButtons();
      } else {
        // If no saved position, ensure active tab is visible
        scrollActiveTabIntoView();
      }
    }
  }, []);

  // Scroll active tab into view when route changes
  useEffect(() => {
    scrollActiveTabIntoView();
  }, [router.pathname]);

  // Set up scroll event listeners
  useEffect(() => {
    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      
      // Initial check
      checkScrollButtons();
      
      return () => {
        navElement.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  // Log current path for debugging
  useEffect(() => {
    console.log('Current path:', router.pathname);
  }, [router.pathname]);

  // Check if there are substitutions for today
  useEffect(() => {
    const checkTodaySubstitutions = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const response = await axios.get(`/api/vulcan/substitutions?startDate=${dateStr}&endDate=${dateStr}`);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log('Found substitutions for today:', response.data.length);
          setHasSubstitutions(true);
        } else {
          setHasSubstitutions(false);
        }
      } catch (error) {
        console.error('Error checking substitutions:', error);
        setHasSubstitutions(false);
      }
    };
    
    checkTodaySubstitutions();
  }, []);

  // Handle navigation safely
  const handleNavigation = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Safety check - if already on this page, don't navigate
    if (router.pathname === href) {
      return;
    }
    
    // Save the current scroll position before navigating
    saveScrollPosition();
    
    // Wrap in try/catch to prevent any errors during navigation
    try {
      // Add a class to the body to indicate navigation is in progress
      if (typeof document !== 'undefined') {
        document.body.classList.add('navigating');
      }
      
      // Disable error reporting during navigation
      const originalOnError = window.onerror;
      window.onerror = (message) => {
        if (message === 'Component unmounted' || String(message).includes('unmounted')) {
          console.log('Suppressed navigation error:', message);
          return true;
        }
        return false;
      };
      
      // Use location.href for a cleaner navigation without client-side routing
      window.location.href = href;
      
      // Restore error handling after a delay (just in case navigation didn't complete)
      setTimeout(() => {
        window.onerror = originalOnError;
      }, 1000);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback
      window.location.href = href;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 blur-backdrop py-2 shadow-elevation">
      <div className="w-full mx-auto relative flex items-center justify-center">
        {/* Left scroll button */}
        {showLeftScroll && (
          <button 
            className="absolute left-1 z-10 p-1 bg-surface rounded-full shadow-md text-text-primary opacity-80 hover:opacity-100 transition-opacity"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <CaretLeft size={20} />
          </button>
        )}

        {/* Scrollable navigation */}
        <div 
          ref={navRef}
          className="w-full max-w-full overflow-x-auto scrollbar-hide flex items-center px-2 touch-pan-x"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <nav className="flex items-center w-max mx-auto">
            {navItems.map((item) => {
              // Determine if the current path is active
              const isActive = router.pathname === item.href || 
                               (item.href !== '/dashboard' && router.pathname.startsWith(item.href));
              
              return (
                <div key={item.name} className="relative px-1">
                  <a 
                    href={item.href}
                    className={`nav-item flex items-center py-1 px-3 mx-1 rounded-full ${isActive ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-overlay/20'}`}
                    onClick={isActive ? (e) => e.preventDefault() : handleNavigation(item.href)}
                  >
                    <span className="relative">
                      <item.icon 
                        size={20} 
                        weight={isActive ? "fill" : "regular"}
                      />
                      
                      {/* Show notification indicator for substitutions */}
                      {item.checkSubstitutions && hasSubstitutions && !isActive && (
                        <span className="absolute -top-1 -right-2 w-2 h-2 bg-warning rounded-full"></span>
                      )}
                    </span>
                    <span className="text-xs ml-2 font-medium whitespace-nowrap">{item.name}</span>
                    
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        layoutId="bottomNavIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </a>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right scroll button */}
        {showRightScroll && (
          <button 
            className="absolute right-1 z-10 p-1 bg-surface rounded-full shadow-md text-text-primary opacity-80 hover:opacity-100 transition-opacity"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <CaretRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation; 