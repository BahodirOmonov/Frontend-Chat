if(!token) {
	window.location = "/login"
}

const userId = window.localStorage.getItem("userId")

sendButton.onclick = () => {
	console.log("Hello world!")
}

async function renderContacts () {

	const users = await request("/users")

	usersContact.innerHTML = null
	usersWriter.innerHTML = null

	for(let user of users) {
		let div = document.createElement("div")

		const message = await request(`/messages?userId=${userId}&sendUserId=${user.userId}`)
		const message2 = await request(`/messages?userId=${user.userId}&sendUserId=${userId}`)

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

		if(message.length || message2.length) {
			let div2 = document.createElement("div")

			div2.innerHTML = div.innerHTML
			div2.className = div.className
			usersWriter.append(div2)

			div2.onclick = event => {
				renderMessages(user.userId, message, message2)
			}
		}

		div.onclick = event => {
			renderMessages(user.userId, message, message2)
		}
	}
}

async function renderMessages(userId, message, message2) {
	const users = await request("/users")
	let messages = [...message, ...message2]
	messages = messages.sort((a, b) => a.messageId - b.messageId)

	const user = users.find(user => user.userId == userId)

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

	let messageStr = ""

	conversation.innerHTML = null
	for(let message of messages) {
		messageStr += `
			<div class="row message-body">
	          <div class="col-sm-12 ${message.userId == userId ? "message-main-receiver": "message-main-sender" }">
	            <div class=${message.userId == userId ? "receiver": "sender"}>
	              <div class="message-text">${message.messageText}</div>
	              <span class="message-time pull-right">${dateRender(message.messageDate)}</span>
	            </div>
	          </div>
	        </div>
		`
	}
	conversation.innerHTML = messageStr
}

function dateRender(value) {
	const date = new Date(value)
	// return `${(date.getHours()).toString().padStart(2, 0)}:${(date.getMinutes()).toString().padStart(2, 0)}   |    ${(date.getDate()).toString().padStart(2, 0)}-${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getFullYear()}`
	return `${(date.getHours()).toString().padStart(2, 0)}:${(date.getMinutes()).toString().padStart(2, 0)}`
}

renderContacts()