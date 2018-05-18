import ReactDOM from 'react-dom';
import React from 'react';
import OptionsProps from '../../interfaces/OptionsProps.ts';
import DeckSelector from './DeckSelector.tsx';
import CardTypeSelector from './CardTypeSelector.tsx';
import WordFieldSelector from './WordFieldSelector.tsx';
//import TranslationFieldSelector from './TranslationFieldSelector.tsx';
//import RomajiFieldSelector from './RomajiFieldSelector.tsx';
//import HiraganaFieldSelector from './HiraganaFieldSelector.tsx';
//import FuriganaFieldSelector from './FuriganaFieldSelector.tsx';

export default class Options extends React.Component<OptionsProps, any> {
	render() {
		return <form>
			<h1>Anki synchronization options</h1>
			<label className="browser-style-label">
				<span>Deck:</span>
				<DeckSelector {...this.props} />
			</label>
			<label>
				<span>Type of card:</span>
				<CardTypeSelector {...this.props} />
			</label>
			<label>
				<span>Word:</span>
				<WordFieldSelector {...this.props} />
			</label>
			{/*<label>
				<span>Translation:</span>
				<TranslationFieldSelector {...this.props} />
			</label>
			<label>
				<span>Romaji:</span>
				<RomajiFieldSelector {...this.props} />
			</label>
			<label>
				<span>Hiragana:</span>
				<HiraganaFieldSelector {...this.props} />
			</label>
			<label>
				<span>Furigana:</span>
				<FuriganaFieldSelector {...this.props} />
			</label>*/}
		</form>;
	}
}
