import React from 'react';

class BookActionsManager extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { value: ''}
        this.actions = props.actions;
    }

    handleChange = (event) => {
        const destinyShelf = event.target.value;
        this.props.changeShelf()
    }

    render(){
        const handlerChange = this.props.changeShelf;
        return (<div className="book-shelf-changer">
            <select value={this.state.value} onChange={this.handleChange} >
                <option value="none" disabled >Move to...</option>
                {
                    this.actions.map((action,index) => {
                     return (<option key={index} value={action.name}>{action.text}</option>)
                    })
                }
            </select>
        </div>);
    };
}

export default BookActionsManager;