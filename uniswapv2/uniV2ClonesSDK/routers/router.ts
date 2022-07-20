import { TradeType } from "../constants";
import invariant from "tiny-invariant";
import { validateAndParseAddress } from "../utils";
import { ETHER, Trade } from "../entities";
import { SwapParameters, toHex, TradeOptions, ZERO_HEX } from ".";

export default class Router {
  swapExactNativeForTokensSupportingFeeOnTransferTokens: string;
  swapExactTokensForNativeSupportingFeeOnTransferTokens: string;
  swapExactNativeForTokens: string;
  swapExactTokensForNative: string;
  swapNativeForExactTokens: string;
  swapTokensForExactNative: string;

  constructor(
    swapExactNativeForTokensSupportingFeeOnTransferTokens: string,
    swapExactTokensForNativeSupportingFeeOnTransferTokens: string,
    swapExactNativeForTokens: string,
    swapExactTokensForNative: string,
    swapNativeForExactTokens: string,
    swapTokensForExactNative: string
  ) {
    this.swapExactNativeForTokensSupportingFeeOnTransferTokens =
      swapExactNativeForTokensSupportingFeeOnTransferTokens;
    this.swapExactTokensForNativeSupportingFeeOnTransferTokens =
      swapExactTokensForNativeSupportingFeeOnTransferTokens;
    this.swapExactNativeForTokens = swapExactNativeForTokens;
    this.swapExactTokensForNative = swapExactTokensForNative;
    this.swapNativeForExactTokens = swapNativeForExactTokens;
    this.swapTokensForExactNative = swapTokensForExactNative;
  }
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  swapCallParameters(trade: Trade, options: TradeOptions): SwapParameters {
    const etherIn = trade.inputAmount.currency === ETHER;
    const etherOut = trade.outputAmount.currency === ETHER;
    // the router does not support both ether in and out
    invariant(!(etherIn && etherOut), "ETHER_IN_OUT");
    invariant(options.ttl > 0, "TTL");

    const to: string = validateAndParseAddress(options.recipient);
    const amountIn: string = toHex(
      trade.maximumAmountIn(options.allowedSlippage)
    );
    const amountOut: string = toHex(
      trade.minimumAmountOut(options.allowedSlippage)
    );
    const path: string[] = trade.route.path.map((token) => token.address);
    const deadline = `0x${(
      Math.floor(new Date().getTime() / 1000) + options.ttl
    ).toString(16)}`;
    const useFeeOnTransfer = Boolean(options.feeOnTransfer);

    let methodName: string;
    let args: (string | string[])[];
    let value: string;
    switch (trade.tradeType) {
      case TradeType.EXACT_INPUT:
        if (etherIn) {
          methodName = useFeeOnTransfer
            ? this.swapExactNativeForTokensSupportingFeeOnTransferTokens
            : this.swapExactNativeForTokens;
          // (uint amountOutMin, address[] calldata path, address to, uint deadline)
          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = useFeeOnTransfer
            ? this.swapExactTokensForNativeSupportingFeeOnTransferTokens
            : this.swapExactTokensForNative;
          // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = useFeeOnTransfer
            ? "swapExactTokensForTokensSupportingFeeOnTransferTokens"
            : "swapExactTokensForTokens";
          // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        }
        break;
      case TradeType.EXACT_OUTPUT:
        invariant(!useFeeOnTransfer, "EXACT_OUT_FOT");
        if (etherIn) {
          methodName = this.swapNativeForExactTokens;
          // (uint amountOut, address[] calldata path, address to, uint deadline)
          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = this.swapTokensForExactNative;
          // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = "swapTokensForExactTokens";
          // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        }
        break;
    }
    return {
      methodName,
      args,
      value,
    };
  }
}
