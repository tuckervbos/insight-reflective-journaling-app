import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import SignupFormPage from "./components/SignupFormPage/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
import HomePage from "./components/HomePage/HomePage";
import Navigation from "./components/Navigation/Navigation";

const App = () => {
	return (
		<div>
			<Navigation />
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/signup" element={<SignupFormPage />} />
				<Route path="/login" element={<LoginFormPage />} />
				<Route path="/home" element={<HomePage />} />
			</Routes>
		</div>
	);
};

export default App;
