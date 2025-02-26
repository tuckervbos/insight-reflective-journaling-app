// DarkThemeProvider.jsx
import React from "react";

export const DarkThemeProvider = ({ children }) => {
	return (
		<div className="bg-gray-950 min-h-screen text-gray-200">{children}</div>
	);
};
