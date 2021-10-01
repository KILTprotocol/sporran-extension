import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { paths, generatePath } from '../paths';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { Avatar } from '../../components/Avatar/Avatar';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';

import styles from './DidExplainer.module.css';

interface Props {
  identity: Identity;
}

export function DidExplainer({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_DidExplainer_heading')}</h1>
      <p className={styles.subline}>{t('view_DidExplainer_subline')}</p>

      <IdentitySlide identity={identity} />

      <div className={styles.functionality}>
        <Avatar className={styles.avatar} identity={identity} />
        {t('view_DidExplainer_functionality')}
      </div>
      <p className={styles.deposit}>{t('view_DidExplainer_deposit')}</p>

      <Link
        to={generatePath(paths.identity.did.upgrade, {
          address: identity.address,
        })}
        className={styles.upgrade}
      >
        {t('view_DidExplainer_CTA')}
      </Link>

      <LinkBack />
      <Stats />
    </section>
  );
}
