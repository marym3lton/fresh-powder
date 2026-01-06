import React from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, CloudSun } from 'lucide-react';
import { WeatherCondition } from '../types/resort';
interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
export function WeatherIcon({
  condition,
  className = '',
  size = 'md'
}: WeatherIconProps) {
  // Size mapping
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-48 h-48'
  };
  // Artistic gradient definitions based on condition
  const getGradient = (cond: WeatherCondition) => {
    switch (cond) {
      case 'sunny':
        return 'from-orange-400 via-red-500 to-yellow-500';
      case 'cloudy':
        return 'from-slate-300 via-slate-400 to-slate-600';
      case 'snowing':
        return 'from-blue-400 via-indigo-500 to-cyan-400';
      case 'raining':
        return 'from-blue-600 via-blue-700 to-indigo-800';
      case 'windy':
        return 'from-teal-400 via-emerald-500 to-green-600';
      case 'partly-cloudy':
        return 'from-orange-300 via-slate-400 to-blue-300';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };
  // Abstract shape rendering
  const renderAbstractShape = () => {
    const gradient = getGradient(condition);
    // Base container with gradient blob
    return <div className={`relative flex items-center justify-center ${className}`}>
        {/* Main gradient blob */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} blur-xl opacity-60 animate-pulse`} />

        {/* Secondary blob for depth */}
        <div className={`absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr ${gradient} blur-lg opacity-80`} />

        {/* Icon overlay */}
        <div className="relative z-10 drop-shadow-2xl filter">
          {renderIcon(sizeClasses[size])}
        </div>
      </div>;
  };
  const renderIcon = (sizeClass: string) => {
    const iconProps = {
      className: `${sizeClass} text-white drop-shadow-lg`,
      strokeWidth: 2.5
    };
    switch (condition) {
      case 'sunny':
        return <Sun {...iconProps} />;
      case 'cloudy':
        return <Cloud {...iconProps} fill="currentColor" className={`${sizeClass} text-white/90`} />;
      case 'snowing':
        return <CloudSnow {...iconProps} />;
      case 'raining':
        return <CloudRain {...iconProps} />;
      case 'windy':
        return <Wind {...iconProps} />;
      case 'partly-cloudy':
        return <CloudSun {...iconProps} />;
      default:
        return <Sun {...iconProps} />;
    }
  };
  return renderAbstractShape();
}

