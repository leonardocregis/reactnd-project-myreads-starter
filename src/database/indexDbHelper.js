class BookShelfDb {

    shelfName = "shelf";
    dbOpen = false;
    databaseName = undefined;

    constructor(window, shelfName) {
      this.shelfName = shelfName;
      this.refWindow = window;
          if (!this.readyDatabase()) {
              throw new Error("cant create a IndexedDB");
          }
      this.readyDatabase();
    }

    readyDatabase() {
        // In the following line, you should include the prefixes of implementations you want to test.
        this.indexedDB = this.refWindow.indexedDB || this.refWindow.mozIndexedDB || this.refWindow.webkitIndexedDB || this.refWindow.msIndexedDB;
        // DON'T use "var indexedDB = ..." if you're not in a function.
        // Moreover, you may need references to some window.IDB* objects:
        this.IDBTransaction = this.refWindow.IDBTransaction || this.refWindow.webkitIDBTransaction || this.refWindow.msIDBTransaction || { READ_WRITE: "readwrite" }; // This line should only be needed if it is needed to support the object's constants for older browsers
        this.IDBKeyRange = this.refWindow.IDBKeyRange || this.refWindow.webkitIDBKeyRange || this.refWindow.msIDBKeyRange;
        // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
        if (!this.indexedDB) {
            return false;
        }
        return true;
    }

    open(databaseName) {
      if (this.db && this.databaseName == databaseName) {
        throw new Error("database already open");
      }
      const openDBRequest = this.indexedDB.open(databaseName,1);
      return new Promise((resolve, reject) => {
        openDBRequest.onerror = (event) => {
          console.log('couldnt open the database');
          reject(['couldnt open the database', event.target.error]);
        };
        openDBRequest.onsuccess = (event) => {
          console.log('opened database');
          this.dbOpen = true;
          this.db = openDBRequest.result;
          resolve(this.db);
        };
        openDBRequest.onupgradeneeded = (event) => {
          reject(["Database structure dont exists, use createNew", event.target.error]);
        };
      });
    }

    createNew(databaseName) {
        this.dbOpen = false;
        const openDBRequest = this.indexedDB.open(databaseName,1);
        let isNewDb = false;
        let upgradedPromise = new Promise((resolve, reject) => {
            openDBRequest.onupgradeneeded = (event) => {
              console.log('creating structure');
              isNewDb = true;
              this.db = event.target.result;
              this.objStore = this.db.createObjectStore(this.shelfName, { keyPath: "name" });
              this.objStore.transaction.oncomplete = (event) => {
                resolve(this.db);
              }
              this.objStore.transaction.onerror = (event) => {
                reject(new Error(event.target.error));
              }
            }
        });
        return new Promise( (resolve, reject) => {
          openDBRequest.onerror = (event) => {
            reject(['couldnt create the structure', event.target.error]);
          };
          openDBRequest.onsuccess = (event) => {
            console.log('created database');
            this.dbOpen = true;
            if (isNewDb) {
              upgradedPromise
                .then(db => resolve(db))
                .catch(err => reject(err));
            } else {
              reject(new Error('Database already exists'));
            }
          };

        });
    }

    update(data){
      return new Promise((resolve, reject) => {
        console.log('inserting values');
        const transaction = this.db.transaction('shelf', 'readwrite');
        const customerObjectStore = transaction.objectStore('shelf');
        customerObjectStore.put(data);

        transaction.oncomplete = function(event) {
          resolve(data);
        };
        
        transaction.onerror = function(event) {
          resolve(new Error(event.target.error));
        };
      });
    }

    insert(data){
      return new Promise((resolve, reject) => {
        console.log('inserting values');
        const transaction = this.db.transaction('shelf', 'readwrite');
        const customerObjectStore = transaction.objectStore('shelf');
        customerObjectStore.add(data);

        transaction.oncomplete = event =>  resolve(data);
        
        transaction.onerror = event => reject(event.target.error);
      });
    }

    delete(index) {
      return new Promise((resolve, reject) => {
        console.log('deleting index', index);
        const transaction = this.db.transaction('shelf', 'readwrite');
        const customerObjectStore = transaction.objectStore('shelf');
        customerObjectStore.del(index);

        transaction.oncomplete = function(event) {
          resolve(data);
        };
        
        transaction.onerror = function(event) {
          reject(event.target.error);
        };
      });
      
    }

    fetchData(index) {
      if(this.dbOpen) {
        console.log('dbOpen');
        return new Promise((resolve,reject) => {
          const transaction = this.db.transaction(["shelf"]);
          const objectStore = transaction.objectStore("shelf");
          const request = objectStore.get(index);
          transaction.onerror = function(event) {
            reject(event.target.error);
          };
          request.onerror = function(event) {
            reject(event.target.error);
          };
          request.onsuccess = function(event) {
           resolve(request.result);
          }
        });
      } else {
        return Promise.reject("Database not open");
      }
    }

    cleanActions() {
      this.promises = [];
    }
}


export default BookShelfDb;