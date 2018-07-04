import React from 'react'
import ReactDOM from 'react-dom'
import BooksApp from './App'
import BookStorage from './database/BookStorage';
import FakeIndexDB from 'fake-indexeddb';
import IndexDbHelper from './database/indexDbHelper';
import { BrowserRouter } from 'react-router-dom'
import DefaultBookShelves from './database/DefaultBookShelves';
import BookWardrobe from './components/wardrobe/BookWardrobe';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import BookStructureManager from './BookStructureManager';
configure({ adapter: new Adapter() });
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

describe ('Testing indexDb', () =>{
  it('is loaded correctly the shelfs', () => {
    expect.assertions(1);
    return indexDbHelper.open('myShelf')
      .then(()=>{
        return Promise.all([
          indexDbHelper.insert({name:'currentlyReading', value: bookShelf.get('currentlyReading')}),
          indexDbHelper.insert({name:'wantToRead', value: bookShelf.get('wantToRead')}),
          indexDbHelper.insert({name:'read', value: bookShelf.get('read')})
        ]).then(() =>
          expect(true).toBe(true)
        ).catch((err) => {
          console.error(err);
          expect(false).toBe(false)
        })
      .catch(err => console.error(err))
    })
  })
})

xit('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <BooksApp 
        bookShelves={bookShelves}
        bookStorage={bookStorage}
      />
    </BrowserRouter>, div)
})

xit('renders the default books', () => {
  const wrapper = shallow(
    <BookStructureManager 
      bookShelves={bookShelves}
      bookStorage={bookStorage}
      render = {()=> {}}
    />
  );
  expect(wrapper.props.bookShelves).toEqual(bookShelves);
})