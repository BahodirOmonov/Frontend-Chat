;(async () => {
	if(token) {
		let response = await request('/users')
		if(response.status != 401) {
			if(window.location.pathname != "/") window.location = "/"	
		}
		else {
			window.localStorage.removeItem("token")
			if(window.location.pathname != "/login") window.location = "/login"
		}
	}
	else {
		window.localStorage.removeItem("sendUserId")
		window.localStorage.removeItem("userImage")
		if(window.location.pathname == "/") window.location = "/login"
	}
})()