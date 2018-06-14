import React from 'react';
import BookShelf from '../shelf/BookShelf';
import {Link} from 'react-router-dom';

class  BookWardrobe extends React.Component {

    render() {
        let shelves = [];
        this.props.shelves.forEach((shelve) => {
            shelves.push(shelve);
        });
        const bookUtils = new BookUtils(this.shelves);
        return (
            <div className="list-books">
                <div className="list-books-title">
                <h1>{this.props.title}</h1>
                </div>
                <div className="list-books-content">
                <div>
                    {
                    shelves &&
                    shelves.map( shelf => {
                                return (<div key={shelf.name}> 
                                            <BookShelf
                                             shelf={shelf}
                                             changeShelf={this.props.changeShelf}
                                             availableActions={bookUtils.filterAction(shelf.name)}
                                             />
                                        </div>)
                    })
                }
                </div>
                </div>
                <div className="open-search">
                <Link to="/search" >Add a book</Link>
                </div>
        </div>
        );
    }
};

export default BookWardrobe;