"use client";

import { useState } from "react";
import brazilMap from "@svg-maps/brazil";

interface MapLocation {
  id: string;
  name: string;
  path: string;
}

interface BrazilMapProps {
  stateCounts?: Record<string, number>;
  onStateSelect?: (stateId: string | null) => void;
  selectedState?: string | null;
}

const stateIdToUpper = (id: string) => id.toUpperCase();

// State centers for badge positioning (viewBox 0 0 613 639)
const stateCenters: Record<string, { x: number; y: number }> = {
  AC: { x: 50, y: 220 },
  AL: { x: 555, y: 230 },
  AM: { x: 160, y: 120 },
  AP: { x: 350, y: 70 },
  BA: { x: 490, y: 295 },
  CE: { x: 550, y: 160 },
  DF: { x: 410, y: 330 },
  ES: { x: 510, y: 395 },
  GO: { x: 380, y: 340 },
  MA: { x: 440, y: 155 },
  MG: { x: 460, y: 380 },
  MS: { x: 320, y: 410 },
  MT: { x: 280, y: 290 },
  PA: { x: 350, y: 170 },
  PB: { x: 580, y: 195 },
  PE: { x: 555, y: 215 },
  PI: { x: 485, y: 195 },
  PR: { x: 350, y: 485 },
  RJ: { x: 485, y: 445 },
  RN: { x: 575, y: 175 },
  RO: { x: 175, y: 270 },
  RR: { x: 205, y: 50 },
  RS: { x: 320, y: 565 },
  SC: { x: 360, y: 530 },
  SE: { x: 560, y: 255 },
  SP: { x: 400, y: 445 },
  TO: { x: 410, y: 260 },
};

export function getStateName(stateId: string): string {
  return (
    (brazilMap.locations as MapLocation[]).find(
      (l) => l.id === stateId.toLowerCase() || l.id.toUpperCase() === stateId
    )?.name ?? stateId
  );
}

export default function BrazilMap({
  stateCounts = {},
  onStateSelect,
  selectedState: controlledSelected,
}: BrazilMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [internalSelected, setInternalSelected] = useState<string | null>(null);

  const selectedState = controlledSelected !== undefined ? controlledSelected : internalSelected;

  function handleClick(stateId: string) {
    const upperId = stateIdToUpper(stateId);
    const newState = selectedState === upperId ? null : upperId;

    if (onStateSelect) {
      onStateSelect(newState);
    } else {
      setInternalSelected(newState);
    }
  }

  function getStateColor(stateId: string) {
    const upperId = stateIdToUpper(stateId);
    const count = stateCounts[upperId] ?? 0;
    const isHovered = hoveredState === stateId;
    const isSelected = selectedState === upperId;

    if (isSelected) return "#16530C";
    if (count > 0) return isHovered ? "#1e7a1e" : "#3da03d";
    return isHovered ? "#c8e5ce" : "#e8f5ea";
  }

  function getStrokeColor(stateId: string) {
    const upperId = stateIdToUpper(stateId);
    const isSelected = selectedState === upperId;
    return isSelected ? "#AC870F" : "rgba(255,255,255,0.7)";
  }

  return (
    <div className="relative">
      {/* Tooltip */}
      {hoveredState && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 animate-fade-in rounded-xl border border-neuro-200 bg-white px-4 py-2.5 shadow-lg shadow-neuro-200/40">
          <p className="text-sm font-semibold text-neuro-900">
            {getStateName(hoveredState)}
          </p>
          <p className="text-xs text-neuro-500">
            {stateCounts[stateIdToUpper(hoveredState)] ?? 0} profissional(is)
          </p>
        </div>
      )}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={brazilMap.viewBox}
        className="w-full max-w-lg mx-auto"
        style={{ maxHeight: "500px" }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="4"
              floodColor="#16530C"
              floodOpacity="0.15"
            />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          {(brazilMap.locations as MapLocation[]).map((location) => {
            const upperId = stateIdToUpper(location.id);
            const isSelected = selectedState === upperId;

            return (
              <path
                key={location.id}
                d={location.path}
                fill={getStateColor(location.id)}
                stroke={getStrokeColor(location.id)}
                strokeWidth={isSelected ? 2 : 0.5}
                className="cursor-pointer transition-all duration-200"
                filter={isSelected ? "url(#glow)" : undefined}
                onMouseEnter={() => setHoveredState(location.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleClick(location.id)}
              />
            );
          })}
        </g>

        {/* Badges with professional count */}
        {Object.entries(stateCounts).map(([state, count]) => {
          if (count === 0 || !stateCenters[state]) return null;

          return (
            <g key={`badge-${state}`} className="pointer-events-none">
              <circle
                cx={stateCenters[state].x}
                cy={stateCenters[state].y}
                r="14"
                fill="#AC870F"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={stateCenters[state].x}
                y={stateCenters[state].y + 4.5}
                textAnchor="middle"
                fill="white"
                fontSize="11"
                fontWeight="bold"
                fontFamily="system-ui, sans-serif"
              >
                {count}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
