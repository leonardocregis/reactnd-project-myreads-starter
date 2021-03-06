import React from 'react'
import ReactDOM from 'react-dom'
import BooksApp from './App'
import BookStorage from './database/BookStorage';
import FakeIndexDB from 'fake-indexeddb';
import IndexDbHelper from './database/indexDbHelper';
import { BrowserRouter } from 'react-router-dom'
import DefaultBookShelves from './database/DefaultBookShelves';
import BookStructureManager from './BookStructureManager';
import {render, cleanup, fireEvent, waitForElement} from 'react-testing-library'
import BookWardrobe from './components/wardrobe/BookWardrobe';
import BookSearcher from './components/book/BookSearcher';
import 'jest-dom/extend-expect'

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

describe ('Testing React Components', () => {
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
  it('renders something', () => {
    const {getByTestId} =  render(
      <BrowserRouter>
        <BooksApp 
          bookShelves={bookShelves}
          bookStorage={bookStorage}
        />
      </BrowserRouter>
    );
    expect(getByTestId('book-structure-manager')).not.toBeEmpty();
  })
  describe('Testing book wardrobe', () => {
    it('renders the Book Wardrobe with no books', () => {
      const title = 'Test Title';
      const shelves = new Map();
      const shelve =  {name: 'Sample Shelf', title:'Sample Shelf title', books:[]}
      shelves.set(shelve.name, shelve);
      
      const {getByText} =  render(
        <BrowserRouter>
            <BookWardrobe
                title = {title}
                shelves = {shelves}
            />
        </BrowserRouter>
      );
      expect(getByText('Sample Shelf title')).not.toBeEmpty();
    })
  
    it('renders the Book Wardrobe with one book', () => {
      const title = 'Test Title';
      const shelves = new Map();
      const book = {
        title: "Ender's Game",
        authors: "Orson Scott Card",
        imageLinks: {
          thumbnail: "http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api"
        },
        shelf: "currentlyReading"
      } 
      const shelve =  {name: 'Sample Shelf', title:'Sample Shelf title', books:[book]}
    
      shelves.set(shelve.name, shelve);
      
      const {getByText} =  render(
      <BrowserRouter>
          <BookWardrobe
              title = {title}
              shelves = {shelves}
          />
      </BrowserRouter>
      );
      expect(getByText('Sample Shelf title')).not.toBeEmpty();
      expect(getByText("Ender's Game")).not.toBeEmpty();
      expect(getByText("Orson Scott Card")).not.toBeEmpty();
    })
    it('show error for undefined shelf', () => {
      const title = 'Test Title';
      const shelves = new Map();
      shelves.set('Sample Shelf', undefined);
      
      const {getByText} =  render(
        <BrowserRouter>
            <BookWardrobe
                title = {title}
                shelves = {shelves}
            />
        </BrowserRouter>
      );
      expect(getByText('Undefined Shelf')).not.toBeEmpty();
      })    
  })
  describe('Testing book storage', ()=> {
    it('book search loads default page', ()=> {
      const {getByText} =  render(
        <BrowserRouter>
          <BookStructureManager 
            bookShelves={bookShelves}
            bookStorage={bookStorage}
            render={(bookShelves, changeShelf, extractShelvesNames)=> (
              <div> 
                <BookSearcher
                    shelves={bookShelves}
                    availableActions={extractShelvesNames(['Shelf1','Shelf2'])}
                    changeShelf={changeShelf}
                />
              </div>
            )}/>
        </BrowserRouter>);
      expect(getByText('No Results')).not.toBeEmpty();
    })
    it('book search has books', async ()=> {
      //Arrange
      const book = {
        id:"12345",
        title: "Ender's Game",
        authors: "Orson Scott Card",
        imageLinks: {
          thumbnail: "http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api"
        },
        shelf: "currentlyReading"
      } 
      const shelve =  {name: 'Sample Shelf', title:'Sample Shelf title', books:[book]}
      const bookApi = {
        search: (query) => {
          const p = new Promise(resolve => resolve([book]));
          return p;
        }
      }
      bookShelves.set('Sample Shelf', shelve);
      const {getByPlaceholderText, getByText } =  render(
        <BrowserRouter>
          <BookStructureManager 
            bookShelves={bookShelves}
            bookStorage={bookStorage}
            render={(bookShelves, changeShelf, extractShelvesNames)=> (
              <div> 
                <BookSearcher
                    shelves={bookShelves}
                    availableActions={extractShelvesNames(bookShelves)}
                    changeShelf={changeShelf}
                    booksApi={bookApi}
                />
              </div>
            )}/>
        </BrowserRouter>);
        expect(getByPlaceholderText("Search by title or author, min 3 chars")).toBeEmpty();
        expect(getByText("No Results")).not.toBeEmpty();

        const input = getByPlaceholderText("Search by title or author, min 3 chars");
        
        input.value = 'Ender';

        //Act
        fireEvent.change(input);
        const partial = getByPlaceholderText("Search by title or author, min 3 chars");
        expect(partial.value).toEqual('Ender');
        expect(getByText("Loading...")).not.toBeEmpty();

        //Assert
        const result = await  waitForElement(() =>
          getByText('Sample Shelf title')
        );
        expect(result).not.toBeEmpty();
        expect(getByText('Orson Scott Card')).not.toBeEmpty();
      })
  })

})
