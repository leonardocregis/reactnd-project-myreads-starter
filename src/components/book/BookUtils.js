class BookUtils {

    constructor (shelves) {
        this.shelves = shelves;
    }

    filterAction = (shelfName) => {
        return this.convertShelfActions().map(action => {
            if (action.name === shelfName) {
                action.used = true;
            }
            return action;
        });
    }

    convertShelfActions() {
        return this.shelves.map(shelve => { return {name: shelve.name, text:shelve.title, used:false}});
    }

}

export default BookUtils;