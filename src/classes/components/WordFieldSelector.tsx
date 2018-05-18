import ReactDOM from 'react-dom';
import React from 'react';
import OptionsProps from '../../interfaces/OptionsProps.ts';

export default class WordFieldSelector extends React.Component<OptionsProps, any> {
	constructor(props: OptionsProps) {
		super(props);

		this.state = {
			fields: [],
			selectedWordField: null,
		};

		this.props.store.getCardType().then((cardType: string) => {
			this.props.anki.bindToGetFields(cardType, (fields: Array<string>) => {
				this.setState({fields});
			});
		});

		this.props.store.getWordField().then((selectedWordField: string) => {
			this.setState({selectedWordField});
		});
	}

	setSelectedWordField(selectedWordField: string) {
		this.props.store.setWordField(selectedWordField);
		this.setState({selectedWordField});
	}

	render() {
		return <select
			className="browser-style"
			value={this.state.selectedWordField}
			onChange={event => this.setSelectedWordField(event.target.value)}
		>
			{this.state.fields.sort().map((fieldName: string) => 
				<option value={fieldName}>{fieldName}</option>
			)}
		</select>;
	}
}
