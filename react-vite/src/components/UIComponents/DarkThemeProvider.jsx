// DarkThemeProvider.jsx
import React from "react";

export const DarkThemeProvider = ({ children }) => {
	return <div className="bg-black min-h-screen text-gray-200">{children}</div>;
};
