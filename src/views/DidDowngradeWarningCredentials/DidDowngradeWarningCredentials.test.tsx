import { Attestation } from '@kiltprotocol/core';

import { identitiesMock as identities, render } from '../../testing/testing';

import { waitForDownloadInfo } from '../../utilities/showDownloadInfoStorage/showDownloadInfoStorage.mock';
import { waitForPresentationInfo } from '../../utilities/showPresentationInfoStorage/showPresentationInfoStorage.mock';
import { mockIsFullDid } from '../../utilities/did/did.mock';

import { parseDidUri, sameFullDid } from '../../utilities/did/did';

import { DidDowngradeWarningCredentials } from './DidDowngradeWarningCredentials';

jest.mock('../../utilities/did/did');
jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as ReturnType<typeof parseDidUri>);
jest.mocked(sameFullDid).mockReturnValue(true);
jest.mocked(Attestation.query).mockResolvedValue(null);

describe('DidDowngradeWarningCredentials', () => {
  it('should render', async () => {
    mockIsFullDid(true);
    const { container } = render(
      <DidDowngradeWarningCredentials
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />,
    );
    await waitForDownloadInfo();
    await waitForPresentationInfo();
    expect(container).toMatchSnapshot();
  });
});
