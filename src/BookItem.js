import React from 'react';
import BookActionsManager from './BookActionsManager';

function BookItem(props) {
    
    const urlImage = 'url("'+props.imageURL+'")';
    console.log(urlImage);
    return (
        <div className="book">
            <div className="book-top">
                <div className="book-cover" style={{
                    width: 128, 
                    height: 193,
                    backgroundImage: urlImage
                    }}>
                </div>
                <BookActionsManager/>
            </div>
            <div className="book-title">{props.title}</div>
            <div className="book-authors">{props.authors}</div>
        </div>
    )
}

export default BookItem;