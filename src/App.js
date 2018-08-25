import React from 'react';
import BookWardrobe from './components/wardrobe/BookWardrobe';
import {Route} from 'react-router-dom';
import './styles/App.css';
import BookSearcher from './components/book/BookSearcher';
import BookStructureManager from './BookStructureManager';
import * as BooksAPI from './api/BooksAPI';

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    if (props.bookShelves && props.bookStorage) {
      this.bookShelves = props.bookShelves;
      this.bookStorage = props.bookStorage;
    } else {
      throw new Error('Undefined properties to start the component, contact the ')
    }
  }

  render() {
    return (
      <BookStructureManager
         bookShelves={this.bookShelves}
         bookStorage={this.bookStorage}
         render={(bookShelves, changeShelf, extractShelvesNames)=> (
           <div>
            <Route path="/search" render={() => (
              <BookSearcher
                shelves={bookShelves}
                availableActions={extractShelvesNames(bookShelves)}
                changeShelf={changeShelf}
                bookApi={BooksAPI}
              />
            )}/>
            <Route exact path="/" render={() =>(
              <BookWardrobe
                title="My reads"
                shelves={bookShelves}
                changeShelf={changeShelf}
              />
            )}/>
          </div>
        )}/>
    )
  }
}
export default BooksApp
