import ReactDOM from 'react-dom';
import React from 'react';
import OptionsProps from '../../interfaces/OptionsProps.ts';

export default class HiraganaFieldSelector extends React.Component<OptionsProps, any> {
	constructor(props: OptionsProps) {
		super(props);

		this.state = {
			fields: [],
			selectedHiraganaField: null,
		};

		this.props.store.getCardType().then((cardType: string) => {
			this.props.anki.bindToGetFields(cardType, (fields: Array<string>) => {
				this.setState({fields});
			});
		});

		this.props.store.getHiraganaField().then((selectedHiraganaField: string|null) => {
			this.setState({selectedHiraganaField});
		});
	}

	setSelectedHiraganaField(selectedHiraganaField: string|null) {
		this.props.store.setHiraganaField(selectedHiraganaField);
		this.setState({selectedHiraganaField});
	}

	render() {
		return <select
			className="browser-style"
			value={this.state.selectedHiraganaField}
			onChange={event => this.setSelectedHiraganaField(event.target.value)}
		>
			<option></option>
			{this.state.fields.sort().map((fieldName: string) => 
				<option value={fieldName}>{fieldName}</option>
			)}
		</select>;
	}
}
