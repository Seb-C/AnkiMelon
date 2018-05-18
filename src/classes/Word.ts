export default class Word {
	word: string;
	phonetic: string|null;
	translations: Array<string>;

	constructor(word: string, phonetic: string|null, translations: Array<string>) {
		this.word = word;
		this.phonetic = phonetic;
		this.translations = translations;
	}
}
