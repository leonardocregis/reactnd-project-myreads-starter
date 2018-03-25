import React from 'react';
import BookShelf from './BookShelf';
import {Link} from 'react-router-dom';

function BookWardrobe(props) {
    const {reading, wantToRead, read} = props.books;
    const bookActions = props.bookActions;
    return (
        <div className="list-books">
            <div className="list-books-title">
            <h1>{props.title}</h1>
            </div>
            <div className="list-books-content">
            <div>
                <BookShelf 
                 title="Currently Reading"
                 books={reading}
                 bookActions={bookActions}
                />
                <BookShelf 
                 title="Want to Read"
                 books={wantToRead}
                 bookActions={bookActions}
                />                
                <BookShelf
                 title="Read"
                 books={read}
                 bookActions={bookActions}
                />
            </div>
            </div>
            <div className="open-search">
            <Link to="/search" >Add a book</Link>
            </div>
      </div>

    );
};

export default BookWardrobe;