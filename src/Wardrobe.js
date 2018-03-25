import React from 'react';
import BookShelf from './BookShelf';
import {Link} from 'react-router-dom';

function Wardrobe(props) {
    const {reading, wantToRead, read} = props.books;
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
                />
                <BookShelf 
                 title="Want to Read"
                 books={wantToRead}
                />                
                <BookShelf
                 title="Read"
                 books={read}
                />
            </div>
            </div>
            <div className="open-search">
            <Link to="/search" >Add a book</Link>
            </div>
      </div>

    );
};

export default Wardrobe;