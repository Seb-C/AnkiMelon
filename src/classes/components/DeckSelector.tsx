import ReactDOM from 'react-dom';
import React from 'react';
import OptionsProps from '../../interfaces/OptionsProps.ts';

export default class DeckSelector extends React.Component<OptionsProps, any> {
	constructor(props: OptionsProps) {
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
