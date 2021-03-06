# MyReads Project


This project is the final project from Udacity, a branch from the template provided by them. Its using the core React, covering all the functionalities that the project asked to do , but adding some new ones. The new functionalities are all from background, so you wont see anything different from the view perspective.

* Offline behavior, the app can run partially offline, the use can see his book list, update the shelves of the books offline, no need to a connection. It can't use the Search behavior because it is totally based into a connection.
* Unit tests covering 80% of the code
* Strong separation of the concerns, you can if you like use all the modules separated and also create new functionalities with a separated classes
* Introduced a new and simple dependency injection pattern. Using the props, you set all the modules dependent configurations making them easier to maintain.

## TL;DR

To get started developing right away:

* install all project dependencies with `npm install`
* start the development server with `npm start`
* if you want to test just run `npm test`
* to see the coverage `npm test -- --coverage`, greather than 80%
* to build the project to production stage `npm run build`

## What You're Getting
```bash
├── CONTRIBUTING.md
├── README.md - This file.
├── SEARCH_TERMS.md # The whitelisted short collection of available search terms for you to use with your app.
├── package.json # npm package manager file. It's unlikely that you'll need to modify this.
├── public #public static repository
│   ├── favicon.ico # React Icon, You may change if you wish.
│   └── index.html # DO NOT MODIFY
└── src
    ├── App.css # Styles for your app. Feel free to customize this as you desire.
    ├── App.js # This is the root of your app. Contains static HTML right now.
    ├── App.test.js # Used for testing, coverage of 80% or more see the topic about the commands
    ├── api #folder to hold all the api used by app, rigth now just the api to call the persistence
        ├── BooksAPI.js # A JavaScript API for the provided Udacity backend. Instructions for the methods are below.
    ├── icons # Helpful images for your app. Use at your discretion.
    │   ├── add.svg
    │   ├── arrow-back.svg
    │   └── arrow-drop-down.svg
    ├── components #React components holder
    │   ├── book #Boor related components
    │   │   ├── BookActionsManager.js #The definition of the operations that can be done into a book
    │   │   ├── BookItem.js #The view related stuff for the book item
    │   │   ├── BookSearchers.js #The component that deal with searching books into the api
    │   │   └── BookUtils.js #Common functions used onto the other components
    │   ├── shelf #shelf related api, in the hierarchy its a intermediary one
    │   │   └── BookShelf.js # Manages the behavior and view of the shelf            
    │   └── wardrobe #shelf related api, in the hierarchy its the top one
    │   │   └── BookWardrobe.js # General view the holder of all the shelves
    ├── index.css # Global styles. You probably won't need to change anything here.
    ├── BookStructureManager.js #Holds the behavior for the components
    ├── setupTests.js #Setup the tests
    └── index.js # You should not need to modify this file. It is used for DOM rendering only.

```

## Backend Server

To simplify your development process, we've provided a backend server for you to develop against. The provided file [`BooksAPI.js`](src/BooksAPI.js) contains the methods you will need to perform necessary operations on the backend:

* [`getAll`](#getall)
* [`update`](#update)
* [`search`](#search)

### `getAll`

Method Signature:

```js
getAll()
```

* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* This collection represents the books currently in the bookshelves in your app.

### `update`

Method Signature:

```js
update(book, shelf)
```

* book: `<Object>` containing at minimum an `id` attribute
* shelf: `<String>` contains one of ["wantToRead", "currentlyReading", "read"]  
* Returns a Promise which resolves to a JSON object containing the response data of the POST request

### `search`

Method Signature:

```js
search(query)
```

* query: `<String>`
* Returns a Promise which resolves to a JSON object containing a collection of a maximum of 20 book objects.
* These books do not know which shelf they are on. They are raw results only. You'll need to make sure that books have the correct state while on the search page.

## Important
The backend API uses a fixed set of cached search results and is limited to a particular set of search terms, which can be found in [SEARCH_TERMS.md](SEARCH_TERMS.md). That list of terms are the _only_ terms that will work with the backend, so don't be surprised if your searches for Basket Weaving or Bubble Wrap don't come back with any results.

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Contributing

This repository is work from @Leonardocregis to the project for React from Udacity.com.br

For details, check out [CONTRIBUTING.md](CONTRIBUTING.md).
