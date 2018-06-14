class BookUtils {

    constructor (shelves) {
        this.shelves = shelves;
    }

    filterAction = (shelfName) => {
        return this.convertShelfActions().filter(action => action.name !== shelfName);
    }

    convertShelfActions() {
        return this.shelves.map(shelve => { return {name: shelve.name, text:shelve.title}});
    }

}