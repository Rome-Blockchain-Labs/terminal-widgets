import { diffTokenLists, TokenList } from '@uniswap/token-lists';
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Text } from 'rebass';

import { ButtonSecondary } from '../../../../components/buttons';
import { AutoColumn } from '../../../../components/column';
import { AutoRow } from '../../../../components/row';
import { AppDispatch } from '../../../../store';
import { getDefaultCurrencySymbol, listVersionLabel } from '../../../../utils';
import { useRemovePopup } from '../../state/application/hooks';
import { acceptListUpdate } from '../../state/lists/actions';

export default function ListUpdatePopup({
  auto,
  listUrl,
  newList,
  oldList,
  popKey,
}: {
  popKey: string;
  listUrl: string;
  oldList: TokenList;
  newList: TokenList;
  auto: boolean;
}) {
  const removePopup = useRemovePopup();
  const removeThisPopup = useCallback(
    () => removePopup(popKey),
    [popKey, removePopup]
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleAcceptUpdate = useCallback(() => {
    if (auto) return;
    dispatch(acceptListUpdate(listUrl));
    removeThisPopup();
  }, [auto, dispatch, listUrl, removeThisPopup]);

  const {
    added: tokensAdded,
    changed: tokensChanged,
    removed: tokensRemoved,
  } = useMemo(() => {
    return diffTokenLists(oldList.tokens, newList.tokens);
  }, [newList.tokens, oldList.tokens]);
  const numTokensChanged = useMemo(
    () =>
      Object.keys(tokensChanged).reduce(
        (memo, chainId: any) =>
          memo + Object.keys(tokensChanged[chainId]).length,
        0
      ),
    [tokensChanged]
  );

  return (
    <AutoRow>
      <AutoColumn gap="8px" style={{ flex: '1' }}>
        {auto ? (
          <span tw="text-black text-xl font-medium">
            The token list &quot;{oldList.name}&quot; has been updated to{' '}
            <strong>{listVersionLabel(newList.version)}</strong>.
          </span>
        ) : (
          <>
            <div>
              <Text>
                An update is available for the token list &quot;{oldList.name}
                &quot; ({listVersionLabel(oldList.version)} to{' '}
                {listVersionLabel(newList.version)}).
              </Text>
              <ul>
                {tokensAdded.length > 0 ? (
                  <li>
                    {tokensAdded.map((token, i) => (
                      <React.Fragment key={`${token.chainId}-${token.address}`}>
                        <strong title={token.address}>
                          {getDefaultCurrencySymbol(token)}
                        </strong>
                        {i === tokensAdded.length - 1 ? null : ', '}
                      </React.Fragment>
                    ))}{' '}
                    added
                  </li>
                ) : null}
                {tokensRemoved.length > 0 ? (
                  <li>
                    {tokensRemoved.map((token, i) => (
                      <React.Fragment key={`${token.chainId}-${token.address}`}>
                        <strong title={token.address}>
                          {getDefaultCurrencySymbol(token)}
                        </strong>
                        {i === tokensRemoved.length - 1 ? null : ', '}
                      </React.Fragment>
                    ))}{' '}
                    removed
                  </li>
                ) : null}
                {numTokensChanged > 0 ? (
                  <li>{numTokensChanged} tokens updated</li>
                ) : null}
              </ul>
            </div>
            <AutoRow>
              <div style={{ flexGrow: 1, marginRight: 12 }}>
                <ButtonSecondary onClick={handleAcceptUpdate}>
                  Accept update
                </ButtonSecondary>
              </div>
              <div style={{ flexGrow: 1 }}>
                <ButtonSecondary onClick={removeThisPopup}>
                  Dismiss
                </ButtonSecondary>
              </div>
            </AutoRow>
          </>
        )}
      </AutoColumn>
    </AutoRow>
  );
}
