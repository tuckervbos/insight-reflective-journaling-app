import { Routes, Route, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
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
import CreateGoalPage from "./components/CreateGoalPage/CreateGoalPage";
import GoalsPage from "./components/GoalsPage/GoalsPage";
import ViewGoalPage from "./components/ViewGoalPage/ViewGoalPage";
import EditGoalPage from "./components/EditGoalPage/EditGoalPage";
import MilestonesPage from "./components/MilestonesPage/MilestonesPage";
import EditMilestonePage from "./components/EditMilestonePage/EditMilestonePage";
import CreateMilestonePage from "./components/CreateMilestonePage/CreateMilestonePage";
import ViewMilestonePage from "./components/ViewMilestonePage/ViewMilestonePage";
import InsightForm from "./components/InsightForm/InsightForm";
import InsightList from "./components/InsightList/InsightList";
import ViewInsightsPage from "./components/ViewInsightsPage/ViewInsightsPage";
import ViewInsightPage from "./components/ViewInsightPage/ViewInsightPage";
import CreateInsightPage from "./components/CreateInsightPage/CreateInsightPage";
import EditInsightPage from "./components/EditInsightPage/EditInsightPage";

const App = () => {
	const { user, authenticate } = useSessionStore();
	const location = useLocation();

	useEffect(() => {
		authenticate();
	}, [authenticate]);

	return (
		<>
			<Toaster />
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
								<Route path="/goals" element={<GoalsPage />} />
								<Route path="/goals/new" element={<CreateGoalPage />} />
								<Route path="/goals/:goalId" element={<ViewGoalPage />} />
								<Route path="/goals/:goalId/edit" element={<EditGoalPage />} />
								<Route path="/milestones" element={<MilestonesPage />} />
								<Route
									path="/milestones/new"
									element={<CreateMilestonePage />}
								/>
								<Route
									path="/milestones/:milestoneId"
									element={<ViewMilestonePage />}
								/>
								<Route
									path="/milestones/:milestoneId/edit"
									element={<EditMilestonePage />}
								/>
								<Route path="/insights" element={<ViewInsightsPage />} />
								<Route path="/insights/new" element={<CreateInsightPage />} />
								<Route
									path="/insights/:insightId"
									element={<ViewInsightPage />}
								/>
								<Route
									path="/insights/:insightId/edit"
									element={<EditInsightPage />}
								/>
								{/* <Route path="/ai/insight-form" element={<InsightForm />} /> */}
								{/* <Route path="/ai/insight-list" element={<InsightList />} /> */}
							</>
						)}
					</Routes>
				</AnimatePresence>
			</div>
		</>
	);
};

export default App;
