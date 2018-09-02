import idb from './idb';

export class Store {
    constructor(){
        this.db = null;
        this.dbName = 'topics';
        this.store = 'outbox';
    }
    init(){
        if(this.db){
            return Promise.resolve(this.db);
        }
        return idb.open(this.dbName,1,upgradeDb =>{
            upgradeDb.createObjectStore(this.store, {autoIncrement: true, keyPath: 'id'});
        })
        .then(db =>{
            return this.db = db;
        });
    }

    outbox(mode){
        return this.init()
            .then(db =>{
                return db.transaction(this.store, mode).objectStore(this.store);
            });
    }
}

