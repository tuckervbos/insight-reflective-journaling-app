import { useState } from "react";
import {
	DarkThemeProvider,
	GlowNavbar,
	GlowCard,
	GlowButton,
	GlowInput,
	GlowToggle,
	GlowModal,
	InfinityLoader,
} from "../UIComponents";

export const GlowingUIDemo = () => {
	const [inputValue, setInputValue] = useState("");
	const [isToggled, setIsToggled] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navLinks = [
		{ label: "Home", href: "#" },
		{ label: "Features", href: "#" },
		{ label: "Pricing", href: "#" },
		{ label: "Contact", href: "#" },
	];

	const handleButtonClick = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			setIsModalOpen(true);
		}, 2000);
	};

	return (
		<DarkThemeProvider>
			<GlowNavbar links={navLinks} />

			<div className="container mx-auto px-4 py-12">
				<h1 className="text-4xl font-bold text-cyan-300 mb-8">
					Glowing UI Components
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
					<GlowCard className="flex flex-col space-y-4">
						<h2 className="text-2xl font-semibold text-cyan-200 mb-2">
							Interactive Controls
						</h2>

						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Glowing Input
								</label>
								<GlowInput
									placeholder="Type something..."
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Glowing Toggle
								</label>
								<div className="flex items-center">
									<GlowToggle
										isOn={isToggled}
										onToggle={() => setIsToggled(!isToggled)}
									/>
									<span className="ml-3 text-sm">
										{isToggled ? "On" : "Off"}
									</span>
								</div>
							</div>

							<div>
								<GlowButton onClick={handleButtonClick}>
									{isLoading ? "Loading..." : "Open Modal"}
								</GlowButton>
								{isLoading && <InfinityLoader className="mt-4" />}
							</div>
						</div>
					</GlowCard>

					<GlowCard>
						<h2 className="text-2xl font-semibold text-cyan-200 mb-4">
							About Infinity Mirror Effect
						</h2>
						<p className="text-gray-300 mb-4">
							The infinity mirror effect creates the illusion of depth through
							repeated reflections, simulated here with layered glowing outlines
							that appear to recede into the screen.
						</p>
						<p className="text-gray-300">
							This design combines a dark theme with cyan accents that provide a
							sci-fi aesthetic, perfect for modern web applications.
						</p>
					</GlowCard>
				</div>
			</div>

			<GlowModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="Glowing Modal"
			>
				<p className="text-gray-300 mb-4">
					This modal demonstrates the infinity mirror effect with animated
					glowing borders that appear to recede into the distance.
				</p>
			</GlowModal>
		</DarkThemeProvider>
	);
};
