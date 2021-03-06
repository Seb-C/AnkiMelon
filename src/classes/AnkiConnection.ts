import Word from './Word.ts';
import OptionsStore from './OptionsStore.ts';
import Options from '../interfaces/Options.ts';

type ErrorHandler = (error: string) => void

type DecksApiResult = Array<string>;
type DecksCallback = (decks: Array<string>) => void

type CardTypesApiResult = Array<string>;
type CardTypesCallback = (cardTypes: Array<string>) => void

type FieldsApiResult = Array<string>;
type FieldsCallback = (cardTypes: Array<string>) => void

export default class AnkiConnection {
	private query(action: string, params: any = {}): Promise<any> {
		const query = new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.addEventListener('error', () => {
				reject('Failed to connect to Anki. Did you start it?');
			});
			xhr.addEventListener('load', () => {
				try {
					const response = JSON.parse(xhr.responseText);
					if (response.error) {
						reject(response.error);
					} else {
						resolve(response.result);
					}
				} catch (e) {
					reject(e);
				}
			});

			xhr.open('POST', 'http://localhost:8765/', true);
			xhr.send(JSON.stringify({action, version: 5, params}));
		});

		if (this.errorHandler !== null) {
			return query.catch(this.errorHandler);
		} else {
			return query;
		}
	}

	private errorHandler: ErrorHandler|null = null;
	public setErrorHandler(callback: ErrorHandler) {
		this.errorHandler = callback;
	}

	private loadDecksBindings: Array<DecksCallback> = [];
	private loadDecksLastResult: DecksApiResult|null = null;
	public loadDecks(): Promise<DecksApiResult> {
		return this.query('deckNames')
			.then((decks: DecksApiResult) => {
				this.loadDecksBindings.map((callback: DecksCallback) => {
					callback(decks);
				});
				this.loadDecksLastResult = decks;
				return decks;
			});
	}
	public bindToGetDecks(callback: DecksCallback) {
		if (this.loadDecksLastResult === null) {
			this.loadDecks().then(callback);
		} else {
			callback(this.loadDecksLastResult);
		}

		// Done after calling it to avoid it being called twice
		this.loadDecksBindings.push(callback);
	}

	private loadCardTypesBindings: Array<CardTypesCallback> = [];
	private loadCardTypesLastResult: CardTypesApiResult|null = null;
	public loadCardTypes(): Promise<CardTypesApiResult> {
		return this.query('modelNames')
			.then((cardTypes: CardTypesApiResult) => {
				this.loadCardTypesBindings.map((callback: CardTypesCallback) => {
					callback(cardTypes);
				});
				this.loadCardTypesLastResult = cardTypes;
				return cardTypes;
			});
	}
	public bindToGetCardTypes(callback: CardTypesCallback) {
		if (this.loadCardTypesLastResult === null) {
			this.loadCardTypes().then(callback);
		} else {
			callback(this.loadCardTypesLastResult);
		}

		// Done after calling it to avoid it being called twice
		this.loadCardTypesBindings.push(callback);
	}

	private loadFieldsBindings: Array<FieldsCallback> = [];
	private loadFieldsLastResult: FieldsApiResult|null = null;
	public loadFields(cardType: string): Promise<FieldsApiResult> {
		return this.query('modelFieldNames', {modelName: cardType})
			.then((fields: FieldsApiResult) => {
				this.loadFieldsBindings.map((callback: FieldsCallback) => {
					callback(fields);
				});
				this.loadFieldsLastResult = fields;
				return fields;
			});
	}
	public bindToGetFields(cardType: string|null, callback: FieldsCallback) {
		if (cardType !== null) {
			if (this.loadFieldsLastResult === null) {
				this.loadFields(cardType).then(callback);
			} else {
				callback(this.loadFieldsLastResult);
			}
		}

		// Done after calling it to avoid it being called twice
		this.loadFieldsBindings.push(callback);
	}
	public getFields(cardType: string): Promise<FieldsApiResult> {
		if (this.loadFieldsLastResult === null) {
			return this.loadFields(cardType);
		} else {
			return Promise.resolve(this.loadFieldsLastResult);
		}
	}

	public addWord(word: Word, store: OptionsStore): Promise<Word> {
		return store.getOptions().then((options: Options) => {
			return this.query('findNotes', {
				"query": '"' + (
					`${options.wordField}:${word.getWord()}`
						.replace(/"/g, '\\"')
				) + '"',
			}).then((foundIds: Array<number>) => {
				if (foundIds.length > 0) {
					return this.query('addTags', {
						notes: foundIds,
						tags: "Animelon",
					});
				} else {
					return this.getFields(options.cardType).then((cardTypeFields: FieldsApiResult) => {
						var fields: any = {};
						fields[options.wordField] = word.getWord();
						fields[options.translationField] = word.getTranslationsAsString();
						if (options.romajiField) {
							fields[options.romajiField] = word.getRomaji();
						}
						if (options.hiraganaField) {
							fields[options.hiraganaField] = word.getHiragana();
						}
						if (options.furiganaField) {
							fields[options.furiganaField] = word.getFurigana();
						}

						if (!fields.hasOwnProperty(cardTypeFields[0])) {
							// A note where the first field is empty is not allowed in Anki
							fields[cardTypeFields[0]] = 'Animelon ' + word.getWord();
						}

						return this.query('addNote', {
							"note": {
								"deckName": options.deck,
								"modelName": options.cardType,
								"fields": fields,
								"tags": [
									"Animelon"
								],
							},
						}).catch ((error: string) => {
							// TODO find a better way to handle this case
							if (error.startsWith('Note is duplicate of existing note.')) {
								console.log('Ignored error: ', error);
								return Promise.resolve();
							} else {
								return Promise.reject(error);
							}
						});
					});
				}
			});
		}).then(() => word);
	}
}
