import React, { useState, useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type ChartData = {
  subject: string;
  value: number;
  fullMark: number;
};

const calculateChartData = (temperature: number, topP: number): ChartData[] => {
  const axes = {
    Creativity: (temperature * 0.6 + topP * 0.4) * 10,
    Coherence: (1 - temperature * 0.7 - (1 - topP) * 0.3) * 10,
    Consistency: (1 - temperature) * 10,
    Precision: (1 - topP * 0.8 - temperature * 0.2) * 10,
    Exploration: topP * 10,
  };

  return Object.entries(axes).map(([subject, value]) => ({
    subject,
    value: Math.max(0, Math.min(10, value)),
    fullMark: 10,
  }));
};

const FullScreenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
    />
  </svg>
);

const ExitFullScreenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25"
    />
  </svg>
);

interface ModelRadarChartProps {
  temperature: number;
  topP: number;
}

export const ModelRadarChart = ({ temperature, topP }: ModelRadarChartProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const data = useMemo(() => calculateChartData(temperature, topP), [temperature, topP]);

  const chartContainerClasses = isFullScreen
    ? 'fixed inset-0 z-50 bg-neutral-900/95 backdrop-blur-sm p-8 flex items-center justify-center'
    : 'relative w-full h-64 mt-4';

  return (
    <div className={chartContainerClasses}>
      <button
        onClick={() => setIsFullScreen(!isFullScreen)}
        className="absolute right-2 top-2 z-10 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
      >
        {isFullScreen ? <ExitFullScreenIcon /> : <FullScreenIcon />}
      </button>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data} style={{ outline: 'none' }}>
          <PolarGrid stroke="#404040" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#a3a3a3', fontSize: isFullScreen ? 16 : 12 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Model Profile"
            dataKey="value"
            stroke="#38bdf8"
            fill="#38bdf8"
            fillOpacity={0.6}
          />
          <Tooltip
            cursor={{ stroke: '#a3a3a3', strokeWidth: 1, strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: '#171717',
              borderColor: '#404040',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number) => [value.toFixed(1), 'Value']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
