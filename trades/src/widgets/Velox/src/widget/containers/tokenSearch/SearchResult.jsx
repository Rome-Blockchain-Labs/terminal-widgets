import React, { useLayoutEffect, useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { AutoSizer, List } from 'react-virtualized';
import styled from 'styled-components';

import {
  useWidgetSizeState,
  withEnlargedProps,
} from '../../WidgetSizeStateContext';
import SearchResultRow from './SearchResultRow';

const NilFoundContainer = styled.div`
  position: absolute;
  width: 50%;
  margin-left: 25%;
  margin-right: 25%;
  margin-top: -0.313rem;
  position: relative;
  background-color: #1c646c;
  z-index: 100;
  color: rgba(0, 0, 0, 0.87);
  height: 3.75rem;
  text-align: center;
  color: white;
  font-weight: bolder;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NormalSearchResultWrapper = styled.div`
  width: 9.375rem;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 0.938rem;
  border-radius: 0.938rem 0 0 0.938rem;
  background: #00474a;
`;
const EnlargedSearchResultWrapper = styled.div`
  width: 18.75rem;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 0.938rem;
  border-radius: 0.938rem 0 0 0.938rem;
  background: #00474a;
`;
const SearchResultWrapper = withEnlargedProps(
  NormalSearchResultWrapper,
  EnlargedSearchResultWrapper
);

const SearchResult = styled.div`
  display: flex;
  height: 100%;
  position: relative;
`;

const NormalSearchResultRowPopover = styled.div`
  position: absolute;
  left: ${(props) => (props.enlarged ? '-17.5rem' : '-15.313rem')};
  top: -9999px;
  z-index: 999;
  width: ${(props) => (props.enlarged ? '18rem' : '15.625rem')};
  background: #00272f;
  padding: ${(props) => (props.enlarged ? '1rem' : '0.625rem')};
  border-radius: ${(props) => (props.enlarged ? '0.6rem' : '0.313rem')};
  font-size: ${(props) => (props.enlarged ? '.813rem' : '.625rem')};
`;
const SearchResultRowPopover = withEnlargedProps(NormalSearchResultRowPopover);

const NilFoundContainerWrapper = styled.div`
  position: relative;
`;

const SearchDropdown = (props) => {
  const widgetSizeState = useWidgetSizeState();
  const suggestions = useSelector(
    (state) => state?.velox?.tokenSearch?.suggestions
  );
  const popoverRef = useRef();

  const filteredSuggestions = suggestions
    .slice()
    .sort((pair1, pair2) => pair2.volumeUSD - pair1.volumeUSD);

  const [isHover, setIsHover] = useState(false);

  useLayoutEffect(() => {
    if (popoverRef.current) {
      const popoverDOM = popoverRef.current;
      if (isHover) {
        popoverDOM.style.display = 'block';
      } else {
        popoverDOM.style.display = 'none';
      }
    }
  }, [popoverRef, isHover]);
  if (props.loading) {
    return (
      <NilFoundContainerWrapper>
        <NilFoundContainer>Loading...</NilFoundContainer>
      </NilFoundContainerWrapper>
    );
  }
  if (!filteredSuggestions.length) {
    return (
      <NilFoundContainerWrapper>
        <NilFoundContainer>No pairs found...</NilFoundContainer>
      </NilFoundContainerWrapper>
    );
  }

  return (
    <SearchResultWrapper>
      <SearchResult>
        <div
          style={{ flex: '1 1 auto' }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <AutoSizer>
            {({ height, width }) => {
              return (
                <List
                  height={height}
                  overscanRowCount={3}
                  rowCount={filteredSuggestions.length}
                  rowHeight={widgetSizeState.enlarged ? 40 : 17}
                  rowRenderer={(props) => (
                    <SearchResultRow
                      suggestions={filteredSuggestions}
                      {...props}
                      popoverRef={popoverRef}
                    />
                  )}
                  width={width}
                />
              );
            }}
          </AutoSizer>
        </div>
        <SearchResultRowPopover ref={popoverRef} />
      </SearchResult>
    </SearchResultWrapper>
  );
};

export default SearchDropdown;
