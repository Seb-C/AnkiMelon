import ReactDOM from 'react-dom';
import React from 'react';
import OptionsComponentsProps from '../../interfaces/OptionsComponentsProps.ts';

export default class DeckSelector extends React.Component<OptionsComponentsProps, any> {
	constructor(props: OptionsComponentsProps) {
		super(props);

		this.state = {
			decks: [],
			selectedDeck: null,
		};

		this.props.anki.bindToGetDecks((decks: Array<string>) => {
			this.setState({decks});
		});

		this.props.store.getDeck().then((selectedDeck: string) => {
			this.setState({selectedDeck});
		});
	}

	setSelectedDeck(selectedDeck: string) {
		this.props.store.setDeck(selectedDeck);
		this.setState({selectedDeck});
	}

	render() {
		return <select
			className="browser-style"
			value={this.state.selectedDeck}
			onChange={event => this.setSelectedDeck(event.target.value)}
		>
			{this.state.decks.sort().map((deckName: string) => 
				<option value={deckName}>{deckName}</option>
			)}
		</select>;
	}
}
