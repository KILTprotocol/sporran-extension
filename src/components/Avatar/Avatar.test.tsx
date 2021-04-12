import { Avatar } from './Avatar';
import { render } from '../../testing';

jest.mock('@polkadot/react-identicon');

describe('Avatar', () => {
  it('should render', async () => {
    const { container } = render(
      <Avatar
        tartan="MacFarlane"
        address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
