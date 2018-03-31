import React from 'react';
// import * as BooksAPI from './BooksAPI'
import BookWardrobe from './BookWardrobe';
import {Route} from 'react-router-dom';
import './App.css';
import BookSearcher from './BookSearcher';

class BooksApp extends React.Component {

  constructor(props){
    super(props);
    this.loadShelves();
    this.loadBooks();
    this.readyState();
  }
  
  loadShelves() {
    const shelves = [
      {
        name: 'reading',
        title: 'Currently reading',
        books:[]
      },
      {
        name: 'wantToRead',
        title: 'Want to read',
        books:[]
      },
      {
        name: 'read',
        title: 'Read',
        books:[]
      },
    ]
    this.bookShelves = new Map();
    shelves.forEach(shelve => this.bookShelves.set(shelve.name, shelve));
  }

  loadBooks() {
    this.bookShelves.get('reading').books = [
        {
          title:"To Kill a Mockingbird",
          authors:"Harper Lee",
          imageURL:"http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api"
        },
        {  
          title:"Ender's Game",
          authors:"Orson Scott Card",
          imageURL:"http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api"
        }
      ]
    ;
    this.bookShelves.get('wantToRead').books = [
      {  
        title:"1776",
        authors:"David McCullough",
        imageURL:"http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api"
      },{
        title:"Harry Potter and the Sorcerer's Stone",
        authors:"J.K. Rowling",
        imageURL:"http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api"
      }
    ];
    this.bookShelves.get('read').books = [
      {
        title:"The Hobbit",
        authors:"J.R.R. Tolkien",
        imageURL:"http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api"
      },{
        title:"Oh, the Places You'll Go!",
        authors:"Seuss",
        imageURL:"http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api"
      },{
        title:"The Adventures of Tom Sawyer",
        authors:"Mark Twain",
        imageURL:"http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api"
      }
    ];
  }

  readyState() {
    this.state = {
      bookShelves:this.bookShelves
    };
  }   

  changeShelf = (fromShelf, toShelf, book) => {

    let shelfBooksOrigin = this.state.bookShelves.get(fromShelf).books;
    shelfBooksOrigin.books = shelfBooksOrigin.books.filter(book => book.title !== book.title)
    this.state.bookShelves.set(fromShelf, shelfBooksOrigin);

    let shelfBooksDestiny = this.state.bookShelves.get(toShelf);
    shelfBooksDestiny.unshift(book);
    this.state.bookShelves.set(toShelf, shelfBooksDestiny);

    const newState = this.state.bookShelves;
    this.setState({newState});
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
