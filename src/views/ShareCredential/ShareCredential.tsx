import { browser } from 'webextension-polyfill-ts';
import { useCallback, useState } from 'react';
import { minBy } from 'lodash-es';

import { contentShareChannel } from '../../channels/ShareChannels/browserShareChannels';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { usePasswordType } from '../../components/usePasswordType/usePasswordType';
import { Identity, useIdentities } from '../../utilities/identities/identities';

import tableStyles from '../../components/Table/Table.module.css';
import styles from './ShareCredential.module.css';

export function ShareCredential(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const [checked, setChecked] = useState<{ [key: string]: boolean }>({
    '0': true,
  });

  const { passwordType, passwordToggle } = usePasswordType();
  const [password, setPassword] = useState('');

  const handleShareToggle = useCallback(
    ({ target }) => {
      setChecked({
        ...checked,
        [target.name]: target.checked,
      });
    },
    [checked],
  );

  const handleShareAllToggle = useCallback(({ target }) => {
    const newChecked: { [key: string]: boolean } = {};

    const { elements } = target.form;
    [...elements].forEach((input: HTMLInputElement) => {
      if (input.type === 'checkbox' && input !== elements.all) {
        newChecked[input.name] = elements.all.checked;
      }
    });

    setChecked(newChecked);
  }, []);

  const handlePasswordInput = useCallback((event) => {
    setPassword(event.target.value);
  }, []);

  const handleCancel = useCallback(() => {
    window.close();
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    await contentShareChannel.return({});
    window.close();
  }, []);

  const identities = useIdentities().data;
  if (!identities) {
    return null; // storage data pending
  }

  const identity = minBy(Object.values(identities), 'index') as Identity;

  // TODO: use real data
  const credentials = [
    {
      Name: 'email private',
      'Full Name': 'Ingo Rübe',
      Email: 'ingo@kilt.io',
      'Credential type': 'BL-Mail-Simple',
      Attester: 'SocialKYC',
      valid: true,
    },
    {
      Name: 'twitter',
      'Credential type': 'BL-Mail-Advanced',
      Attester: 'SocialKYC',
      valid: true,
    },
  ];

  const allChecked = credentials.every((dummy, index) => checked[index]);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_ShareCredential_heading')}</h1>
      <p className={styles.subline}>{t('view_ShareCredential_subline')}</p>

      <IdentitySlide identity={identity} />

      <table className={styles.credentials}>
        <thead>
          <tr className={tableStyles.tr}>
            <th className={tableStyles.th}>
              <label>
                <input
                  type="checkbox"
                  name="all"
                  checked={allChecked}
                  onChange={handleShareAllToggle}
                  className={styles.checkbox}
                />
                <span />
                {t('view_ShareCredential_all')}
              </label>
            </th>
            <th className={tableStyles.th}>{t('view_ShareCredential_name')}</th>
            <th className={tableStyles.th}>
              {t('view_ShareCredential_ctype')}
            </th>
            <th className={tableStyles.th}>
              {t('view_ShareCredential_attester')}
            </th>
            <th className={tableStyles.th}>
              {t('view_ShareCredential_valid')}
            </th>
          </tr>
        </thead>
        <tbody>
          {credentials.map((credential, index) => (
            <tr key={credential.Name} className={tableStyles.tr}>
              <td className={tableStyles.td}>
                <label>
                  <input
                    type="checkbox"
                    name={String(index)}
                    checked={Boolean(checked[index])}
                    onChange={handleShareToggle}
                    className={styles.checkbox}
                    aria-label={t('view_ShareCredential_share')}
                  />
                  <span />
                </label>
              </td>
              <td className={tableStyles.td}>{credential.Name}</td>
              <td className={tableStyles.td}>
                {credential['Credential type']}
              </td>
              <td className={tableStyles.td}>{credential.Attester}</td>
              <td
                className={credential.valid ? styles.valid : tableStyles.td}
                aria-label={
                  credential.valid ? t('view_ShareCredential_valid') : undefined
                }
              />
            </tr>
          ))}
        </tbody>
      </table>

      <label className={styles.label}>
        {t('view_ShareCredential_password')}
        <span className={styles.passwordLine}>
          <input
            name="password"
            type={passwordType}
            className={styles.password}
            required
            onInput={handlePasswordInput}
          />
          {passwordToggle}
        </span>
      </label>

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={handleCancel}>
          {t('common_action_cancel')}
        </button>
        <button type="submit" className={styles.submit} disabled={!password}>
          {t('view_ShareCredential_CTA')}
        </button>
      </p>
    </form>
  );
}
