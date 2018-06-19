import IndexDbHelper from './indexDbHelper';
import DefaultBookShelves from './DefaultBookShelves';

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
        db.open(this.storageName)
          .then(() => {
              console.log('load process done');
              this.fetchStoredShelfs()
                .then(shelfData => 
                  {
                    console.log('shelfData', shelfData);
                    let shelfMap = this.defaultBookShelves.buildFullDefaultShelf();
                    let savingPromises = [];
                    console.log('default map', shelfMap);
                    shelfMap.forEach( shelf => {
                      console.log('processing default map item',shelf);
                      shelfMap.set(shelf.name, shelf);
                      const loadedShelf = shelfData.get(shelf.name);
                      if (!loadedShelf){
                        console.log('going to insert', shelf);
                        savingPromises.push(this.updateBookList(shelf.name, shelf));
                      } else {
                        console.log('going to load', loadedShelf);
                        shelfMap.set(shelf.name, loadedShelf.value);
                      }
                    });
                    console.log('shelfMap', shelfMap);
                    if (savingPromises.length > 0) {
                      Promise.all(savingPromises)
                      .then(result => {
                       resolve(shelfMap);
                      }).catch(err => {
                        reject(new Error(err));
                      }); 
                    } else {
                      resolve(shelfMap);
                    }
                  }
                )
                .catch( err => 
                  {
                    console.log('line 78 something wrong happen', err);
                    let defaultShelf = this.buildFullDefaultShelf(); 
                    resolve(defaultShelf);
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
            shelfMap.set('reading', result[0]);
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