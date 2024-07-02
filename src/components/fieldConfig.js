const fieldConfig = {
  token: { visible: false, label: '' },
  ybs: { visible: true, label: 'YBS' },
  decimals: { visible: true, decimals: 0, label: 'Decimals' },
  symbol: { visible: true, label: 'Symbol' },
  rewards: { visible: true, label: 'Rewards' },
  utils: { visible: true, label: 'Utils' },
  reward_token: { visible: true, label: 'Reward Token' },
  reward_token_is_v2: { visible: true, label: 'Reward Token Is V2' },
  reward_token_underlying: { visible: true, label: 'Reward Token Underlying' },
  peg_data: {
    order: [
      'pool',
      'peg_token',
      '',
      'swap_size',
      'output_amount',
      'peg',
      'pool_balances',
      'balance_peg_token',
      'balance_ylocker_token',
    ],
    pool: { visible: true, label: 'Pool' },
    peg_token: { visible: true, label: 'Peg Token' },
    swap_size: {
      visible: false,
      decimals: 0,
      label: 'Swap Size',
      isMultiplier: true,
    },
    output_amount: { visible: true, decimals: 0, label: '10k Swap Output' },
    peg: { visible: true, decimals: 2, label: 'Peg', isPct: true },
    pool_balances: {
      visible: true,
      label: 'Pool Balances',
      group: [
        { key: 'balance_peg_token', decimals: 0, isUSD: false },
        { key: 'balance_ylocker_token', decimals: 0, isUSD: false },
      ],
      separator: ' | ',
    },
    balance_peg_token: {
      visible: false,
      decimals: 2,
      label: 'Peg token balance',
    },
    balance_ylocker_token: {
      visible: false,
      decimals: 2,
      label: 'yToken balance',
    },
  },
  strategy_data: {
    order: [
      'is_v2',
      'autocompounder',
      'strategy',
      'reward_token',
      '',
      'unsold_rewards',
      'profit_release_data',
      'swap_limits',
      'swap_min',
      'swap_max',
      'swap_min_usd',
      'swap_max_usd',
      'reward_token_decimals',
      'price_per_share_autocompounder',
      'price_per_share_reward_token',
      'claimable_rewards',
      'harvest_trigger',
      'credit',
    ],
    is_v2: { visible: false, label: 'Is V2' },
    autocompounder: { visible: true, label: 'Auto-compounder' },
    strategy: { visible: true, label: 'Strategy' },
    reward_token: { visible: true, label: 'Reward Token' },
    unsold_rewards: { visible: true, decimals: 2, label: 'Unsold Rewards' },
    profit_release_data: {
      unlock_rate: {
        visible: true,
        decimals: 4,
        label: 'Unlock Rate',
        isPct: true,
      },
      unlock_date: { visible: true, label: 'Unlock Date' },
      apr: { visible: true, decimals: 2, label: 'APR', isPct: true },
    },
    swap_limits: {
      visible: true,
      label: 'Swap Min/Max USD',
      group: [
        { key: 'swap_min_usd', decimals: 0, isUSD: true },
        { key: 'swap_max_usd', decimals: 0, isUSD: true },
      ],
      separator: ' | ',
    },
    swap_min: { visible: false, decimals: 0, label: 'Swap Min' },
    swap_max: { visible: false, decimals: 0, label: 'Swap Max' },
    swap_min_usd: {
      visible: false,
      decimals: 2,
      isUSD: true,
      label: 'Swap Min USD',
    },
    swap_max_usd: {
      visible: false,
      decimals: 2,
      isUSD: true,
      label: 'Swap Max USD',
    },
    reward_token_decimals: {
      visible: false,
      decimals: 0,
      label: 'Reward Token Decimals',
    },
    price_per_share_autocompounder: {
      visible: false,
      decimals: 4,
      label: 'Autocompounder PPS',
    },
    price_per_share_reward_token: {
      visible: false,
      decimals: 4,
      label: 'Reward Token PPS',
    },
    claimable_rewards: {
      visible: true,
      decimals: 2,
      label: 'Claimable Rewards',
    },
    harvest_trigger: { visible: true, label: 'Harvest Trigger' },
    credit: { visible: true, decimals: 0, label: 'Credit' },
  },
  price_data: {
    order: [
      'visible',
      'decimals',
      'isUSD',
      'showLogo',
      'showAddress',
      'showCopyButton',
    ],
    visible: true,
    decimals: 4,
    isUSD: true,
    showLogo: true,
    showAddress: true,
    showCopyButton: true,
  },
  pipeline_data: {
    order: [
    'fee_burner',
    'splitter',
    'receiver',
    '',
      
      'split_ratio_admin_fees',
      'split_ratio_vote_incentives',
      '',
      'receiver_balance',
      'burner_balances'
    ],
    receiver_balance: { visible: true, decimals: 0, label: 'Receiver balance' },
    fee_burner: { visible: true, label: 'Fee Burner' },
    burner_balances: { visible: true, label: 'Burner Balances' },
    splitter: { visible: true, label: 'Splitter' },
    receiver: { visible: true, label: 'Receiver' },
    split_ratio_admin_fees: {
      visible: true,
      label: 'Admin Fee Splits',
      isPct: true,
    },
    split_ratio_vote_incentives: {
      visible: true,
      label: 'Vote Incentive Splits',
      isPct: true,
    },
  },
  ybs_data: {
    order: [
      'ybs',
      '',
      'start_time',
      'start_block',
      'global_weight',
      'global_balance',
      'system_avg_boost',
      '',
      'strategy_boost',
      'strategy_weight',
      'strategy_balance',
    ],
    ybs: { visible: true, label: 'ybs' },
    weekly_data: {
      start_time: { visible: true, label: 'Week Start', isTimestamp: true },
      start_block: { visible: false, decimals: 0, label: 'Start Block' },
      global_weight: { visible: true, decimals: 0, label: 'Global Weight' },
      global_balance: { visible: true, decimals: 0, label: 'Global Balance' },
      strategy_boost: {
        visible: true,
        decimals: 4,
        label: 'Strategy Boost',
        isMultiplier: true,
      },
      system_avg_boost: {
        visible: true,
        decimals: 4,
        label: 'Global Avg Boost',
        isMultiplier: true,
      },
      strategy_weight: { visible: true, decimals: 0, label: 'Strategy Weight' },
      strategy_balance: {
        visible: true,
        decimals: 0,
        label: 'Strategy Balance',
      },
    },
  },
};

export default fieldConfig;
