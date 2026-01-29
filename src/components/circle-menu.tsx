'use client';

import { Icon } from '@iconify/react';
import { useState } from 'react';
import { segments } from '../utils/sidebar';

export const CircleMenu = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const createSegmentPath = (startAngle: number) => {
    const centerX = 300;
    const centerY = 300;
    const outerRadius = 280;
    const innerRadius = 120;

    const gapDeg = 6;
    const segmentDeg = 60 - gapDeg;
    const start = startAngle + gapDeg / 2;
    const end = start + segmentDeg;

    const startAngleRad = ((start - 90) * Math.PI) / 180;
    const endAngleRad = ((end - 90) * Math.PI) / 180;
    
    const x1 = centerX + innerRadius * Math.cos(startAngleRad);
    const y1 = centerY + innerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(startAngleRad);
    const y2 = centerY + outerRadius * Math.sin(startAngleRad);
    const x3 = centerX + outerRadius * Math.cos(endAngleRad);
    const y3 = centerY + outerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(endAngleRad);
    const y4 = centerY + innerRadius * Math.sin(endAngleRad);
    
    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;
  };

  return (
    <div className="relative mx-auto flex h-[600px] w-[600px] items-center justify-center">
      <svg className="absolute h-full w-full" viewBox="0 0 600 600">
        <defs>
          <filter id="circleMenuShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.18" />
          </filter>
        </defs>

        {segments.map((segment, index) => {
          const isHovered = hoveredIndex === index;
          const transform = isHovered
            ? 'translate(300 300) scale(1.03) translate(-300 -300)'
            : undefined;

          return (
            <path
              key={index}
              d={createSegmentPath(segment.angle)}
              fill={segment.color}
              style={{
                transition: 'transform 160ms ease, filter 160ms ease, opacity 160ms ease',
                cursor: 'pointer',
                transform,
                transformOrigin: '300px 300px',
                opacity: isHovered ? 1 : 0.98,
              }}
              filter={isHovered ? 'url(#circleMenuShadow)' : undefined}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </svg>

      {segments.map((segment, index) => {
        const angleRad = (segment.angle * Math.PI) / 180;
        const x = Math.cos(angleRad) * segment.radius;
        const y = Math.sin(angleRad) * segment.radius;

        return (
          <div
            key={index}
            className="absolute z-10 flex flex-col items-center gap-2"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
              <Icon icon={segment.icon} className="h-6 w-6 text-white" style={{ color: '#226730' }} />
            </div>
            <span className="text-sm font-semibold text-white">{segment.label}</span>
          </div>
        );
      })}

      <div className="absolute z-10 flex items-center justify-center">
        <img
          src="/images/round.png"
          alt="Center"
          className="h-64 w-64 object-contain"
          draggable={false}
        />
      </div>

      <div className="absolute z-20 flex items-center justify-center">
        <img
          src="/images/logoKanga.png"
          alt="Kangaroo Logo"
          className="h-28 w-28 object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
};
