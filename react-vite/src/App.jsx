import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import SignupFormPage from "./components/SignupFormPage/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
import HomePage from "./components/HomePage/HomePage";
import Navigation from "./components/Navigation/Navigation";
import EntriesPage from "./components/EntriesPage/EntriesPage";
import CreateEntryPage from "./components/CreateEntryPage/CreateEntryPage";
import UserProfile from "./components/UserProfile/UserProfile";
import ChangePassword from "./components/UserProfile/ChangePassword";
import useSessionStore from "./store/sessionStore";
import { useEffect } from "react";

const App = () => {
	const { user, authenticate } = useSessionStore();

	useEffect(() => {
		authenticate();
	}, [authenticate]);

	return (
		<div>
			<Navigation />
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/signup" element={<SignupFormPage />} />
				<Route path="/login" element={<LoginFormPage />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/entries" element={<EntriesPage />} />
				<Route path="/entries/new" element={<CreateEntryPage />} />
				{user && (
					<>
						<Route path="/profile" element={<UserProfile userId={user.id} />} />
						<Route
							path="/change-password"
							element={<ChangePassword userId={user.id} />}
						/>
					</>
				)}
			</Routes>
		</div>
	);
};

export default App;
