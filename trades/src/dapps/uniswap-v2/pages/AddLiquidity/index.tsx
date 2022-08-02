import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import {
  Currency,
  currencyEquals,
  ETHER,
  TokenAmount,
  WETH,
} from '@rbl/velox-common/uniV2ClonesSDK';
import { useWeb3React } from '@romeblockchain/wallet';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Plus } from 'react-feather';
import { Text } from 'rebass';
import { theme } from 'twin.macro';

import {
  ButtonError,
  ButtonLight,
  ButtonPrimary,
} from '../../../../components/buttons';
import { LightCard } from '../../../../components/card';
import { AutoColumn, ColumnCenter } from '../../../../components/column';
import {
  ConfirmationModalContent,
  TransactionConfirmationModal,
} from '../../../../components/modals';
import { AddRemoveTabs } from '../../../../components/navigationTabs';
import Row, { RowBetween, RowFlat } from '../../../../components/row';
import { DappContext } from '../../../../contexts';
import {
  calculateGasMargin,
  calculateSlippageAmount,
  currencyId,
  getRouterContract,
  maxAmountSpend,
  wrappedCurrency,
} from '../../../../utils';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import DoubleCurrencyLogo from '../../components/DoubleLogo';
import { MinimalPositionCard } from '../../components/PositionCard';
import { PairState } from '../../data/Reserves';
import { useCurrency } from '../../hooks/Tokens';
import {
  ApprovalState,
  useApproveCallback,
} from '../../hooks/useApproveCallback';
import { useWalletModalToggle } from '../../state/application/hooks';
import { Field } from '../../state/mint/actions';
import {
  useDerivedMintInfo,
  useMintActionHandlers,
  useMintState,
} from '../../state/mint/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import {
  useIsExpertMode,
  useUserDeadline,
  useUserSlippageTolerance,
} from '../../state/user/hooks';
import AppBody from '../AppBody';
import { Dots, Wrapper } from '../Pool/styleds';
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom';
import { PoolPriceBar } from './PoolPriceBar';

const AddLiquidity: FC<{
  onBack: () => void;
  newLiquidity: boolean;
  currencyIdA?: string;
  currencyIdB?: string;
}> = ({
  currencyIdA: defaultCurrencyIdA,
  currencyIdB: defaultCurrencyIdB,
  newLiquidity,
  onBack,
}) => {
  const { account, chainId, provider: library } = useWeb3React();

  const [currencyIdA, setCurrencyIdA] = useState<string | undefined>(
    defaultCurrencyIdA
  );
  const [currencyIdB, setCurrencyIdB] = useState<string | undefined>(
    defaultCurrencyIdB
  );

  const { network } = useContext(DappContext);
  const currencyA = useCurrency(currencyIdA, network);
  const currencyB = useCurrency(currencyIdB, network);
  const [isNewLiquidity, setIsNewLiquidity] = useState(newLiquidity);
  const {
    router: { ABI: routerABI, address: routerAddress },
  } = useContext(DappContext);

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, (WETH as any)[chainId])) ||
        (currencyB && currencyEquals(currencyB, (WETH as any)[chainId])))
  );

  const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected

  const expertMode = useIsExpertMode();

  // mint state
  const { independentField, otherTypedValue, typedValue } = useMintState();
  const {
    currencies,
    currencyBalances,
    dependentField,
    error,
    liquidityMinted,
    noLiquidity: mintNoLiquidity,
    pair,
    pairState,
    parsedAmounts,
    poolTokenPercentage,
    price,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined);
  const { onFieldAInput, onFieldBInput } =
    useMintActionHandlers(mintNoLiquidity);

  useEffect(() => {
    setIsNewLiquidity(newLiquidity);
  }, [newLiquidity]);

  const noLiquidity = useMemo(
    () => (isNewLiquidity && (!currencyIdA || !currencyIdB)) || mintNoLiquidity,
    [currencyIdA, currencyIdB, isNewLiquidity, mintNoLiquidity]
  );

  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // txn values
  const [deadline] = useUserDeadline(); // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance(); // custom from users
  const [txHash, setTxHash] = useState<string>('');

  // get formatted amounts
  const formattedAmounts = useMemo(
    () => ({
      [dependentField]: noLiquidity
        ? otherTypedValue
        : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
      [independentField]: typedValue,
    }),
    [
      dependentField,
      independentField,
      noLiquidity,
      otherTypedValue,
      parsedAmounts,
      typedValue,
    ]
  );

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = useMemo(
    () =>
      [Field.CURRENCY_A, Field.CURRENCY_B].reduce((accumulator, field) => {
        return {
          ...accumulator,
          [field]: maxAmountSpend(currencyBalances[field]),
        };
      }, {}),
    [currencyBalances]
  );

  const atMaxAmounts: { [field in Field]?: TokenAmount } = useMemo(
    () =>
      [Field.CURRENCY_A, Field.CURRENCY_B].reduce((accumulator, field) => {
        return {
          ...accumulator,
          [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
        };
      }, {}),
    [maxAmounts, parsedAmounts]
  );

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    routerAddress
  );
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    routerAddress
  );

  const addTransaction = useTransactionAdder();

  const onAdd = useCallback(async () => {
    if (!chainId || !library || !account) return;
    const router = getRouterContract(
      routerAddress,
      routerABI,
      library,
      account
    );

    const {
      [Field.CURRENCY_A]: parsedAmountA,
      [Field.CURRENCY_B]: parsedAmountB,
    } = parsedAmounts;
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
      return;
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(
        parsedAmountA,
        noLiquidity ? 0 : allowedSlippage
      )[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(
        parsedAmountB,
        noLiquidity ? 0 : allowedSlippage
      )[0],
    };

    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline;

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null;
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER;
      estimate = router.estimateGas.addLiquidityAVAX;
      method = router.addLiquidityAVAX;
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)
          ?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
        ].toString(), // token min
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
        ].toString(), // eth min
        account,
        deadlineFromNow,
      ];
      value = BigNumber.from(
        (tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString()
      );
    } else {
      estimate = router.estimateGas.addLiquidity;
      method = router.addLiquidity;
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadlineFromNow,
      ];
      value = null;
    }

    setAttemptingTxn(true);
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary:
              'Add ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_A]?.symbol +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_B]?.symbol,
          });

          setTxHash(response.hash);
        })
      )
      .catch((error) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error);
        }
      });
  }, [
    account,
    addTransaction,
    allowedSlippage,
    chainId,
    currencies,
    currencyA,
    currencyB,
    deadline,
    library,
    noLiquidity,
    parsedAmounts,
    routerABI,
    routerAddress,
  ]);

  const modalHeader = useMemo(() => {
    return noLiquidity ? (
      <AutoColumn gap="20px">
        <LightCard borderRadius="20px" mt="20px">
          <RowFlat>
            <Text
              fontSize="48px"
              fontWeight={500}
              lineHeight="42px"
              marginRight={10}
            >
              {currencies[Field.CURRENCY_A]?.symbol +
                '/' +
                currencies[Field.CURRENCY_B]?.symbol}
            </Text>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </RowFlat>
        </LightCard>
      </AutoColumn>
    ) : (
      <AutoColumn gap="0">
        <RowFlat style={{ marginTop: '20px' }}>
          <div tw="flex items-center">
            <Text
              fontSize="24px"
              fontWeight={500}
              lineHeight="42px"
              marginRight={10}
            >
              {liquidityMinted?.toSignificant(6)}
            </Text>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={18}
            />
          </div>
        </RowFlat>
        <Row>
          <Text fontSize="14px">
            {currencies[Field.CURRENCY_A]?.symbol +
              '/' +
              currencies[Field.CURRENCY_B]?.symbol +
              ' Pool Tokens'}
          </Text>
        </Row>
        <span tw="italic text-xl pt-2 font-medium">
          {`Output is estimated. If the price changes by more than ${
            allowedSlippage / 100
          }% your transaction will revert.`}
        </span>
      </AutoColumn>
    );
  }, [allowedSlippage, currencies, liquidityMinted, noLiquidity]);

  const modalBottom = useMemo(() => {
    return (
      <ConfirmAddModalBottom
        currencies={currencies}
        noLiquidity={noLiquidity}
        parsedAmounts={parsedAmounts}
        poolTokenPercentage={poolTokenPercentage}
        price={price}
        onAdd={onAdd}
      />
    );
  }, [
    currencies,
    noLiquidity,
    onAdd,
    parsedAmounts,
    poolTokenPercentage,
    price,
  ]);

  const pendingText = useMemo(
    () =>
      `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
        currencies[Field.CURRENCY_A]?.symbol
      } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${
        currencies[Field.CURRENCY_B]?.symbol
      }`,
    [currencies, parsedAmounts]
  );

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA);
      if (newCurrencyIdA === currencyIdB) {
        setCurrencyIdA(currencyIdB);
        setCurrencyIdB(currencyIdA);
      } else {
        setCurrencyIdA(newCurrencyIdA);
        setCurrencyIdB(currencyIdB);
      }
    },
    [currencyIdA, currencyIdB]
  );
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB);
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          setCurrencyIdA(currencyIdB);
          setCurrencyIdB(newCurrencyIdB);
        } else {
          const OLD_PATH_STRUCTURE =
            /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/;
          const match = newCurrencyIdB.match(OLD_PATH_STRUCTURE);
          if (match?.length) {
            setCurrencyIdA(match[1]);
            setCurrencyIdB(match[2]);
          } else {
            setCurrencyIdA(newCurrencyIdB);
            setCurrencyIdB(undefined);
          }
        }
      } else {
        setCurrencyIdA(currencyIdA ? currencyIdA : 'AVAX');
        setCurrencyIdB(newCurrencyIdB);
      }
    },
    [currencyIdA, currencyIdB]
  );

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('');
    }
    setTxHash('');
  }, [onFieldAInput, txHash]);

  return (
    <>
      <AppBody>
        <TransactionConfirmationModal
          attemptingTxn={attemptingTxn}
          content={() => (
            <ConfirmationModalContent
              bottomContent={modalBottom}
              title={
                noLiquidity ? 'You are creating a pool' : 'You will receive'
              }
              topContent={modalHeader}
              onDismiss={handleDismissConfirmation}
            />
          )}
          hash={txHash}
          isOpen={showConfirm}
          pendingText={pendingText}
          onDismiss={handleDismissConfirmation}
        />
        <AddRemoveTabs
          adding={true}
          newLiquidity={noLiquidity}
          onBack={onBack}
        />
        <Wrapper>
          <div tw="flex">
            {noLiquidity && (
              <div tw="w-1/3 flex flex-col text-gray-200 bg-dark-600 rounded-xl text-lg justify-between py-5 px-2 text-center mr-3 leading-4">
                <div tw="font-medium">
                  YOU ARE THE FIRST LIQUIDITY PROVIDER.
                </div>
                <div>
                  The ratio of tokens you add will set the price of this pool.
                </div>
                <div>
                  Once you are happy with the rate click supply to review.
                </div>
              </div>
            )}
            <div tw="flex-grow">
              <AutoColumn gap="20px">
                <CurrencyInputPanel
                  // showCommonBases
                  currency={currencies[Field.CURRENCY_A]}
                  id="add-liquidity-input-tokena"
                  label="Input"
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onCurrencySelect={handleCurrencyASelect}
                  onMax={() => {
                    onFieldAInput(
                      maxAmounts[Field.CURRENCY_A]?.toExact() ?? ''
                    );
                  }}
                  onUserInput={onFieldAInput}
                />
                <ColumnCenter>
                  <Plus color={theme`colors.yellow.400`} size="16" />
                </ColumnCenter>
                <CurrencyInputPanel
                  // showCommonBases
                  currency={currencies[Field.CURRENCY_B]}
                  id="add-liquidity-input-tokenb"
                  label="Input"
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onCurrencySelect={handleCurrencyBSelect}
                  onMax={() => {
                    onFieldBInput(
                      maxAmounts[Field.CURRENCY_B]?.toExact() ?? ''
                    );
                  }}
                  onUserInput={onFieldBInput}
                />

                {!account ? (
                  <ButtonLight onClick={toggleWalletModal}>
                    Connect Wallet
                  </ButtonLight>
                ) : (
                  <AutoColumn gap={'md'}>
                    {(approvalA === ApprovalState.NOT_APPROVED ||
                      approvalA === ApprovalState.PENDING ||
                      approvalB === ApprovalState.NOT_APPROVED ||
                      approvalB === ApprovalState.PENDING) &&
                      isValid && (
                        <RowBetween>
                          {approvalA !== ApprovalState.APPROVED && (
                            <ButtonPrimary
                              disabled={approvalA === ApprovalState.PENDING}
                              width={
                                approvalB !== ApprovalState.APPROVED
                                  ? '48%'
                                  : '100%'
                              }
                              onClick={approveACallback}
                            >
                              {approvalA === ApprovalState.PENDING ? (
                                <Dots>
                                  Approving{' '}
                                  {currencies[Field.CURRENCY_A]?.symbol}
                                </Dots>
                              ) : (
                                'Approve ' +
                                currencies[Field.CURRENCY_A]?.symbol
                              )}
                            </ButtonPrimary>
                          )}
                          {approvalB !== ApprovalState.APPROVED && (
                            <ButtonPrimary
                              disabled={approvalB === ApprovalState.PENDING}
                              width={
                                approvalA !== ApprovalState.APPROVED
                                  ? '48%'
                                  : '100%'
                              }
                              onClick={approveBCallback}
                            >
                              {approvalB === ApprovalState.PENDING ? (
                                <Dots>
                                  Approving{' '}
                                  {currencies[Field.CURRENCY_B]?.symbol}
                                </Dots>
                              ) : (
                                'Approve ' +
                                currencies[Field.CURRENCY_B]?.symbol
                              )}
                            </ButtonPrimary>
                          )}
                        </RowBetween>
                      )}
                    <ButtonError
                      disabled={
                        !isValid ||
                        approvalA !== ApprovalState.APPROVED ||
                        approvalB !== ApprovalState.APPROVED
                      }
                      error={
                        !isValid &&
                        !!parsedAmounts[Field.CURRENCY_A] &&
                        !!parsedAmounts[Field.CURRENCY_B]
                      }
                      onClick={() => {
                        expertMode ? onAdd() : setShowConfirm(true);
                      }}
                    >
                      <span tw="text-xl font-medium">{error ?? 'Supply'}</span>
                    </ButtonError>
                  </AutoColumn>
                )}
              </AutoColumn>
            </div>
            {!noLiquidity && (
              <div tw="pl-3">
                {currencies[Field.CURRENCY_A] &&
                  currencies[Field.CURRENCY_B] &&
                  pairState !== PairState.INVALID && (
                    <PoolPriceBar
                      currencies={currencies}
                      noLiquidity={noLiquidity}
                      poolTokenPercentage={poolTokenPercentage}
                      price={price}
                    />
                  )}
              </div>
            )}
          </div>
        </Wrapper>
      </AppBody>

      {pair && !noLiquidity && pairState !== PairState.INVALID ? (
        <AutoColumn style={{ marginTop: '1rem', minWidth: '20rem' }}>
          <MinimalPositionCard pair={pair} showUnwrapped={oneCurrencyIsWETH} />
        </AutoColumn>
      ) : null}
    </>
  );
};

export default AddLiquidity;
