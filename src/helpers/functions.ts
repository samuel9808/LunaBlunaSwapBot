const toMacro = (x: number): number => {
    return Number(x) / 1000000;
}
const toMicro = (x: number): number => {
    return Math.round(x * 1000000);
}

const calculatePercentageGain = (from: number, to: number) => {
    return ((to - from) / from) * 100;
}
const calculatePercentageLoss = (from: number, to: number) => {
    return ((from - to) / from) * 100;
}

const calculatePrice = (from: number, to: number) => {
    return (from / to);
}

const toMiliseconds = (from: number) => {
    return (from * 1000)
}

export {
    toMacro,
    toMicro,
    calculatePercentageGain,
    calculatePercentageLoss,
    calculatePrice,
    toMiliseconds
}