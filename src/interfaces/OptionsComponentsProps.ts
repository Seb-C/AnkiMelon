import AnkiConnection from '../classes/AnkiConnection.ts';
import OptionsStore from '../classes/OptionsStore.ts';

export default interface OptionsComponentsProps {
	anki: AnkiConnection,
	store: OptionsStore,
}
