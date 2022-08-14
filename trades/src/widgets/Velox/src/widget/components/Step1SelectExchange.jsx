// import { multiChains } from '@rbl/velox-common';
import { getAddress } from '@ethersproject/address';
import { useWeb3React } from '@romeblockchain/wallet';
import { useWallets } from '@romeblockchain/wallet';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import tw from 'twin.macro';

import { INVALID, validateStrategy } from '../../redux/derivedState';
import { completeStep1 } from '../../redux/strategyConfig/strategyConfigSlice';
import ExchangeSelector from '../containers/exchangeSelector';
import MaxGas from '../containers/maxGas';
import { StepPagination } from '../containers/pagination';
import TokenSearch from '../containers/tokenSearch';
import { withEnlargedProps } from '../WidgetSizeStateContext';
import { StepHeading, StepSection, StepText } from './common/css';
import StepperItem from './common/v2/StepperItem';

const NormalSelectExchangeWrapper = styled.div`
  min-height: 15rem;
`;

const EnlargedSelectExchangeWrapper = styled.div`
  min-height: 20rem;
`;

const SelectExchangeWrapper = withEnlargedProps(
  NormalSelectExchangeWrapper,
  EnlargedSelectExchangeWrapper
);

const WalletButton = styled.button`
  ${tw`bg-[#08333C] text-[#00D3CF] border-[#0D8486] border-[3px] rounded-full py-2 px-3 font-semibold`}
`;

const StepSelectExchange = (props) => {
  const { account, connector } = useWeb3React();
  const { selectedWallet, setSelectedWallet } = useWallets();
  const dispatch = useDispatch();
  const invalidReasons = useSelector(validateStrategy);
  const { gwei } = useSelector((state) => state?.velox?.strategy);
  let fixedGasPrice;
  const { chainHex } = useSelector((state) => state?.velox?.wallet.connection);
  const { chainId } = useSelector(
    (state) => state?.velox?.strategy?.selectedExchange?.identifiers
  );
  const isWrongNetwork = parseInt(chainHex) !== parseInt(chainId);

  useEffect(() => {
    if (!invalidReasons.includes(INVALID.STEP1_NULL_PAIR) && gwei > 0) {
      dispatch(completeStep1(true));
    } else {
      dispatch(completeStep1(false));
    }
  }, [invalidReasons, gwei, dispatch]);

  return (
    <StepperItem
      bodyBackgroundColor="#05545A"
      completed={props.completed}
      headerText="Select Exchange"
      indexBackgroundColor="#0D6D6F"
      indexText="Step&nbsp;1"
      name={props.name}
      opened={props.opened}
      ready={props.ready}
      onOpen={props.onOpen}
    >
      <SelectExchangeWrapper>
        <StepSection>
          <StepHeading>Account</StepHeading>
          <div tw="text-[0.7rem] md:text-[1rem] ">
            <div>Connected with {selectedWallet}</div>
            <div>{shortenAddress(account)}</div>

            <div tw="flex gap-x-2 mt-2">
              <WalletButton
                onClick={async () => {
                  try {
                    if (connector && connector.deactivate) {
                      await connector.deactivate();
                      window.localStorage.clear();
                    } else {
                      await connector.resetState();
                    }
                    setSelectedWallet(undefined);
                  } catch (error) {}
                }}
              >
                DISCONNECT WALLET
              </WalletButton>
              <WalletButton onClick={() => setSelectedWallet(undefined)}>
                CHANGE WALLET
              </WalletButton>
            </div>
          </div>
        </StepSection>

        <StepSection>
          <StepHeading>Select Exchange</StepHeading>
          <ExchangeSelector />
        </StepSection>

        {!isWrongNetwork && (
          <div>
            <StepSection>
              <StepHeading>{!fixedGasPrice && 'Select'} Gas Limit</StepHeading>
              <MaxGas fixedGasPrice={fixedGasPrice} />
            </StepSection>
            <StepSection>
              <StepHeading>Select Token Pairing</StepHeading>
              <TokenSearch />
            </StepSection>
          </div>
        )}

        {isWrongNetwork && (
          <StepSection>
            <StepText>Please switch network</StepText>
          </StepSection>
        )}
      </SelectExchangeWrapper>

      <StepSection>
        <StepPagination />
      </StepSection>
    </StepperItem>
  );
};

export default StepSelectExchange;

function shortenAddress(address, chars = 4) {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}
function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}
