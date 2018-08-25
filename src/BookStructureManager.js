import React from 'react';

class BookStructureManager extends React.Component {
  
    constructor(props) {
      super(props);
      if (props.bookShelves && props.bookStorage) {
        this.bookShelves = props.bookShelves;
        this.bookStorage = props.bookStorage;
        this.state = {
          bookShelves: this.bookShelves
        }  
      } else {
        throw new Error('Undefined properties to start the component, contact the ')
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
        .catch( err => console.error(err));
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
              console.error(`non existing books configurations for: ${fromShelf}`)
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
  
        this.persistBooksLocal(fromShelf, shelfBooksDestiny, toShelf, shelfBooksOrigin);
        this.persistBookRemote(book);
        const newState = new Map(bookShelves);
        this.setState({bookShelves: newState});      
      } else {
        throw new Error(`non existing configuration for: ${toShelf}`);
      }
    }
  
    persistBookRemote(book) {
      this.bookStorage.updateRemoteBook(book, book.shelf);
    }

    persistBooksLocal(fromShelf, shelfBooksDestiny, toShelf, shelfBooksOrigin ) {
      let updates = [];
      if (fromShelf){
          updates.push(this.bookStorage.updateBookList(fromShelf, shelfBooksOrigin));
      }
      updates.push(this.bookStorage.updateBookList(toShelf, shelfBooksDestiny));
      if (updates.length > 0) {
        Promise.all(updates)
          .then( data => console.log(`saved locally with sucess ${data}`))
          .catch( err=> console.error(err));
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
        return (
            <div data-testid="book-structure-manager" className="app">
            {
                this.props.render(this.state.bookShelves, this.changeShelf, this.extractShelvesNames)
            }
            </div>
        );
    }
}

export default BookStructureManager;