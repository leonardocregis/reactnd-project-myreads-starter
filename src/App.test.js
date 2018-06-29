import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import BookStorage from './database/BookStorage';
import FakeIndexDB from 'fake-indexeddb';
import IndexDbHelper from './database/indexDbHelper';
import { BrowserRouter } from 'react-router-dom'
/** 
 This course is not designed to teach Test Driven Development. 
 Feel free to use this file to test your application, but it 
 is not required.
**/
let mockWindow = {};
mockWindow.indexedDB = FakeIndexDB;
const bookShelves = new Map();
const indexDbHelper = new IndexDbHelper(mockWindow, 'myShelf');
indexDbHelper.insert({name:'currentlyReading', value: undefined})
indexDbHelper.insert({name:'wantToRead', value: undefined})
indexDbHelper.insert({name:'read', value: undefined})

const bookStorage = new BookStorage('myShelf',IndexDbHelper, mockWindow);

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <App
        bookShelves={bookShelves}
        bookStorage={bookStorage}
      />
    </BrowserRouter>, div)
})


