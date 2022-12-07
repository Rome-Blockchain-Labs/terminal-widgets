import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@romeblockchain/wallet';

const Web3ReactManager: React.FC = ({ children }) => {
  const {
    connector,
    chainId,
    isActive: active,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'networkError' does not exist on type 'We... Remove this comment to see the full error message
    networkError,
  } = useWeb3React();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector, chainId]);

  // when there's no account connected, react to logins (broadly speaking) on
  // the injected provider, if it exists

  // if the account context isn't active, and there's an error on the network
  // context, it's an irrecoverable error
  if (!active && networkError) {
    // TODO: log error to Sentry
    return <>An internal error occurred. Please try again later.</>;
  }

  return <>{children}</>;
};

export default Web3ReactManager;
