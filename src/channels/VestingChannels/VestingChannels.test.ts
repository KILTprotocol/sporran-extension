import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { getBalances } from '@kiltprotocol/core/lib/balance/Balance.chain';
import BN from 'bn.js';

import { decryptIdentity } from '../../utilities/identities/identities';
import { originalBalancesMock } from '../balanceChangeChannel/balanceChangeChannel.mock';
import { hasVestedFunds, signVest, submitVest } from './VestingChannels';

jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainApiConnection: {
    getConnectionOrConnect: jest.fn(),
  },
  BlockchainUtils: {
    submitSignedTx: jest.fn(),
  },
}));

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain', () => ({
  getBalances: jest.fn(),
}));

jest.mock('../../utilities/identities/identities', () => ({
  decryptIdentity: jest.fn(),
}));

const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

const vestingInfoMock = {
  isSome: true,
};

const txMock = {
  toHex() {
    return 'hex transaction';
  },
};

const queryInfoMock = {
  partialFee: new BN(0.5e15),
};

const apiMock = {
  query: {
    vesting: { vesting: jest.fn().mockResolvedValue(vestingInfoMock) },
  },
  tx: {
    vesting: { vest: jest.fn().mockReturnValue(txMock) },
  },
  rpc: {
    payment: { queryInfo: jest.fn().mockResolvedValue(queryInfoMock) },
  },
};

const signedTxMock = {
  hash: {
    toHex() {
      return 'Signed tx hash';
    },
  },
  toHex() {
    return 'Signed tx hex';
  },
};

const chainMock = {
  api: apiMock,
  signTx: jest.fn().mockResolvedValue(signedTxMock),
};

(BlockchainApiConnection.getConnectionOrConnect as jest.Mock).mockResolvedValue(
  chainMock,
);

describe('VestingChannels', () => {
  describe('hasVestedFunds', () => {
    it('should return true when has vested funds', async () => {
      const hasVestedFundsResult = await hasVestedFunds(mockAddress);

      expect(hasVestedFundsResult).toBe(true);
      expect(BlockchainApiConnection.getConnectionOrConnect).toHaveBeenCalled();
    });
  });

  describe('signVest', () => {
    it('should return the hash of the signed transaction', async () => {
      const identityMock = {
        identity: true,
      };

      (decryptIdentity as jest.Mock).mockReturnValue(identityMock);

      (getBalances as jest.Mock).mockResolvedValue(originalBalancesMock);

      const hash = await signVest({
        address: mockAddress,
        password: 'password',
      });

      expect(decryptIdentity).toHaveBeenCalledWith(mockAddress, 'password');

      expect(apiMock.tx.vesting.vest).toHaveBeenCalled();

      expect(apiMock.rpc.payment.queryInfo).toHaveBeenCalledWith(
        'Signed tx hex',
      );

      expect(chainMock.signTx).toHaveBeenCalledWith(identityMock, txMock);

      expect(hash).toEqual('Signed tx hash');
    });
  });

  describe('submitVest', () => {
    it('should submit the transaction', async () => {
      await submitVest('Signed tx hash');

      expect(BlockchainUtils.submitSignedTx).toHaveBeenCalledWith(
        signedTxMock,
        expect.anything(),
      );
    });
  });
});
