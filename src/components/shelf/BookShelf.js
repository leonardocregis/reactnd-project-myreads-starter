import React from 'react';
import BookItem from '../book/BookItem';

class BookShelf extends React.Component {

  changeShelf = ((shelfName,book) =>{
    this.props.changeShelf(shelfName, book);
  });

  render() {
    const {shelf, availableActions} = this.props.shelf;
    if (shelf) {
      return this.renderShelf(shelf, availableActions);
    } else {
      return (
        <div> Undefined Shelf </div>
      );
    }

  }

  renderShelf(shelf, availableActions) {
    return (<div className="bookshelf" data-testid="book-shelf">
      <h2 className="bookshelf-title">{shelf.title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {shelf.books && shelf.books.map(book => {
            return (<li key={book.title}>
              <BookItem imageURL={book.imageLinks.thumbnail} book={book} availableActions={availableActions} changeShelf={this.changeShelf} />
            </li>);
          })}
        </ol>
      </div>
    </div>);
  }
};

export default BookShelf;