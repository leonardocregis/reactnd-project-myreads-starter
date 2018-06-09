import React from 'react';
//import * as BooksAPI from './api/BooksAPI'
import BookWardrobe from './components/wardrobe/BookWardrobe';
import {Route} from 'react-router-dom';
import './styles/App.css';
import BookSearcher from './components/book/BookSearcher';

class BooksApp extends React.Component {

  worker = null;
  constructor(props){
    super(props);
    this.state = {
      bookShelves: []
    }
  }

  componentDidMount() {
    this.setState ({
      bookShelves: [
        {
          name:'readed', title:'Currently reading', books:[{
            title:"To Kill a Mockingbird",
            authors:"Harper Lee",
            imageURL:"http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api"
          }]
        }
      ]
    });
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
