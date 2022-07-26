import {
  DocumentNode,
  OperationVariables,
  SubscriptionHookOptions,
  SubscriptionResult,
  TypedDocumentNode,
  useApolloClient,
} from '@apollo/client';
import { useEffect, useState } from 'react';

import { objToKey } from '../utils';
import { useIsMounted } from '.';

export const useSubscription = <TData = any, TVariables = OperationVariables>(
  subscription: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: SubscriptionHookOptions<TData, TVariables>
): SubscriptionResult<TData> => {
  const isMounted = useIsMounted();
  const [result, setResult] = useState<SubscriptionResult<TData>>({
    loading: true,
  });

  const client = useApolloClient();
  useEffect(() => {
    if (options?.skip) {
      return;
    }
    const subscriptionInstance = client
      .subscribe({
        ...options,
        query: subscription,
      })
      .subscribe(
        (nextResult) => {
          if (isMounted.current) {
            setResult({
              data: nextResult.data ?? undefined,
              error: undefined,
              loading: false,
            });
          }
        },
        (error) => {
          if (isMounted.current) {
            setResult({
              data: undefined,
              error: error,
              loading: false,
            });
          }
        }
      );
    return () => {
      setResult({
        data: undefined,
        error: undefined,
        loading: true,
      });
      subscriptionInstance.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, isMounted, objToKey(options || {}), subscription]);

  return result;
};
