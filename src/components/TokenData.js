import React, { useState, useEffect } from 'react';
import './TokenData.css';
import fieldConfig from './fieldConfig';

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 1H1V10" stroke="currentColor" strokeWidth="1" />
    <path d="M4 4H13V13H4V4Z" stroke="currentColor" strokeWidth="1" />
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

const TokenData = ({ token, data }) => {
  const [activeTab, setActiveTab] = useState('ybs_data');
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [activeWeekIndex, setActiveWeekIndex] = useState(null);

  useEffect(() => {
    // Reset activeWeekIndex when token changes
    setActiveWeekIndex(null);
  }, [token]);

  const renderGroupedFields = (groupConfig, obj) => {
    return groupConfig.group.map((field, index) => {
      const value = obj[field.key];
      const formattedValue = formatValue(value, field);
      return (
        <React.Fragment key={field.key}>
          {index > 0 && <span className="grouped-separator">{groupConfig.separator}</span>}
          <span className="grouped-value">{formattedValue}</span>
        </React.Fragment>
      );
    });
  };

  const isEthereumAddress = (value) => {
    return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-3)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000); // Reset after 2 seconds
    });
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const renderYBSData = (ybsData) => {

    if (!ybsData || !ybsData.weekly_data) {
      return <div>No YBS data available</div>;
    }

    const weeklyData = ybsData.weekly_data;
    const weekIndices = Object.keys(weeklyData).map(Number).sort((a, b) => b - a);

    if (weekIndices.length === 0) {
      return <div>No weekly data available</div>;
    }

    if (activeWeekIndex === null) {
      setActiveWeekIndex(weekIndices[0]);
      return null; // Return null to avoid rendering with null activeWeekIndex
    }

    const currentWeekData = weeklyData[activeWeekIndex];

    if (!currentWeekData) {
      return <div>No data available for the selected week</div>;
    }

    const changeWeek = (direction) => {
      const currentIndex = weekIndices.indexOf(activeWeekIndex);
      const newIndex = direction === 'prev' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= 0 && newIndex < weekIndices.length) {
        setActiveWeekIndex(weekIndices[newIndex]);
      }
    };

    return (
      <div className="ybs-data-container">
        <div className="week-selector">
          <button
            onClick={() => changeWeek('prev')}
            disabled={weekIndices.indexOf(activeWeekIndex) === weekIndices.length - 1}
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
        <div className="ybs-data">
          {Object.entries(currentWeekData).map(([key, value]) => {
            const config = fieldConfig?.ybs_data?.weekly_data?.[key];
            if (!config || !config.visible) return null;

            let formattedValue = formatValue(value, config);
            if (config.isTimestamp) {
              formattedValue = new Date(value * 1000).toLocaleString();
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
          onClick={() => copyToClipboard(value)}
          title="Copy full address"
        >
          <CopyIcon />
        </button>
        {copiedAddress === value && <span className="copied-message">Copied!</span>}
      </div>
    );
  };

  const formatValue = (value, config) => {
    if (typeof value === 'number') {
      let formattedNumber = Number(value).toLocaleString(undefined, {
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals,
      });
      if (config.isPct) {
        formattedNumber =
          (value * 100).toLocaleString(undefined, {
            minimumFractionDigits: config.decimals,
            maximumFractionDigits: config.decimals,
          }) + '%';
      } else if (config.isUSD) {
        formattedNumber = '$' + formattedNumber;
      } else if (config.isMultiplier) {
        formattedNumber += 'x';
      }
      return formattedNumber;
    } else if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    }
    return value;
  };

  const renderData = (obj, section) => {
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
                        onError={(e) => e.target.replaceWith(GenericERC20Icon())}
                      />
                    ) : (
                      <GenericERC20Icon />
                    )}
                  </div>
                )}
                <span className="token-symbol">{symbol}</span>
                <span className="token-price">
                  ${Number(price).toLocaleString(undefined, {
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
    } else {
      return (
        <div className="data-container">
          {Object.entries(fieldConfig[section] || {}).map(([key, config]) => {
            if (!config.visible) return null;

            const label = config.label || key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

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
                  {isEthereumAddress(value) ? renderValueWithCopyButton(value) : formattedValue}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  const tabs = ['ybs_data', 'strategy_data', 'peg_data', 'price_data', 'pipeline_data'];

  return (
    <div className="token-data">
      <h2 className="token-header">
        <span className="token-symbol">{data.symbol}</span>
        <span className="token-address">{renderValueWithCopyButton(token)}</span>
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
              : tab.replace(/_data/g, '').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>
      <div className="tab-content">{renderData(data[activeTab] || {}, activeTab)}</div>
    </div>
  );
};

export default TokenData;
