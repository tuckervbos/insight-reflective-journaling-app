import { Navigate } from "react-router-dom";
import useSessionStore from "../store/sessionStore";

const PrivateRoute = ({ children }) => {
	const user = useSessionStore((state) => state.user);
	return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
