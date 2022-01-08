import {
  BlockTxBroadcastResult,
  Coin,
  Coins,
  isTxError,
  MnemonicKey,
  MsgExecuteContract,
} from "@terra-money/terra.js";

import colors from 'colors/safe';
import config from "../../config";
import {
  calculatePrice,
  terra,
  toMacro,
  toMicro,
  toMiliseconds
} from "../helpers";
import {
  BlunaBalanceQueryMessage,
  BlunaBalanceResponse,
  Config,
  IncreaseAllowanceHandleMessage,
  SwapBlunaHandleMessage,
  SwapBlunaSendMsg,
  SwapBlunaToLunaSimulationQueryMessage,
  SwapBlunaToLunaSimulationResponse,
  SwapLunaHandleMessage,
  SwapLunaToBlunaSimulationQueryMessage,
  SwapLunaToBlunaSimulationResponse,
  SwapSimulationContractResponse,
  WalletBalance
} from "../types";

const swapLunaToBluna = async (
  walletMnemonic: string,
  lunaAmount: number,
  expectedBlunaAmount: number,
  slippagePercentage: number
): Promise<BlockTxBroadcastResult> => {

  console.log(colors.yellow('Intentando Swapear Luna/Bluna'));

  // Instanciar la cartera
  const wallet = terra.wallet(
    new MnemonicKey({
      mnemonic: walletMnemonic,
    })
  )

  // Incrementar el Allowance para el trade
  // Mensaje de incremento
  const increaseAllowanceHandleMessage: IncreaseAllowanceHandleMessage = {
    increase_allowance: {
      amount: toMicro(expectedBlunaAmount).toString(),
      spender: config.pairTokenAddress,
    },
  };
  // Contrato de incremento de allowance.
  const increaseAllowance = new MsgExecuteContract(
    wallet.key.accAddress,
    config.blunaTokenAddress,
    increaseAllowanceHandleMessage
  );

  // Hacer el Swap
  // Mensaje de Swap
  const swapLunaHandleMessage: SwapLunaHandleMessage = {
    swap: {
      offer_asset: {
        amount: toMicro(lunaAmount).toString(),
        info: {
          native_token: {
            denom: 'uluna',
          },
        },
      },
      belief_price: (lunaAmount / expectedBlunaAmount).toString(),
      max_spread: (slippagePercentage / 100).toString(),
    },
  };

  const swapCoins = new Coins({
    uluna: toMicro(lunaAmount),
  });

  // Contrato de Swap.
  const executeSwap = new MsgExecuteContract(
    wallet.key.accAddress,
    config.pairTokenAddress,
    swapLunaHandleMessage,
    swapCoins
  );

  // Crear y firmar los contratos en la Blockchain
  const tx = await wallet.createAndSignTx({
    msgs: [increaseAllowance, executeSwap],
  });

  // Conseguir el Hash de la transaccion
  const txHash = await terra.tx.hash(tx);
  console.log('TxHash: ', txHash);

  // Resultado del contrato 
  const result = await terra.tx.broadcast(tx);
  if (!isTxError(result)) {
    console.log('Luna a gastar: ', lunaAmount);
    console.log('bLuna a cambio: ', expectedBlunaAmount);
  } 

  return result;
}

const swapBlunaToLuna = async (
  walletMnemonic: string,
  bLunaAmount: number,
  expectedLunaAmount: number,
  slippagePercentage: number
): Promise<BlockTxBroadcastResult> => {

  console.log(colors.cyan('Intentando Swapear bLuna/Luna'));

  // Instanciar la cartera
  const wallet = terra.wallet(
    new MnemonicKey({
      mnemonic: walletMnemonic,
    })
  );

  // Mensaje de propiedades del Swap
  const swapMsg: SwapBlunaSendMsg = {
    swap: {
      belief_price: (bLunaAmount / expectedLunaAmount).toString(),
      max_spread: (slippagePercentage / 100).toString(),
    },
  };

  // Transformar mensaje a Base64
  const base64SwapMsg = Buffer.from(JSON.stringify(swapMsg)).toString('base64');

  // Mensaje del Swap
  const swapHandleMessage: SwapBlunaHandleMessage = {
    send: {
      amount: toMicro(bLunaAmount).toString(),
      contract: config.pairTokenAddress,
      msg: base64SwapMsg
    },
  };

  // Contrato del Swap
  const executeSwap = new MsgExecuteContract(
    wallet.key.accAddress,
    config.blunaTokenAddress,
    swapHandleMessage
  );
  // Crear y firmar los contratos en la Blockchain
  const tx = await wallet.createAndSignTx({
    msgs: [executeSwap],
  });

  // Conseguir el Hash de la transaccion
  const txHash = await terra.tx.hash(tx);
  console.log('TxHash: ', txHash);

  // Resultado del contrato
  const result = await terra.tx.broadcast(tx);
  if (!isTxError(result)) {
    console.log('bLuna a gastar: ', bLunaAmount);
    console.log('Luna a cambio: ', expectedLunaAmount);
  } 

  return result;
}

const getWalletBalance = async (
  address: string
): Promise<WalletBalance> => {


  const blunaBalanceQueryMessage: BlunaBalanceQueryMessage = {
    balance: { address },
  }

  const [{ balance: blunaBalance }, coins] = await Promise.all([
    // bLuna
    terra.wasm.contractQuery(
      config.blunaTokenAddress,
      blunaBalanceQueryMessage
    ) as Promise<BlunaBalanceResponse>,
    // Coins Nativas
    terra.bank.balance(address),
  ]);

  const luna = new Coin(coins[0].get('uluna')!.denom, coins[0].get('uluna')!.amount);
  const ust = new Coin(coins[0].get('uusd')!.denom, coins[0].get('uusd')!.amount);

  // console.log(`Luna: ${toMacro(luna.amount.toNumber())}`);
  // console.log(`UST: ${toMacro(ust.amount.toNumber())}`);
  return {
    uluna: luna.amount.toString() ?? "0",
    uust: ust.amount.toString() ?? "0",
    ubluna: blunaBalance ?? "0",
  };
}

const simulateLunatoBlunaSwap = async (
  lunaAmount: number = 1
): Promise<SwapLunaToBlunaSimulationResponse> => {
  // const { luna: balance } = await getWalletBalance();;

  const queryMessage: SwapLunaToBlunaSimulationQueryMessage = {
    simulation: {
      offer_asset: {
        amount: toMicro(lunaAmount).toString(),
        info: { native_token: { denom: 'uluna' } },
      },
    },

  }

  const contractResponse: SwapSimulationContractResponse = await terra.wasm.contractQuery(
    config.pairTokenAddress,
    queryMessage
  );

  // const percentageGain = calculatePercentageGain(
  //   lunaAmount,
  //   toMacro(Number(contractResponse.return_amount))
  // )

  const price = calculatePrice(
    lunaAmount,
    toMacro(Number(contractResponse.return_amount))
  )

  // console.log('LunaToBluna');
  // console.log(percentageGain);
  // console.log(contractResponse);
  // console.log(`Luna/Bluna Belief Price: ${price}`);

  return {
    contractResponse,
    // percentageGain,
    price
  };

}

const simulateBlunaToLunaSwap = async (
  blunaAmount: number = 1
): Promise<SwapBlunaToLunaSimulationResponse> => {

  const queryMessage: SwapBlunaToLunaSimulationQueryMessage = {
    simulation: {
      offer_asset: {
        amount: toMicro(blunaAmount).toString(),
        info: {
          token: {
            contract_addr: config.blunaTokenAddress,
          },
        },
      },
    },
  };

  const contractResponse: SwapSimulationContractResponse =
    await terra.wasm.contractQuery(
      config.pairTokenAddress,
      queryMessage
    );

  // const percentageLoss = calculatePercentageLoss(
  //   blunaAmount,
  //   toMacro(Number(contractResponse.return_amount))
  // );
  // console.log('BlunaToLuna');
  // console.log(percentageLoss);
  // console.log(contractResponse);

  const price = calculatePrice(
    blunaAmount,
    toMacro(Number(contractResponse.return_amount))
  )

  // console.log(`Bluna/Luna Belief Price: ${price}`);

  return {
    contractResponse,
    // percentageLoss,
    price
  };
}

let continueRunning = true;

const start = async (config: Config): Promise<void> => {
  continueRunning = true;

  const {
    wallet,
    parameters,
  } = config;

  let [{ price: lunaPrice }, { price: blunaPrice }] = await Promise.all([
    simulateLunatoBlunaSwap(),
    simulateBlunaToLunaSwap(),
  ]);

  // console.log(`Luna: ${lunaPrice}`);
  // console.log(`bLuna: ${blunaPrice}`);

  const walletBalance = await getWalletBalance(wallet.address);
  const lunaBalance = Math.min(
    toMacro(Number(walletBalance.uluna)),
    parameters.maxLunaSwapAmount
  );
  const bLunaBalance = Math.min(
    toMacro(Number(walletBalance.ubluna)),
    parameters.maxbLunaSwapAmount
  );

  const [swapLunaBlunaSim, swapBlunaLunaSim] = await Promise.all([
    simulateLunatoBlunaSwap(lunaBalance),
    simulateBlunaToLunaSwap(bLunaBalance),
  ]);

  const shouldSwapLuna =
    lunaBalance >= parameters.minLunaSwapAmount &&
    swapLunaBlunaSim.price <= parameters.maxBlunaPrice;

  const shouldSwapBluna =
    bLunaBalance >= parameters.minbLunaSwapAmount &&
    swapBlunaLunaSim.price <= parameters.maxLunaPrice;

  // console.log(`Swapear Luna? ${shouldSwapLuna}`);
  // console.log(`Swapear bLuna? ${shouldSwapBluna}`);

  const txResult: BlockTxBroadcastResult | undefined = shouldSwapLuna
    ? await swapLunaToBluna(
      config.wallet.mnemonic,
      lunaBalance,
      toMacro(Number(swapLunaBlunaSim.contractResponse.return_amount)),
      config.parameters.slippage
    )
    : shouldSwapBluna
    ? await swapBlunaToLuna(
        config.wallet.mnemonic,
        bLunaBalance,
        toMacro(Number(swapBlunaLunaSim.contractResponse.return_amount)),
        config.parameters.slippage
    )
    : undefined;

  

  if (txResult === undefined) {
    console.log('Parametros no se cumplen, reintentando.');
  } else {
    if (isTxError(txResult)) {
      console.log(colors.red('Error en Transaccion, reintentando.'));
    } else {
      console.log(colors.green('Swap Exitoso'));
    }
  }

  if(continueRunning) {
    setTimeout(() => start(config), toMiliseconds(parameters.interval));
  }
}


export {
  getWalletBalance,
  simulateBlunaToLunaSwap,
  simulateLunatoBlunaSwap,
  start
}