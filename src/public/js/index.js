let usersLength = 0
let privateUsersLength = 0

;(async () => {
	const users = await request("/users")
	usersLength = users.length
	profileImageRender(users)
	renderPrivate(users)
	renderContacts(users)
})()	



setInterval(async () => {
	const users = await request("/users")

	if(users.length > usersLength) {
		usersLength = users.length
		renderContacts(users)
	}

	let count = 0

	users.forEach( async user => {
		const message = await request(`/messages?sendUserId=${user.userId}`)
		const message2 = await request(`/messages?userId=${user.userId}`)

		if(message.length || message2.length) {
			count++
		}


		if(users[users.length - 1].userId == user.userId && count > privateUsersLength) {
			renderPrivate(users)
		}
	} )

	const sendUserId = window.localStorage.getItem("sendUserId")
	renderMessages(sendUserId)

}, 500)


composeText.onkeyup = async event => {
	let users = await request("/users")
	users = users.filter(user => (user.username.toLowerCase()).includes((event.target.value).toLowerCase()))
	renderContacts(users)
} 

searchText.onkeyup = async event => {
	let users = await request("/users")
	users = users.filter(user => (user.username.toLowerCase()).includes((event.target.value).toLowerCase()))
	renderPrivate(users)
} 

smileIcon.onclick = () => {
	comment.value += "😂"
}

comment.onkeyup = event => {
	if(event.keyCode != 13) return
	sendMessage(comment.value)
	comment.value = null
}

sendButton.onclick = event => {
	sendMessage(comment.value)
}

async function sendMessage(value) {
	const sendUserId = window.localStorage.getItem("sendUserId")

	value = value.trim()
	if(!value) return

	let formData = new FormData()
	
	formData.append("messageText", value)
	formData.append("sendUserId", sendUserId)

	const response = await request("/messages", "POST", formData)

	comment.value = null

	const users = await request("/users")

	renderContacts(users)
	renderMessages(sendUserId)
}

async function renderContacts (users) {

	usersContact.innerHTML = null

	for(let user of users) {
		let div = document.createElement("div")

		div.className = "row sideBar-body"

		div.innerHTML = `
			<div class="col-sm-3 col-xs-3 sideBar-avatar">
				<div class="avatar-icon">
					<img src=${backEndApi + user.userImage}>
				</div>
			</div>
			<div class="col-sm-9 col-xs-9 sideBar-main">
				<div class="row">
					<div class="col-sm-8 col-xs-8 sideBar-name">
						<span class="name-meta">${user.username}</span>
					</div>
				</div>
			</div>
		`

		usersContact.append(div)

		div.onclick = event => {
			window.localStorage.setItem("sendUserId", user.userId)
			avatarRender(user)
			renderMessages(user.userId)
		}

	}
}

async function renderPrivate(users) {
	usersWriter.innerHTML = null
	let count = 0

	for(let user of users) {

		const message = await request(`/messages?sendUserId=${user.userId}`)
		const message2 = await request(`/messages?userId=${user.userId}`)

		if(message.length || message2.length) {
			let div = document.createElement("div")

			div.className = "row sideBar-body"

			div.innerHTML = `
				<div class="col-sm-3 col-xs-3 sideBar-avatar">
					<div class="avatar-icon">
						<img src=${backEndApi + user.userImage}>
					</div>
				</div>
				<div class="col-sm-9 col-xs-9 sideBar-main">
					<div class="row">
						<div class="col-sm-8 col-xs-8 sideBar-name">
							<span class="name-meta">${user.username}</span>
						</div>
					</div>
				</div>
			`

			count++

			usersWriter.append(div)

			div.onclick = event => {
				window.localStorage.setItem("sendUserId", user.userId)
				avatarRender(user)
				renderMessages(user.userId)
			}
		}

	}

	privateUsersLength = count
}

async function renderMessages(sendUserId) {
	const message = await request(`/messages?sendUserId=${sendUserId}`)
	const message2 = await request(`/messages?userId=${sendUserId}`)

	let messages = [...message, ...message2]
	messages = messages.sort((a, b) => a.messageId - b.messageId)

	let messageStr = ""

	conversation.innerHTML = null
	for(let message of messages) {
		messageStr += `
		<div class="row message-body">
			<div class="col-sm-12 ${message.userId == sendUserId ? "message-main-receiver": "message-main-sender" }">
			<div class=${message.userId == sendUserId ? "receiver": "sender"}>
				<div class="message-text">${message.messageText}</div>
					<span class="message-time pull-right">${dateRender(message.messageDate)}</span>
				</div>
			</div>
		</div>
		`
	}
	conversation.innerHTML = messageStr
}


function avatarRender(user) {
	nameAvatar.innerHTML = `
	<div class="col-sm-2 col-md-1 col-xs-3 heading-avatar">
		<div class="heading-avatar-icon">
			<img src=${backEndApi + user.userImage}>
		</div>
	</div>
	<div class="col-sm-8 col-xs-7 heading-name">
		<a class="heading-name-meta">${user.username}</a>
		<span class="heading-online">Online</span>
	</div>
	<div class="col-sm-1 col-xs-1  heading-dot pull-right">
		<i class="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i>
	</div>	
	`
}

function profileImageRender(users) {
	const userImage = window.localStorage.getItem("userImage")
	let img = document.createElement("img")
	img.src = backEndApi + userImage
	headingAvatar.append(img)
}


function dateRender(value) {
	const date = new Date(value)
	// return `${(date.getHours()).toString().padStart(2, 0)}:${(date.getMinutes()).toString().padStart(2, 0)}   |    ${(date.getDate()).toString().padStart(2, 0)}-${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getFullYear()}`
	return `${(date.getHours()).toString().padStart(2, 0)}:${(date.getMinutes()).toString().padStart(2, 0)}`
}

