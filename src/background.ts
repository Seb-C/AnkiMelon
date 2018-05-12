import Word from './classes/Word.ts';
import {
	Translation as ApiHistoryTranslation,
	Word as ApiHistoryWord,
	Result as ApiHistoryResult,
} from './interfaces/ApiHistory.ts';
import { Word as ApiLookupWord } from './interfaces/ApiLookup.ts';

function catchRequest(url: string): Promise<any> {
	return new Promise((resolve, reject) => {
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
					reject(resultData.error);
				} else {
					resolve(resultData);
				}
			};
			stream.onerror = event => {
				reject(stream.error);
			};
		}, {urls: [url]}, ["blocking"]);
	});
}

function createWordFromHistoryFormat(wordData: ApiHistoryWord): Word {
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

function createWordFromLookupFormat(wordData: ApiLookupWord): Word {
	return new Word(
		wordData.originalPhrase,
		wordData.phoneticText,
		wordData.data
	);
}

function addWordToAnki(word: Word): Promise<Word> {
	return new Promise((resolve, reject) => {
		console.log('add', word);
	});
}

function incrementAnkiLookupCounter(word: Word): Promise<Word> {
	return new Promise((resolve, reject) => {
		console.log('increment', word);
	});
}

catchRequest("*://animelon.com/api/*/translationHistoryAll/jp*")
	.then((data: ApiHistoryResult) => Promise.all(data.resArray.map(
		(wordData: ApiHistoryWord) => Promise.resolve(createWordFromHistoryFormat(wordData))
		.then(addWordToAnki)
		.then((word: Word) => console.log('Added word to Anki from history', word))
	)))
	.then((words: any) => console.log('Added all words to Anki from history', words));

catchRequest("*://animelon.com/api/translationService/translate/")
	.then(createWordFromLookupFormat)
	.then(addWordToAnki)
	.then(incrementAnkiLookupCounter)
	.then((word: Word) => console.log('Added word to Anki from lookup: ', word));
