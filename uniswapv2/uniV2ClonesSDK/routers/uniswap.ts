import Router from "./router";

const UniswapRouter = new Router(
  "swapExactETHForTokensSupportingFeeOnTransferTokens",
  "swapExactTokensForETHSupportingFeeOnTransferTokens",
  "swapExactETHForTokens",
  "swapExactTokensForETH",
  "swapETHForExactTokens",
  "swapTokensForExactETH"
);

export default UniswapRouter;
