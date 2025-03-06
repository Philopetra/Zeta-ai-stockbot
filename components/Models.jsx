import { useDispatch, useSelector } from "react-redux";
import { setActiveModel } from "../redux/slices/authSlice";
import { useRef, useState } from "react";
import useOutsideClick from "../lib/hooks/useOutsideClick";
import { DogIcon, Thermometer } from "lucide-react";
import colors from "tailwindcss/colors";

const Models = ({ showModel, setShowModel, temperature, setTemperature }) => {
	const dispatch = useDispatch();
	const activeModel = useSelector(
		(state) => state?.user?.model?.active || "groq"
	);
	const [active, setActive] = useState(activeModel);

	const models = {
		groq: "llama3-8b-8192",
		mistral: "mistral-large-latest",
	};

	const handleModelChange = (model) => {
		setActive(model);
		dispatch(setActiveModel(model));
	};

	const modalRef = useRef(null);

	useOutsideClick(modalRef, () => {
		if (showModel) {
			setShowModel(false);
		}
	});

	return (
		<div className="relative" ref={modalRef}>
			<div className="flex items-center gap-2">
				<DogIcon size={16} />
				<p className="my-2 font-semibold">Select model</p>
			</div>
			{showModel && (
				<div className="modal w-full flex flex-col">
					{Object.entries(models).map(([model, displayName]) => (
						<label
							key={model}
							className="gap-2 flex my-1 p-2 bg-zinc-50 bg-opacity-50 rounded-xl hover:bg-zinc-50 cursor-pointer dark:border dark:border-zinc-800 dark:hover:bg-zinc-800 dark:bg-zinc-900"
						>
							<input
								type="checkbox"
								name="model"
								value={model}
								checked={active === model}
								onChange={() => handleModelChange(model)}
								className="rounded bg-gray-800 accent-gray-900 dark:bg-zinc-900 dark:accent-zinc-100"
								disabled={model !== "groq"}
							/>
							<div className="flex items-center justify-between">
								<p
									className={`text-sm font-semibold text-gray-700 dark:text-zinc-100 ${
										model !== "groq" ? "line-through" : ""
									}`}
								>
									{displayName}
								</p>
								{model !== "groq" && (
									<span className="ml-2 text-xs text-gray-400 ">PRO</span>
								)}
							</div>
						</label>
					))}
				</div>
			)}
			<div className="flex items-center gap-2 mt-4">
				<Thermometer size={16} />
				<p className="font-semibold">Temperature</p>
			</div>
			<input
				type="range"
				min="0"
				max="1"
				step="0.1"
				value={temperature}
				onChange={(e) => setTemperature(e.target.value)}
				className="w-full bg-gray-900 rounded-lg accent-gray-900 dark:bg-zinc-900 dark:accent-zinc-100"
			/>
		</div>
	);
};
export default Models;
