class Actions {
	constructor({actions}) {
		CreateCache.call(this); /* Provides: $document, $window */
		this.id = `action-${Math.round(Math.random() * 1000000)}`;
		this.actions = actions;
		this.observer = new Observer();
		this.tmpl = {
			actions: this.renderActions.bind(this),
		};

		this.generateTemplate();
		this.initEventsActions();

		this.observer.fire('init');

		return this;
	}
	generateTemplate() {
		let tmpl = `<div id="${this.id}">
									<button
											type="button"
											id="filter-block"
											class="d-flex justify-content-center align-items-center"
											data-toggle="dropdown"
											aria-haspopup="true"
											aria-expanded="false"
										>
											<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="#fff" class="bi bi-filter-circle-fill" viewBox="0 0 16 16">
													<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM3.5 5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zM5 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
											</svg>
										</button>
										%actions%
								</div>`;

		this.markup = tmpl.replace(
			new RegExp(/%(\w+)%/, 'g'),
			(a,b) => this.renderPart(b)
		);

			return this.markup;
	}

	initApi() {
		this.$el = $(`#${this.id}`);
		this.$el.data('api', this);
	}

	renderActions() {
		const actions = this.actions.map(({action,type,name, bold})=>{
			return `<li
							class="dropdown-item font-weight-${bold ? "bold" : "normal"} js-post-action"
							data-action="${action}"
							data-type="${type}">${name}</li>`
		}).join('')

		return `<ul
							class="dropdown-menu"
							aria-labelledby="filter-block"
							>${actions}</ul>`;
	}

	renderPart(type) {
		const templateCB = this.tmpl[type];
		if(typeof templateCB === "function") {
			return this.tmpl[type]();
		} else {
			return "";
		}
	}

	handleActionClick(data) {
		this.observer.fire(data.action, data.type)
	}

	initEventsActions() {
		this.$document
			.on('click', `#${this.id} .js-post-action`,e=> {
				this.handleActionClick.call(this, $(e.target).data());
			})
	}

	render(parent) {
		const $parent = parent instanceof $ ? parent : $(parent);
		$parent.append(this.markup);
		this.initApi();
	}
}

window.Actions = Actions;