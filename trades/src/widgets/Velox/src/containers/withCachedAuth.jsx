import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from '../assets/styled';
import Card from '../components/common/v2/card';
import { hasValidAuth } from '../redux/derivedState';
import {
  getUserStrategies,
  updateCachedAuth,
} from '../redux/strategy/strategySlice';
import { toastError } from '../redux/userFeedback/userFeedbackSlice';
import useProvider from './ethereum/use-provider';

const StyledButton = styled(Button)`
  float: none;
  padding: 13px 10px 10px 10px;
  width: 120px;
  margin: 20px auto;
  text-align: center;
`;

const CardContent = styled.div`
  padding: 20px;
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
        <div style={{ margin: '0 auto', maxWidth: '1080px' }}>
          <Card
            bodyStyle={{ backgroundColor: '#064950' }}
            headerStyle={{ backgroundColor: '#0D6D6F' }}
            headerText="My&nbsp;Strategies"
          >
            <CardContent style={{ textAlign: 'center' }}>
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
                <sup> Save on this device</sup>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div style={{ margin: '0 auto', maxWidth: '1080px' }}>
        <Card
          bodyStyle={{ backgroundColor: '#064950' }}
          headerStyle={{ backgroundColor: '#0D6D6F' }}
          headerText="My&nbsp;Strategies"
        >
          <CardContent>
            <WrappedComponent {...props} />
          </CardContent>
        </Card>
      </div>
    );
  };
};

export default withCachedAuth;
