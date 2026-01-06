import React from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { Resort } from '../types/resort';
import { WeatherIcon } from './WeatherIcon';
interface ResortCardProps {
  resort: Resort;
}
export function ResortCard({
  resort
}: ResortCardProps) {
  // Determine card theme based on weather
  const getTheme = () => {
    if (resort.weatherCondition === 'sunny') return 'bg-orange-50 hover:bg-orange-100 border-orange-100';
    if (resort.weatherCondition === 'snowing') return 'bg-blue-50 hover:bg-blue-100 border-blue-100';
    if (resort.weatherCondition === 'cloudy') return 'bg-slate-50 hover:bg-slate-100 border-slate-200';
    return 'bg-gray-50 hover:bg-gray-100 border-gray-200';
  };
  return <div className={`group relative overflow-hidden rounded-[2rem] border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${getTheme()} h-[420px] flex flex-col`}>
      {/* Background Weather Visual - Abstract & Large */}
      <div className="absolute right-0 top-0 opacity-40 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
        <WeatherIcon condition={resort.weatherCondition} size="xl" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full p-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-3xl font-black tracking-tighter text-slate-900 leading-none mb-2">
              {resort.name}
            </h3>
            <div className="flex items-center text-slate-500 font-medium tracking-wide text-sm uppercase">
              <MapPin className="w-3 h-3 mr-1" />
              {resort.location.split(',')[0]}
            </div>
          </div>
          <div className="bg-white/50 backdrop-blur-md p-2 rounded-full">
            <ArrowUpRight className="w-5 h-5 text-slate-900" />
          </div>
        </div>

        {/* Hero Metric: Temperature */}
        <div className="flex-1 flex flex-col justify-center items-center my-4">
          <div className="relative">
            <span className="text-[140px] leading-[0.8] font-black text-slate-900 tracking-tighter drop-shadow-sm">
              {resort.currentTemp}
            </span>
            <span className="text-5xl font-black text-slate-900 absolute top-4 -right-6">°</span>
          </div>
          <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 text-white text-sm font-bold tracking-wide shadow-lg">
            {resort.weatherCondition.toUpperCase().replace('-', ' ')}
          </div>
        </div>

        {/* Footer Metrics - Minimalist Grid */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-900/5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Snow 24h
            </span>
            <div className="flex items-baseline">
              <span className="text-2xl font-black text-slate-900">
                {resort.precip24h}
              </span>
              <span className="text-sm font-bold text-slate-400 ml-0.5">"</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              UV Index
            </span>
            <div className="flex items-baseline">
              <span className="text-2xl font-black text-slate-900">
                {resort.uvIndex}
              </span>
              <span className="text-sm font-bold text-slate-400 ml-0.5"></span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Wind
            </span>
            <div className="flex items-baseline">
              <span className="text-2xl font-black text-slate-900">
                {resort.windSpeed}
              </span>
              <span className="text-sm font-bold text-slate-400 ml-0.5">
                mph
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>;
}

