import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { hasValidAuth } from '../../redux/derivedState';
import {
  getUserStrategies,
  updateCachedAuth,
} from '../../redux/strategy/strategySlice';
import { toastError } from '../../redux/userFeedback/userFeedbackSlice';
import { Button } from '../assets/styled';
import StepperItem from '../components/common/v2/StepperItem';
import StepperWideItem from '../components/common/v2/StepperWideItem';
import useProvider from './ethereum/use-provider';

const StyledButton = styled(Button)`
  float: none;
  padding: 1.3rem 1rem 1rem 1rem;
  width: 12rem;
  margin: 2rem auto;
  text-align: center;
`;

const message =
  'The owner of this signed message can view deployed Velox strategies';

const getCachedAuth = () => {
  return {
    message: localStorage.message,
    signedMessage: localStorage.signedMessage,
  };
};
const saveAuthToCache = ({ message, signedMessage }) => {
  window.localStorage.setItem('message', message);
  window.localStorage.setItem('signedMessage', signedMessage);
};

const withCachedAuth = (WrappedComponent) => {
  return (props) => {
    const validAuth = useSelector(hasValidAuth);
    const { provider } = useProvider();
    const dispatch = useDispatch();
    const account = useSelector(
      (state) => state?.velox?.wallet.connection.account
    );
    const [shouldGetSig, setShouldGetSig] = useState(false);
    const [saveSig, setSaveSig] = useState(false);

    useEffect(() => {
      if (validAuth) {
        dispatch(getUserStrategies());
      }
    }, [account, validAuth, dispatch]);
    useEffect(() => {
      dispatch(updateCachedAuth(getCachedAuth()));
    }, [dispatch]);

    useEffect(() => {
      if (!validAuth && shouldGetSig) {
        setShouldGetSig(false);
        provider
          .getSigner()
          .signMessage(message)
          .then((signedMessage) => {
            if (saveSig) {
              saveAuthToCache({ message, signedMessage });
            }
            dispatch(updateCachedAuth({ message, signedMessage }));
          })
          .catch((error) =>
            dispatch(toastError('Something went wrong signing'))
          );
      }
    }, [shouldGetSig, provider, dispatch, saveSig, validAuth]);

    if (!validAuth) {
      return (
        <div style={{ height: '100%', margin: '0 auto' }}>
          <StepperItem style={{ textAlign: 'center' }}>
            <div>
              <h6 style={{ marginBottom: '20px' }}>
                SIGN A MESSAGE TO VIEW YOUR VELOX STRATEGIES
              </h6>
              Please <b>verify control</b> of this account
              <br /> with a signed message.
            </div>
            <br />
            <div>This does not cost gas.</div>
            <StyledButton onClick={() => setShouldGetSig(true)}>
              VERIFY NOW
            </StyledButton>
            <div>
              <input
                type={'checkbox'}
                value={saveSig}
                onChange={() => setSaveSig((b) => !b)}
              />
              <sup>&nbsp;&nbsp;Save on this device</sup>
            </div>
          </StepperItem>
        </div>
      );
    }

    return (
      <StepperWideItem>
        <WrappedComponent {...props} />
      </StepperWideItem>
    );
  };
};

export default withCachedAuth;
