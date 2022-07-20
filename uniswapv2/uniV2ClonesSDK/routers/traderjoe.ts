import Router from "./router";

const TraderjoeRouter = new Router(
  "swapExactAVAXForTokensSupportingFeeOnTransferTokens",
  "swapExactTokensForAVAXSupportingFeeOnTransferTokens",
  "swapExactAVAXForTokens",
  "swapExactTokensForAVAX",
  "swapAVAXForExactTokens",
  "swapTokensForExactAVAX"
);

export default TraderjoeRouter;
