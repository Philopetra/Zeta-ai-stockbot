import React from "react";
import { AudioLines, DogIcon, Loader2, PlayIcon } from "lucide-react";
import Models from "./Models";

const ChatForm = ({
	handleSubmit,
	input,
	handleInputChange,
	isLoading,
	temperature,
	setTemperature,
	stop,
	showModel,
	setShowModel,
}) => {
	const handleTextToSpeech = () => {
		const recognition = new (window.SpeechRecognition ||
			window.webkitSpeechRecognition)();
		recognition.onresult = (event) => {
			const transcript = event.results[0][0].transcript;
			handleInputChange({ target: { value: transcript } });
		};
		recognition.start();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="fixed bottom-0 left-0 md:left-60 right-0 w-full md:w-1/3 shadow-2xl drop-shadow-xl mx-auto px-4 py-2 border border-gray-200 z-0 bg-white rounded-t-xl dark:bg-black dark:border-zinc-900"
		>
			<div className="max-w-screen-xl mx-auto">
				<div className="flex-1 mb-5">
					<input
						name="prompt"
						value={input}
						autoComplete="false"
						onChange={handleInputChange}
						placeholder="Type a message..."
						className="flex-1 p-2 w-full rounded-xl outline-none dark:bg-black dark:text-zinc-100"
						disabled={isLoading}
					/>
				</div>
				<div className="flex justify-between items-center">
					<div className="relative flex gap-2">
						<div
							className={`absolute bottom-full mb-2 md:w-96 w-full md:-left-4 left-0 right-0 border bg-white dark:bg-zinc-900  p-4 rounded-xl z-50 transition-opacity duration-300 dark:border-zinc-800  ${
								showModel ? "opacity-100 visible" : "opacity-0 invisible"
							}`}
						>
							<Models
								showModel={showModel}
								setShowModel={setShowModel}
								temperature={temperature}
								setTemperature={setTemperature}
							/>
						</div>

						<div
							onClick={() => setShowModel(!showModel)}
							className="cursor-pointer hover:rotate-180 group-hover:animate-spin transition-all duration-800 ease-in bg-gray-50 dark:bg-zinc-900 p-2 rounded-xl"
						>
							<DogIcon size={18} />
						</div>
						<button
							type="button"
							onClick={handleTextToSpeech}
							className="dark:bg-zinc-900 bg-zinc-50 rounded-full px-2 py-1 hover:px-4 transition-all duration-100 ease-in"
						>
							<PlayIcon size={14} />
						</button>
					</div>
					<div className="flex gap-2">
						{isLoading ? (
							<div
								onClick={() => stop()}
								className="bg-gray-900 px-3 py-1 rounded-full cursor-pointer"
							>
								<Loader2 className="animate-spin mt-1 text-white" size={20} />
							</div>
						) : (
							<button
								type="submit"
								className={`px-2 py-2 bg-gray-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-black hover:px-6 rounded-full transition-all duration-100 ease-in text-white`}
							>
								<AudioLines size={18} />
							</button>
						)}
					</div>
				</div>
			</div>
		</form>
	);
};

export default ChatForm;
