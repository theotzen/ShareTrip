import React from 'react';
import ReactDOM from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import App from './App';
import messages from './messages';

window.React = React

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
        <IntlProvider locale="fr" messages={messages.fr}>
            <App />
        </IntlProvider>
);
