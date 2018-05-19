import Word from './Word.ts';
import { Word as ApiLookupWord } from '../interfaces/Api/Animelon/Lookup.ts';
import AnkiConnection from './AnkiConnection.ts';
import {
	Translation as ApiHistoryTranslation,
	Word as ApiHistoryWord,
	Result as ApiHistoryResult,
} from '../interfaces/Api/Animelon/History.ts';

type OnError = (error: string) => void;
type OnSuccess = (data: any, onError: OnError) => void;

export default class AnimelonService {
	private readonly HISTORY_URL = "*://animelon.com/api/*/translationHistoryAll/jp*";
	private readonly LOOKUP_URL  = "*://animelon.com/api/translationService/translate/";

	private anki: AnkiConnection;

	constructor(anki: AnkiConnection) {
		this.anki = anki;
	}

	setupRequestHandlers(onError: OnError) {
		this.onRequest(this.HISTORY_URL, this.handleHistoryResult.bind(this), onError);
		this.onRequest(this.LOOKUP_URL, this.handleLookupResult.bind(this), onError);
	}

	onRequest(url: string, onSuccess: OnSuccess, onError: OnError) {
		browser.webRequest.onBeforeRequest.addListener(request => {
			var stream = browser.webRequest.filterResponseData(request.requestId);
			var decoder = new TextDecoder("utf-8");

			var data = '';
			stream.ondata = event => {
				data += decoder.decode(event.data);
				stream.write(event.data);
			};
			stream.onstop = event => {
				stream.disconnect();
				var resultData = JSON.parse(data);
				if (resultData && resultData.error) {
					onError(resultData.error);
				} else {
					onSuccess(resultData, onError);
				}
			};
			stream.onerror = event => {
				onError(stream.error);
			};
		}, {urls: [url]}, ["blocking"]);
	}

	createWordFromHistoryFormat(wordData: ApiHistoryWord): Word {
		var translations: Array<string> = [];
		wordData.phrase.translations.forEach((lang: ApiHistoryTranslation) => {
			if (lang.language == 'en') {
				translations.push(...lang.translations);
			}
		});

		return new Word(
			wordData._id,
			wordData.phrase.phonetics.text || null,
			translations
		);
	}

	createWordFromLookupFormat(wordData: ApiLookupWord): Word {
		return new Word(
			wordData.originalPhrase,
			wordData.phoneticText,
			wordData.data
		);
	}

	handleHistoryResult(data: ApiHistoryResult, onError: OnError) {
		return Promise.all(data.resArray.map((wordData: ApiHistoryWord) => {
			return this.anki.addWord(this.createWordFromHistoryFormat(wordData));
		}))
			.catch(onError);
	}

	handleLookupResult(wordData: ApiLookupWord, onError: OnError) {
		return this.anki.addWord(this.createWordFromLookupFormat(wordData))
			.catch(onError);
	}
}
