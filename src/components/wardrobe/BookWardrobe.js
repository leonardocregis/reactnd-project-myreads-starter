import React from 'react';
import BookShelf from '../shelf/BookShelf';
import {Link} from 'react-router-dom';
import BookUtils from '../book/BookUtils';

/**
 * Parameters :
 * shelfes: Map of { name:<string>, title:<string>, books:[<book>]}
 * title: <string>
 */
class  BookWardrobe extends React.Component {

    render() {
        let shelves = [];
        const {title, changeShelf} = this.props;
        if (this.props.shelves) {
            this.props.shelves.forEach((shelve) => {
                shelves.push(shelve);
            });    
        }
        const bookUtils = new BookUtils(shelves);
        return (
            <div className="list-books" data-testid="book-wardrobe">
                <div className="list-books-title">
                <h1>{title}</h1>
                </div>
                <div className="list-books-content">
                <div>
                    {
                    shelves &&
                    shelves.map( (shelf,index) => {
                                if (shelf) {
                                    return (<div key={shelf.name}> 
                                        <BookShelf
                                         shelf={shelf}
                                         changeShelf={changeShelf}
                                         availableActions={bookUtils.filterAction(shelf.name)}
                                         />
                                    </div>)
                                } else {
                                    return (<div key={index}><BookShelf/></div>)
                                }
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