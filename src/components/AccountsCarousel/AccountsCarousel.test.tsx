import {
  accountsMock as accounts,
  moreAccountsMock as moreAccounts,
  render,
} from '../../testing/testing';
import { paths } from '../../views/paths';

import { NEW } from '../../utilities/accounts/accounts';

import { AccountsCarousel, AccountsBubbles } from './AccountsCarousel';

describe('AccountsCarousel', () => {
  it('should render normal accounts', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.overview}
        account={accounts['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the first account', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.overview}
        account={accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the last account', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.overview}
        account={accounts['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new account', async () => {
    const { container } = render(
      <AccountsCarousel path={paths.account.overview} account={NEW} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should support other paths', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.send.start}
        account={accounts['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a bubble for each account', async () => {
    const { container } = render(
      <AccountsBubbles
        accounts={Object.values(accounts)}
        path={paths.account.overview}
      />,
    );

    expect(container).toMatchSnapshot();
  });
  it('should not render bubbles if number of accounts is more than the maximum', async () => {
    const { container } = render(
      <AccountsBubbles
        accounts={Object.values(moreAccounts)}
        path={paths.account.overview}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
