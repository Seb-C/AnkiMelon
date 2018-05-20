import AnkiConnection from './AnkiConnection.ts';
import Options from '../interfaces/Options.ts';

export default class OptionsStore {
	private readonly DEFAULT_DECK: string              = 'Default';
	private readonly DEFAULT_CARD_TYPE: string         = 'Basic';
	private readonly DEFAULT_WORD_FIELD: string        = 'Front';
	private readonly DEFAULT_TRANSLATION_FIELD: string = 'Back';

	private anki: AnkiConnection;
	private store: browser.storage.StorageArea;

	constructor(anki: AnkiConnection) {
		this.anki = anki;
		this.store = browser.storage.local;
	}

	public getOptions(): Promise<Options> {
		return this.store.get()
			.then((options: any) => options as Options);
	}

	private getOption(key: string, def: any = null): Promise<any> {
		return this.getOptions()
			.then((options: any) => {
				return options[key] || def;
			});
	}
	private setOptions(newOptions: Options) {
		return this.getOptions()
			.then((oldOptions: Options) => {
				return this.store.set({...oldOptions, ...newOptions});
			});
	}

	getDeck(): Promise<string> {
		return this.getOption('deck', this.DEFAULT_DECK);
	}
	setDeck(deck: string) {
		this.setOptions({deck} as Options);
	}

	getCardType(): Promise<string> {
		return this.getOption('cardType', this.DEFAULT_CARD_TYPE);
	}
	setCardType(cardType: string) {
		this.setOptions({cardType} as Options)
			.then(() => this.anki.loadFields(cardType));
	}

	getWordField(): Promise<string> {
		return this.getOption('wordField', this.DEFAULT_WORD_FIELD);
	}
	setWordField(wordField: string) {
		this.store.set({wordField});
	}

	getTranslationField(): Promise<string> {
		return this.getOption('translationField', this.DEFAULT_TRANSLATION_FIELD);
	}
	setTranslationField(translationField: string) {
		this.store.set({translationField});
	}

	getRomajiField(): Promise<string|null> {
		return this.getOption('romajiField', null);
	}
	setRomajiField(romajiField: string|null) {
		this.store.set({romajiField});
	}

	getHiraganaField(): Promise<string|null> {
		return this.getOption('hiraganaField', null);
	}
	setHiraganaField(hiraganaField: string|null) {
		this.store.set({hiraganaField});
	}

	getFuriganaField(): Promise<string|null> {
		return this.getOption('furiganaField', null);
	}
	setFuriganaField(furiganaField: string|null) {
		this.store.set({furiganaField});
	}
}
