type DecksApiResult = Array<string>;
type DecksCallback = (decks: Array<string>) => void

type CardTypesApiResult = Array<string>;
type CardTypesCallback = (cardTypes: Array<string>) => void

type FieldsApiResult = Array<string>;
type FieldsCallback = (cardTypes: Array<string>) => void

export default class AnkiConnection {
	private query(action: string, params: any = {}): Promise<any> {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.addEventListener('error', () => {
				reject('failed to connect to AnkiConnect'); // TODO error message ?
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
}
