import config from '../../config';
import Decimal from 'decimal.js';


type SwapSimulationContractResponse = {
  return_amount: string;
  spread_amount: string;
  commission_amount: string;
};

type SwapLunaToBlunaSimulationResponse = {
  contractResponse: SwapSimulationContractResponse;
  // percentageGain: number;
  price: number;
};

type SwapLunaToBlunaSimulationQueryMessage = {
  simulation: {
    offer_asset: {
      amount: string;
      info: {
        native_token: {
          denom: "uluna";
        };
      };
    };
  };
};


type IncreaseAllowanceHandleMessage = {
  increase_allowance: {
    amount: string;
    spender: typeof config.pairTokenAddress;
  };
};


type SwapBlunaToLunaSimulationResponse = {
  contractResponse: SwapSimulationContractResponse;
  // percentageLoss: number;
  price: number;
};

type SwapBlunaToLunaSimulationQueryMessage = {
  simulation: {
    offer_asset: {
      amount: string;
      info: {
        token: {
          contract_addr: typeof config.blunaTokenAddress;
        };
      };
    };
  };
};

type BlunaBalanceQueryMessage = {
  balance: {
    address: string;
  };
};

type BlunaBalanceResponse = {
  balance: string;
};


type WalletBalance = {
  uust: string;
  uluna: string;
  ubluna: string;
};

type SwapLunaHandleMessage = {
  swap: {
    offer_asset: {
      amount: string;
      info: {
        native_token: {
          denom: string;
        };
      };
    };
    max_spread: string,
    belief_price: string
  }
};

type SwapBlunaSendMsg = {
  swap: {
    belief_price: string;
    max_spread: string;
  };
};

type SwapBlunaHandleMessage = {
  send: {
    amount: string;
    contract: typeof config.pairTokenAddress;
    msg: string; // SwapBlunaToLunaSendMsg in base64 encoding
  };
};

type Config = {
  pairTokenAddress: string;
  blunaTokenAddress: string;
  swapBase64: string;
  terraNodeURL: string;
  terraChainID: string;
  wallet: {
    address: string;
    mnemonic: string;
  };
  parameters: {
    maxLunaSwapAmount: number;
    minLunaSwapAmount: number;
    maxbLunaSwapAmount:number;
    minbLunaSwapAmount:number;
    slippage:  number;
    interval: number;
    maxBlunaPrice: number;
    maxLunaPrice: number;
  }
  
}

export {
  SwapLunaToBlunaSimulationQueryMessage,
  SwapLunaToBlunaSimulationResponse,
  SwapBlunaToLunaSimulationQueryMessage,
  SwapBlunaToLunaSimulationResponse,
  SwapSimulationContractResponse,
  BlunaBalanceQueryMessage,
  BlunaBalanceResponse,
  WalletBalance,
  SwapLunaHandleMessage,
  IncreaseAllowanceHandleMessage,
  SwapBlunaSendMsg,
  SwapBlunaHandleMessage,
  Config
};