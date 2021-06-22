import userEvent from '@testing-library/user-event';
import { browser } from 'webextension-polyfill-ts';

import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '../../testing/testing';
import { saveAccount } from '../../utilities/accounts/accounts';

import { AccountSlide } from './AccountSlide';
import { AccountSlideNew } from './AccountSlideNew';

jest.mock('../../utilities/accounts/accounts');
jest.spyOn(browser.runtime, 'sendMessage');

const account = {
  name: 'My Sporran Account',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
  index: 1,
};

describe('AccountSlide', () => {
  it('should render', async () => {
    const { container } = render(<AccountSlide account={account} />);
    expect(container).toMatchSnapshot();
  });

  it('should enable editing the account name', async () => {
    render(<AccountSlide account={account} />);

    userEvent.click(await screen.findByLabelText('Account options'));
    userEvent.click(
      await screen.findByRole('menuitem', { name: 'Edit account name' }),
    );
    userEvent.type(await screen.findByLabelText('Account name:'), ' Foo');

    const saveButton = await screen.findByRole('button', { name: 'Save' });
    userEvent.click(saveButton);

    expect(saveAccount).toHaveBeenCalledWith({
      name: 'My Sporran Account Foo',
      address: account.address,
      index: 1,
    });

    await waitForElementToBeRemoved(saveButton);
  });
});

describe('AccountSlideNew', () => {
  it('should render', async () => {
    const { container } = render(<AccountSlideNew />);

    expect(container).toMatchSnapshot();
  });
});
