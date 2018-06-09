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
        let map = new Map();
        result.forEach(element => {
          map.set(element.title, element.books);
        });
        this.setState({bookShelves:map});
      })
      .catch( err => console.log(err));
  }

  changeShelf = (fromShelf, toShelf, book) => {

    let shelfBooksOrigin = this.state.bookShelves.get(fromShelf);
    shelfBooksOrigin.books = shelfBooksOrigin.books.filter(bookVal => bookVal.title !== book.title)
    this.state.bookShelves.set(fromShelf, shelfBooksOrigin);

    let shelfBooksDestiny = this.state.bookShelves.get(toShelf);
    shelfBooksDestiny.books.unshift(book);
    this.state.bookShelves.set(toShelf, shelfBooksDestiny);

    const newState = this.state.bookShelves;
    this.setState({bookShelves: newState});
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
