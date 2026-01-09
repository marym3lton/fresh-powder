import React, { useEffect, useRef } from 'react';
import { X, Mountain, Snowflake, Wind, Sun, Cloud, CloudSnow, CloudRain, CloudSun } from 'lucide-react';
import { Resort, DailyForecast, WeatherCondition } from '../types/resort';

interface SnowReportRailProps {
  resort: Resort | null;
  onClose: () => void;
}

function formatDayName(dateString: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date(dateString + 'T12:00:00');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

function getConditionLabel(condition: WeatherCondition): string {
  switch (condition) {
    case 'sunny': return 'Sunny';
    case 'cloudy': return 'Cloudy';
    case 'snowing': return 'Snow';
    case 'raining': return 'Rain';
    case 'windy': return 'Windy';
    case 'partly-cloudy': return 'Partly Cloudy';
    default: return 'Clear';
  }
}

function SmallWeatherIcon({ condition }: { condition: WeatherCondition }) {
  const iconClass = "w-6 h-6";
  
  switch (condition) {
    case 'sunny':
      return <Sun className={`${iconClass} text-yellow-500`} />;
    case 'cloudy':
      return <Cloud className={`${iconClass} text-slate-400`} fill="currentColor" />;
    case 'snowing':
      return <CloudSnow className={`${iconClass} text-blue-500`} />;
    case 'raining':
      return <CloudRain className={`${iconClass} text-blue-600`} />;
    case 'windy':
      return <Wind className={`${iconClass} text-teal-500`} />;
    case 'partly-cloudy':
      return <CloudSun className={`${iconClass} text-yellow-500`} />;
    default:
      return <Sun className={`${iconClass} text-yellow-500`} />;
  }
}

function ForecastRow({ forecast, index }: { forecast: DailyForecast; index: number }) {
  const dayName = formatDayName(forecast.date, index);
  const hasSnow = forecast.snowfall > 0;
  const isEvenRow = index % 2 === 0;
  
  return (
    <div className={`grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 py-3.5 px-4 ${isEvenRow ? 'bg-slate-50' : 'bg-white'}`}>
      {/* Day Name */}
      <div className="font-bold text-slate-900">
        {dayName}
      </div>
      
      {/* Weather Condition */}
      <div className="flex flex-col items-center min-w-[70px]">
        <SmallWeatherIcon condition={forecast.weatherCondition} />
        <span className="text-[10px] text-slate-500 mt-0.5">{getConditionLabel(forecast.weatherCondition)}</span>
      </div>
      
      {/* High/Low */}
      <div className="text-center min-w-[80px]">
        <span className="font-bold text-slate-900">{forecast.tempHigh}°</span>
        <span className="text-slate-400 mx-1">/</span>
        <span className="font-bold text-slate-500">{forecast.tempLow}°</span>
      </div>
      
      {/* Wind */}
      <div className="text-right min-w-[55px]">
        <span className="font-bold text-slate-700">{forecast.windSpeed}</span>
        <span className="text-slate-400 text-sm ml-0.5">mph</span>
      </div>
      
      {/* Snow */}
      <div className="text-right min-w-[45px]">
        <span className={`font-bold ${hasSnow ? 'text-blue-600' : 'text-slate-300'}`}>
          {forecast.snowfall}"
        </span>
      </div>
    </div>
  );
}

export function SnowReportRail({ resort, onClose }: SnowReportRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const isOpen = resort !== null;

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Close on click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Calculate total 7-day snowfall
  const totalSnowfall = resort?.dailyForecast?.reduce((sum, day) => sum + day.snowfall, 0) || 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
      />

      {/* Rail Panel */}
      <div
        ref={railRef}
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {resort && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="relative bg-[#F8F9FA] text-slate-900 p-6 pb-6 border-b border-slate-200">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Resort Name & Location */}
              <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tight">{resort.name}</h2>
                <p className="text-slate-500 font-medium">{resort.location}</p>
              </div>

              {/* Hero Temperature */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-start">
                  <span className="text-7xl font-black tracking-tighter leading-none">{resort.currentTemp}</span>
                  <span className="text-2xl font-black text-slate-400 mt-1">°</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-slate-400">H</span>
                      <span className="text-lg font-bold">{resort.highTemp}°</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300" />
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-slate-400">L</span>
                      <span className="text-lg font-bold text-slate-500">{resort.lowTemp}°</span>
                    </div>
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-white text-sm font-bold tracking-wide">
                    {resort.weatherCondition.toUpperCase().replace('-', ' ')}
                  </div>
                </div>
              </div>

              {/* Stats Grid - Row 1: Snow Stats */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-white rounded-xl p-3 border border-slate-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Mountain className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-black">{resort.baseSnow}</span>
                    <span className="text-sm font-bold text-slate-400 ml-0.5">"</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-slate-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Snowflake className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">24h</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-black">{resort.precip24h}</span>
                    <span className="text-sm font-bold text-slate-400 ml-0.5">"</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-slate-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Snowflake className="w-3.5 h-3.5 text-cyan-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">7-Day</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-black">{totalSnowfall.toFixed(1)}</span>
                    <span className="text-sm font-bold text-slate-400 ml-0.5">"</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid - Row 2: UV & Wind */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3 border border-slate-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sun className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UV Index</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-black">{resort.uvIndex}</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-slate-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Wind className="w-3.5 h-3.5 text-teal-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wind</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-black">{resort.windSpeed}</span>
                    <span className="text-sm font-bold text-slate-400 ml-1">mph</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast Section */}
            <div className="flex-1 overflow-y-auto">
              {resort.dailyForecast && resort.dailyForecast.length > 0 ? (
                <div>
                  {/* Table Header */}
                  <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 py-2.5 px-4 border-b border-slate-200 bg-white sticky top-0">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider col-span-2">7-Day Forecast</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center min-w-[80px]">High/Low</div>
                    <div className="min-w-[55px] flex justify-end">
                      <Wind className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-[45px] flex justify-end">
                      <Snowflake className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  
                  {/* Forecast Rows */}
                  {resort.dailyForecast.map((forecast, index) => (
                    <ForecastRow
                      key={forecast.date}
                      forecast={forecast}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Snowflake className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">Forecast data unavailable</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 p-4">
              <p className="text-xs text-slate-400 text-center">
                Weather data provided by Open-Meteo
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
