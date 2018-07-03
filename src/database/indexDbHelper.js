class IndexDbHelper {

  shelfName = 'shelf';
  dbOpen = false;
  databaseName = undefined;

  constructor(window, shelfName) {
    this.refWindow = window;
    if (!this.readyDatabase()) {
        throw new Error("cant create a IndexedDB");
    }
    if (shelfName) {
      this.shelfName = shelfName
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
    if (this.db && this.databaseName === databaseName) {
      throw new Error("database already open");
    }
    const openDBRequest = this.indexedDB.open(databaseName,1);
    let hasUpgrade = false;//suposed that the event onUpgradeneeded always happens before onsucess
    let upgradedPromise = new Promise((resolve, reject) => {
      openDBRequest.onupgradeneeded = (event) => {
        hasUpgrade = true;
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
        reject(new Error(event.target.error));
      };
      openDBRequest.onsuccess = (event) => {
        this.dbOpen = true;
        this.db = event.target.result;
        if (hasUpgrade) {
          upgradedPromise
          .then(db => resolve(db))
          .catch(err => reject(err));
        } else {
          resolve(this.db);
        }
      };
    });

  }

  update(data){
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.shelfName, 'readwrite');
      const customerObjectStore = transaction.objectStore(this.shelfName);
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
      if (!this.db) {
        throw new Error('Cant insert Db not initialized');
      }
      const transaction = this.db.transaction(this.shelfName, 'readwrite');
      const customerObjectStore = transaction.objectStore(this.shelfName);
      customerObjectStore.add(data);

      transaction.oncomplete = event =>  resolve(data);
      
      transaction.onerror = event => reject(event.target.error);
    });
  }

  delete(index) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.shelfName, 'readwrite');
      const customerObjectStore = transaction.objectStore(this.shelfName);
      customerObjectStore.del(index);

      transaction.oncomplete = function(event) {
        resolve(event.target.result);
      };
      
      transaction.onerror = function(event) {
        reject(event.target.error);
      };
    });
    
  }

  fetchData(index) {
    if(this.dbOpen) {
      return new Promise((resolve,reject) => {
        const transaction = this.db.transaction([this.shelfName]);
        const objectStore = transaction.objectStore(this.shelfName);
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

export default IndexDbHelper;