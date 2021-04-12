import { browser } from 'webextension-polyfill-ts';

import { render, screen } from '../../testing';
import {
  BalanceChangeRequest,
  BalanceChangeResponse,
  MessageType,
} from '../../connection/MessageType';

import { Balance } from './Balance';

jest.spyOn(browser.runtime, 'sendMessage');
jest
  .spyOn(browser.runtime.onMessage, 'addListener')
  .mockImplementation(async (callback) => {
    const response = {
      type: MessageType.balanceChangeResponse,
      data: {
        address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
        balance: '04625103a72000',
      },
    } as BalanceChangeResponse;
    callback(response, {});
  });

describe('Balance', () => {
  it('should render', async () => {
    const address = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';
    const { container } = render(<Balance address={address} />);

    await screen.findByText(/K/);

    expect(container).toMatchSnapshot();
    expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
      type: MessageType.balanceChangeRequest,
      data: { address },
    } as BalanceChangeRequest);
  });
});
