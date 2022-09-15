import { FormEvent, Fragment, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { BaseDidKey, DidServiceEndpoint } from '@kiltprotocol/types';
import { GenericExtrinsic } from '@polkadot/types';

import { find } from 'lodash-es';

import * as styles from './SignDidExtrinsic.module.css';

import { Identity } from '../../utilities/identities/types';
import { usePopupData } from '../../utilities/popups/usePopupData';
import {
  getIdentityCryptoFromSeed,
  useIdentities,
} from '../../utilities/identities/identities';
import { getFullDidDetails, isFullDid } from '../../utilities/did/did';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { backgroundSignDidExtrinsicChannel } from '../../channels/SignDidExtrinsicChannels/backgroundSignDidExtrinsicChannel';
import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';

import { CopyValue } from '../../components/CopyValue/CopyValue';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';

import {
  getExtrinsicValues,
  getAddServiceEndpoint,
  getRemoveServiceEndpoint,
  getExtrinsic,
} from './didExtrinsic';

function Endpoint({ endpoint }: { endpoint: DidServiceEndpoint }): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <dl className={styles.endpointDetails}>
      {endpoint.urls && endpoint.urls.length > 0 && (
        <div className={styles.fullWidthDetail}>
          <dt className={styles.endpointName}>
            {t('view_SignDidExtrinsic_endpoint_url')}
          </dt>
          <dd className={styles.endpointValue}>{endpoint.urls[0]}</dd>
        </div>
      )}

      {endpoint.types && endpoint.types.length > 0 && (
        <div className={styles.endpointDetail}>
          <dt className={styles.endpointName}>
            {t('view_SignDidExtrinsic_endpoint_type')}
          </dt>
          <dd className={styles.endpointValue}>{endpoint.types[0]}</dd>
        </div>
      )}

      <div className={styles.endpointDetail}>
        <dt className={styles.endpointName}>
          {t('view_SignDidExtrinsic_endpoint_id')}
        </dt>
        <dd className={styles.endpointValue}>{endpoint.id}</dd>
      </div>
    </dl>
  );
}
function AddServiceEndpointExtrinsic({
  identity,
  extrinsic,
}: {
  identity: Identity;
  extrinsic: GenericExtrinsic;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const { did } = identity;

  const endpoint = getAddServiceEndpoint(extrinsic);

  return (
    <Fragment>
      <h1 className={styles.heading}>
        {t('view_SignDidExtrinsic_endpoint_title_add')}
      </h1>
      <p className={styles.subline}>
        {t('view_SignDidExtrinsic_endpoint_subline')}
      </p>

      <IdentitiesCarousel identity={identity} />

      {isFullDid(did) && (
        <CopyValue value={did} label="DID" className={styles.didLine} />
      )}

      <Endpoint endpoint={endpoint} />
    </Fragment>
  );
}

function RemoveServiceEndpointExtrinsic({
  identity,
  extrinsic,
  error,
}: {
  identity: Identity;
  extrinsic: GenericExtrinsic;
  error: ReturnType<typeof useBooleanState>;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const { did } = identity;

  const endpoint = useAsyncValue(getRemoveServiceEndpoint, [
    extrinsic,
    did,
    error,
  ]);

  return (
    <Fragment>
      <h1 className={styles.heading}>
        {t('view_SignDidExtrinsic_endpoint_title_remove')}
      </h1>
      <p className={styles.subline}>
        {t('view_SignDidExtrinsic_endpoint_subline')}
      </p>

      <IdentitiesCarousel identity={identity} />

      {isFullDid(did) && (
        <CopyValue value={did} label="DID" className={styles.didLine} />
      )}

      {endpoint && <Endpoint endpoint={endpoint} />}
    </Fragment>
  );
}

function DidExtrinsic({
  identity,
  extrinsic,
  origin,
  canSelect,
}: {
  identity: Identity;
  extrinsic: GenericExtrinsic;
  origin: string;
  canSelect?: boolean;
}) {
  const t = browser.i18n.getMessage;

  const values = getExtrinsicValues(extrinsic, origin);

  return (
    <Fragment>
      <h1 className={styles.heading}>{t('view_SignDidExtrinsic_title')}</h1>
      <p className={styles.subline}>{t('view_SignDidExtrinsic_subline')}</p>

      {canSelect ? (
        <IdentitiesCarousel identity={identity} />
      ) : (
        <IdentitySlide identity={identity} />
      )}

      <dl className={styles.details}>
        {values.map(({ label, value, details }) => (
          <Fragment key={label}>
            <dt className={styles.detailName}>{label}:</dt>
            <dd
              className={styles.detailValue}
              title={!details ? String(value) : undefined}
            >
              {!details ? (
                value
              ) : (
                <details className={styles.expanded}>
                  <summary>{value}</summary>
                  {details}
                </details>
              )}
            </dd>
          </Fragment>
        ))}
      </dl>
    </Fragment>
  );
}

interface Props {
  identity: Identity;
}

export function SignDidExtrinsic({
  identity: currentIdentity,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const data = usePopupData<SignDidExtrinsicOriginInput>();

  const { signer, origin, signingDid } = data;

  const did = signingDid || currentIdentity.did;

  const identities = useIdentities().data;

  const signingDidIdentity =
    signingDid &&
    identities &&
    find(Object.values(identities), { did: signingDid });

  const identity = signingDidIdentity || currentIdentity;

  const extrinsic = useAsyncValue(getExtrinsic, [data]);

  const removeEndpointError = useBooleanState();

  const extrinsicMethod = extrinsic?.method.method;

  const isServiceEndpointExtrinsic =
    extrinsicMethod === 'addServiceEndpoint' ||
    extrinsicMethod === 'removeServiceEndpoint';

  const isForbidden =
    extrinsic?.method.section === 'did' && !isServiceEndpointExtrinsic;

  const error = [
    !isFullDid(did) && t('view_SignDidExtrinsic_error_light_did'),
    isForbidden && t('view_SignDidExtrinsic_error_forbidden'),
    removeEndpointError.current &&
      t('view_SignDidExtrinsic_endpoint_remove_error'),
  ].filter(Boolean)[0];

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!extrinsic) {
        throw new Error('Missing extrinsic');
      }

      if (isForbidden) {
        throw new Error('This DID call is forbidden');
      }

      const fullDidDetails = await getFullDidDetails(did);

      const { seed } = await passwordField.get(event);
      const { keystore } = await getIdentityCryptoFromSeed(seed);

      let didKey: BaseDidKey | undefined;
      const authorized = await fullDidDetails.authorizeExtrinsic(
        extrinsic,
        keystore,
        signer,
        {
          async keySelection([key]) {
            didKey = key;
            return key;
          },
        },
      );

      if (!didKey) {
        throw new Error('No extrinsic signing key stored');
      }
      const didKeyUri = fullDidDetails.assembleKeyUri(didKey.id);
      const signed = authorized.toHex();

      await backgroundSignDidExtrinsicChannel.return({ signed, didKeyUri });

      window.close();
    },
    [extrinsic, signer, passwordField, did, isForbidden],
  );

  const handleCancelClick = useCallback(async () => {
    await backgroundSignDidExtrinsicChannel.throw('Rejected');
    window.close();
  }, []);

  if (!extrinsic) {
    return null; // blockchain data pending
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      {extrinsicMethod === 'addServiceEndpoint' && (
        <AddServiceEndpointExtrinsic
          identity={identity}
          extrinsic={extrinsic}
        />
      )}

      {extrinsicMethod === 'removeServiceEndpoint' && (
        <RemoveServiceEndpointExtrinsic
          identity={identity}
          extrinsic={extrinsic}
          error={removeEndpointError}
        />
      )}

      {!isServiceEndpointExtrinsic && (
        <DidExtrinsic
          identity={identity}
          extrinsic={extrinsic}
          origin={origin}
          canSelect={!signingDidIdentity}
        />
      )}

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button
          onClick={handleCancelClick}
          type="button"
          className={styles.reject}
        >
          {t('view_SignDidExtrinsic_reject')}
        </button>
        <button
          type="submit"
          className={styles.submit}
          disabled={Boolean(error)}
        >
          {t('common_action_sign')}
        </button>
        <output className={styles.errorTooltip} hidden={!error}>
          {error}
        </output>
      </p>
    </form>
  );
}
