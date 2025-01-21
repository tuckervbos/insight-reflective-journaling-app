import useSessionStore from "../../store/sessionStore";

function HomePage() {
	const user = useSessionStore((state) => state.user);

	return (
		<div>
			<h1>Home Page</h1>
			{user ? (
				<p>Welcome back, {user.username}!</p>
			) : (
				<p>Please log in or sign up to get started.</p>
			)}
		</div>
	);
}

export default HomePage;
