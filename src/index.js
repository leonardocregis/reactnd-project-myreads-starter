import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './styles/index.css'
import { BrowserRouter } from 'react-router-dom'
import BookStorage from './database/BookStorage';
import IndexDbHelper from './database/indexDbHelper';

const bookShelves = new Map();
const bookStorage = new BookStorage('myShelf',IndexDbHelper);

ReactDOM.render(
    <BrowserRouter>
        <App 
            bookShelves={bookShelves}
            bookStorage={bookStorage}
        />
    </BrowserRouter>, document.getElementById('root'))
