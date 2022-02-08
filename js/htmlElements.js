let currentDate = new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear()
const usersEl = ({ fullName, userId, selected, active }) => {
	return `
		<tr data-userid="${userId}">
		  <td class="align-middle">
		    <div class="custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top">
		      <input ${selected && 'checked'} onclick="selectUser(this)" type="checkbox" class="custom-control-input" id="item-${userId}">
		      <label class="custom-control-label" for="item-${userId}"></label>
		    </div>
		  </td>
		  <td class="text-nowrap align-middle">${fullName}</td>
		  <td class="text-nowrap align-middle"><span>${currentDate}</span></td>
		  <td class="text-center align-middle"><i onclick="toggleUser(this)" class="fa fa-fw text-secondary cursor-pointer fa-toggle-${active == true ? 'on' : 'off'}"></i></td>
		  <td class="text-center align-middle">
		    <div class="btn-group align-top">
		        <button  class="btn btn-sm btn-outline-secondary badge" onclick="editUser(this)" type="button" data-toggle="modal" data-target="#user-form-modal">Edit</button>
		        <button class="btn btn-sm btn-outline-secondary badge" onclick="deleteuser(this)" type="button"><i class="fa fa-trash"></i></button>
		    </div>
		  </td>
		</tr>
	`
}

const buttonsEl = ({ page }) => {
	return `
		<li data-page="${page}" onclick="findPage(this)" class="page-item ${page == 1 ? 'active' : ''}"><a href="#" class="page-link">${page}</a></li>
	`
}

function users () {
	const users = window.localStorage.getItem('users')
	return JSON.parse(users) || mockUsers
}

let actives = 0
let select = 0
for (let j = 0; j < users().length; j++) {
	if (users()[j].active == true) {
		actives++
	}
}

for (let j = 0; j < users().length; j++) {
	if (users()[j].selected == true) {
		select++
	}
}

const filters = `
	<li class="nav-item"><a href="" class="nav-link filter-all"><span>All</span>&nbsp;<small>/&nbsp;${users().length}</small></a></li>
    <li class="nav-item"><a href="" class="nav-link filter-Active"><span>Active</span>&nbsp;<small>/&nbsp;${actives}</small></a></li>
    <li class="nav-item"><a href="" class="nav-link filter-selected"><span>Selected</span>&nbsp;<small>/&nbsp;${select}</small></a></li>
	`
