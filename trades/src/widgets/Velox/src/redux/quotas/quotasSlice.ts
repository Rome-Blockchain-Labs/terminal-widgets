import { getVeloxProxyAddress } from '@rbl/velox-common/multiChains';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import retry from 'async-retry';
import { Contract, utils } from 'ethers';
import { stringify } from 'flatted';
import merge from 'lodash/merge';
import set from 'lodash/set';

import { erc20abi } from '../../contracts/abi';
import { QuotasState } from '../../model/store/quotas';
import { Token } from '../../model/token';
import loggerWithCloud from '../../utils/logging/loggerWithCloud';
import { chainIdToBlockchainName } from '../../utils/network-mapping';
import { PROVIDER_DISCONNECT } from '../sharedActions';
import { toastError } from '../userFeedback/userFeedbackSlice';

function getProxyAddress(chainId: number) {
  const chainIdString = chainId.toString();
  return getVeloxProxyAddress(
    chainIdToBlockchainName(chainIdString),
    chainIdString
  );
}

export const updateTokenBalance = createAsyncThunk(
  'tokens/tokenBalance',
  async (payload: { provider: any; token: Token }, thunkAPI: any) => {
    try {
      return retry(
        async () => {
          const account = thunkAPI.getState().velox.wallet.connection.account;
          if (!account)
            throw new Error('attempted to get balance without an account');
          const { provider, token } = payload;
          const signer = provider.getSigner();
          const contract = new Contract(token.id, erc20abi, signer);
          contract.connect(signer);
          const rawBalance = await contract.balanceOf(account);
          const chainId = await signer.getChainId();
          const proxyAddress = getProxyAddress(chainId);
          const rawAllowance = await contract.allowance(account, proxyAddress);
          const balance = utils.formatUnits(
            rawBalance.toString(),
            token.decimals
          );
          const allowance = utils.formatUnits(
            rawAllowance.toString(),
            token.decimals
          );
          return { allowance, balance, tokenAddress: token.id };
        },
        { retries: 4 }
      );
    } catch (e) {
      throw new Error(stringify(e, Object.getOwnPropertyNames(e)));
    }
  }
);

export const unlockTokenAllowance = createAsyncThunk(
  'token/allowance',
  async (payload: any, thunkAPI: any) => {
    try {
      const { provider, token } = payload;
      const signer = provider.getSigner();
      const contract = new Contract(token.id, erc20abi, signer);
      contract.connect(signer);
      const chainId = await signer.getChainId();
      const proxyAddress = getProxyAddress(chainId);
      const success = await contract.approve(
        proxyAddress,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      );
      await success.wait();
      thunkAPI.dispatch(updateTokenBalance({ provider, token }));
      return { tokenAddress: token.id };
    } catch (error: any) {
      const rejectedTxErr =
        error?.message ===
        'MetaMask Tx Signature: User denied transaction signature.';
      thunkAPI.dispatch(
        toastError(
          rejectedTxErr ? 'Conversion rejected.' : 'Changing token allowance'
        )
      );
      throw new Error(stringify(error, Object.getOwnPropertyNames(error)));
    }
  }
);

const initialState: QuotasState = {};

export const quotasSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(PROVIDER_DISCONNECT, () => {
      return {}; //reset all state
    });
    builder.addCase(updateTokenBalance.pending, (state, action) => {
      const tokenAddress = action.meta.arg.token.id;
      merge(state, {
        [tokenAddress]: {
          allowance: { error: null, loading: true, value: 0 },
          balance: { error: null, loading: true, value: 0 },
        },
      });
    });
    builder.addCase(updateTokenBalance.fulfilled, (state, action: any) => {
      const { allowance, balance, tokenAddress } = action.payload;
      merge(state, {
        [tokenAddress]: {
          allowance: { error: null, loading: false, value: allowance },
          balance: { error: null, loading: false, value: balance },
        },
      });
    });
    builder.addCase(updateTokenBalance.rejected, (state, action) => {
      loggerWithCloud.sendToCloud(
        `updateTokenBalance error:${stringify(action)}`,
        'error'
      );
      const tokenAddress = action.meta.arg.token.id;
      const error = action.error.message;
      merge(state, {
        [tokenAddress]: {
          allowance: { error, loading: false, value: 0 },
          balance: { error, loading: false, value: 0 },
        },
      });
    });
    builder.addCase(unlockTokenAllowance.fulfilled, (state, action: any) => {
      const { tokenAddress } = action.payload;
      //setting to max safe integer. Old allowances of less than max still need to be handled in other parts of the app
      set(state, `${tokenAddress}.allowance`, {
        error: null,
        loading: false,
        value: Number.MAX_SAFE_INTEGER,
      });
    });
    builder.addCase(unlockTokenAllowance.pending, (state, action) => {
      const tokenAddress = action.meta.arg.token.id;
      set(state, `${tokenAddress}.allowance.loading`, true);
    });
    builder.addCase(unlockTokenAllowance.rejected, (state, action) => {
      loggerWithCloud.sendToCloud(
        `unlockTokenAllowance error:${stringify(action)}`,
        'error'
      );
      const tokenAddress = action.meta.arg.token.id;
      merge(state, { [tokenAddress]: { allowance: { loading: false } } });
    });
  },
  initialState,
  name: 'quotas',
  reducers: {
    addStrategyMinAllowance: (state, action) => {
      const { minAllowance, tokenAddress } = action.payload;
      merge(state, { [tokenAddress]: { allowance: { min: minAllowance } } });
    },
  },
});

export const { addStrategyMinAllowance } = quotasSlice.actions;
export default quotasSlice.reducer;
