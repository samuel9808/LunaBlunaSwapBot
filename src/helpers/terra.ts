import { LCDClient } from "@terra-money/terra.js";
import config from "../../config";

export const terra = new LCDClient({
    URL: config.terraNodeURL,
    chainID: config.terraChainID,
});