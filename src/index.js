import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './styles/index.css'
import { BrowserRouter } from 'react-router-dom'
import BookStorage from './database/BookStorage';
import BookUtils from "./components/book/BookUtils";

const bookShelves = new Map();
const bookStorage = new BookStorage('myShelf');
const bookUtils = new BookUtils();

ReactDOM.render(
    <BrowserRouter>
        <App 
            bookShelves={bookShelves}
            bookStorage={bookStorage}
            bookUtils={bookUtils}
        />
    </BrowserRouter>, document.getElementById('root'))
