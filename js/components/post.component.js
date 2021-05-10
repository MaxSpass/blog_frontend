const CLS_NAME = {
	title: 'post-title',
	user: 'post-author',
	content: 'post-content',
	thumbnail: 'post-src',
	createdAt: 'post-created',
}

class PostComponent {
	constructor({fields, tmpl}) {
		/* fields: id, title, content, thumbnail, user, status, created_at */
		this._type = window.TYPES.POST;
		this.id = fields.id;
		CreateCache.call(this); /* Provides: $document, $window */
		this.fields = fields;
		this.selector = `#post-${this.fields.id}`;
		this.observer = new Observer();
		this.visible = false;

		this.tmpl = $.extend(true, {
			title: this.renderTitle.bind(this),
			user: this.renderAuthor.bind(this),
			content: this.renderContent.bind(this),
			inner: this.renderContent.bind(this),
			thumbnail: this.renderThumbnailSrc.bind(this),
			createdAt: this.renderCreatedAt.bind(this),
		}, tmpl);

		this.generateTemplate();
		this.observer.fire('init');

		return this;
	}

	initApi() {
		this.$el = $(this.selector);
		this.$el.data('api', this);
	}

	renderTitle() {
		return `<h4 class="${CLS_NAME.title}">${this.fields.title}</h4>`;
	}

	renderAuthor() {
		return `<span class="${CLS_NAME.user} position-absolute">${this.fields.user}</span>`
	}

	renderThumbnailSrc() {
		return `<div
							class="${CLS_NAME.thumbnail} position-absolute w-100 h-100"
							style="background-image: url(${this.fields.thumbnail})"
						></div>`;
	}

	renderContent() {
		return `<p class="${CLS_NAME.content}">${this.fields.content}</p>`;
	}

	renderCreatedAt() {
		return `<p class="${CLS_NAME.createdAt} position-absolute m-0"><small>${this.fields.createdAt}</small></p>`
	}

	generateTemplate() {
		const {id, status} = this.fields;

		let tmpl = `<div
												id="post-${id}"
												data-post-id="${id}"
												class="post-wrapper post-status-${status} mb-3 w-100"
												style="display:none;"
											>
											<div class="card d-flex flex-row position-relative h-100">
													<div class="post-image position-relative">
														%user%
														%thumbnail%				
													</div>
													%actions%
													<div class="post-body p-2">
														%title%
														<div class="post-inner">%content%</div>
														%createdAt%
													</div>
												</div>
										</div>`;

		this.markup = tmpl.replace(
			new RegExp(/%(\w+)%/, 'g'),
			(a,b) => this.renderPart(b)
		);

		return this.markup;
	}

	hide(cb = () => {}) {
		this.$el.fadeOut(300, () => {
			this.visible = false;
			cb();
		});
	}

	show() {
		this.$el.fadeIn();
		this.visible = true;
	}

	renderPart(type) {
		const templateCB = this.tmpl[type];
		if(typeof templateCB === "function") {
			return this.tmpl[type]();
		} else {
			return "";
		}
	}

	updateParts(updatedKeys) {
		for (let key in updatedKeys) {
			switch (key) {
				case "title":
					this.$el.find(`.${CLS_NAME.title}`)
						.text(this.fields.title);
					break;

				case "user":
					this.$el.find(`.${CLS_NAME.user}`)
						.text(this.fields.user);
					break;

				case "content":
					this.$el.find(`.${CLS_NAME.content}`)
						.text(this.fields.content);
					break;

				case "thumbnail":
					this.$el.find(`.${CLS_NAME.thumbnail}`)
						.attr({
							title: this.fields.title,
							src: this.fields.thumbnail,
						});
					break;

				case "createdAt":
					this.$el.find(`.${CLS_NAME.createdAt}`)
						.text(this.fields.createdAt);
					break;

				default:
					break;
			}
		}

		this.observer.fire('updated', updatedKeys);
	}

	update(props) {
		const updatedKeys = {};

		for (let key in props) {
			const newKey = props[key];
			if (this.fields.hasOwnProperty(key) && this.fields[key] !== newKey) {
				updatedKeys[key] = props[key];
			}
		}

		this.fields = {
			...this.fields,
			...updatedKeys,
		}

		this.updateParts(updatedKeys);
	}

	remove() {
		this.$el.hide(this.$el.remove.bind(this.$el));
	}

	scroll(delay = 500) {
		setTimeout(()=>{
			$('html, body').animate({
				scrollTop: this.$el.offset().top
			}, delay);
		})
	}

	render(parent, delay = 0, cb) {
		const $parent = parent instanceof $ ? parent : $(parent);

		setTimeout(()=>{
			$parent.append(this.markup);
			this.initApi();
			this.show();
			cb();
		}, delay)
	}
}

class PostEditableComponent extends PostComponent {
	constructor({fields}) {
		super({fields});
		this.dropdownKey = `dropdown-${this._type}-${this.fields.id}`;
		this.tmpl.actions = this.renderActions.bind(this);

		this.generateTemplate();
		this.initEventsActions();
	}
	renderActions() {
		return `<div class="position-absolute post-actions">
						<button
										type="button"
										id="${this.dropdownKey}"
										class="d-flex justify-content-center align-items-center"
										data-toggle="dropdown"
										aria-haspopup="true"
										aria-expanded="false"
						>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" class="bi bi-three-dots" viewBox="0 0 16 16">
										<path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
								</svg>
						</button>
						<ul class="dropdown-menu" aria-labelledby="${this.dropdownKey}">
								<li class="dropdown-item js-post-action" data-action="onEdit">Редактировать</li>
								<li class="dropdown-item js-post-action" data-action="onRemove">Удалить</li>
						</ul>
				</div>`;
	}
	handleActionClick(type) {
		this.observer.fire(type, this)
	}
	initEventsActions() {
		this.$document
			.on('click', `${this.selector} .js-post-action`,(e)=> {
				this.handleActionClick.call(this, $(e.target).data('action'));
			})
	}
}

window.PostComponent = PostComponent;
window.PostEditableComponent = PostEditableComponent;

