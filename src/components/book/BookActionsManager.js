import React from 'react';

class BookActionsManager extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { value: ''}
    }


    handleChange = (event) => {
        const destinyShelf = event.target.value;
        this.props.changeShelf(destinyShelf);
    }

    render(){
        const {actions} = this.props;
        return (<div className="book-shelf-changer">
            <select value={this.state.value} onChange={this.handleChange} >
                <option value="none" >Move to...</option>
                {
                    actions && actions.map((action,index) => {
                     return (<option key={index} value={action.name}>{action.text}</option>)
                    })
                }
            </select>
        </div>);
    };
}

export default BookActionsManager;