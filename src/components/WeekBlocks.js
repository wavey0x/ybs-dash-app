import React from 'react';
import './WeekBlocks.css';

const WeekBlocks = ({ userInfo }) => {
  const currentWeek = userInfo.week_id;
  const startTimestamp = userInfo.start_ts;

  const blocks = [];

  for (let i = 0; i < 5; i++) {
    const weekId = currentWeek + i;
    const weekTimestamp = startTimestamp + 604800 * i;
    const date = new Date(weekTimestamp * 1000).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
    });
    const balance = Number(
      userInfo.stake_map[weekId]?.amount || 0
    ).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const realized = Number(userInfo.stake_map?.realized || 0).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    );

    const multiplier = (5 - i) * 0.5;
    const displayValue = i === 0 ? realized : balance !== '0' ? balance : '';

    blocks.push({
      weekId,
      value: displayValue,
      multiplier,
      date,
      isRealized: i === 0,
    });
  }

  return (
    <div className="week-blocks">
      {blocks.map((block) => (
        <div
          key={block.weekId}
          className={`week-block ${block.isRealized ? 'week-block--realized' : ''}`}
        >
          <div className="week-block__value">{block.value}</div>
          <div className="week-block__multiplier">{block.multiplier}x</div>
          <div className="week-block__date">{block.date}</div>
        </div>
      ))}
    </div>
  );
};

export default WeekBlocks;
