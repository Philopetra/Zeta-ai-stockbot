import React, { useState, useEffect, useRef } from "react";
import {
	X,
	PanelLeftOpen,
	PanelLeftClose,
	LogIn,
	PartyPopperIcon,
	DogIcon,
	UserIcon,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	GithubAuthProvider,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../lib/utils/firebase";
import { setUserInStore, logout } from "../../redux/slices/authSlice";
import { PiGoogleLogo } from "react-icons/pi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import useOutsideClick from "../../lib/hooks/useOutsideClick";
import colors from "tailwindcss/colors";


const Navbar = ({ setDrawerOpen, drawerOpen }) => {
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingGithub, setLoadingGithub] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoginWithEmail, setIsLoginWithEmail] = useState(false);
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const theme = useSelector((state) => state.theme?.theme);

	const modalRef = useRef(null);
	useOutsideClick(modalRef, () => setShowAuthModal(false));

	const handleGetTemplate = () => {
		window.open("https://github.com/shadcn/ui", "_blank");
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				dispatch(
					setUserInStore({
						uid: user.uid,
						email: user.email,
						displayName: user.displayName,
						photoURL: user.photoURL,
						emailVerified: user.emailVerified,
						phoneNumber: user.phoneNumber || null,
						createdAt: user.metadata.creationTime,
						lastLoginAt: user.metadata.lastSignInTime,
					})
				);
			} else {
				dispatch(logout());
				Cookies.remove("userUid");
			}
		});

		return () => unsubscribe();
	}, [dispatch]);

	const handleGoogleLogin = async () => {
		setLoading(true);
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);

			dispatch(
				setUserInStore({
					uid: result.user.uid,
					email: result.user.email,
					displayName: result.user.displayName,
					photoURL: result.user.photoURL,
					emailVerified: result.user.emailVerified,
					phoneNumber: result.user.phoneNumber || null,
					createdAt: result.user.metadata.creationTime,
					lastLoginAt: result.user.metadata.lastSignInTime,
				})
			);

			toast.success("Successfully signed in!");
			setShowAuthModal(false);
		} catch (error) {
			console.error("Error signing in with Google:", error);
			toast.error(error.message || "Failed to sign in");
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			dispatch(logout());
			Cookies.remove("userUid");
			setShowAuthModal(false);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	const handleGithubLogin = async () => {
		setLoadingGithub(true);
		try {
			const provider = new GithubAuthProvider();
			const result = await signInWithPopup(auth, provider);

			dispatch(
				setUserInStore({
					uid: result.user.uid,
					email: result.user.email,
					displayName: result.user.displayName,
					photoURL: result.user.photoURL,
					emailVerified: result.user.emailVerified,
					phoneNumber: result.user.phoneNumber || null,
					createdAt: result.user.metadata.creationTime,
					lastLoginAt: result.user.metadata.lastSignInTime,
				})
			);

			toast.success("Successfully signed in with GitHub!");
			setShowAuthModal(false);
		} catch (error) {
			console.error("Error signing in with GitHub:", error);
			if (error.code === "auth/account-exists-with-different-credential") {
				toast.error(
					"An account already exists with a different sign-in method. Please use that method to log in."
				);
			} else {
				toast.error(error.message || "Failed to sign in with GitHub");
			}
		} finally {
			setLoadingGithub(false);
		}
	};

	const handleEmailLogin = async () => {
		setIsLoginWithEmail(true);
		setLoading(true);
		if (!email || !password) {
			toast.error("Please enter both email and password.");
			setLoading(false);
			return;
		}
		try {
			// First try to sign in
			try {
				await signInWithEmailAndPassword(auth, email, password);
				toast.success("Successfully signed in with email!");
				setShowAuthModal(false);
			} catch (signInError) 
			{
				// If user not found, create new account
				if (signInError.code === "auth/user-not-found") {
					const userCredential = await createUserWithEmailAndPassword(
						auth,
						email,
						password
					);
					// Update user info in Redux store
					dispatch(
						setUserInStore({
							uid: userCredential.user.uid,
							email: userCredential.user.email,
							displayName: userCredential.user.displayName,
							photoURL: userCredential.user.photoURL,
							emailVerified: userCredential.user.emailVerified,
							phoneNumber: userCredential.user.phoneNumber || null,
							createdAt: userCredential.user.metadata.creationTime,
							lastLoginAt: userCredential.user.metadata.lastSignInTime,
						})
					);
					toast.success("Account created successfully! You are now logged in.");
					setShowAuthModal(false);
				} else if (signInError.code === "auth/wrong-password" || signInError.code === "auth/invalid-credential") {
					toast.error("Invalid email or password. Please try again.");
				} else {
					throw signInError;
				}
			}
		} catch (error) {
			console.error("Error in email authentication:", error);
			toast.error(error.message || "Failed to authenticate");
		} finally {
			setLoading(false);
		}
	};
	  
	  
	const handleEmailSignUp = async () => {
		setLoading(true);
		if (!email || !password) {
			toast.error("Please enter both email and password.");
			setLoading(false);
			return;
		}
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			dispatch(
				setUserInStore({
					uid: userCredential.user.uid,
					email: userCredential.user.email,
					displayName: userCredential.user.displayName,
					photoURL: userCredential.user.photoURL,
					emailVerified: userCredential.user.emailVerified,
					phoneNumber: userCredential.user.phoneNumber || null,
					createdAt: userCredential.user.metadata.creationTime,
					lastLoginAt: userCredential.user.metadata.lastSignInTime,
				})
			);
			toast.success("Account created successfully! You are now logged in.");
			setShowAuthModal(false);
		} catch (error) {
			console.error("Error in sign up:", error);
			toast.error(error.message || "Failed to sign up");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="sticky top-0 flex justify-between w-full bg-white border-b border-gray-50 dark:border-b dark:border-zinc-900 py-2 md:px-5 z-10 dark:bg-black">
			<div className="relative flex justify-start items-center gap-2">
				{/* <DogIcon
					size={24}
					color={theme === "light" ? colors.gray[700] : colors.zinc[100]}
				/> */}
				 <Image
				src='/assets/images/ZILogo.svg'
				alt='logo'
				width={30}
				height={30}
				className='object-contain'
				/>

				<button
					onClick={() => setDrawerOpen(!drawerOpen)}
					className="cursor-pointer mx-2 md:hidden sm:visible "
				>
					{drawerOpen ? (
						<PanelLeftOpen size={24} />
					) : (
						<PanelLeftClose size={24} />
					)}
				</button>

			</div>

			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center">
					{user ? (
						<div>
							{user.photoURL ? (
								<Image
									src={user.photoURL || "/default-avatar.png"}
									alt="User Avatar"
									width={40}
									height={40}
									className="rounded-full cursor-pointer text-xs"
									onClick={() => setShowAuthModal(true)}
								/>
							) : (
								<div
									className="rounded-full cursor-pointer text-xs bg-gray-900 dark:bg-zinc-900 w-8 h-8 flex items-center justify-center"
									onClick={() => setShowAuthModal(true)}
								>
									<UserIcon size={16} color={colors.gray[100]} />
								</div>
							)}
						</div>
					) : (
						<button
							onClick={() => setShowAuthModal(true)}
							className="px-4 py-2 text-sm bg-gray-900 text-white rounded hover:px-6 transition-all duration-100 ease-in hover:bg-zinc-1000 dark:bg-zinc-900 dark:hover:bg-zinc-800"
						>
							<LogIn className="mr-2 inline" size={16} />
							Login
						</button>
					)}
				</div>
			</div>

			{showAuthModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div
						ref={modalRef}
						className="bg-white rounded-xl p-8 w-96 relative dark:bg-black dark:border  dark:border-zinc-800"
					>
						<button
							onClick={() => setShowAuthModal(false)}
							className="absolute top-4 right-4 hover:bg-zinc-100 p-1 rounded-full transition-colors"
						>
							<X size={20} className="text-gray-500" />
						</button>

						{user ? (
							<div className="flex flex-col items-center py-5">
								{user.photoURL ? (
									<Image
										src={user.photoURL}
										alt="User Avatar"
										width={80}
										height={80}
										className="rounded-full mb-4"
									/>
								) : (
									<div className="w-20 h-20 rounded-full mb-4 bg-gray-900 dark:bg-zinc-900 flex items-center justify-center">
										<UserIcon size={32} color={colors.gray[100]} />
									</div>
								)}
								<h2 className="text-xl font-bold mb-1">{user.displayName}</h2>
								<p className="text-gray-500 mb-4">{user.email}</p>
								<button
									onClick={handleLogout}
									className="rounded-xl px-4 py-1.5 bg-red-500 text-white hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
								>
									Logout
								</button>
							</div>
						) : (
							<div className="flex flex-col items-center">
								<h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
								<p className="text-gray-500 mb-4">
									Please sign in or sign up to continue.
								</p>
								<div className="w-full space-y-3 mb-6">
									<input
										type="email"
										placeholder="Email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full p-2 outline-none text-sm border rounded-xl border-gray-300 dark:bg-zinc-900 hover:bg-gray-50 dark:text-zinc-100"
									/>
									<input
										type="password"
										placeholder="Password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full p-2 outline-none text-sm border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-zinc-900 dark:text-zinc-100"
									/>
									<button
										onClick={handleEmailLogin}
										className="w-full text-white rounded-xl py-2 text-sm bg-gray-800 hover:bg-gray-900 transition-colors font-medium dark:bg-zinc-900 dark:hover:bg-zinc-800"
									>
										{loading && isLoginWithEmail ? (
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
										) : (
											"Sign In"
										)}
									</button>
									<button
										onClick={handleEmailSignUp}
										className="w-full text-white rounded-xl py-2 text-sm bg-gray-800 hover:bg-gray-900 transition-colors font-medium dark:bg-zinc-900 dark:hover:bg-zinc-800"
									>
										{loading && !isLoginWithEmail ? (
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
										) : (
											"Sign Up (for new users)"
										)}
									</button>
								</div>

								<div className="relative w-full mb-6">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-gray-200"></div>
									</div>
									<div className="relative flex justify-center text-sm">
										<span className="px-2 bg-white text-gray-500 dark:bg-zinc-900 dark:text-zinc-400">
											Or continue with
										</span>
									</div>
								</div>

								<div className="w-full space-y-2">
									<button
										onClick={handleGoogleLogin}
										disabled={loading && !isLoginWithEmail}
										className="w-full flex items-center justify-center px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-zinc-50 transition-colors dark:bg-black dark:hover:bg-zinc-900"
									>
										{loading && !isLoginWithEmail ? (
											<div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
										) : (
											<>
												<PiGoogleLogo className="mr-2 text-lg" />
												Sign in with Google
											</>
										)}
									</button>

									<button
										onClick={handleGithubLogin}
										className="w-full flex items-center justify-center px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-zinc-50 transition-colors dark:bg-black dark:hover:bg-zinc-900"
									>
										{loadingGithub ? (
											<div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
										) : (
											<>
												<svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
													<path
														fill="currentColor"
														d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
													/>
												</svg>
												Sign in with GitHub
											</>
										)}
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Navbar;
