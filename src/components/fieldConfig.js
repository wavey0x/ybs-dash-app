// fieldConfig.js

const fieldConfig = {
    token: { visible: false, label: "" },
    ybs: { visible: true, label: "YBS" },
    decimals: { visible: true, decimals: 0, label: "Decimals" },
    symbol: { visible: true, label: "Symbol" },
    rewards: { visible: true, label: "Rewards" },
    utils: { visible: true, label: "Utils" },
    reward_token: { visible: true, label: "Reward Token" },
    reward_token_is_v2: { visible: true, label: "Reward Token Is V2" },
    reward_token_underlying: { visible: true, label: "Reward Token Underlying" },
    peg_data: {
      peg_token: { visible: true, label: "Peg Token" },
      swap_size: { visible: true, decimals: 2, label: "Swap Size" },
      output_amount: { visible: true, decimals: 2, label: "Output Amount" },
      peg: { visible: true, decimals: 2, label: "Peg", isPct: true },
      balance_peg_token: { visible: true, decimals: 2, label: "Peg token balance" },
      balance_ylocker_token: { visible: true, decimals: 2, label: "yToken balance" }
    },
    strategy_data: {
      is_v2: { visible: false, label: "Is V2" },
      autocompounder: { visible: true, label: "Autocompounder" },
      strategy: { visible: true, label: "Strategy" },
      unsold_rewards: { visible: true, decimals: 2, label: "Unsold Rewards" },
      profit_release_data: {
        unlock_rate: { visible: true, decimals: 4, label: "Unlock Rate", isPct: true },
        unlock_date: { visible: true, label: "Unlock Date" },
        apr: { visible: true, decimals: 2, label: "APR", isPct: true }
      },
      swap_min: { visible: false, decimals: 2, label: "Swap Min" },
      swap_max: { visible: false, decimals: 2, label: "Swap Max" },
      swap_min_usd: { visible: true, decimals: 2, isUSD: true, label: "Swap Min USD" },
      swap_max_usd: { visible: true, decimals: 2, isUSD: true, label: "Swap Max USD" },
      reward_token_decimals: { visible: false, decimals: 0, label: "Reward Token Decimals" },
      reward_token: { visible: true, label: "Reward Token" },
      price_per_share_autocompounder: { visible: false, decimals: 4, label: "Autocompounder PPS" },
      price_per_share_reward_token: { visible: false, decimals: 4, label: "Reward Token PPS" },
      claimable_rewards: { visible: true, decimals: 2, label: "Claimable Rewards" },
      harvest_trigger: { visible: true, label: "Harvest Trigger" },
      credit: { visible: true, decimals: 0, label: "Credit" }
    },
    price_data: {
      visible: true,
      decimals: 4,
      isUSD: true,
      showLogo: true,
      showAddress: true,
      showCopyButton: true
    },
    pipeline_data: { visible: true, label: "Pipeline Data" }
  };
  
  export default fieldConfig;