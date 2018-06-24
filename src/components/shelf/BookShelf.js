import React from 'react';
import BookItem from '../book/BookItem';

class BookShelf extends React.Component {

  changeShelf = ((destinyShelf, bookName) =>{
    const shelf = this.props.shelf;
    const book = shelf.books.filter(book => book.title === bookName)[0];
    this.props.changeShelf(shelf.name, destinyShelf, book);
  });

  render() {
    const shelf = this.props.shelf;
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{shelf.title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {
              shelf.books && shelf.books.map( book => {
                return (
                  <li key={book.title}>
                    <BookItem
                      imageURL={book.imageLinks.thumbnail}
                      title={book.title}
                      authors={book.authors}
                      availableActions={this.props.availableActions}
                      changeShelf={this.changeShelf}
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