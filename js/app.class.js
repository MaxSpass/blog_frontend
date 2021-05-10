var CreateCache = (function() {
	var $document = $(document);
	var $window = $(window);

	return function() {
		this.$window = $window;
		this.$document = $document;
	}
})();

function CreateAPI() {
	this.request = null;
	this.data = null;
	this.api = {};

	var globalApi = window.API[this.type];

	if(globalApi) {
		for(let key in globalApi) {
			this.api[key] = globalApi[key].bind(this)
		}
	}
}

if(window.Observer !== 'function') {
	function Observer() {
		this.observers = [];
	}

	Observer.prototype.subscribe = function(type, callback, scope) {
		var scope = scope || window;
		this.observers.push({
			type: type,
			callback: callback.bind(scope),
		})
		return this;
	}
	Observer.prototype.unsubscribe = function(type, callback) {
		this.observers = this.observers.filter(function(sub) {
			return (type && sub.type !== type) && (callback && sub.callback !== callback)
		});
		return this;
	}
	Observer.prototype.fire = function(type, data) {
		var types = Array.isArray(type) ? type : [type];
		this.observers.forEach(function(obs) {
			types.forEach(function(t) {
				if(obs.type === t) {
					obs.callback(data)
				}
			})
		});
		return this;
	}
}



function CreateModel(type) {
	this.type = type;
	CreateAPI.call(this);
}
