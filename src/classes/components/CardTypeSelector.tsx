import ReactDOM from 'react-dom';
import React from 'react';
import OptionsProps from '../../interfaces/OptionsProps.ts';

export default class CardTypeSelector extends React.Component<OptionsProps, any> {
	constructor(props: OptionsProps) {
		super(props);

		this.state = {
			cardTypes: [],
			selectedCardType: null,
		};

		this.props.anki.bindToGetCardTypes((cardTypes: Array<string>) => {
			this.setState({cardTypes});
		});

		this.props.store.getCardType().then((selectedCardType: string) => {
			this.setState({selectedCardType});
		});
	}

	setSelectedCardType(selectedCardType: string) {
		this.props.store.setCardType(selectedCardType);
		this.setState({selectedCardType});
	}

	render() {
		return <select
			className="browser-style"
			value={this.state.selectedCardType}
			onChange={event => this.setSelectedCardType(event.target.value)}
		>
			{this.state.cardTypes.sort().map((cardType: string) => 
				<option value={cardType}>{cardType}</option>
			)}
		</select>;
	}
}
