import React from 'react'
import ReactDOM from 'react-dom'
import BooksApp from './App'
import BookStorage from './database/BookStorage';
import FakeIndexDB from 'fake-indexeddb';
import IndexDbHelper from './database/indexDbHelper';
import { BrowserRouter } from 'react-router-dom'
import DefaultBookShelves from './database/DefaultBookShelves';
import {Route} from 'react-router-dom';
import BookWardrobe from './components/wardrobe/BookWardrobe';
import BookSearcher from './components/book/BookSearcher';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });
/** 
 This course is not designed to teach Test Driven Development. 
 Feel free to use this file to test your application, but it 
 is not required.
**/
let mockWindow = {};
mockWindow.indexedDB = FakeIndexDB;
const bookShelves = new Map();
const indexDbHelper = new IndexDbHelper(mockWindow, 'myShelf');
const bookShelf = new DefaultBookShelves().buildFullDefaultShelf();
const bookStorage = new BookStorage('myShelf',IndexDbHelper, mockWindow);

indexDbHelper.insert({name:'currentlyReading', value: bookShelf.get('currentlyReading')})
  .catch((err) => console.error('error', err));
indexDbHelper.insert({name:'wantToRead', value: bookShelf.get('wantToRead')})
  .catch((err) => console.error('error', err));
indexDbHelper.insert({name:'read', value: bookShelf.get('read')})
  .catch((err) => console.error('error', err));


it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <BooksApp 
        bookShelves={bookShelves}
        bookStorage={bookStorage}
      />
    </BrowserRouter>, div)
})

it ('renders the default books', () => {
  shallow(
    <BooksApp 
      bookShelves={bookShelves}
      bookStorage={bookStorage}
    />
  );
})