export default {
    // Token
    pairTokenAddress: 'terra13e4jmcjnwrauvl2fnjdwex0exuzd8zrh5xk29v' ?? '',
    blunaTokenAddress: 'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x' ?? '',
    swapBase64: 'eyJzd2FwIjp7fX0=',

    // Terra config
    terraNodeURL: 'https://bombay-lcd.terra.dev' ?? '',
    terraChainID: 'bombay-12' ?? '',

    // Wallets
    wallet: {
        address: 'terra14v95gt3h9t4mqwvsmancnahw64aeux27h7epfy',
        mnemonic: 'gather audit behave rapid behind edit level source lyrics sail october choice journey exact mean lobster survey force glad slush glide judge soup vote'
    },
    // Pametros de Swap
    parameters: {
        maxLunaSwapAmount: 5,
        minLunaSwapAmount: 2,
        maxbLunaSwapAmount: 5,
        minbLunaSwapAmount: 2,
        slippage: 0.5, // Porcentaje
        interval: 5, // Segundos
        maxBlunaPrice: 0.50,
        maxLunaPrice: 0.50
    }
}