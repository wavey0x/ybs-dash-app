import React from 'react';
import './WeekBlocks.css';  // Make sure to import the CSS for styling

const WeekBlocks = ({ userInfo }) => {
  const currentWeek = userInfo.week_id;
  const weekBlocks = [];
  const blockWidth = 60;
  const blockHeight = 50;
  const startTimestamp = userInfo.start_ts;
  const blockGap = 5;  // Reduced the gap between blocks

  for (let i = 0; i < 5; i++) {
    const weekId = currentWeek + i;
    const weekTimestamp = startTimestamp + 604800 * i;
    const date = new Date(weekTimestamp * 1000).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
    });
    const balance = Number(userInfo.stake_map[weekId]?.amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const realized = Number(userInfo.stake_map?.realized || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    // Calculate multiplier
    const multiplier = (5 - i) * 0.5;

    weekBlocks.push(
      <g key={weekId}>
        <rect
          x={i * (blockWidth + blockGap)}
          y={0}
          width={blockWidth}
          height={blockHeight}
          fill="none"
          stroke={i === 0 ? 'gold' : balance ? 'black' : 'black'}
          strokeWidth={i === 0 ? '2' : '1'}
        />
        <text
          x={i * (blockWidth + blockGap) + blockWidth / 2}
          y={blockHeight / 2 - 5}
          textAnchor="middle"
          fontSize="10"
          fill="black"
        >
          {i === 0 ? realized : balance ? balance : ''}
        </text>
        <text
          x={i * (blockWidth + blockGap) + blockWidth / 2}
          y={blockHeight + 10}  // Adjust y position for multiplier
          textAnchor="middle"
          fontSize="8"
          fill="black"
          fontWeight="bold"  // Bold styling for multiplier
        >
          {multiplier}x
        </text>
        <text
          x={i * (blockWidth + blockGap) + blockWidth / 2}
          y={blockHeight + 20}  // Adjust y position for date
          textAnchor="middle"
          fontSize="8"
          fill="black"
        >
          {date}
        </text>
      </g>
    );
  }

  return <svg width="100%" height="80">{weekBlocks}</svg>;
};

export default WeekBlocks;
