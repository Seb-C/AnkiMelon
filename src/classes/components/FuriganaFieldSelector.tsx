import ReactDOM from 'react-dom';
import React from 'react';
import OptionsProps from '../../interfaces/OptionsProps.ts';

export default class FuriganaFieldSelector extends React.Component<OptionsProps, any> {
	constructor(props: OptionsProps) {
		super(props);

		this.state = {
			fields: [],
			selectedFuriganaField: null,
		};

		this.props.store.getCardType().then((cardType: string) => {
			this.props.anki.bindToGetFields(cardType, (fields: Array<string>) => {
				this.setState({fields});
			});
		});

		this.props.store.getFuriganaField().then((selectedFuriganaField: string|null) => {
			this.setState({selectedFuriganaField});
		});
	}

	setSelectedFuriganaField(selectedFuriganaField: string|null) {
		this.props.store.setFuriganaField(selectedFuriganaField);
		this.setState({selectedFuriganaField});
	}

	render() {
		return <select
			className="browser-style"
			value={this.state.selectedFuriganaField}
			onChange={event => this.setSelectedFuriganaField(event.target.value)}
		>
			<option></option>
			{this.state.fields.sort().map((fieldName: string) => 
				<option value={fieldName}>{fieldName}</option>
			)}
		</select>;
	}
}
