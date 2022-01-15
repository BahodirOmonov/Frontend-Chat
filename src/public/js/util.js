const backEndApi = "http://localhost:5000"
const token = window.localStorage.getItem("token")

const request = async (route, method, body) => {
	let isForm = true
	const headers = {
		token
	}

	if(!(body instanceof FormData)) {
		headers["Content-Type"] = "application/json"
		isForm = false
	}

	const response = await fetch(backEndApi + route, {
		method,
		headers,
		body: isForm ? body: JSON.stringify(body)
	})


	return await response.json()
}

