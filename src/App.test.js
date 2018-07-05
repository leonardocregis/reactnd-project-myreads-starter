import React from 'react'
import ReactDOM from 'react-dom'
import BooksApp from './App'
import BookStorage from './database/BookStorage';
import FakeIndexDB from 'fake-indexeddb';
import IndexDbHelper from './database/indexDbHelper';
import { BrowserRouter } from 'react-router-dom'
import DefaultBookShelves from './database/DefaultBookShelves';
import BookStructureManager from './BookStructureManager';
import {render, cleanup} from 'react-testing-library'

/** 
 This course is not designed to teach Test Driven Development. 
 Feel free to use this file to test your application, but it 
 is not required.
**/
let mockWindow = {};
const bookShelves = new Map();
mockWindow.indexedDB = FakeIndexDB;
const indexDbHelper = new IndexDbHelper(mockWindow, 'myShelf');
const bookShelf = new DefaultBookShelves().buildFullDefaultShelf();
const bookStorage = new BookStorage('myShelf',IndexDbHelper, mockWindow);
beforeAll(()=> {
  return indexDbHelper.open('myShelf')
    .then(()=>{
      return Promise.all([
        indexDbHelper.insert({name:'currentlyReading', value: bookShelf.get('currentlyReading')}),
        indexDbHelper.insert({name:'wantToRead', value: bookShelf.get('wantToRead')}),
        indexDbHelper.insert({name:'read', value: bookShelf.get('read')})
      ])
    })
})
afterEach(cleanup);
describe ('Testing indexDb', () =>{
  it('is loaded without error the shelfs', () => {
    expect.assertions(1);
    return indexDbHelper.fetchData('currentlyReading').then(data => expect(data).toEqual({name:'currentlyReading', value:bookShelf.get('currentlyReading')}));
  })
})

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

it('renders the default books', () => {
  const {getByTestId} = render(
    <BookStructureManager 
      bookShelves={bookShelves}
      bookStorage={bookStorage}
      render = {()=> {}}
    />
  );
  expect(getByTestId('book-structure-manager')).toBeEmpty();
})
it('renders the default books', () => {
  const {getByTestId} = render(
    <BrowserRouter>
    <BooksApp 
      bookShelves={bookShelves}
      bookStorage={bookStorage}
    />
    </BrowserRouter>
  );
  expect(getByTestId('book-structure-manager')).toBeEmpty();
})