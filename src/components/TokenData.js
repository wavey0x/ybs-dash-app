import React, { useState, useEffect } from 'react';
import './TokenData.css';
import ErrorModal from './ErrorModal';
import UserInfoModal from './UserInfoModal';
import fieldConfig from './fieldConfig';
import {
  isEthereumAddress,
  truncateAddress,
  copyToClipboard,
  isValidUrl,
  formatValue,
} from '../utils/tokenHelpers';

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 1H1V10" stroke="gray" strokeWidth="1" />
    <path d="M4 4H13V13H4V4Z" stroke="gray" strokeWidth="1" />
  </svg>
);

const GenericERC20Icon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const TokenData = ({ token, data, tokens, setToken }) => {
  const [activeTab, setActiveTab] = useState('ybs_data');
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [activeWeekIndex, setActiveWeekIndex] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const weeklyData = data.ybs_data?.weekly_data;
    const weekIndices = weeklyData
      ? Object.keys(weeklyData)
          .map(Number)
          .sort((a, b) => b - a)
      : [];
    setActiveWeekIndex(weekIndices.length > 0 ? weekIndices[0] : null);
  }, [token, data.ybs_data?.weekly_data]);

  useEffect(() => {
    setToken(token);
  }, [token, setToken]);

  const handleSearchSubmit = async (event) => {
    if (event && event.key && event.key !== 'Enter') return;
    try {
      const weekId = activeWeekIndex;
      console.log(process.env.REACT_APP_API);
      const response = await fetch(
        `${process.env.REACT_APP_API}/ybs/user_info?account=${searchAddress}&week_id=${weekId}&ybs=${token}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result && result.length > 0) {
        setUserInfo(result[0]);
        setModalIsOpen(true);
      } else {
        setErrorMessage('No data found for the provided address and week.');
        setErrorModalIsOpen(true);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      setErrorMessage('An error occurred while fetching the data.');
      setErrorModalIsOpen(true);
    }
  };

  const handleWeekChange = async (account, newWeekId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/ybs/user_info?account=${account}&week_id=${newWeekId}&ybs=${token}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result && result.length > 0) {
        setUserInfo(result[0]);
      } else {
        setErrorMessage('No data found for the provided week.');
        setErrorModalIsOpen(true);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      setErrorMessage('An error occurred while fetching the data.');
      setErrorModalIsOpen(true);
    }
  };

  const renderGroupedFields = (groupConfig, obj) => {
    return groupConfig.group.map((field, index) => {
      const value = obj[field.key];
      const formattedValue = formatValue(value, field);
      return (
        <React.Fragment key={field.key}>
          {index > 0 && (
            <span className="grouped-separator">{groupConfig.separator}</span>
          )}
          <span className="grouped-value">{formattedValue}</span>
        </React.Fragment>
      );
    });
  };

  const renderYBSData = (ybsData) => {
    if (!ybsData) {
      return <div>No YBS data available</div>;
    }

    const weeklyData = ybsData.weekly_data;
    const weekIndices = weeklyData
      ? Object.keys(weeklyData)
          .map(Number)
          .sort((a, b) => b - a)
      : [];

    if (weekIndices.length === 0 && !ybsData.ybs) {
      return <div>No weekly data available</div>;
    }

    const currentWeekData =
      activeWeekIndex !== null ? weeklyData[activeWeekIndex] : {};
    const orderedFields = fieldConfig.ybs_data.order;

    const changeWeek = (direction) => {
      const currentIndex = weekIndices.indexOf(activeWeekIndex);
      const newIndex =
        direction === 'prev' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= 0 && newIndex < weekIndices.length) {
        setActiveWeekIndex(weekIndices[newIndex]);
      }
    };

    return (
      <div className="ybs-data-container">
        {weekIndices.length > 0 && (
          <div className="week-selector">
            <button
              onClick={() => changeWeek('prev')}
              disabled={
                weekIndices.indexOf(activeWeekIndex) === weekIndices.length - 1
              }
            >
              &lt;
            </button>
            <span>Week {activeWeekIndex}</span>
            <button
              onClick={() => changeWeek('next')}
              disabled={weekIndices.indexOf(activeWeekIndex) === 0}
            >
              &gt;
            </button>
          </div>
        )}
        <div className="ybs-data">
          {orderedFields.map((key, index) => {
            if (key === 'order') return null; // Skip the order key
            const config =
              fieldConfig?.ybs_data?.[key] ||
              fieldConfig?.ybs_data?.weekly_data?.[key];
            if (!config) {
              // Render separator
              return (
                <div key={`separator-${index}`} className="data-separator">
                  <span className="separator-text">{key}</span>
                  <hr />
                </div>
              );
            }
            if (!config.visible) return null;

            const value = config.group
              ? null
              : key === 'ybs'
              ? ybsData[key]
              : currentWeekData?.[key];
            if (value === undefined && !config.group) return null; // Skip rendering if value is undefined and it's not a group

            let formattedValue = formatValue(value, config);
            if (isEthereumAddress(value))
              formattedValue = renderValueWithCopyButton(value);
            if (config.isTimestamp) {
              formattedValue = new Date(value * 1000).toLocaleDateString();
            }

            if (config.group) {
              return (
                <div key={key} className="data-row grouped-row">
                  <div className="data-label">{config.label}:</div>
                  <div className="data-value grouped-values">
                    {renderGroupedFields(config, currentWeekData)}
                  </div>
                </div>
              );
            }

            return (
              <div key={key} className="data-row">
                <div className="data-label">{config.label}:</div>
                <div className="data-value">{formattedValue}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderValueWithCopyButton = (value) => {
    return (
      <div className="ethereum-address">
        <a
          href={`https://etherscan.io/address/${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="etherscan-link"
        >
          {truncateAddress(value)}
        </a>
        <button
          className="copy-button"
          onClick={() => copyToClipboard(value, setCopiedAddress)}
          title="Copy full address"
        >
          <CopyIcon />
        </button>
        {copiedAddress === value && (
          <span className="copied-message">Copied!</span>
        )}
      </div>
    );
  };

  const renderBurnerBalances = (burnerBalances) => {
    return (
      <div className="burner-balances-container">
        {Object.entries(burnerBalances).length === 0
          ? 'n/a'
          : Object.entries(burnerBalances).map(
              ([address, { symbol, balance }]) => (
                <div key={address} className="burner-balance-row">
                  <span className="burner-balance">
                    {Number(balance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="burner-token"> {symbol}</span>
                </div>
              )
            )}
      </div>
    );
  };

  const renderPipelineData = (pipelineData) => {
    const orderedFields = fieldConfig.pipeline_data.order;

    return (
      <div className="data-container">
        {orderedFields.map((key, index) => {
          if (key === 'order') return null; // Skip the order key
          const config = fieldConfig.pipeline_data[key];
          if (!config) {
            // Render separator
            return (
              <div key={`separator-${index}`} className="data-separator">
                <span className="separator-text">{key}</span>
              </div>
            );
          }
          if (!config.visible) return null;

          const label =
            config.label ||
            key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

          const value = pipelineData[key];
          let formattedValue = formatValue(value, config);
          if (isEthereumAddress(value))
            formattedValue = renderValueWithCopyButton(value);

          if (Array.isArray(value)) {
            const d = config.decimals === null ? 2 : config.decimals;
            formattedValue = value
              .map((v) => `${(v * 100).toFixed(d)}%`)
              .join(' | ');
          }

          if (key === 'burner_balances' && typeof value === 'object') {
            formattedValue = renderBurnerBalances(value);
          }
          if (key === 'receiver_balance') {
            formattedValue = formattedValue + ' crvUSD';
          }

          return (
            <div key={key} className="data-row">
              <div className="data-label">{label}:</div>
              <div className="data-value">{formattedValue}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderData = (obj, section) => {
    if (!fieldConfig[section]) return <div>No data available</div>;

    if (section === 'ybs_data') {
      return renderYBSData(obj);
    }

    if (section === 'price_data') {
      const config = fieldConfig.price_data;
      return (
        <div className="price-data-container">
          {Object.entries(obj).map(([address, tokenData]) => {
            const { symbol, logoURI, price } = tokenData;

            return (
              <div key={address} className="price-data-row">
                {config.showLogo && (
                  <div className="token-logo-container">
                    {isValidUrl(logoURI) ? (
                      <img
                        src={logoURI}
                        alt={symbol}
                        className="token-logo"
                        onError={(e) =>
                          e.target.replaceWith(GenericERC20Icon())
                        }
                      />
                    ) : (
                      <GenericERC20Icon />
                    )}
                  </div>
                )}
                <span className="token-symbol">{symbol}</span>
                <span className="token-price">
                  $
                  {Number(price).toLocaleString(undefined, {
                    minimumFractionDigits: config.decimals,
                    maximumFractionDigits: config.decimals,
                  })}
                </span>
                {config.showAddress && (
                  <div className="token-address-container">
                    {renderValueWithCopyButton(address)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (section === 'pipeline_data') {
      return renderPipelineData(obj);
    }

    const orderedFields =
      fieldConfig[section]?.order || Object.keys(fieldConfig[section]);

      return (
        <div className="data-container">
          {orderedFields.map((key) => {
            if (key === 'order') return null; // Skip the order key
            const config = fieldConfig[section][key];
            if (!config) {
              // Render separator
              return (
                <div key={`separator-${key}`} className="data-separator">
                  <span className="separator-text">{key}</span>
                  <hr />
                </div>
              );
            }
            if (!config.visible) return null;
      
            const label =
              config.label ||
              key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      
            if (config.group) {
              return (
                <div key={key} className="data-row grouped-row">
                  <div className="data-label">{label}:</div>
                  <div className="data-value grouped-values">
                    {renderGroupedFields(config, obj)}
                  </div>
                </div>
              );
            }
      
            const value = obj[key];
            let formattedValue = formatValue(value, config);
      
            if (Array.isArray(value) && config.isPct) {
              const d = config.decimals === null ? 2 : config.decimals;
              formattedValue = value
                .map((v) => `${(v * 100).toFixed(d)}%`)
                .join(' | ');
            }
      
            if (typeof value === 'object' && value !== null) {
              return (
                <React.Fragment key={key}>
                  <div className="data-label">{label}</div>
                  <div className="data-value">{renderData(value, key)}</div>
                </React.Fragment>
              );
            }
      
            return (
              <div key={key} className="data-row">
                <div className="data-label">{label}:</div>
                <div className="data-value">
                  {isEthereumAddress(value)
                    ? renderValueWithCopyButton(value)
                    : formattedValue}
                </div>
              </div>
            );
          })}
        </div>
      );
      
  };

  // Determine if the Pipeline tab should be shown based on localStorage
  const isAdmin = localStorage.getItem('admin') === 'admin';
  const tabs = [
    'ybs_data',
    'strategy_data',
    'peg_data',
    'price_data',
    ...(isAdmin && Object.keys(data.pipeline_data || {}).length > 0
      ? ['pipeline_data']
      : []),
  ];

  return (
    <div className="token-data">
      <h2 className="token-header">
        <span className="token-symbol">{data.symbol} </span>
        <span className="token-address">
          {renderValueWithCopyButton(token)}
        </span>
      </h2>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'ybs_data'
              ? 'YBS'
              : tab
                  .replace(/_data/g, '')
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {renderData(data[activeTab] || {}, activeTab)}
      </div>
      <div className="search-container">
        <div className="search-input-wrapper">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Input user address..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyPress={(e) => handleSearchSubmit(e)}
            className="minimalist-input"
          />
          <button className="search-button" onClick={handleSearchSubmit}>
            &gt;
          </button>
        </div>
      </div>
      <UserInfoModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        userInfo={userInfo}
        onWeekChange={handleWeekChange}
      />
      <ErrorModal
        isOpen={errorModalIsOpen}
        onRequestClose={() => setErrorModalIsOpen(false)}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default TokenData;