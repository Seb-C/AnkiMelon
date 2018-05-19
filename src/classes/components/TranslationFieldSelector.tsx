import ReactDOM from 'react-dom';
import React from 'react';
import OptionsProps from '../../interfaces/OptionsProps.ts';

export default class TranslationFieldSelector extends React.Component<OptionsProps, any> {
	constructor(props: OptionsProps) {
		super(props);

		this.state = {
			fields: [],
			selectedTranslationField: null,
		};

		this.props.store.getCardType().then((cardType: string) => {
			this.props.anki.bindToGetFields(cardType, (fields: Array<string>) => {
				this.setState({fields});
			});
		});

		this.props.store.getTranslationField().then((selectedTranslationField: string) => {
			this.setState({selectedTranslationField});
		});
	}

	setSelectedTranslationField(selectedTranslationField: string) {
		this.props.store.setTranslationField(selectedTranslationField);
		this.setState({selectedTranslationField});
	}

	render() {
		return <select
			className="browser-style"
			value={this.state.selectedTranslationField}
			onChange={event => this.setSelectedTranslationField(event.target.value)}
		>
			{this.state.fields.sort().map((fieldName: string) => 
				<option value={fieldName}>{fieldName}</option>
			)}
		</select>;
	}
}
