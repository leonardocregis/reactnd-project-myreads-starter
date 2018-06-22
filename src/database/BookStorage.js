import IndexDbHelper from './indexDbHelper';
import DefaultBookShelves from './DefaultBookShelves';
import * as BooksAPI from '../api/BooksAPI'

/**
 * Class to manage the indexDb values
 * 
 * It open or create a connection to a indexDb, loads default data to it, if theres no data . 
 * Returns a default map if the connection to indexDb doesn't works, take care to check if latter on it works and loads the data to indexBb
 * 
 * data format into the indexDb (following the IndexDbHelper format)  {index, value}
 *  where value is [sample]
 *             {
 *              name: 'reading',
 *              title: 'Currently reading',
 *              books: [
 *                {
 *                 title:"To Kill a Mockingbird",
 *                 authors:"Harper Lee",
 *                 imageURL:"",
 *                }
 *              ],
 *              synchronized: false,
 *             }
 */
class BookStorage {
  defaultBookShelves = new DefaultBookShelves();
  constructor(storageName){
      this.storageName = storageName;
      this.bookShelveDb = new IndexDbHelper(window, this.storageName);
  }

  /**
   * 
   * @param {string} listName 
   * @param {title:string, authors:string, imageURL:string} books
   * @returns Promise.then(updatedValues)
   */
  updateBookList(listName, shelf) {
    return this.bookShelveDb.update({"name":listName, "value":shelf});
  }

  /**
   * Try to open a storage, 
   *  case it exists loads what is saved there, 
   *  case it doesnt exists try to creat a new one and load it with the default data definition
   *  error cases it loads the default data to this.booksShelves local map and reject with a error
   * 
   * 
   * @returns Promise.then({shelfMap})
   *                 .catch({})
   */
  loadFromDb() {
    return new Promise( (resolve, reject) => {
        let db = this.bookShelveDb;
        let shelfMap = this.defaultBookShelves.loadDefaultShelves();
        db.open(this.storageName)
          .then(() => {
              BooksAPI.getAll().then( books => {
                books.forEach(book => {
                  let shelf = shelfMap.get(book.shelf);
                  shelf.books.push(book);
                  this.updateBookList(book.shelf, shelf);
                });
                resolve(shelfMap);
              }).catch( err => 
                  {
                    this.fetchStoredShelfs().then( shelfs => {
                      shelfs.forEach( shelf => {
                        let auxShelf = shelfMap.get(shelf.shelf);
                        auxShelf.books = shelf.value.books;      
                      });
                    }).catch(err => reject(err));
                  }
                );
            }
          ).catch(err => {
              console.log('warning creating db wasnt possible', err);
              resolve(this.buildFullDefaultShelf());
            }
          );
    });
  }

  /**
   * Seek from the 3 types of shelfs from some persitence : reading, wantToRead, read  the values that are saved.
   */
  fetchStoredShelfs() {
    return new Promise( (resolve, reject) => {
      let readingPromise = this.bookShelveDb.fetchData('currentlyReading');
      let wantToReadPromise = this.bookShelveDb.fetchData('wantToRead');
      let readPromise = this.bookShelveDb.fetchData('read');
      Promise.all([readingPromise, wantToReadPromise, readPromise])
        .then(result => 
          {
            let shelfMap = new Map();
            shelfMap.set('currentlyReading', result[0]);
            shelfMap.set('wantToRead', result[1]);
            shelfMap.set('read', result[2]);
            resolve(shelfMap);
          }
        ).catch(err => reject(err));
      }
    );
  }

}

export default BookStorage;