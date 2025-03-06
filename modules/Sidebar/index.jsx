import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	collection,
	addDoc,
	query,
	getDocs,
	doc,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import { setUserChats, setError } from "../../redux/slices/chatsSlice";
import { toast } from "react-toastify";
import { db } from "../../lib/utils/firebase";
import { useQuery } from "@tanstack/react-query";
import router from "next/router";
import {
	Edit,
	Ellipsis,
	PlusIcon,
	TrashIcon,
	ChevronLeft,
	ChevronRight,
	DogIcon,
} from "lucide-react";
import Image from "next/image";
import colors from "tailwindcss/colors";
import ThemeToggle from "../../components/ThemeToggle";
import useOutsideClick from "../../lib/hooks/useOutsideClick";

const Sidebar = ({
	isCollapsed,
	setIsCollapsed,
	drawerOpen,
	setDrawerOpen,
}) => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const theme = useSelector((state) => state.theme?.theme);
	const { uid } = user || {};

	const menuRef = useRef(null);

	const {
		data: userChats,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["chats", uid],
		queryFn: async () => {
			if (!uid) return [];
			const q = query(collection(db, "chats", uid, "chats"));
			const snapshot = await getDocs(q);
			const chats = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			return chats;
		},
		enabled: !!uid,
		onError: (error) => {
			dispatch(setError(error.message));
		},
		onSuccess: (data) => {
			dispatch(setUserChats(data));
		},
	});

	const [isCreating, setIsCreating] = useState(false);

	const createNewChat = async () => {
		try {
			setIsCreating(true);
			const newChat = {
				createdAt: new Date(),
				title: `Chat ${Math.floor(Math.random() * 10000)}`,
			};
			const userChatsRef = collection(db, "chats", uid, "chats");
			const newChatId = await addDoc(userChatsRef, newChat);
			router.push(`/chat/${newChatId.id}`);
			toast.success("New chat created");
			refetch();
		} catch (error) {
			dispatch(setError(error.message));
		} finally {
			setIsCreating(false);
		}
	};

	const ChatItem = ({ chat }) => {
		const [isEditing, setIsEditing] = useState(false);
		const [newTitle, setNewTitle] = useState(chat.title);
		const [menuOpen, setMenuOpen] = useState(false);

		const handleRename = async () => {
			if (newTitle.trim()) {
				const chatRef = doc(db, "chats", uid, "chats", chat.id);
				await updateDoc(chatRef, { title: newTitle });
				setIsEditing(false);
				toast.success("Chat updated");
				refetch();
			}
		};
		useOutsideClick(menuRef, () => {
			if (menuOpen) {
				setMenuOpen(false);
			}
		});

		const handleDelete = async () => {
			const chatRef = doc(db, "chats", uid, "chats", chat.id);
			await deleteDoc(chatRef);
			toast.success("Chat deleted");

			if (router.query.id === chat.id) {
				const chatsSnapshot = await getDocs(
					collection(db, "chats", uid, "chats")
				);
				const remainingChats = chatsSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				if (remainingChats.length > 0) {
					const mostRecentChat = remainingChats.sort(
						(a, b) => b.createdAt.toDate() - a.createdAt.toDate()
					)[0];
					router.push(`/chat/${mostRecentChat.id}`);
				} else {
					router.push("/");
				}
			}
			refetch();
		};

		return (
			<div
				className={`flex items-center my-1 justify-between relative hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:bg-opacity-70 dark:hover:text-black transition-all duration-200 p-2 rounded-xl ${
					router.query.id === chat.id
						? "bg-zinc-50 dark:bg-black dark:border dark:border-zinc-800"
						: ""
				}`}
			>
				{isEditing ? (
					<input
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleRename()}
						onBlur={() => setIsEditing(false)}
						className="p-1 text-sm border border-gray-50 outline-none rounded-xl"
					/>
				) : (
					<div
						className={`flex-1 cursor-pointer text-sm transition-all duration-200 dark:text-zinc-100 ${
							router.query.id === chat.id ? "text-gray-900" : "text-gray-700"
						}`}
						onClick={(e) => {
							router.push(`/chat/${chat.id}`);
							setIsCollapsed(false);
							setDrawerOpen(false);
						}}
					>
						{chat.title}
					</div>
				)}
				<div
					className="relative"
					onClick={() => {
						setMenuOpen((prev) => !prev);
					}}
				>
					{!isCollapsed && (
						<Ellipsis
							className="cursor-pointer"
							size={18}
							color={theme === "light" ? colors.gray[700] : colors.zinc[100]}
						/>
					)}

					{!isCollapsed && menuOpen && (
						<div
							ref={menuRef}
							className="absolute right-0 mt-2 w-48 bg-white dark:bg-black dark:border-zinc-900 p-2 border rounded-xl shadow-xl z-10 transition-all duration-200 ease-in-out transform origin-top-right scale-y-100 opacity-100"
						>
							<div className="flex items-center">
								<button
									className="flex items-center rounded-xl dark:text-zinc-100 w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:hover:border-zinc-900 dark:hover:bg-opacity-60 text-xs text-gray-600 transition-all duration-150"
									onClick={(e) => {
										setIsEditing(true);
										setMenuOpen(false);
									}}
								>
									<Edit className="mr-2" size={14} />
									Rename
								</button>
							</div>
							<div className="flex items-center">
								<button
									className="flex items-center w-full rounded-xl text-left px-4 py-2 dark:text-zinc-100 dark:hover:bg-zinc-900 hover:bg-zinc-50 dark:hover:border-zinc-900 text-xs text-gray-600 transition-all duration-150"
									onClick={() => {
										handleDelete();
										setMenuOpen(false);
									}}
								>
									<TrashIcon className="mr-2" size={14} />
									Delete
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="relative flex flex-col justify-betwen h-screen md:w-80 bg-gray-80 bg-opacity-50 border-r dark:border-zinc-900 dark:bg-black animate-pulse">
				<div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded m-4 w-1/3"></div>
				<div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded mx-4 w-1/2"></div>
				<div className="flex-1 p-4 space-y-4">
					{[...Array(10)].map((_, i) => (
						<div
							key={i}
							className="h-1 bg-zinc-100 dark:bg-zinc-900 rounded"
						></div>
					))}
				</div>
				<div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded mx-4 w-1/2 absolute bottom-10" />
				<div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded mx-4 w-1/2 absolute bottom-14" />
			</div>
		);
	}

	return (
		<div
			className={`flex flex-col h-screen sticky top-0 left-0 bottom-0 ${
				isCollapsed ? "md:w-40" : "md:w-80"
			} border-r overflow-y-scroll hidescrollbar relative transition-all duration-300 bg-zinc-50 bg-opacity-20 dark:bg-black dark:border-zinc-900`}
		>
			<button
				onClick={() => {
					setIsCollapsed(!isCollapsed);
					setDrawerOpen(false);
				}}
				className="hidden md:block absolute right-3 top-3 bg-white border rounded-full p-1 cursor-pointer hover:bg-zinc-50 dark:bg-black dark:border-zinc-900"
			>
				{isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
			</button>
			<button
				className={`text-lg text-gray-800 dark:text-zinc-100 p-3 flex items-center gap-2 transition-opacity duration-300 cursor-pointer`}
				onClick={() => {
					router.push("/");
					setIsCollapsed(false);
					setDrawerOpen(false);
				}}
			>
				
				{isCollapsed ? <Image
								src='/assets/images/ZILogo.svg'
								alt='logo'
								width={30}
								height={30}
								/> : "AI Chat app"}

			</button>
			<hr
				className={`${
					isCollapsed ? "mt-2" : "mt-1"
				} border-gray-50 dark:border-zinc-900`}
			/>
			<button
				onClick={createNewChat}
				disabled={isCreating}
				className={`m-4 px-4 py-2 flex items-center border border-gray-800 dark:border-zinc-900 bg-zinc-50 dark:bg-black text-black ${
					isCollapsed ? "w-10 justify-center" : "w-fit"
				} text-xs rounded hover:bg-zinc-100 dark:hover:border-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed`}
			>
				{isCreating ? (
					<div className="border-2 border-gray-800 dark:border-zinc-900 border-t-transparent w-4 h-4 rounded-full animate-spin mr-2" />
				) : (
					<div className="flex gap-2 items-center dark:text-zinc-100 dark:hover:text-zinc-100 ">
						<PlusIcon size={14} />
						{!isCollapsed && "New Chat"}
					</div>
				)}
			</button>
			<div className="flex-1 overflow-y-auto px-4">
				{userChats?.map((chat) => (
					<ChatItem key={chat.id} chat={chat} />
				))}

				{(!userChats || userChats.length === 0) && (
					<div className="p-3 text-gray-500 dark:text-zinc-800">
						No chats yet
					</div>
				)}
			</div>
			<ThemeToggle />
		</div>
	);
};

export default Sidebar;
