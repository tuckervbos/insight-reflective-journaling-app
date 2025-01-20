const getCsrfToken = async () => {
	const response = await fetch("/api/auth/csrf/restore", {
		credentials: "include",
	});
	const data = await response.json();
	if (data.csrf_token) {
		document.cookie = `csrf_token=${data.csrf_token}; path=/`;
	} else {
		console.error("Failed to fetch CSRF token");
	}
};
