import AnkiConnection from '../classes/AnkiConnection.ts';
import Store from '../classes/Store.ts';

export default interface OptionsProps {
	anki: AnkiConnection,
	store: Store,
}
