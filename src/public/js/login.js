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



formLogin.onsubmit = async event => {
	try {
		event.preventDefault()

		usernameInput.value = usernameInput.value.trim()
		passwordInput.value = passwordInput.value.trim()

		if(!usernameInput.value || !passwordInput.value) {
			return errorMessage.textContent = "username yoki passwordni qiymati yo'q!"
		}

		if(!usernameInput.value < 1 && !usernameInput.value > 50) {
			return errorMessage.textContent = "username uzunligi 1 va 50 orasida bo'lishi kerak!"
		}

		if(!passwordInput.value < 5 && !passwordInput.value > 15) {
			return errorMessage.textContent = "password uzunligi 5 va 15 orasida bo'lishi kerak!"
		}

		const response = await request("/auth/login", "POST", {
			username: usernameInput.value,
			password: passwordInput.value
		})

		if(response.status == 201) {
			window.localStorage.setItem("token", response.token)
			window.localStorage.setItem("userId", response.user.userId)
			window.location = "/"
		}
		else {
			errorMessage.textContent = response.message
		}
		
	} catch (error) {
		errorMessage.textContent = error.message
	}
}