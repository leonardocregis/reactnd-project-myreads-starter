import React from 'react';
import BookShelf from '../shelf/BookShelf';
import {Link} from 'react-router-dom';

class  BookWardrobe extends React.Component {
    shelves = [];
    
    filterAction = (shelfName) => {
        return this.convertShelfActions().filter(action => action.name !== shelfName);
    }
    
    convertShelfActions() {
        return this.shelves.map(shelve => { return {name: shelve.name, text:shelve.title}});
    }

    render() {

        this.props.shelves.forEach((value) => {
            this.shelves.push(value);
        });

        return (
            <div className="list-books">
                <div className="list-books-title">
                <h1>{this.props.title}</h1>
                </div>
                <div className="list-books-content">
                <div>
                    {
                    this.shelves.map( shelf => {
                                return (<div key={shelf.name}> 
                                            <BookShelf
                                             shelf={shelf}
                                             changeShelf={this.props.changeShelf}
                                             availableActions={this.filterAction(shelf.name)}
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