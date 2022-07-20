import Router from "./router";

const PangolinRouter = new Router(
  "swapExactAVAXForTokensSupportingFeeOnTransferTokens",
  "swapExactTokensForAVAXSupportingFeeOnTransferTokens",
  "swapExactAVAXForTokens",
  "swapExactTokensForAVAX",
  "swapAVAXForExactTokens",
  "swapTokensForExactAVAX"
);

export default PangolinRouter;
