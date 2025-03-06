import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
	collection,
	addDoc,
	serverTimestamp,
	getDocs,
} from "firebase/firestore";
import { db } from "../lib/utils/firebase";
import { useChat } from "@ai-sdk/react";
import { DogIcon, RotateCcw } from "lucide-react";
import colors from "tailwindcss/colors";
import Message from "./Message";
import { useQuery } from "@tanstack/react-query";
import ChatForm from "./ChatForm";
import { v4 as uuidv4 } from "uuid";

const Chat = ({ chatId }) => {
	const messagesEndRef = useRef(null);
	const userId = useSelector((state) => state?.auth?.user?.uid);
	const { isAuthenticated } = useSelector((state) => state.auth);
	const [temperature, setTemperature] = useState(0.7);
	const activeModel = useSelector((state) => state.auth.model.active);
	const [showModels, setShowModels] = useState(false);

	const {
		data: initialMessages = [],
		isLoading: isMessagesLoading,
		refetch,
	} = useQuery({
		queryKey: ["messages", userId, chatId],
		queryFn: async () => {
			if (!userId || !chatId || !isAuthenticated) return [];
			const messagesRef = collection(
				db,
				"chats",
				userId,
				"chats",
				chatId,
				"messages"
			);
			const messagesSnapshot = await getDocs(messagesRef);
			return messagesSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
		},
		enabled: !!isAuthenticated && !!userId && !!chatId,
	});

	const {
		messages,
		stop,
		setMessages,
		setInput,
		isLoading,
		handleInputChange,
		handleSubmit,
		error,
		input,
		reload,
	} = useChat({
		api: "/api/chat",
		initialMessages,
		experimental_throttle: 100,
		headers: {
			"Content-Type": "application/json",
		},
		onError: (error) => {
			console.log(error, "error");
		},
		streamProtocol: "text",
		sendExtraMessageFields: true,
		body: { model: activeModel, temperature },
		onFinish: async (message) => {
			const userMessageContent = input.trim();
			const aiMessageContent = message.parts.map((part) => part.text).join("");

			if (userMessageContent.length > 0 && aiMessageContent.length > 0) {
				const userMessage = {
					content: userMessageContent,
					role: "user",
					messageId: uuidv4(),
					timestamp: serverTimestamp(),
				};

				const aiMessage = {
					content: aiMessageContent,
					role: "assistant",
					messageId: message.id,
					timestamp: serverTimestamp(),
				};

				let ids = {};
				if (chatId && isAuthenticated && userId) {
					await Promise.all([
						(ids.userMessageId = addDoc(
							collection(db, "chats", userId, "chats", chatId, "messages"),
							userMessage
						)),
						(ids.aiMessageId = addDoc(
							collection(db, "chats", userId, "chats", chatId, "messages"),
							aiMessage
						)),
					]);
					refetch();
					setMessages((prevMessages) => {
						const updatedMessages = prevMessages.map((msg) => {
							if (msg.role === "user" && !msg.id) {
								return { ...msg, id: userMessage.messageId };
							}
							if (msg.role === "assistant" && !msg.id) {
								return { ...msg, id: aiMessage.messageId };
							}
							return msg;
						});

						return [...updatedMessages];
					});
				}
				setInput("");
			}
		},
	});

	return (
		<div className="flex flex-col mb-20">
			<div className="flex-1 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 max-w-5xl mx-auto my-20 px-4 overflow-hidden">
				<div className="h-full overflow-y-auto">
					{isMessagesLoading ? (
						<div className="flex flex-col h-full w-full mx-auto">
							<div className="flex-1 h-full w-full space-y-4">
								{[...Array(5)].map((_, i) => (
									<div
										key={i}
										className="flex flex-col gap-2 animate-pulse my-2"
									>
										<div className="flex justify-end">
											<div className="w-40 h-2 bg-zinc-100 dark:bg-zinc-900  rounded-xl" />
										</div>
										<div className="flex justify-start">
											<div className="w-40 h-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl " />
										</div>
									</div>
								))}
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-2">
							{messages
								?.sort(
									(a, b) =>
										(a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)
								)
								.map((m) => (
									<Message
										key={m.id}
										message={m}
										reload={reload}
										setMessages={setMessages}
										setInput={setInput}
									/>
								))}
							<div ref={messagesEndRef} />
						</div>
					)}
					{error && (
						<div className="flex items-center text-red-400 gap-2 p-8 my-4">
							<DogIcon color={colors.red[400]} size={14} />
							<div className="break-words">An error occurred.</div>
							<button
								type="button"
								onClick={() => reload()}
								className="flex items-center gap-2 p-1 text-xs rounded-xl border border-red-200"
							>
								<RotateCcw size={14} color={colors.red[400]} />
								<span>Retry</span>
							</button>
						</div>
					)}
				</div>
			</div>

			<ChatForm
				handleSubmit={handleSubmit}
				input={input}
				temperature={temperature}
				setTemperature={setTemperature}
				handleInputChange={handleInputChange}
				isLoading={isLoading}
				stop={stop}
				showModel={showModels}
				setShowModel={setShowModels}
			/>
		</div>
	);
};

export default Chat;
