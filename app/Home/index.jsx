import React from "react";
import { DogIcon } from "lucide-react";
import Image from "next/image";
import colors from "tailwindcss/colors";

const Home = () => {
	return (
		<div className="flex flex-col items-center h-screen overflow-y-auto bg-white dark:bg-black text-gray-900 dark:text-zinc-100">
			<div className=" flex max-w-4xl w-full h-full px-4 py-12 align-middle justify-center content-center">
				<div className="text-center mb-12 align-middle justify-center content-center ">
					<div className=" flex align-middle justify-center "> <Image
					src='/assets/images/ZetaInsightsLogo.svg'
					alt='logo'
					height={40}
					width={180}
					className=" text-center"
					/>
					</div>
					<h2 className="text-3xl font-semibold mt-6 mb-6">
					Discover Greatness 
					</h2>
					<h1 className="text-5xl font-bold mb-4 text-blue-600">AI Powered Stock Advice</h1>
					
					<p className="text-xl text-gray-600 dark:text-zinc-400">
					ZetaFinInsight is an open-source AI Financial Advice System for Stock trading to stay Ahead of the Market with Timely Financial Advice
					</p>
				</div>
			</div>
		</div>
	);
};

// const Home = () => (
// 	<section className='w-full flex-center flex-col'>
// 		<Image
// 			src='/assets/images/ZetaInsightsLogo.svg'
// 			alt='logo'
// 			height={30}
// 			width={120}
// 			/>
// 	  <h1 className='head_text text-center'>
// 		Discover Greatness
// 		<br className='max-md:hidden' />
// 		<span className='orange_gradient text-center'> AI Powered Stock Advice</span>
// 	  </h1>
// 	  <p className='desc text-center'>
// 		ZetaFinInsight is an open-source AI Financial Advice System for Stock trading to stay Ahead of the Market with Timely Financial Advice
// 	  </p>
// 	</section>
//   );

export default Home;
