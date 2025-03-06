import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
	const dispatch = useDispatch();
	const theme = useSelector((state) => state.theme.theme);

	const handleToggle = () => {
		dispatch(toggleTheme());
	};

	return (
		<div className="flex items-center p-4">
			<button
				onClick={handleToggle}
				className={`p-2 flex gap-2 items-center rounded-full border border-zinc-100 dark:bg-black dark:border dark:border-zinc-900 `}
			>
				<Moon size={18} className="text-zinc-100 dark:text-zinc-100" />
				<Sun size={18} className="text-zinc-900 dark:text-zinc-800" />
			</button>
		</div>
	);
};

export default ThemeToggle;
