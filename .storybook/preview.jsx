import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import { MemoryRouter } from 'react-router-dom';
import { init } from '@kiltprotocol/core';

import { AccountsProviderMock } from '../src/testing/AccountsProviderMock';
import { ViewDecorator } from '../src/components/View/ViewDecorator';
import '../src/views/App/App.css';

init({ address: 'wss://full-nodes-lb.devnet.kilt.io' });

// You'll start to receive all console messages, warnings, errors in your action logger panel - Everything except HMR logs.
setConsoleOptions({
  panelExclude: [],
});

export const decorators = [
  // You'll receive console outputs as a console,
  // warn and error actions in the panel. You might want to know from
  // what stories they come. In this case, add withConsole decorator:
  (storyFn, context) => withConsole()(storyFn)(context),

  ViewDecorator,

  (Story) => (
    <MemoryRouter>
      <AccountsProviderMock>
        <Story />
      </AccountsProviderMock>
    </MemoryRouter>
  ),
];

export const parameters = {
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      popup: {
        name: 'Extension Popup',
        type: 'desktop',
        styles: {
          height: '600px',
          width: '480px',
        },
      },
    },
    defaultViewport: 'popup',
  },
  layout: 'fullscreen',
};
