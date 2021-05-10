const Instances = Object.values(window.TYPES);

var Model = (function(){
	return Instances.reduce((acc,el)=>{
		acc[el.toLowerCase()] = new CreateModel(el)
		return acc;
	}, {})
})();

const $blockPosts = $('#block-posts');
const $blockFilter = $('#block-filter');
const $loginModal = $('#login-popup');
const $registrationModal = $('#registration-popup');
const $editPostModal = $('#edit-post-popup');
const $createPostModal = $('#create-post-popup');

const STORAGE_AUTH_KEY 				= 'auth';
const STORAGE_ROLES_KEY 			= 'roles';
const STORAGE_USERS_KEY 			= 'users';
const STORAGE_TAGS_KEY 				= 'tags';
const STORAGE_CATEGORIES_KEY 	= 'categories';

const ACTION_FILTER_BY_ALL 		= 'filter_by_all';
const ACTION_FILTER_BY_USER 	= 'filter_by_user';
const ACTION_FILTER_BY_CAT 		= 'filter_by_cat';
const ACTION_FILTER_BY_TAG 		= 'filter_by_tag';
const ACTION_SORT_BY_RESET 		= 'sort_by_reset';
const ACTION_SORT_BY_AZ 			= 'sort_by_az';
const ACTION_SORT_BY_ZA 			= 'sort_by_za';

const STORAGE_AUTH 				= sessionStorage.getItem(STORAGE_AUTH_KEY);
const STORAGE_ROLES 			= sessionStorage.getItem(STORAGE_ROLES_KEY);
const STORAGE_USERS 			= sessionStorage.getItem(STORAGE_USERS_KEY);
const STORAGE_TAGS 				= sessionStorage.getItem(STORAGE_TAGS_KEY);
const STORAGE_CATEGORIES 	= sessionStorage.getItem(STORAGE_CATEGORIES_KEY);

const APP_DATA = {
	_auth: JSON.parse(STORAGE_AUTH),
	_roles: JSON.parse(STORAGE_ROLES),
	_users: JSON.parse(STORAGE_USERS),
	_tags: JSON.parse(STORAGE_TAGS),
	_categories: JSON.parse(STORAGE_CATEGORIES),

	get auth() {
		return this._auth;
	},
	set auth(value) {
		saveData(STORAGE_AUTH_KEY, value)
		this._auth = value;
	},
	get roles() {
		return this._roles;
	},
	set roles(value) {
		saveData(STORAGE_ROLES_KEY, value)
		this._roles = value;
	},
	get users() {
		return this._users;
	},
	set users(value) {
		saveData(STORAGE_USERS_KEY, value)
		this._users = value;
	},
	get tags() {
		return this._tags;
	},
	set tags(value) {
		saveData(STORAGE_TAGS_KEY, value)
		this._tags = value;
	},
	get categories() {
		return this._categories;
	},
	set categories(value) {
		saveData(STORAGE_CATEGORIES_KEY, value)
		this._categories = value;
	}
};

function saveData(key, obj) {
	sessionStorage.setItem(key, JSON.stringify(obj));
}

function getFormData($form) {
	return $form.serializeArray().reduce((acc,el)=>{
		acc[el.name] = el.value;
		return acc;
	}, {});
}

function hideError($form) {
	$form.find('.alert-danger').fadeOut();
}

function showErrorTextInForm($form, errors) {
	$form.find('.alert-danger')
		.text(errors.join('\n'))
		.fadeIn();
}

function promiseGetSeveral(array, api) {
	return Promise.all(array.map(api))
		.then(res=>res.filter(el=>el.success).map(el=>el.data))
}

function resetForm($form) {
	$form.get(0).reset()
}

function getAppearState(post_data, action, data) {
	switch(action) {
		case ACTION_FILTER_BY_ALL:
			return true;
		case ACTION_FILTER_BY_USER:
			return parseInt(post_data.user_id) === data;
		case ACTION_FILTER_BY_CAT:
			return post_data.categories.some(cat_id=>parseInt(cat_id) === data)
		case ACTION_FILTER_BY_TAG:
			return post_data.tags.some(tag_id=>parseInt(tag_id) === data)
		default:
			return false;
	}
}

function getSortedPosts(posts, action) {
	switch(action) {
		case ACTION_SORT_BY_AZ:
			return posts.sort((a,b)=>a.title < b.title ? -1 : 1);
		case ACTION_SORT_BY_ZA:
			return posts.sort((a,b)=>a.title > b.title ? -1 : 1);
		default:
			return posts;
	}
}

function filterBy(action) {
	return data => {
		const postsFiltered = window.posts.map(post=>({
			id: post.id,
			state: getAppearState(post, action, data),
		}))

		window.postsComponents.forEach(component=>{
			const { state } = postsFiltered.find(el=>el.id === component.id);
			component.$el.toggleClass("d-none", !state)
		})
	}
}

function sortBy(action) {

	return () => {
		let postsCopied = window.posts.slice();
		let postsByOrder = getSortedPosts(postsCopied, action);

		if(postsCopied.length && postsByOrder.length) {
			postsCopied.forEach((post, i)=>{
				const component = window.postsComponents.find(el=>el.id === post.id);
				component.$el.css("order", i+1);

			})
		} else {
			window.postsComponents.forEach(component=>{
				component.$el.css("order", "unset");
			})
		}
	}
}

function postEdit(post) {
	const {id, title, user_id, content} = post.fields;
	const $editableContent = $editPostModal.find('#edit-post-content');
	const $form = $editPostModal.find('form');
	const $title = $editableContent.find('input[name="title"]');
	const $user = $editableContent.find('input[name="user"]');
	const $content = $editableContent.find('textarea[name="content"]');

	$form.data('id', id);
	$title.val(title);
	$user.val(user_id);
	$content.text(content);

	$editPostModal.modal("show");
}

function postRemove(post) {
	console.log('postRemove', post)
	return Model.post.api.delete(post.fields.id)
		.then(({success, message, errors})=>{
			if(success) {
				post.remove();
				console.log(message.join('\n'))
			} else if(errors && errors.length) {
				console.warn(errors.join('\n'))
			}
		})
}

function handleCreateFormSubmit(e) {
	e.preventDefault();
	const $form = $(e.target);
	const dataForSend = getFormData($form);
	const {title,content} = dataForSend;

	const isValid = [title, content].every(el=>Boolean($.trim(el)));

	if(isValid) {
		hideError($form);

		Model.post.api.create(dataForSend)
			.then(({success, data, errors})=>{
				if(success) {
					const postComponent = createPostComponent(preparePostData(data, APP_DATA), APP_DATA);
					postComponent.render($blockPosts);
					postComponent.scroll();
					resetForm($form);
					$form.closest('.modal').modal("hide");
				} else if(errors && errors.length) {
					showErrorTextInForm($form, errors)
				}
			})
	} else {
		showErrorTextInForm($form, ['Заголовок и Текст должны быть заполнены']);
	}
}

function preparePostData(post, appData = {}) {
		const {users = [], tags = [], categories = []} = appData;
		const author = users.find(el=>el.id === post.user_id) || {};
		return {
			...post,
			title: $.trim(post.title) ? post.title : "Без заголовка",
			user: $.trim(author.name) ? `Автор: ${author.name}` : "Без автора",
			content: $.trim(post.content) ? post.content : "Без описания",
			createdAt: post.created_at.split(' ')[0].split('-').reverse().join('/'),
			tags: post.tags && post.tags.length
				? post.tags.map(el=>tags.find(tag=>tag.id===el).title)
				: [],
			categories: post.categories && post.categories.length
				? post.categories.map(el=>categories.find(category=>category.id===el).title)
				: [],
		}
}

function createPostComponent(post, appState) {
	const props = {fields: post};
	const editable = appState.auth.id === post.user_id;
	const postComponent = editable
		? new PostEditableComponent(props)
		: new PostComponent(props);

	if(editable) {
		postComponent.observer.subscribe('onEdit', postEdit)
		postComponent.observer.subscribe('onRemove', postRemove)
	}

	return postComponent;
}

function initAdminPanel() {
	const admin_id = APP_DATA.roles.find(role=>role.name === "Админ").id;
	const isAdmin = APP_DATA.auth.role_id === admin_id;

	if(isAdmin) {
		$('#block-main-actions').removeClass('d-none').addClass('d-flex');
		const $user = $createPostModal.find('input[name="user"]');
		$user.val(APP_DATA.auth.id);
		$createPostModal.find('form').on('submit', handleCreateFormSubmit);
	}
}

function initActions() {
	const actions = [];

	if(APP_DATA.users.length) {
		Array.prototype.push.apply(actions, APP_DATA.users.map(({id,name})=>({
			action: ACTION_FILTER_BY_USER,
			type: id,
			name: `Фильтер по автору - ${name}`,
		})))
	}

	if(APP_DATA.categories.length) {
		Array.prototype.push.apply(actions, APP_DATA.categories.map(({id,title})=>({
			action: ACTION_FILTER_BY_CAT,
			type: id,
			name: `Фильтер по категории - ${title}`,
		})))
	}

	if(APP_DATA.tags.length) {
		Array.prototype.push.apply(actions, APP_DATA.tags.map(({id,title})=>({
			action: ACTION_FILTER_BY_TAG,
			type: id,
			name: `Фильтер по тэгу - ${title}`,
		})))
	}

	if(actions.length) {
		actions.unshift({
			action: ACTION_FILTER_BY_ALL,
			name: "Фильтер (нажмите для сброса)",
			bold: true,
		});

		actions.push({
			action: ACTION_SORT_BY_RESET,
			name: "Сортировка (нажмите для сброса)",
			bold: true,
		});

		actions.push({
			action: ACTION_SORT_BY_AZ,
			name: "Сортировать (A-Z)",
		});

		actions.push({
			action: ACTION_SORT_BY_ZA,
			name: "Сортировать (Z-A)",
		});

		const actionsComponent = new Actions({
			actions: actions,
		});

		actionsComponent.observer
			.subscribe(ACTION_FILTER_BY_ALL, filterBy(ACTION_FILTER_BY_ALL))
			.subscribe(ACTION_FILTER_BY_USER, filterBy(ACTION_FILTER_BY_USER))
			.subscribe(ACTION_FILTER_BY_CAT, filterBy(ACTION_FILTER_BY_CAT))
			.subscribe(ACTION_FILTER_BY_TAG, filterBy(ACTION_FILTER_BY_TAG))
			.subscribe(ACTION_SORT_BY_RESET, sortBy(ACTION_SORT_BY_RESET))
			.subscribe(ACTION_SORT_BY_AZ, sortBy(ACTION_SORT_BY_AZ))
			.subscribe(ACTION_SORT_BY_ZA, sortBy(ACTION_SORT_BY_ZA))

		actionsComponent.render($blockFilter)
	}
}

function loadPage() {
	initAdminPanel();
	
	Model.post.api.get()
		.then(res=>{
			const { success, data, errors } = res;

			if(success) {
				const { users_id, tags_id, categories_id } = data.reduce((acc,el)=>{
					if(acc.users_id.indexOf(el.user_id) === -1) {
						acc.users_id.push(el.user_id);
					}
					if(el.categories.length) {
						el.categories.forEach(cat=>{
							if(acc.categories_id.indexOf(cat) === -1) {
								acc.categories_id.push(cat);
							}
						})
					}
					if(el.tags.length) {
						el.tags.forEach(cat=>{
							if(acc.tags_id.indexOf(cat) === -1) {
								acc.tags_id.push(cat);
							}
						})
					}
					return acc;
				}, {
					users_id: [],
					tags_id: [],
					categories_id: []
				});

				Promise.all([
					promiseGetSeveral(users_id, Model.user.api.get),
					promiseGetSeveral(tags_id, Model.tag.api.get),
					promiseGetSeveral(categories_id, Model.category.api.get),
				])
					.then(res => {
						APP_DATA.users = res[0];
						APP_DATA.tags = res[1];
						APP_DATA.categories = res[2];
					})
					.then(()=>{
						window.posts = data;
						window.postsComponents = data.map(post=>createPostComponent(
							preparePostData(post, APP_DATA),
							APP_DATA
						));

						const loadComponentsPromise = Promise.all(
							window.postsComponents.map((component,i) => new Promise(resolve => {
								component.render($blockPosts, i * 50, resolve)
							}))
						);

						loadComponentsPromise.then(initActions);
					})

			} else if (errors && errors.length) {
				console.warn(errors.join('\n'))
			}
	})
}

function updateNavbar() {
	const {name, id} = APP_DATA.auth;
	$('#block-user-name')
		.text(name)
		.data('id', id);

	$('#block-auth').remove();
}

if(STORAGE_AUTH) {

	APP_DATA.auth = JSON.parse(STORAGE_AUTH);

	loadPage();
	updateNavbar();

	$editPostModal.find('form').on('submit', handleEditFormSubmit(Model.post.api.update))
	
	function handleEditFormSubmit(api) {
		return function(e) {
			e.preventDefault();
			const $this = $(e.target);
			const dataForSend = getFormData($this);
			const id = $this.data('id');
			const updatedPostComponent = window.postsComponents.find(el=>el.id === id);

			updatedPostComponent.$el.addClass('editable');

			api(id, dataForSend)
				.then(({success, data, errors})=>{
					if(success) {
						updatedPostComponent.update(preparePostData(data, APP_DATA));
						hideError($this);
						setTimeout(()=>updatedPostComponent.$el.removeClass('editable'), 500);
						$this.closest('.modal').modal("hide");
					} else if (errors && errors.length) {
						showErrorTextInForm($this, errors);
					}
				})

		}
	}
	
} else {

	$loginModal.find('form').on('submit',handleAuthFormSubmit(Model.auth.api.auth))
	$registrationModal.find('form').on('submit', handleAuthFormSubmit(Model.user.api.create))

	function handleAuthFormSubmit(api) {
		return function(e) {
			e.preventDefault();
			const $this = $(e.target);
			const dataForSend = getFormData($this);

			if(/^[a-zA-Z]+$/.test(dataForSend.name)) {
				api(dataForSend)
					.then(({success, data, errors})=>{
							if(success) {
								APP_DATA.auth = data;
								updateNavbar();
								loadPage();
								hideError($this);
								$this.closest('.modal').modal("hide");
							} else if (errors && errors.length) {
								showErrorTextInForm($this, errors);
							}
						}
					)
			} else {
				showErrorTextInForm($this, ['Имя должно содержать только буквы латиницы'])
			}
		}
	}

	function renderRolesSelect(roles) {
		$('#roles-block').html(`<label class="col-form-label">Роль:</label><select name="role_id" class="custom-select custom-select-lg">
			${roles.map(({id,name}, i)=>`<option value="${id}">${name}</option>`).join('')}
		</select>`)
	}

	function checkRoles() {
		const roles = APP_DATA.roles;
		let promise;

		if(roles) {
			promise = Promise.resolve(roles)
		} else {
			promise = Model.role.api.get()
				.then(({success, data})=>{
					if(success) {
						APP_DATA.roles = data;
					}
					return data;
				})
		}
		return promise.then(renderRolesSelect)
	}

	if(location.search) {
		const searchParam = new URLSearchParams(location.search)
		const userName = searchParam.get("user");
		if(userName) {
			$loginModal.find("input[name=name]").val(userName);
			$loginModal.find("form").trigger("submit");
		}
	} else {
		checkRoles()
			.then(()=>{
				$loginModal.modal("show")
			})
	}
}