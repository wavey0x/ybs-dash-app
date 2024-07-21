import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import WeekBlocks from './WeekBlocks';

const UserInfoModal = ({ isOpen, onRequestClose, userInfo, onWeekChange }) => {
  const [currentWeekId, setCurrentWeekId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setCurrentWeekId(userInfo.week_id);
    }
  }, [userInfo]);

  const changeWeek = async (direction) => {
    const newWeekId = direction === 'prev' ? currentWeekId - 1 : currentWeekId + 1;
    setCurrentWeekId(newWeekId);
    setLoading(true);
    await onWeekChange(userInfo.account, newWeekId);
    setLoading(false);
  };

  const formatDateRange = (startTs) => {
    const startDate = new Date(startTs * 1000).toLocaleDateString({
      month: '2-digit',
      day: '2-digit',
    });
    const endDate = new Date((startTs + 6 * 86400) * 1000).toLocaleDateString({
      month: '2-digit',
      day: '2-digit',
    });
    return `${startDate} --> ${endDate}`;
  };

  if (!userInfo) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
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
        <button onClick={() => changeWeek('prev')} disabled={currentWeekId === 0}>{'<'}</button>
        <span>Week {currentWeekId}</span>
        <button onClick={() => changeWeek('next')}>{'>'}</button>
      </div>
      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        <div>
          <h4>{userInfo.account}</h4>
          <p>
        {formatDateRange(userInfo.start_ts)}
          </p>
          <p>Balance: {Number(userInfo.user_balance).toLocaleString(2)}</p>
          <p>Weight: {Number(userInfo.user_weight).toLocaleString(2)}</p>
          <p>Boost: {Number(userInfo.user_boost).toLocaleString(4)}x</p>
          <WeekBlocks userInfo={userInfo} />
        </div>
      )}
    </Modal>
  );
};

export default UserInfoModal;
