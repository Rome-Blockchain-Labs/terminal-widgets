import { getWrappedNativeToken, NETWORKS } from '@rbl/velox-common/multiChains';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import retry from 'async-retry';
import { Contract, utils } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { stringify } from 'flatted';

import { WETH_DECIMALS } from '../../config';
import { ExchangeParams } from '../../containers/exchangeSelector/allowableExchanges';
import { erc20abi, wethAbi } from '../../contracts/abi';
import loggerWithCloud from '../../utils/logging/loggerWithCloud';
import { chainIdToBlockchainName } from '../../utils/network-mapping';
import {
  getNativeTokenSymbol,
  getWrappedNativeTokenName,
  getWrappedNativeTokenSymbol,
} from '../../utils/web3';
import { updateTokenBalance } from '../quotas/quotasSlice';
import { PROVIDER_DISCONNECT } from '../sharedActions';
import { toastError } from '../userFeedback/userFeedbackSlice';

export const getNativeToken = (selectedExchange: ExchangeParams) => {
  const nativeTokenAddress = getWrappedNativeToken(
    selectedExchange.identifiers.blockchain,
    selectedExchange.identifiers.chainId
  );

  let imageUrl = null;

  switch (selectedExchange.identifiers.blockchain) {
    case NETWORKS.ETHEREUM.NAME:
      imageUrl =
        'https://assets.coingecko.com/coins/images/2518/small/weth.png?1547036627';
      break;
    case NETWORKS.AVALANCHE.NAME:
      imageUrl =
        'https://assets.coingecko.com/coins/images/15075/small/wrapped-avax.png?1629873618';
      break;
    case NETWORKS.BSC.NAME:
      imageUrl =
        'https://assets.coingecko.com/coins/images/12591/small/binance-coin-logo.png?1600947313';
      break;
    default:
      loggerWithCloud.sendToCloud(
        `Could not find native token for ${selectedExchange.identifiers.blockchain}`,
        'error'
      );
  }

  return {
    address: nativeTokenAddress,
    decimals: 18,
    id: nativeTokenAddress,
    image: imageUrl,
    name: getWrappedNativeTokenName(),
    symbol: getWrappedNativeTokenSymbol(),
  };
};

export const updateNativeToken = createAsyncThunk(
  'wallet/updateNative',
  async (payload: any, thunkAPI: any) => {
    try {
      const { provider } = payload;
      const { selectedExchange } = thunkAPI.getState().velox.strategy;
      const nativeToken = getNativeToken(selectedExchange) as any;
      if (nativeToken) {
        thunkAPI.dispatch(updateTokenBalance({ provider, token: nativeToken }));
      } else {
        loggerWithCloud.error('Could not identidy token native to network');
      }
    } catch (e) {
      loggerWithCloud.error('Could not update native token balance', e);
    }
  }
);

export const convertEthToWETH = createAsyncThunk(
  'wallet/convert',
  async (payload: any, thunkAPI: any) => {
    try {
      const { amountInEther, provider } = payload;
      const { chainHex } = thunkAPI.getState().velox.wallet.connection;
      const signer = provider.getSigner();
      const chainIdString = String(parseInt(chainHex));
      const contract = new Contract(
        getWrappedNativeToken(
          chainIdToBlockchainName(chainIdString),
          chainIdString
        ),
        wethAbi,
        signer
      );
      contract.connect(signer);
      const tx = await contract.deposit({
        value: utils.parseEther(amountInEther),
      });
      await tx.wait();
      thunkAPI.dispatch(getWalletBalance({ provider }));
      thunkAPI.dispatch(updateNativeToken({ provider }));
    } catch (error: any) {
      const rejectedTxErr =
        error?.message ===
        'MetaMask Tx Signature: User denied transaction signature.';
      if (!rejectedTxErr) {
        loggerWithCloud.sendToCloud(
          `Error converting eth to weth, error:${stringify(
            error,
            Object.getOwnPropertyNames(error)
          )}`,
          'error'
        );
      }
      thunkAPI.dispatch(
        toastError(
          rejectedTxErr
            ? 'Conversion rejected.'
            : `Error converting ${getNativeTokenSymbol()} to ${getWrappedNativeTokenSymbol()}.`
        )
      );
    }
  }
);

export const getWalletBalance = createAsyncThunk(
  'wallet/balance',
  async (payload: any, thunkAPI: any) => {
    const { provider } = payload;
    console.log('getting wallet balance');
    try {
      return await retry(
        async () => {
          const { account, chainHex } =
            thunkAPI.getState().velox.wallet.connection;
          console.log('ACCOUNT', account, 'chain', chainHex);
          // get ETH balance
          const balance = await provider.getBalance(account);
          const ethBalance = parseFloat(formatEther(balance)).toPrecision(4);
          // get wETH balance
          const chainIdString = String(parseInt(chainHex));
          const wethAddress = getWrappedNativeToken(
            chainIdToBlockchainName(chainIdString),
            chainIdString
          );
          const contract = new Contract(wethAddress, erc20abi, provider);
          const rawWethBalance = await contract.balanceOf(account);
          const wethBalance = utils.formatUnits(
            rawWethBalance.toString(),
            WETH_DECIMALS
          );
          console.log('weth', wethBalance, ethBalance);
          return { ethBalance, wethBalance };
        },
        { retries: 4 }
      );
    } catch (e) {
      console.log(e);
      loggerWithCloud.sendToCloud(
        `Failed to get wallet balance, err:${stringify(
          e,
          Object.getOwnPropertyNames(e)
        )}`,
        'error'
      );
      thunkAPI.dispatch(toastError('Could not display your balance'));
      throw e;
    }
  }
);

export const walletSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(PROVIDER_DISCONNECT, (state: any) => {
      state.connection = { account: '', chainHex: '', isConnected: false };
      state.ethBalance = 0;
      state.loadingConversion = false;
    });
    builder.addCase(getWalletBalance.pending, (state, action: any) => {
      state.loadingBalance = true;
      state.ethBalance = 0;
      state.wethBalance = 0;
    });
    builder.addCase(getWalletBalance.fulfilled, (state, action: any) => {
      const { ethBalance, wethBalance } = action.payload;
      state.ethBalance = ethBalance;
      state.wethBalance = wethBalance;
      state.loadingBalance = false;
    });
    builder.addCase(getWalletBalance.rejected, (state, action: any) => {
      state.ethBalance = 0;
      state.wethBalance = 0;
      state.loadingBalance = false;
    });
    builder.addCase(convertEthToWETH.pending, (state, action: any) => {
      state.loadingConversion = true;
    });
    builder.addCase(convertEthToWETH.fulfilled, (state, action: any) => {
      state.loadingConversion = false;
    });
    builder.addCase(convertEthToWETH.rejected, (state, action: any) => {
      state.loadingConversion = false;
    });
  },
  initialState: {
    balanceErr: '',
    connection: {
      account: '',
      chainHex: '',
      connected: false,
      // error?
      //pending?
    },
    ethBalance: 0,
    loadingBalance: false,
    loadingConversion: false,
    wethBalance: 0, //wrappingEth
  },
  name: 'wallet',

  reducers: {
    updateConnection: (state, action) => {
      state.connection = { ...state.connection, ...action.payload };
    },
  },
});

export const { updateConnection } = walletSlice.actions;
export default walletSlice.reducer;
