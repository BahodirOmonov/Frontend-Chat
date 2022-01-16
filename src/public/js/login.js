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
			window.localStorage.setItem("userImage", response.user.userImage)
			window.location = "/"
		}
		else {
			errorMessage.textContent = response.message
		}
		
	} catch (error) {
		errorMessage.textContent = error.message
	}
}