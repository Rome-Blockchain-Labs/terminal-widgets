import Router from "./router";

const NetswapRouter = new Router(
  "swapExactMetisForTokensSupportingFeeOnTransferTokens",
  "swapExactTokensForMetisSupportingFeeOnTransferTokens",
  "swapExactMetisForTokens",
  "swapExactTokensForMetis",
  "swapMetisForExactTokens",
  "swapTokensForExactMetis"
);

export default NetswapRouter;
