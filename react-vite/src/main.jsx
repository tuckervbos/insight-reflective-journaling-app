import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "./context/Modal";
import { getCsrfToken, authenticate } from "./utils/api";
import useSessionStore from "./store/sessionStore"; // zustand store - state management
import App from "./App";
import "./index.css";

const Root = () => {
	const setUser = useSessionStore((state) => state.setUser);
	const [initialized, setInitialized] = useState(false);
	const [authError, setAuthError] = useState(null);

	useEffect(() => {
		const initializeApp = async () => {
			try {
				// fetch CSRF token
				await getCsrfToken();

				// attempt to authenticate user session
				const user = await authenticate();
				if (user) setUser(user); // update zustand store
			} catch (error) {
				console.error("App initialization failed:", error);
				setAuthError("Failed to initialize app. Please refresh and try again.");
			} finally {
				setInitialized(true);
			}
		};

		initializeApp();
	}, [setUser]);

	if (!initialized) return <div className="loading-screen">Loading...</div>;
	if (authError)
		return (
			<div className="error-screen">
				<p>{authError}</p>
				<button onClick={() => window.location.reload()}>Retry</button>
			</div>
		);

	return (
		<ModalProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ModalProvider>
	);
};

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Root />
	</React.StrictMode>
);
