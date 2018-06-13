import IndexDbHelper from './indexDbHelper';

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
                    let shelfMap = this.buildFullDefaultShelf();
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

  buildFullDefaultShelf() {

      let defaultBookShelve = this.loadDefaultShelves();
      const books = this.loadDefaultBooks()

      defaultBookShelve.get('reading').books = books.slice(0,2);
      defaultBookShelve.get('wantToRead').books = books.slice(2,4);
      defaultBookShelve.get('read').books = books.slice(4,7);

      return defaultBookShelve;
  }
  /**
   * Seek from the 3 types of shelfs : reading, wantToRead, read  the values that are saved.
   */
  fetchStoredShelfs() {
    return new Promise( (resolve, reject) => {
      let readingPromise = this.bookShelveDb.fetchData('reading');
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

  loadDefaultShelves() {
      const shelves = [
          {
              name: 'reading',
              title: 'Currently reading',
              books: [],
              synchronized: false,
          },
          {
              name: 'wantToRead',
              title: 'Want to read',
              books: [],
              synchronized: false,
          },
          {
              name: 'read',
              title: 'Read',
              books: [],
              synchronized: false,
          },
      ]
      let shelveMap = new Map();
      shelves.forEach(shelve => shelveMap.set(shelve.name, shelve));
      return shelveMap;
  }

  loadDefaultBooks() {
      return [
        {
          title:"To Kill a Mockingbird",
          authors:"Harper Lee",
          imageURL:"http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api",
        },
        {  
          title:"Ender's Game",
          authors:"Orson Scott Card",
          imageURL:"http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api",
        },
        {  
          title:"1776",
          authors:"David McCullough",
          imageURL:"http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api",
        },
        {
          title:"Harry Potter and the Sorcerer's Stone",
          authors:"J.K. Rowling",
          imageURL:"http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api",
        },
        {
          title:"The Hobbit",
          authors:"J.R.R. Tolkien",
          imageURL:"http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api",
        },
        {
          title:"Oh, the Places You'll Go!",
          authors:"Seuss",
          imageURL:"http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api",
        },
        {
          title:"The Adventures of Tom Sawyer",
          authors:"Mark Twain",
          imageURL:"http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api",
        }
      ];
  }
}

export default BookStorage;