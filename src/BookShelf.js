import React from 'react';
import BookItem from './BookItem';

class BookShelf extends React.Component {


  render() {
    const shelf = this.props.shelf;
    const changeShelf = this.props.changeShelf;
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{shelf.title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {
              shelf.books.map( book => {
                return (
                  <li key={book.title}>
                    <BookItem
                      imageURL={book.imageURL}
                      title={book.title}
                      authors={book.authors}
                      availableActions={this.props.availableActions}
                      changeShelf={changeShelf}
                    />
                  </li>
                )
              })
            }
          </ol>
        </div>
      </div>
    );
  }
};

export default BookShelf;