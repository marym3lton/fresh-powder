import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { ResortCard } from '../components/ResortCard';
import { mockResorts } from '../data/mockResorts';
export function ResortWeatherApp() {
  const [selectedState, setSelectedState] = useState('Colorado');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const sortedResorts = [...mockResorts].sort((a, b) => b.uxIndex - a.uxIndex);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);
  
  return <div className="min-h-screen bg-[#F8F9FA] text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Artistic Header */}
      <header className="pt-20 pb-12 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-4">
              FRESH POW
            </h1>
            <p className="text-xl font-medium text-slate-500 max-w-md">
              Real-time conditions for snow sport enthusiasts.
            </p>
          </div>

          {/* State Selector */}
          <div className="w-full md:w-auto">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full md:w-80 bg-transparent border-b-2 border-slate-200 py-4 text-xl font-bold text-slate-900 focus:outline-none focus:border-slate-900 transition-colors uppercase tracking-wide text-left flex items-center justify-between"
              >
                {selectedState}
                <ChevronDown className={`w-6 h-6 text-slate-900 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setSelectedState('Colorado');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-6 py-4 text-left text-lg font-bold uppercase tracking-wide hover:bg-slate-50 transition-colors text-slate-900"
                  >
                    Colorado
                  </button>
                  
                  <div className="relative">
                    <button
                      disabled
                      className="w-full px-6 py-4 text-left text-lg font-bold uppercase tracking-wide text-slate-300 cursor-not-allowed bg-slate-50/50 flex items-center justify-between"
                    >
                      Utah
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold tracking-wide shadow-lg">
                        COMING SOON
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="px-6 md:px-12 pb-24 max-w-[1600px] mx-auto">
        {sortedResorts.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
            {sortedResorts.map((resort, index) => <div key={resort.id} className="transform transition-all duration-500 hover:-translate-y-2" style={{
          transitionDelay: `${index * 50}ms`
        }}>
                <ResortCard resort={resort} />
              </div>)}
          </div> : <div className="py-32 text-center">
            <h3 className="text-4xl font-black text-slate-200 uppercase tracking-tighter">
              No Peaks Found
            </h3>
          </div>}
      </main>

      {/* Minimal Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-slate-200 max-w-[1600px] mx-auto flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
        <span>Colorado, USA</span>
        <span>© 2024 Alpine Report</span>
      </footer>
    </div>;
}

