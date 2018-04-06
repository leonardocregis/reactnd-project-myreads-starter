import React from 'react';
import BookActionsManager from './BookActionsManager';

class BookItem  extends React.Component { 

    changeShelf(destinyShelf){
        this.props.changeShelf(destinyShelf, this.props.title);
    }

    render() {
        const props = this.props;
        const urlImage = 'url("'+props.imageURL+'")';
         return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{
                        width: 128, 
                        height: 193,
                        backgroundImage: urlImage
                        }}>
                    </div>
                    <BookActionsManager
                        actions={props.availableActions}
                        changeShelf={this.changeShelf.bind(this)}
                    />
                </div>
                <div className="book-title">{props.title}</div>
                <div className="book-authors">{props.authors}</div>
            </div>
        )
    }
}

export default BookItem;