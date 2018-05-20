import ReactDOM from 'react-dom';
import React from 'react';
import OptionsComponentsProps from '../../interfaces/OptionsComponentsProps.ts';

export default class WordFieldSelector extends React.Component<OptionsComponentsProps, any> {
	constructor(props: OptionsComponentsProps) {
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
