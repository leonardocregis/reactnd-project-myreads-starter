import React from 'react';
import BookItem from './BookItem';

function BookShelf(props) { 
    let bookShelfTitle;
    let books;
    if (props.title)
    bookShelfTitle = props.title;
    else {
        bookShelfTitle = 'Undefined';
    }
    if (props.books)
    books = props.books;
    else {
        books = [];
    }
    return (
        <div className="bookshelf">
        <h2 className="bookshelf-title">{bookShelfTitle}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {
              books.map(book => {
                return (
                    <li key={book.title}>
                      <BookItem 
                        title={book.title}
                        authors={book.author}
                        imageURL={book.imageURL}
                     />
                    </li>
                )
              })
            }
          </ol>
        </div>
      </div>
    );
};
export default BookShelf;