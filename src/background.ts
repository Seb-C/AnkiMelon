import AnimelonService from './classes/AnimelonService.ts';
import AnkiConnection from './classes/AnkiConnection.ts';
import OptionsStore from './classes/OptionsStore.ts';

const anki = new AnkiConnection();
const animelon = new AnimelonService();
const store = new OptionsStore(anki);

animelon.setupRequestHandlers(anki, store, (error: string) => {
	console.error(error);
	browser.notifications.create(null, {
		type   : "basic",
		title  : "AnkiMelon error!",
		message: error,
		iconUrl: "icon.png",
	});
});
