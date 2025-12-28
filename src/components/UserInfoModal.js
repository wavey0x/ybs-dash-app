import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import WeekBlocks from './WeekBlocks';
import './UserModalInfo.css';

const UserInfoModal = ({
  isOpen,
  onRequestClose,
  userInfo,
  onWeekChange,
  isGlobal,
}) => {
  const [currentWeekId, setCurrentWeekId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setCurrentWeekId(userInfo.week_id);
    }
  }, [userInfo]);

  const changeWeek = async (direction) => {
    const newWeekId =
      direction === 'prev' ? currentWeekId - 1 : currentWeekId + 1;
    setCurrentWeekId(newWeekId);
    setLoading(true);

    const endpoint = isGlobal ? 'global_info' : 'user_info';
    const params = isGlobal
      ? { week_id: newWeekId }
      : { account: userInfo.account, week_id: newWeekId };

    await onWeekChange({ endpoint, params });

    setLoading(false);
  };

  const formatDateRange = (startTs) => {
    const startDate = new Date(startTs * 1000).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    const endDate = new Date((startTs + 6 * 86400) * 1000).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    return `${startDate} — ${endDate}`;
  };

  const formatNumber = (value) => {
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!userInfo) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      contentLabel="User Info"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <div className="modal-header">
        <button className="modal-close-button" onClick={onRequestClose}>
          &times;
        </button>
      </div>
      <div className="week-selector">
        <button
          onClick={() => changeWeek('prev')}
          disabled={currentWeekId === 0}
        >
          {'<'}
        </button>
        <span className="week-label">Week {currentWeekId}</span>
        <button onClick={() => changeWeek('next')}>{'>'}</button>
      </div>
      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        <div className="modal-content">
          <p className="date-range">{formatDateRange(userInfo.start_ts)}</p>
          <div className="user-stats">
            <div className="stat-row">
              <span className="stat-label">Balance</span>
              <span className="stat-value">{formatNumber(userInfo.balance)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Weight</span>
              <span className="stat-value">{formatNumber(userInfo.weight)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Boost</span>
              <span className="stat-value">{Number(userInfo.boost).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}x</span>
            </div>
          </div>
          <WeekBlocks userInfo={userInfo} />
        </div>
      )}
    </Modal>
  );
};

export default UserInfoModal;
