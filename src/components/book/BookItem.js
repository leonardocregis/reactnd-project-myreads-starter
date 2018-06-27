import React from 'react';
import BookActionsManager from './BookActionsManager';

class BookItem  extends React.Component { 

    changeShelf(destinyShelf){
        this.props.changeShelf(destinyShelf, this.props.book);
    }

    render() {
        const {title, authors} = this.props.book;
        const {availableActions, imageURL} = this.props;
        const urlImage = 'url("'+imageURL+'")';
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
                        actions={availableActions}
                        changeShelf={this.changeShelf.bind(this)}
                    />
                </div>
                <div className="book-title">{title}</div>
                <div className="book-authors">{authors}</div>
            </div>
        )
    }
}

export default BookItem;