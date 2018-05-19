import toHiragana from 'wanakana/es/toHiragana';

export default class Word {
	private word: string;
	private phonetic: string|null;
	private translations: Array<string>;

	constructor(word: string, phonetic: string|null, translations: Array<string>) {
		this.word = word;
		this.phonetic = phonetic;
		this.translations = translations;
	}

	getWord(): string {
		return this.word;
	}

	getTranslationsAsString(): string {
		return this.translations.join(', ');
	}

	getRomaji(): string|null {
		return this.phonetic;
	}

	getHiragana(): string|null {
		if (this.phonetic === null) {
			return null;
		}

		return toHiragana(this.phonetic);
	}

	getFurigana(): string|null {
		if (this.phonetic === null) {
			return null;
		}

		return `${this.word}[${this.getHiragana()}]`;
	}
}
