import ReactDOM from 'react-dom';
import React from 'react';
import Options from './classes/components/Options.tsx';
import AnkiConnection from './classes/AnkiConnection.ts';
import Store from './classes/Store.ts';

window.addEventListener('load', () => {
	const anki: AnkiConnection = new AnkiConnection();
	const store = new Store(anki);

	ReactDOM.render(<Options anki={anki} store={store} />, document.body);
});
