import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ModalProvider, Modal } from "../context/Modal";
import { authenticate } from "../utils/api";
import Navigation from "../components/Navigation/Navigation";

export default function Layout() {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		authenticate().then(() => setIsLoaded(true));
	}, []);

	return (
		<>
			<ModalProvider>
				<Navigation />
				{isLoaded && <Outlet />}
				<Modal />
			</ModalProvider>
		</>
	);
}
