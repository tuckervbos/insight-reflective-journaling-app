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
	const { entryId } = useParams();
	const navigate = useNavigate();
	const { entries, updateEntry, fetchEntryById, setEntries, deleteEntry } =
		useEntriesStore();

	const [editedEntry, setEditedEntry] = useState({ title: "", body: "" });

	useEffect(() => {
		const loadEntry = async () => {
			let existingEntry = entries.find((e) => e.id === parseInt(entryId, 10));

			if (!existingEntry && entryId) {
				existingEntry = await fetchEntryById(entryId);
				if (existingEntry) {
					setEntries([existingEntry]);
				}
			}

			if (existingEntry) {
				setEditedEntry({
					title: existingEntry.title,
					body: existingEntry.body,
				});
			}
		};

		loadEntry();
	}, [entryId, entries, fetchEntryById, setEntries]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditedEntry((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async (e) => {
		e.preventDefault();
		if (!editedEntry.title.trim() || !editedEntry.body.trim()) {
			alert("Both Title and Entry body are required.");
			return;
		}

		await updateEntry(entryId, editedEntry);
		navigate(`/entries/${entryId}`);
	};

	if (!editedEntry.title && !editedEntry.body) {
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
				<form onSubmit={handleSave}>
					<div className="flex flex-col space-y-4">
						<label className="text-violet-300">Title</label>
						<input
							type="text"
							name="title"
							required
							value={editedEntry.title}
							onChange={handleChange}
							className="bg-background text-white border border-violet-500 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
						/>

						<label className="text-violet-300">Entry</label>
						<textarea
							name="body"
							value={editedEntry.body}
							onChange={handleChange}
							required
							rows={6}
							className="bg-background text-white border border-violet-500 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
						/>

						<div className="mt-4 flex justify-between">
							<GlowButton type="submit">Save Changes</GlowButton>
							<div className="flex space-x-4">
								<GlowButton
									onClick={() => navigate(`/entries/${entryId}`)}
									className="bg-gray-600"
								>
									Cancel
								</GlowButton>
								<GlowButton
									onClick={async () => {
										const isConfirmed = window.confirm(
											"Are you sure you want to delete this entry?"
										);
										if (isConfirmed) {
											await deleteEntry(entryId);
											navigate("/entries", { replace: true });
										}
									}}
									className="bg-red-500"
								>
									Delete Entry
								</GlowButton>
							</div>
						</div>
					</div>
				</form>
			</GlowCard>
		</motion.div>
	);
};

export default EditEntryPage;
