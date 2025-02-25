import { injectExtension } from '@polkadot/extension-inject';

import { injectedAccessChannel } from '../AccessChannels/injectedAccessChannel';
import { IdentitiesInjectedAPI } from '../IdentitiesInjectedAPI/IdentitiesInjectedAPI';
import { SignerInjectedAPI } from '../SignerInjectedAPI/SignerInjectedAPI';

export function injectIntoDApp(version: string): void {
  const sporranMeta = {
    name: 'Sporran', // manifest_name
    version,
  };

  // @ts-expect-error FIXME: different versions of @polkadot/types used by our code and by @polkadot/extension-inject
  injectExtension(async (unsafeDAppName: string) => {
    const dAppName = unsafeDAppName.substring(0, 50);
    await injectedAccessChannel.get({ dAppName });

    return {
      accounts: new IdentitiesInjectedAPI(dAppName),
      signer: new SignerInjectedAPI(dAppName),
    };
  }, sporranMeta);
}
