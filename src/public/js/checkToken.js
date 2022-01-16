;(async () => {
	if(token) {
		let response = await request('/users')
		if(response.status != 401) {
			if(window.location.pathname != "/") window.location = "/"	
		}
		else {
			window.localStorage.removeItem("token")
			window.localStorage.removeItem("userId")
			window.localStorage.removeItem("sendUserId")
			if(window.location.pathname != "/login") window.location = "/login"
		}
	}
	else {
		window.localStorage.removeItem("sendUserId")
		window.localStorage.removeItem("userId")
		if(window.location.pathname != "/login") window.location = "/login"
	}
})()