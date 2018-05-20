import ReactDOM from 'react-dom';
import React from 'react';
import OptionsComponentsProps from '../../interfaces/OptionsComponentsProps.ts';

export default class RomajiFieldSelector extends React.Component<OptionsComponentsProps, any> {
	constructor(props: OptionsComponentsProps) {
		super(props);

		this.state = {
			fields: [],
			selectedRomajiField: null,
		};

		this.props.store.getCardType().then((cardType: string) => {
			this.props.anki.bindToGetFields(cardType, (fields: Array<string>) => {
				this.setState({fields});
			});
		});

		this.props.store.getRomajiField().then((selectedRomajiField: string|null) => {
			this.setState({selectedRomajiField});
		});
	}

	setSelectedRomajiField(selectedRomajiField: string|null) {
		this.props.store.setRomajiField(selectedRomajiField);
		this.setState({selectedRomajiField});
	}

	render() {
		return <select
			className="browser-style"
			value={this.state.selectedRomajiField}
			onChange={event => this.setSelectedRomajiField(event.target.value)}
		>
			<option></option>
			{this.state.fields.sort().map((fieldName: string) => 
				<option value={fieldName}>{fieldName}</option>
			)}
		</select>;
	}
}
