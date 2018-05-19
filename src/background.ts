import AnimelonService from './classes/AnimelonService.ts';
import AnkiConnection from './classes/AnkiConnection.ts';

const anki = new AnkiConnection();
const animelon = new AnimelonService(anki);

animelon.setupRequestHandlers((error: string) => {
	console.error(error); // TODO
});
