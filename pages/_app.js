import React from "react";
import LayoutWrapper from "../modules/Layout";
import "tailwindcss/tailwind.css";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function MyApp({ Component, pageProps }) {
	const queryClient = new QueryClient({
		defaultOptions: {
			refetchOnWindowFocus: false,
		},
	});
	return (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<LayoutWrapper>
						<Component {...pageProps} />
					</LayoutWrapper>
				</PersistGate>
			</Provider>
		</QueryClientProvider>
	);
}

export default MyApp;
