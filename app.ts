import config from './config';

import colors from 'colors/safe';

import { getWalletBalance, 
  inquirerMenu, 
  pausa, 
  simulateBlunaToLunaSwap, 
  simulateLunatoBlunaSwap,
  start } from './src/scripts';

import { toMacro } from './src/helpers';



const main = async () => {
  let opt;
  opt = await inquirerMenu();

  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        console.log('En progreso');
        break;
      case 2:
        {
          const walletBalance = await getWalletBalance(config.wallet.address);

          console.log(`${colors.cyan('UST: ')} ${toMacro(Number(walletBalance.uust))}`);
          console.log(`${colors.cyan('Luna: ')} ${toMacro(Number(walletBalance.uluna))}`);
          console.log(`${colors.cyan('bLuna: ')} ${toMacro(Number(walletBalance.ubluna))}`);
        }
        break;
      case 3:

        {
          const walletBalance = await getWalletBalance(config.wallet.address);
          const lunaBalance = Math.min(
            toMacro(Number(walletBalance.uluna)),
            config.parameters.maxLunaSwapAmount
          );
          const blunaBalance = Math.min(
            toMacro(Number(walletBalance.ubluna)),
            config.parameters.maxbLunaSwapAmount
          );

          const [swapLunaToBlunaSimulation, swapBlunaToLunaSimulation] =
            await Promise.all([
              simulateLunatoBlunaSwap(lunaBalance),
              simulateBlunaToLunaSwap(blunaBalance),
            ]);

          console.log(`Luna-Bluna Price: ${swapLunaToBlunaSimulation.price}`);
          console.log(`Bluna-Luna Price: ${swapBlunaToLunaSimulation.price}`);
        }


        break;
      case 4:
        console.log(colors.cyan('Para cambiar la configuracion, vea el archivo config.ts'));
        console.log(`Maximo Luna por Swap: ${colors.yellow(config.parameters.maxLunaSwapAmount.toString())}`);
        console.log(`Minimo Luna por Swap: ${colors.yellow(config.parameters.minLunaSwapAmount.toString())}`);
        console.log(`Maximo bLuna por Swap: ${colors.yellow(config.parameters.maxbLunaSwapAmount.toString())}`);
        console.log(`Minimo bLuna por Swap: ${colors.yellow(config.parameters.minbLunaSwapAmount.toString())}`);
        console.log(`Porcentaje de Slippage: ${colors.yellow(config.parameters.slippage.toString())}`);
        console.log(`Invervalo entre runs: ${colors.yellow(config.parameters.interval.toString())}`);

        break;
      // case 5:
      //   break;
      case 0:
        break;
    }
    if (opt !== 0 && opt !== 5) await pausa();

  } while (opt !== 0 && opt !== 5);

  if ( opt == 5 ) {
    await start(config);
  }

}

main().then(resp => {
  // console.log(resp);
}).catch(err => {
  console.log(err)
})