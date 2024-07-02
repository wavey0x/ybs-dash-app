// src/utils/tokenHelpers.js

export const isEthereumAddress = (value) => {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);
};

export const truncateAddress = (address) => {
  return `${address.slice(0, 5)}...${address.slice(-3)}`;
};

export const copyToClipboard = (text, setCopiedAddress) => {
  navigator.clipboard.writeText(text).then(() => {
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000); // Reset after 2 seconds
  });
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const formatValue = (value, config) => {
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

export const getTokenLogo = (tokens, address) => {
  const tokenData = tokens[address];
  return tokenData?.logoURI && isValidUrl(tokenData.logoURI)
    ? tokenData.logoURI
    : null;
};
