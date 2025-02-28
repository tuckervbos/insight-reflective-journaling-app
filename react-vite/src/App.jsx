import { Routes, Route, useLocation } from "react-router-dom";
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
// import { DarkThemeProvider } from "./components/UIComponents/DarkThemeProvider";
import EditEntryPage from "./components/EditEntryPage/EditEntryPage";
import ViewEntryPage from "./components/ViewEntryPage/ViewEntryPage";
import { AnimatePresence } from "motion/react";
import UpdateProfilePage from "./components/UpdateProfilePage/UpdateProfilePage";

const App = () => {
	const { user, authenticate } = useSessionStore();
	const location = useLocation();

	useEffect(() => {
		authenticate();
	}, [authenticate]);

	return (
		<>
			<Navigation />

			<div className="app-content min-h-screen bg-black text-white">
				<AnimatePresence mode="wait">
					<Routes location={location} key={location.pathname}>
						<Route path="/" element={<LandingPage />} />
						<Route path="/signup" element={<SignupFormPage />} />
						<Route path="/login" element={<LoginFormPage />} />
						<Route path="/home" element={<HomePage />} />
						{user && (
							<>
								<Route
									path="/profile"
									element={<UserProfile userId={user.id} />}
								/>
								<Route
									path="/profile/change-password"
									element={<ChangePassword userId={user.id} />}
								/>
								<Route path="/profile/update" element={<UpdateProfilePage />} />
								<Route path="/entries" element={<EntriesPage />} />
								<Route path="/entries/new" element={<CreateEntryPage />} />
								<Route path="/entries/:entryId" element={<ViewEntryPage />} />
								<Route
									path="/entries/:entryId/edit"
									element={<EditEntryPage />}
								/>
							</>
						)}
					</Routes>
				</AnimatePresence>
			</div>
		</>
	);
};

export default App;
