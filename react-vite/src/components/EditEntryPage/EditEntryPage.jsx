import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEntriesStore from "../../store/entriesStore";
import { GlowButton } from "../UIComponents/Button";
import { GlowCard } from "../UIComponents/Card";
import { motion } from "framer-motion";

// Page transition animation
const pageVariants = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const EditEntryPage = () => {
	const { entryId } = useParams(); // Get entry ID from URL
	const navigate = useNavigate();
	const { entries, updateEntry } = useEntriesStore();

	// Find the existing entry
	const existingEntry = entries.find((e) => e.id === parseInt(entryId));

	const [editedEntry, setEditedEntry] = useState({
		title: existingEntry?.title || "",
		body: existingEntry?.body || "",
	});

	useEffect(() => {
		if (existingEntry) {
			setEditedEntry({ title: existingEntry.title, body: existingEntry.body });
		}
	}, [existingEntry]);

	// Handle changes to input fields
	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditedEntry((prev) => ({ ...prev, [name]: value }));
	};

	// Save changes
	const handleSave = () => {
		updateEntry(entryId, editedEntry);
		navigate("/entries"); // Redirect after saving
	};

	if (!existingEntry) {
		return (
			<div className="container mx-auto py-12 px-6">
				<GlowCard className="p-6 text-center">
					<h1 className="text-3xl font-semibold text-violet-300 mb-4">
						Entry Not Found
					</h1>
					<GlowButton onClick={() => navigate("/entries")}>
						Back to Entries
					</GlowButton>
				</GlowCard>
			</div>
		);
	}

	return (
		<motion.div
			className="container mx-auto py-12 px-6"
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<GlowCard className="p-6">
				<h1 className="text-3xl font-semibold text-violet-300 mb-4">
					Edit Entry
				</h1>

				<div className="flex flex-col space-y-4">
					<label className="text-violet-300">Title</label>
					<input
						type="text"
						name="title"
						value={editedEntry.title}
						onChange={handleChange}
						className="bg-background text-white border border-violet-500 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
					/>

					<label className="text-violet-300">Entry</label>
					<textarea
						name="body"
						value={editedEntry.body}
						onChange={handleChange}
						rows={6}
						className="bg-background text-white border border-violet-500 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
					/>

					<div className="mt-4 flex justify-between">
						<GlowButton onClick={handleSave}>Save Changes</GlowButton>
						<GlowButton
							onClick={() => navigate(`/entries/${entryId}`)}
							className="bg-gray-600"
						>
							Cancel
						</GlowButton>
					</div>
				</div>
			</GlowCard>
		</motion.div>
	);
};

export default EditEntryPage;
