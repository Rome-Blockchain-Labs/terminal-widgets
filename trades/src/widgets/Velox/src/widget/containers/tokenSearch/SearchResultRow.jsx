import React, { useRef, useState } from 'react';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { setPair } from '../../../redux/tokenSearch/tokenSearchSlice';
import { firstAndLast } from '../../../utils/firstAndLast';
import { intToWords } from '../../../utils/intToWords';
import {
  useWidgetSizeState,
  withEnlargedProps,
} from '../../WidgetSizeStateContext';
import useProvider from '../ethereum/use-provider';

const NumberFont = styled.span`
  font-family: 'Fira Code', monospace;
  color: white;
`;

const Ellipsis = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NormalMiniEllipsis = styled.span`
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 5.313rem;
  display: inline-block;
  vertical-align: middle;
  text-transform: uppercase;
  font-size: 0.5rem;
`;
const EnlargedMiniEllipsis = styled.span`
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 5.313rem;
  display: inline-block;
  vertical-align: middle;
  text-transform: uppercase;
  font-size: 0.813rem;
`;
const MiniEllipsis = withEnlargedProps(
  NormalMiniEllipsis,
  EnlargedMiniEllipsis
);

const MainRow = styled.div`
  padding: 0 ${(props) => (props.enlarged ? '1rem' : '.625rem')};
  border-radius: 0;
  font-size: ${(props) => (props.enlarged ? '.813rem' : '0.438rem')};
  cursor: pointer;
  :hover {
    background: #00272f;
    border-radius: 0 0.313rem 0.313rem 0;
  }
`;

const NormalMainRowMeta = styled.div`
  display: none;
`;
const MainRowMeta = withEnlargedProps(NormalMainRowMeta);

const VirtualizedRow = (props) => {
  const { index, style, suggestions } = props;
  const widgetSizeState = useWidgetSizeState();
  const selectedPair = suggestions[index];
  const dispatch = useDispatch();
  const { provider } = useProvider();
  const rowHeight = props.parent.props.rowHeight;
  const popoverDOM = props.popoverRef.current;
  const onClick = (event) => {
    event.preventDefault();
    if (selectedPair && selectedPair.token0 && selectedPair.token1) {
      dispatch(setPair({ provider, selectedPair }));
    }
  };

  const truncatedPair = firstAndLast(selectedPair.id);
  const truncatedToken0 = firstAndLast(selectedPair.token0.id);
  const truncatedToken1 = firstAndLast(selectedPair.token1.id);
  const rowRef = useRef();
  const metaRowRef = useRef();
  const [isHover, setIsHover] = useState(false);
  const imageSize = widgetSizeState.enlarged ? 22 : 12;

  useLayoutEffect(() => {
    if (popoverDOM) {
      if (isHover) {
        popoverDOM.innerHTML = metaRowRef.current.innerHTML;

        let top = (popoverDOM.style.top =
          rowRef.current.parentElement.offsetTop -
          rowRef.current.parentElement.parentElement.parentElement.scrollTop);

        if (top < 100) {
          popoverDOM.style.top = top + 'px';
        } else {
          popoverDOM.style.top =
            top - popoverDOM.clientHeight + rowHeight + 'px';
        }
      } else {
      }
    }
  }, [popoverDOM, rowRef, metaRowRef, isHover, rowHeight]);

  return (
    <div style={style} onClick={onClick}>
      <MainRow
        ref={rowRef}
        enlarged={widgetSizeState.enlarged}
        style={{ height: rowHeight }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            gap: '.188rem',
            height: '100%',
            width: '100%',
          }}
        >
          <div style={{ alignItems: 'center', display: 'flex', flex: '1' }}>
            {selectedPair.token0.image && (
              <img
                alt={selectedPair.token0.symbol}
                src={selectedPair.token0.image}
                style={{ borderRadius: '50%' }}
                width={imageSize}
              />
            )}{' '}
            <MiniEllipsis>{selectedPair.token0.symbol} </MiniEllipsis>
          </div>
          <div style={{ alignItems: 'center', display: 'flex', flex: '1' }}>
            <span>{' / '}</span>
            <span>&nbsp;</span>
            {selectedPair.token1.image && (
              <img
                alt={selectedPair.token1.symbol}
                src={selectedPair.token1.image}
                style={{ borderRadius: '50%' }}
                width={imageSize}
              />
            )}
            <span>&nbsp;</span>
            <MiniEllipsis>{selectedPair.token1.symbol}</MiniEllipsis>
          </div>
        </div>
        <MainRowMeta ref={metaRowRef}>
          <div
            style={{ alignItems: 'center', display: 'flex', gap: '.625rem' }}
          >
            <div style={{ whiteSpace: 'nowrap' }}>
              <div>First Token:</div>
              <div>Second Token:</div>
              <div>Pair Volume:</div>
              <div>Pair:</div>
            </div>
            <div>
              <div>
                <Ellipsis>
                  <NumberFont>{truncatedToken0}</NumberFont>
                </Ellipsis>
              </div>
              <div>
                <Ellipsis>
                  <NumberFont>{truncatedToken1}</NumberFont>
                </Ellipsis>
              </div>
              <div>
                <Ellipsis>
                  <NumberFont>{intToWords(selectedPair.volumeUSD)}</NumberFont>
                </Ellipsis>
              </div>
              <div>
                <Ellipsis>
                  <NumberFont>{truncatedPair}</NumberFont>
                </Ellipsis>
              </div>
            </div>
          </div>
        </MainRowMeta>
      </MainRow>
    </div>
  );
};
export default VirtualizedRow;
