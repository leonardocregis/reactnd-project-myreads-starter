import React from 'react';
import {Link} from 'react-router-dom';
import * as BooksAPI from '../../api/BooksAPI'
import BookItem from './BookItem';


class BookSearcher  extends React.Component {

  state = {
    query: '',
    bookList: [],
    loading: false
  }

  updateQuery = (query) => {
    this.setState({query});
    if (query.length > 2) {
      this.setState({loading: true});
      BooksAPI.search(query).then(books => {
        this.setState({bookList: books, loading: false});
      }).catch( err => {
        console.error(err);
        this.setState({loading: false, error: err});
      });  
    }
  }

  clearQuery = () => {
    this.setState(
        {
            query: ''
        }
    );
  }

  changeChelf(from, to, book) {
    console.log('Change chelf called');
  }

  renderBookList(bookList,availableActions) {
    return ( 
      <ol className="books-grid">
      {
        bookList.length > 0 && bookList.map( book => {
          return (
              <li key={book.id}>
                <BookItem
                  imageURL={book.imageLinks.thumbnail}
                  title={book.title}
                  authors={book.authors}
                  availableActions={availableActions}
                  changeShelf={this.changeShelf}
                />
              </li>
          )
        })
      }
      </ol>
    )
  }
  renderLoading() {
    return (
      <div>
        <label> Loading...</label>
      </div>
    )
  }
  render() {
      const {query, bookList, loading} = this.state;
      const {availableActions} = this.props;

      return (
        <div className="search-books">
        <div className="search-books-bar">
          <Link
            to="/"
            className="close-search">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input 
              type="text"
              placeholder="Search by title or author, min 3 chars"
              value={query}
              onChange={(event) => this.updateQuery(event.target.value)}
            />

          </div>
        </div>
        <div className="search-books-results">
          { 
            loading && this.renderLoading()
          }
          {
            !loading && this.renderBookList(bookList, availableActions)
          }
        </div>
      </div>
    );
  }
}

export default BookSearcher;