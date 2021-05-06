import { useCallback, useEffect, useState } from 'react';
import BN from 'bn.js';
import { ClipLoader } from 'react-spinners';
import { browser } from 'webextension-polyfill-ts';

import {
  BalanceChangeResponse,
  BalanceMessageType,
  sendBalanceChangeRequest,
} from '../../connection/BalanceMessages/BalanceMessages';
import { KiltAmount } from '../KiltAmount/KiltAmount';

import styles from './Balance.module.css';

interface BalanceProps {
  address: string;
}

export function useAddressBalance(address: string): BN | null {
  const [balance, setBalance] = useState<BN | null>(null);

  const balanceListener = useCallback(
    (message: BalanceChangeResponse) => {
      if (
        message.type === BalanceMessageType.balanceChangeResponse &&
        message.data.address === address
      ) {
        setBalance(new BN(message.data.balance));
      }
    },
    [address],
  );

  useEffect(() => {
    browser.runtime.onMessage.addListener(balanceListener);
    sendBalanceChangeRequest(address);

    return () => {
      browser.runtime.onMessage.removeListener(balanceListener);
    };
  }, [address, balanceListener]);

  return balance;
}

export function Balance({ address }: BalanceProps): JSX.Element {
  const t = browser.i18n.getMessage;
  const balance = useAddressBalance(address);

  return (
    <p className={styles.balance}>
      {t('component_Balance_label')}
      {balance !== null && <KiltAmount amount={balance} />}

      {balance === null && <ClipLoader size={10} />}
    </p>
  );
}
