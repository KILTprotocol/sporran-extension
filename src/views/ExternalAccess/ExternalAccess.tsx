import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { groupBy, mapValues } from 'lodash-es';

import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import {
  getAuthorized,
  getDAppHostName,
  setAuthorized,
} from '../../utilities/authorizedStorage/authorizedStorage';
import { paths } from '../paths';

import styles from './ExternalAccess.module.css';

interface HostNames {
  [hostName: string]: {
    key: string;
    checked: boolean;
  }[];
}

function useHostNames(setHostNames: (hostNames: HostNames) => void): void {
  useEffect(() => {
    (async () => {
      const stored = await getAuthorized();

      const keysAndAccess = mapValues(stored, (checked, key) => ({
        key,
        checked,
      }));
      const groupedHostNames = groupBy(keysAndAccess, ({ key }) =>
        getDAppHostName(key),
      );

      setHostNames(groupedHostNames);
    })();
  }, [setHostNames]);
}

export function ExternalAccess(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const [hostNames, setHostNames] = useState<HostNames | null>(null);
  useHostNames(setHostNames);

  const handleChange = useCallback(
    (event) => {
      if (!hostNames) {
        return;
      }

      const { name, checked } = event.target;
      const keysAndAccess = hostNames[name];

      const updated = keysAndAccess.map(({ key }) => ({ key, checked }));
      setHostNames({
        ...hostNames,
        [name]: updated,
      });

      (async () => {
        const authorized = await getAuthorized();
        keysAndAccess.forEach(({ key }) => {
          authorized[key] = checked;
        });
        await setAuthorized(authorized);
      })();
    },
    [hostNames],
  );

  if (!hostNames) {
    return null; // storage data pending
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_ExternalAccess_heading')}</h1>
      <p className={styles.subline}>{t('view_ExternalAccess_subline')}</p>

      <small className={styles.small}>{t('view_ExternalAccess_small')}</small>

      <ul className={styles.list}>
        {Object.entries(hostNames).map(([hostName, keysAndAccess]) => (
          <li key={hostName}>
            <label className={styles.label}>
              {hostName}
              <span className={styles.denied} aria-hidden>
                {t('view_ExternalAccess_denied')}
              </span>
              <input
                name={hostName}
                className={styles.toggle}
                type="checkbox"
                defaultChecked={keysAndAccess[0].checked}
                onClick={handleChange}
              />
              <span />
              <span className={styles.allowed} aria-hidden>
                {t('view_ExternalAccess_allowed')}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <Link className={styles.back} to={paths.home}>
        {t('view_ExternalAccess_back')}
      </Link>

      <LinkBack />
      <Stats />
    </section>
  );
}
