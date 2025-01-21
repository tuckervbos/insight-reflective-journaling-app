import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import SignupFormPage from "./components/SignupFormPage/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
import Navigation from "./components/Navigation/Navigation";

const App = () => {
	return (
		<div>
			<Navigation /> {/* Navigation bar */}
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/signup" element={<SignupFormPage />} />
				<Route path="/login" element={<LoginFormPage />} />
			</Routes>
		</div>
	);
};

export default App;
