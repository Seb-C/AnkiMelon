import ReactDOM from 'react-dom';
import React from 'react';
import Options from './classes/components/Options.tsx';
import AnkiConnection from './classes/AnkiConnection.ts';
import OptionsStore from './classes/OptionsStore.ts';

window.addEventListener('load', () => {
	const anki: AnkiConnection = new AnkiConnection();
	const store = new OptionsStore(anki);

	ReactDOM.render(<Options anki={anki} store={store} />, document.body);
});
