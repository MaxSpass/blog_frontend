$.ajaxSetup({
	dataType: 'json',
})

const API_BASE_URL = "http://api.blog.loc/";
const getUrl = src => API_BASE_URL + src;

var INSTANCE_API = {
	get: (id, type) => $.ajax({
		url: id ? getUrl(type + '/' + id) : getUrl(type),
		method: 'GET',
	}),

	getBy: (data, type) => $.ajax(
		$.extend({
			url: getUrl(type),
			method: 'GET',
		}, data ? {data: $.param(data)} : {})
	),

	create: (data, type) => $.ajax({
		url: getUrl(type),
		method: 'POST',
		data,
	}),

	update: (id, data, type) => $.ajax({
		url: getUrl(type + '/' + id),
		method: 'POST',
		data,
	}),

	delete: (id, type) => $.ajax({
		url: getUrl(type + '/' + id),
		method: 'DELETE',
	})
}

const {
	POST,
	CATEGORY,
	USER,
	TAG,
	ROLE,
	AUTH,
} = window.TYPES;

window.API = {
	[POST]: {
		get: id => INSTANCE_API.get(id, window.ROUTES[POST]),
		create: data => INSTANCE_API.create(data, window.ROUTES[POST]),
		update: (id, data) => INSTANCE_API.update(id, data, window.ROUTES[POST]),
		delete: id => INSTANCE_API.delete(id, window.ROUTES[POST]),
	},
	[CATEGORY]: {
		get: id => INSTANCE_API.get(id, window.ROUTES[CATEGORY]),
	},
	[USER]: {
		get: id => INSTANCE_API.get(id, window.ROUTES[USER]),
		create: data => INSTANCE_API.create(data, window.ROUTES[USER]),
	},
	[TAG]: {
		get: id => INSTANCE_API.get(id, window.ROUTES[TAG]),
	},
	[ROLE]: {
		get: id => INSTANCE_API.get(id, window.ROUTES[ROLE]),
	},
	[AUTH]: {
		auth: name => INSTANCE_API.getBy(name, window.ROUTES[AUTH]),
	},
}