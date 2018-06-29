import React from 'react';
//import * as BooksAPI from './api/BooksAPI'
import BookWardrobe from './components/wardrobe/BookWardrobe';
import {Route} from 'react-router-dom';
import './styles/App.css';
import BookSearcher from './components/book/BookSearcher';

class BooksApp extends React.Component {
  
  constructor(props) {
    super(props);
    if (props.bookShelves && props.bookStorage && props.bookUtils) {
      this.bookShelves = props.bookShelves;
      this.bookStorage = props.bookStorage;
      this.bookUtils = props.bookUtils;
      this.state = {
        bookShelves: this.bookShelves
      }  
    } else {
      throw new Error('Undefined properties to start the component')
    }
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

  changeShelf = (toShelf, book) => {
    if (!toShelf || toShelf === '') {
      throw new Error('Cant move to a empty name shelf');
    }
    if (!book) {
      throw new Error('Cant move a undefined book to a shelf');
    }
    if (this.state) {
      let fromShelf = book.shelf;
      const bookShelves = this.state.bookShelves;

      if (fromShelf) {
        let shelfBooksOrigin = bookShelves.get(fromShelf);

        if (shelfBooksOrigin) {
          if (shelfBooksOrigin.books) {
            shelfBooksOrigin.books = shelfBooksOrigin.books.filter(bookVal => bookVal.title !== book.title)
          } else {
            console.log(`non existing books configurations for: ${fromShelf}`)
            shelfBooksOrigin.books = [];
          }
  
          bookShelves.set(fromShelf, shelfBooksOrigin);
          this.moveToShelf(toShelf, book);
        } else {
          throw new Error(`Non existing configuration for: ${fromShelf}`);
        }        
      } else {
        this.moveToShelf(toShelf, book);
      }
    }
  }
  /**
   * Move to another shelf, update the book shelf itself , persist the change into indexDb
   */
  moveToShelf(toShelf, book) {
    const bookShelves = this.state.bookShelves;
    const shelfBooksDestiny = bookShelves.get(toShelf);
    const shelfBooksOrigin = bookShelves.get(book.shelf);
    const fromShelf = book.shelf;

    if (shelfBooksDestiny) {
      book.shelf = shelfBooksDestiny.name;
      shelfBooksDestiny.books.unshift(book);
      bookShelves.set(toShelf, shelfBooksDestiny);

      this.persistBooks(fromShelf, shelfBooksDestiny, toShelf, shelfBooksOrigin);

      const newState = bookShelves;
      this.setState({bookShelves: newState});      
    } else {
      throw new Error(`non existing configuration for: ${toShelf}`);
    }
  }

  persistBooks(fromShelf, shelfBooksDestiny, toShelf, shelfBooksOrigin ) {
    let updates = [];
    if (fromShelf){
        updates.push(this.bookStorage.updateBookList(fromShelf, shelfBooksOrigin));
    }
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
              changeShelf={this.changeShelf}
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
