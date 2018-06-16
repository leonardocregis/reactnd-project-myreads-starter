import React from 'react';
//import * as BooksAPI from './api/BooksAPI'
import BookWardrobe from './components/wardrobe/BookWardrobe';
import {Route} from 'react-router-dom';
import './styles/App.css';
import BookSearcher from './components/book/BookSearcher';
import BookStorage from './database/BookStorage';
import BookUtils from "./components/book/BookUtils";

class BooksApp extends React.Component {

  bookShelves = new Map();
  bookStorage = new BookStorage('myShelf');
  bookUtils = new BookUtils();

  state = {
    bookShelves: this.bookShelves
  }

  componentDidMount() {
    this.bookStorage.loadFromDb()
      .then( result => {
        let map = new Map();
        result.forEach(element => {
          map.set(element.name, element);
        });
        this.setState({bookShelves:map});
      })
      .catch( err => console.log(err));
  }

  changeShelf = (fromShelf, toShelf, book) => {
    if (this.state) {
      const bookShelves = this.state.bookShelves;
      let shelfBooksOrigin = bookShelves.get(fromShelf);
      
      if (shelfBooksOrigin) {
        if (shelfBooksOrigin.books) {
          shelfBooksOrigin.books = shelfBooksOrigin.books.filter(bookVal => bookVal.title !== book.title)
        } else {
          console.log(`non existing books configurations for: ${fromShelf}`)
          shelfBooksOrigin.books = [];
        }

        bookShelves.set(fromShelf, shelfBooksOrigin);


        let shelfBooksDestiny = bookShelves.get(toShelf);
        if (shelfBooksDestiny) {
          shelfBooksDestiny.books.unshift(book);
          bookShelves.set(toShelf, shelfBooksDestiny);

          this.persistBooks(fromShelf, shelfBooksDestiny, toShelf, shelfBooksOrigin);

          const newState = bookShelves;
          this.setState({bookShelves: newState});      
        } else {
          throw new Error(`non existing configuration for: ${toShelf}`);
        }
      } else {
        throw new Error(`Non existing configuration for: ${fromShelf}`);
      }
    }
  }

  persistBooks(fromShelf, shelfBooksDestiny, toShelf, shelfBooksOrigin ) {
    let updates = [];
    updates.push(this.bookStorage.updateBookList(fromShelf, shelfBooksOrigin));
    updates.push(this.bookStorage.updateBookList(toShelf, shelfBooksDestiny));
    if (updates.length > 0) {
      Promise.all(updates)
        .then( data => console.log(`saved with sucess ${data}`))
        .catch( err=> console.log(err));
    }
  }

  extractShelvesNames(shelves) {
    let shelvesNameTitle = [];
    shelves.forEach( shelve => {
      shelvesNameTitle.push({name: shelve.name, text: shelve.title});
    });
    return shelvesNameTitle;
  }

  render() {
    const {bookShelves} = this.state;

    return (
      <div className="app">
        <Route path="/search" render={() => (
            <BookSearcher
              shelves={bookShelves}
              availableActions={this.extractShelvesNames(bookShelves)}
            />
          )}/>
          <Route exact path="/" render={() =>(
            <BookWardrobe
              title="My reads"
              shelves={bookShelves}
              changeShelf={this.changeShelf}
            />
            )}
          />
      </div>
    )
  }
}

export default BooksApp
