import React from 'react';
//import * as BooksAPI from './api/BooksAPI'
import BookWardrobe from './components/wardrobe/BookWardrobe';
import {Route} from 'react-router-dom';
import './styles/App.css';
import BookSearcher from './components/book/BookSearcher';
import BookStorage from './database/BookStorage';

class BooksApp extends React.Component {

  bookShelves = new Map();
  bookStorage = new BookStorage('myShelf');

  constructor(props){
    super(props);
    this.readyState();
  }

  readyState() {
    this.state = {
      bookShelves: this.bookShelves
    };
  }

  componentDidMount() {
    this.bookStorage.loadFromDb()
      .then( result => {
        console.log("componente will mount", result);
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
      
          const newState = this.state.bookShelves;
          this.setState({bookShelves: newState});      
        } else {
          throw new Error(`non existing configuration for: ${toShelf}`);
        }
      } else {
        throw new Error(`Non existing configuration for: ${fromShelf}`);
      }
    }
  }

  render() {

    return (
      <div className="app">
        <Route path="/search" render={() => (
            <BookSearcher
            />
          )}/>
          <Route exact path="/" render={() =>(
            <BookWardrobe
              title="My reads"
              shelves={this.state.bookShelves}
              changeShelf={this.changeShelf}
            />
            )}
          />
      </div>
    )
  }
}

export default BooksApp
