import React from 'react';
import {Link} from 'react-router-dom';
import BookItem from './BookItem';
import makeCancelable from 'makecancelable';
import {Debounce} from 'react-throttle';

class BookSearcher  extends React.Component {

  state = {
    query: '',
    bookList: [],
    loading: false,
  }
  
  constructor(props) {
    super(props);
    this.bookApi = props.bookApi;
  }
  cancelFetch = undefined;

  updateQuery = (query) => {
    this.setState({query});
    this.setState({loading: true});
    let promise = makeCancelable(this.bookApi.search(query),
      books => {
          if (!books.isCanceled) {
          this.setState({bookList: books, loading: false})
        }
      }, 
      err => {
        if (!err.isCanceled) {
          this.setState({loading: false, error: err});
        }
      }
    );
    this.cancelFetch = promise;
  }
  componentDidUpdate() {
    if (!this.state.loading) {
      this.cancelFetch = undefined;
    }
  }
  componentWillUnmount() {
    if (this.cancelFetch) {
      this.cancelFetch();
    }
  }
  clearQuery = () => {
    this.setState(
        {
            query: ''
        }
    );
  }

  adaptMissingData(book) {
    if (book.imageLinks) {
      if (book.imageLinks.thumbnail) {
        return book;
      } else {
        book.imageLinks = { thumbnail:""}
        return book;
      }
    } else {
        book.imageLinks = { thumbnail:""}
        return book;
    }
  }
  renderBookList(searchedBooks,availableActions) {
    const {shelves, changeShelf} = this.props;
    const recordedBooks = this.mapToBookList(shelves);
    if (searchedBooks.length > 0) {
      return ( 
        <ol className="books-grid">
        {
          searchedBooks.map( book => {
            const alreadySavedBook = recordedBooks.get(book.id);
            if (alreadySavedBook) {
              book.shelf = alreadySavedBook.shelf;
            }
            let auxAvailableActions = availableActions.slice();
            let actionMapped = false;
            const actions = auxAvailableActions.map(action => {
              let auxAction = Object.assign({}, action);
              if (auxAction.name === book.shelf) {
                  auxAction.used = true;
                  actionMapped = true;
              }
              return auxAction;
            });
            if (!actionMapped) {
              actions[0].used = true;
            }
            return (
                <li key={book.id} data-testid="book-searcher">
                  <BookItem
                    imageURL={this.adaptMissingData(book).imageLinks.thumbnail}
                    book={book}
                    availableActions={actions}
                    changeShelf={changeShelf}
                  />
                </li>
            )
          })
        }
        </ol>
      )  
    } else {
      return (
        <div> <label>No Results</label> </div>
      )
    }
  }
  renderLoading() {
    return (
      <div>
        <label>Loading...</label>
      </div>
    )
  }

  mapToBookList(shelves) {
    let recordedBooks = new Map();
    shelves.forEach(shelf => {
      if (shelf.books) {
        shelf.books.forEach(book => {
          recordedBooks.set(book.id, book);
        });  
      }
    });
    return recordedBooks;
  }

  render() {
      const {bookList, loading} = this.state;
      const {availableActions} = this.props;
      return (
        <div data-testid="book-searcher" className="search-books">
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
            <Debounce time="400" handler="onChange">
              <input 
                type="text"
                placeholder="Search by title or author, min 3 chars"
                onChange={(event) => this.updateQuery(event.target.value)}
              />
            </Debounce>
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