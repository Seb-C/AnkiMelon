import Word from './classes/Word.ts';

interface Message {
	action: string,
	payload: any,
}

function addAnkiMelonIconTo(element: Element) {
	if (element.getElementsByClassName('ankimelon-icon').length == 0) {
		const icon = document.createElement('img');
		icon.className = 'ankimelon-icon';
		icon.src = browser.extension.getURL('icon.png');
		icon.setAttribute(
			'style',
			'width: 24px; float: left; margin-right: 5px;'
		);
		icon.title = 'Synchronized with Anki';
		element.insertBefore(icon, element.firstChild);
	}
}

function elementContainsWord(element: Node, word: string) {
	return (element.textContent || "").indexOf(word) !== -1;
}

browser.runtime.onMessage.addListener((message: Message) => {
	if (message.action == "wordAddedToAnki") {
		const word: string = message.payload;

		const currentLookup = document.querySelector('.detailed-translation-container') as Element;
		if (currentLookup) {
			const lookupContainer = currentLookup.parentNode!.parentNode! as Element;

			if (elementContainsWord(lookupContainer, word)) {
				const lookupBodyContainer = lookupContainer.getElementsByClassName('body')[0];
				addAnkiMelonIconTo(lookupBodyContainer as Element);
			}
		}

		Array.prototype.forEach.call(
			document.querySelectorAll(
				'.translation-history-container .phrase-top'
			),
			(historyWordContainer: Node) => {
				if (elementContainsWord(historyWordContainer, word)) {
					addAnkiMelonIconTo(historyWordContainer as Element);
				}
			}
		);
	}
});
