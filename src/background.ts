import AnimelonService from './classes/AnimelonService.ts';
import AnkiConnection from './classes/AnkiConnection.ts';

const anki = new AnkiConnection();
const animelon = new AnimelonService(anki);

animelon.setupRequestHandlers((error: string) => {
	console.error(error);
	browser.notifications.create(null, {
		type   : "basic",
		title  : "AnkiMelon error!",
		message: error,
		//icon   : "",// TODO
	});
});

