import { useState } from "react";
import { useSessionStore } from "../../context/ZustandStore";
import { useModal } from "../../context/Modal";
import { login } from "../../utils/api";
import "./LoginForm.css";

function LoginFormModal() {
	const { setUser } = useSessionStore();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await login({ email, password });
		if (response.errors) {
			setErrors(response.errors);
		} else {
			setUser(response);
			closeModal();
		}
	};

	return (
		<>
			<h1>Log In</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Email
					<input
						type="text"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				{errors.email && <p>{errors.email}</p>}
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				{errors.password && <p>{errors.password}</p>}
				<button type="submit">Log In</button>
			</form>
		</>
	);
}

export default LoginFormModal;
