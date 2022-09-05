import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { filteredStrategiesPageCount } from '../../redux/derivedState';
import { updateCurrentPage } from '../../redux/strategy/strategySlice';

const Pagination = styled.div`
  display: inline-block;
  margin-bottom: -37px;
  a {
    float: left;
    text-decoration: none;
    transition: background-color 0.3s;
    border-color: #067c82;
    background: #08333c;
    border-style: solid;
    border-width: 2px;
    border-radius: 30px;
    padding: 5px 11px;
    margin: 0 2px;
    font-size: 12px;
    font-weight: 600;
    color: #067c82;
  }

  a.active {
    color: white;
    border-color: #067c82;
    background: #067c82;
  }

  a:hover:not(.active) {
    color: #00d3cf;
  }
`;

const StrategyPagination = () => {
  const dispatch = useDispatch();
  const { currentPage } = useSelector((state) => state?.velox?.strategy);
  const pageCount = useSelector(filteredStrategiesPageCount);

  //todo refactor this by using an exisiting pagination package
  const renderPages = () => {
    if (pageCount === 1) {
      return null;
    }
    const pages = [...Array(pageCount).keys()];
    return pages?.map((item, index) => {
      return (
        <a
          key={index}
          className={currentPage === index ? 'networkLogos' : ''}
          href="/#"
          onClick={(e) => {
            e.preventDefault();
            dispatch(updateCurrentPage(index));
          }}
        >
          {index + 1}
        </a>
      );
    });
  };
  const onNextPage = (e) => {
    e.preventDefault();
    if (currentPage < pageCount) dispatch(updateCurrentPage(currentPage + 1));
  };

  const onPrevPage = (e) => {
    e.preventDefault();
    if (currentPage > 0) dispatch(updateCurrentPage(currentPage - 1));
  };

  return (
    <Pagination>
      {currentPage !== 0 && (
        <a href="/#" onClick={onPrevPage}>
          «
        </a>
      )}
      {renderPages()}
      {currentPage !== pageCount - 1 && (
        <a href="/#" onClick={onNextPage}>
          »
        </a>
      )}
    </Pagination>
  );
};
export default StrategyPagination;
