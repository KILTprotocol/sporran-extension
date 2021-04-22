import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { accountsMock as accounts } from '../../testing/AccountsProviderMock';
import { NEW } from '../../utilities/accounts/accounts';
import { paths } from '../paths';

import { AccountOverview } from './AccountOverview';

export default {
  title: 'Views/AccountOverview',
  component: AccountOverview,
  argTypes: {
    successType: {
      control: {
        type: 'radio',
        options: ['created', 'imported', 'reset', undefined],
      },
    },
  },
} as Meta;

export function Template(props: {
  successType?: 'created' | 'imported' | 'reset';
}): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/send',
      ]}
    >
      <Route path={paths.account.overview}>
        <AccountOverview
          account={accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
          {...props}
        />
      </Route>
    </MemoryRouter>
  );
}

export function New(): JSX.Element {
  return (
    <MemoryRouter initialEntries={['/account/NEW/send']}>
      <Route path={paths.account.overview}>
        <AccountOverview account={NEW} />
      </Route>
    </MemoryRouter>
  );
}
