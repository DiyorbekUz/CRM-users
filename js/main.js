class UserSystem {
	editBut = document.querySelector('.badge')
	editForm = document.querySelector("#editForm")
	saveChange = document.querySelector("#saveChange")
	newUser = document.querySelector('.btn-block')
	fullname = document.querySelector('#fullname')
	username = document.querySelector('#username')
	email = document.querySelector('#email')
	about = document.querySelector('#about')
	confirmPassword = document.querySelector('#confirm')
	newPassword = document.querySelector('#newPassword')
	tableBodyEl = document.querySelector('#tableBody')
	paginationEl = document.querySelector('.pagination')
	filterUl = document.querySelector('.nav')
	search = document.querySelector('#search')
	page = 1
	limit = 5

	get users () {
		const users = window.localStorage.getItem('users')
		return JSON.parse(users) || mockUsers
	}

	save (data) {
		window.localStorage.setItem('users', JSON.stringify(data))
	}

	renderUsers ({ active, search, page = this.page }) {
		// filter
		let users = this.users.filter(user => {
			let act = typeof(active) == 'boolean' ? user.active == active : true
			let sea = search ? user.fullName.toLowerCase().includes(search.toLowerCase()) : true

			return act && sea
		})

		// pagination
		users = users.slice(page * this.limit - this.limit, this.limit * page)

		// render users
		this.tableBodyEl.innerHTML = null
		for(let user of users) {
			let htmlEl = usersEl(user)
			this.tableBodyEl.innerHTML += htmlEl
		}
		
		this.filterUl.innerHTML = filters
	}

	editUser(event){
		let userId = event.parentNode.parentNode.parentNode.dataset.userid - 1
		let users = this.users

		
		this.fullname.value = users[userId].fullName

		let saveChange = document.querySelector('#saveChange')
		saveChange.onclick =  (event) => {

			event.preventDefault()
			// console.log(this.fullname.value);
			if (this.fullname.value.trim().length < 5 || this.username.value.trim().length < 5 || this.email.value.trim().length < 5 || this.about.value.trim().length < 5 || this.confirmPassword.value.trim().length < 5 || this.newPassword.value.trim().length < 5 || this.newPassword.value != this.confirmPassword.value) {
				alert("Kiritilgan ma'lumotlar xato, o'yin qilmang babr o'tolmisiz :)")
				return
			}else{
				users[userId].fullName = this.fullname.value
				users[userId].username = this.username.value
				users[userId].about = this.about.value
				users[userId].password = this.newPassword
				this.save(users)	
				this.renderUsers(users)
			}
		}
	}

	selectUser (element, parentElement) {
		const users = this.users

		if(element) {
			const userId = element.parentNode.parentNode.parentNode.dataset.userid
			const user = users.find(user => user.userId == userId)
			user.selected = element.checked
		}

		if(parentElement) {
			for(let user of users) {
				user.selected = parentElement.checked

				let htmlEl = document.querySelector('#item-' + user.userId)
				if(htmlEl) htmlEl.checked = parentElement.checked
			}
		}

		this.save(users)
		window.location = 'index.html'
	}

	toggleUser (element) {
		const users = this.users

		const userId = element.parentNode.parentNode.dataset.userid
		const user = users.find(user => user.userId == userId)

		const elementClass = element.classList[4]
		if(elementClass == 'fa-toggle-on') {
			element.classList.remove('fa-toggle-on')
			element.classList.add('fa-toggle-off')
		}

		if(elementClass == 'fa-toggle-off') {
			element.classList.remove('fa-toggle-off')
			element.classList.add('fa-toggle-on')
		}

		user.active = !user.active
		this.save(users)
		this.renderUsers(users)
		window.location = 'index.html'
		// this.filtersCategory(element)
	}

	paginationButtons () {
		const numberOfPages = Math.ceil(this.users.length / this.limit)

		this.paginationEl.innerHTML = null
		for(let page = 1; page <= numberOfPages; page++) {
			let newButtonEl = buttonsEl({ page })
			this.paginationEl.innerHTML += newButtonEl
		}
	}

	findPage (html) {
		const buttons = document.querySelectorAll('.page-item')
		buttons.forEach(el => el.classList.remove('active'))

		html.classList.add('active')
		this.renderUsers({ page: html.dataset.page })
	}


	deleteUser (event) {
		let users = this.users
		let userId = event.parentNode.parentNode.parentNode.dataset.userid
		let index = users.findIndex(user => user.userId == userId)
		event.parentNode.parentNode.parentNode.remove()
		users.splice(index, 1)
		this.save(users)
	}

	createUser (event) {
		let users = this.users
		let newId = users[0] ? users[users.length-1].userId + 1 : 1
		if (this.fullname.value.trim().length < 5 || this.username.value.trim().length < 5 || this.email.value.trim().length < 5 || this.about.value.trim().length < 5 || this.confirmPassword.value.trim().length < 5 || this.newPassword.value.trim().length < 5 || this.newPassword.value != this.confirmPassword.value || !this.email.value.includes('@') || !this.email.value.includes('.')) {
			alert("Eslatma: hamma kataklardagi belgilar soni 5tadan ko'p va Yangi parol va parolni tasdiqlovci bolimlar birhil bo'lishi shart, ")
			return
		}else{
			users.push({
				userId: newId, 
				username: this.username.value, 
				fullName: this.fullname.value,
				email: this.email.value, 
				bio: this.about.value, 
				password: this.newPassword.value, 
				selected: false, 
				active: false 
			})
			this.save(users)	
			this.renderUsers(users)
			event.preventDefault()
			window.location = 'index.html'
		}
		// event.preventDefault()
	}

	filtersCategory(event){
		let filter = event.target.textContent
		event.preventDefault()
		let users = this.users
		if (filter == 'Active') {
			this.tableBodyEl.innerHTML = null
			for(let user of users) {
				if (user.active == true) {
					let htmlEl = usersEl(user)
					this.tableBodyEl.innerHTML += htmlEl
				}
				
			}
		} else if(filter == 'Selected') {
			this.tableBodyEl.innerHTML = null
			for(let user of users) {
				if (user.selected == true) {
					let htmlEl = usersEl(user)
					this.tableBodyEl.innerHTML += htmlEl
				}
			}
		}else{
			this.renderUsers(users)
		}
	}
	
	searchUsers(){
		this.tableBodyEl.innerHTML = ''
		let users = this.users
		for(let user of users){
			if(user.fullName.toLowerCase().includes(this.search.value)){
				let htmlEl = usersEl(user)
				this.tableBodyEl.innerHTML += htmlEl
			}
		}
	}
}

const userSystem = new UserSystem()

userSystem.renderUsers({})
userSystem.paginationButtons()


// event handlers
function selectUser (html) {
	userSystem.selectUser(html)
}

function toggleUser (html) {
	userSystem.toggleUser(html)
}

function selectAllUsers (html) {
	userSystem.selectUser(null, html)
}

function findPage (html) {
	userSystem.findPage(html)
}

function editUser(event){
	userSystem.editUser(event)
}

function deleteuser(event){
	userSystem.deleteUser(event)
}

userSystem.saveChange.onclick = (event) =>{
	userSystem.createUser(event)
}

userSystem.filterUl.onclick = (el) =>{
	userSystem.filtersCategory(el);
}

userSystem.search.onkeydown = () =>{
	userSystem.searchUsers()
}