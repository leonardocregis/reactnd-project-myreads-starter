import BookShelfDb from '../database/BookShelfDb';

class BookStorageWorker {

    bookShelves = new Map();
    bookShelveDb = new BookShelfDb(window);

    constructor() {
        this.initShelves();
    }

    updateBookList(listName, books) {
      this.bookShelveDb.update({"name":listName, "value":books});
    }

    initShelves() {
      this.loadFromDb().then(result => {
        this.loadDefaultShelves();
        const books = this.loadDefaultBooks();
        if (result[0]) {
          this.bookShelves.get('reading').books = result[0].value;
        } else {
          let booksAux = books.slice(0,2);
          this.bookShelves.get('reading').books = booksAux;
          this.updateBookList('reading', booksAux);
        }
        if (result[1]) {
          this.bookShelves.get('wantToRead').books = result[1].value;
        } else {
          let booksAux = books.slice(2,4);
          this.bookShelves.get('wantToRead').books = booksAux;
          this.updateBookList('wantToRead', booksAux);
        }
        if(result[2]) {
          this.bookShelves.get('read').books = result[2].value;
        } else {
          let booksAux = books.slice(4,7);
          this.bookShelves.get('read').books = booksAux;
          this.updateBookList('read', booksAux);
        }
      }).catch(err => {
        throw new Error(err);
      });
    }

    loadFromDb() {
      this.bookShelveDb.createNew('myShelf');
      return new Promise( (resolve, reject) => {
        let readingShelf;
        let wantToReadShelf;
        let readShelf;
        let readingPromise = this.bookShelveDb.fetchData('reading');
        let wantToReadPromise = this.bookShelveDb.fetchData('wantToRead');
        let readPromise = this.bookShelveDb.fetchData('read');
        Promise.all(readingPromise, wantToReadPromise, readPromise)
          .then(result => 
            {
              readingShelf = result[0];
              wantToReadShelf = result[1];
              readShelf = result[2];
              resolve([readingShelf, wantToReadShelf, readShelf]);
            }
          ).catch(err => reject(err));
      });
    }

    loadDefaultShelves() {
        const shelves = [
            {
                name: 'reading',
                title: 'Currently reading',
                books: []
            },
            {
                name: 'wantToRead',
                title: 'Want to read',
                books: []
            },
            {
                name: 'read',
                title: 'Read',
                books: []
            },
        ]
        shelves.forEach(shelve => this.bookShelves.set(shelve.name, shelve));
    }

    loadDefaultBooks() {
        return [
          {
            title:"To Kill a Mockingbird",
            authors:"Harper Lee",
            imageURL:"http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api"
          },
          {  
            title:"Ender's Game",
            authors:"Orson Scott Card",
            imageURL:"http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api"
          },
          {  
            title:"1776",
            authors:"David McCullough",
            imageURL:"http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api"
          },
          {
            title:"Harry Potter and the Sorcerer's Stone",
            authors:"J.K. Rowling",
            imageURL:"http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api"
          },
          {
            title:"The Hobbit",
            authors:"J.R.R. Tolkien",
            imageURL:"http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api"
          },
          {
            title:"Oh, the Places You'll Go!",
            authors:"Seuss",
            imageURL:"http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api"
          },
          {
            title:"The Adventures of Tom Sawyer",
            authors:"Mark Twain",
            imageURL:"http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api"
          }
        ];
    }
};

export default BookStorageWorker;