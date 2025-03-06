import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { ToastContainer } from "react-toastify";
import useOutsideClick from "../../lib/hooks/useOutsideClick";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";


const LayoutWrapper = ({ children }) => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const drawerRef = useRef(null);
	const theme = useSelector((state) => state.theme?.theme);
	const router = useRouter();

	useOutsideClick(drawerRef, () => setDrawerOpen(false));

	useEffect(() => {
		if (router.pathname === "/") {
			setIsCollapsed(true);
		} else {
			setIsCollapsed(false);
		}
	}, [router.pathname]);

	return (
		<div
			className={`${
				theme === "light"
					? "bg-white text-zinc-900"
					: "bg-black text-zinc-100 dark"
			}`}
		>
			<div className="flex relative">
				<div className="hidden md:block">
					<Sidebar
						setIsCollapsed={setIsCollapsed}
						isCollapsed={isCollapsed}
						drawerOpen={drawerOpen}
						setDrawerOpen={setDrawerOpen}
					/>
				</div>

				<div className={`w-full transition-all duration-300`}>
					<Navbar setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
					<main className="w-full">{children}</main>
				</div>

				<div
					className={`fixed inset-x-0 bottom-0 h-3/4 bg-white rounded-xl border transition-all duration-300 z-50 md:hidden ${
						drawerOpen ? "translate-y-0" : "translate-y-full"
					}`}
					ref={drawerRef}
				>
					<Sidebar
						setIsCollapsed={setIsCollapsed}
						isCollapsed={isCollapsed}
						drawerOpen={drawerOpen}
						setDrawerOpen={setDrawerOpen}
					/>
				</div>

				<ToastContainer position="bottom-right" theme={theme} />
			</div>
		</div>
	);
};

export default LayoutWrapper;
