window.TYPES = {
	POST: "POST",
	CATEGORY: "CATEGORY",
	COMMENT: "COMMENT",
	USER: "USER",
	ROLE: "ROLE",
	TAG: "TAG",
	AUTH: "AUTH",
}

window.ROUTES = {
	POST: "posts",
	CATEGORY: "categories",
	COMMENT: "comments",
	USER: "users",
	ROLE: "roles",
	TAG: "tags",
	AUTH: "auth",
}

const STORAGE_KEY = "STORAGE";
const USE_STORAGE = false;
const REQUEST_DELAY = 0;

class DataBase {
	constructor() {
		const storage = localStorage.getItem(STORAGE_KEY);
		this.storage =  storage && USE_STORAGE ? JSON.parse(storage) : 'test';

		if(!USE_STORAGE) {
			localStorage.removeItem(STORAGE_KEY);
		}
	}

	static getData(data) {
		return {
			data: null,
			error: null,
			message: null,
			...data,
		}
	}

	static getKeyID(type) {
		return `${type.toLowerCase()}_id`;
	};

	_updateStorage(data) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.storage))
		return data;
	}

	_requestSuccess(cb, delay = REQUEST_DELAY) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(this._updateStorage(cb()))
			}, delay);
		})
	}

	__requestError(cb, delay = REQUEST_DELAY) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				reject(cb())
			}, delay);
		})
	}

	_getIndex(id, type) {
		return this.storage[type].findIndex(el=>el[DataBase.getKeyID(type)] === id)
	}

	_createInstance(data, type) {
		return {
			...data,
			[DataBase.getKeyID(type)]: `${type.toLowerCase()}_${this.storage[type].length}`
		}
	}

	fakeGet(id, type) {
		return this._requestSuccess(()=>DataBase.getData({
			data: this.storage[type].filter(el=>(id ? el[DataBase.getKeyID(type)] === id : true))
		}));
	}

	fakeCreate(data, type) {
		return this._requestSuccess(()=>{
			this.storage[type].push(this._createInstance(data, type));
			return DataBase.getData({message: `${type} has been created`,})
		})
	}

	fakeUpdate(id, data, type) {
		const index = this._getIndex(id, type);

		if(index >= 0) {
			return this._requestSuccess(()=>{
				this.storage[type][index] = {
					...this.storage[type][index],
					...data,
				};

				return DataBase.getData({message: `${type} has been updated`})
			});
		} else {
			return this.__requestError(()=>DataBase.getData({
				data: null,
				error: `There is no ${type} with provided id: ${id}`,
				message: null,
			}))
		}
	}

	fakeDelete(id, type) {
		const index = this._getIndex(id, type);

		if(index >= 0) {
			return this._requestSuccess(()=>{
				this.storage[type].splice(index,1)

				return DataBase.getData({message: `${type} has been deleted`})
			});
		} else {
			return this.__requestError(()=>DataBase.getData({
				error: `There is no ${type} with provided id: ${id}`,
			}))
		}
	}
}

window.DB = new DataBase();