export interface Phonetic {
    text: string;
}

export interface Translation {
    language: string;
    translations: Array<string>;
}

export interface Phrase {
    phonetics: Phonetic;
    translations: Array<Translation>;
}

export interface Word {
    _id: string;
    phrase: Phrase;
}

export interface Result {
    error: string;
    resArray: Array<Word>;
}
