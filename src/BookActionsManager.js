import React from 'react';

function BookActionsManager(props) {
    const actions = props.actions;
    return (
        <div className="book-shelf-changer">
            <select onChange={()=> console.log(this.value)}>
                <option value="none" disabled >Move to...</option>
                {
                    actions.map((action,index) => {
                     return (<option key={index} onSelect={action.handler}>{action.text}</option>)
                    })
                }
            </select>
        </div>
    );
}

export default BookActionsManager;