import { Copy, ExternalLink, RotateCcw, Trash } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
	oneDark,
	oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import React from "react";
import { DogIcon } from "lucide-react";
import colors from "tailwindcss/colors";
import { useSelector } from "react-redux";

const Message = ({ message, reload }) => {
	const isUser = message.role === "user";
	const theme = useSelector((state) => state.theme?.theme);

	const copyToClipboard = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<div>
			<div
				className={`flex dark:text-zinc-100 ${
					isUser ? "justify-end" : "justify-start"
				} mb-4 px-4 py-2`}
			>
				<div
					className={`relative max-w-5xl rounded-xl px-4 py-2  ${
						isUser
							? "text-zinc-900 dark:text-zinc-100 dark:bg-black dark:bg-opacity-90"
							: "bg-white text-zinc-900 dark:bg-black dark:text-zinc-100"
					} `}
				>
					{!isUser && (
						<div className="flex items-center justify-start gap-2 mb-2 text-sm text-gray-400 dark:text-zinc-100">
							<div className="border border-zinc-100 rounded-full p-1">
								<DogIcon size={14} />
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => copyToClipboard(message.parts[0].text)}
									className="p-1 rounded hover:bg-zinc-100 transition-colors dark:hover:bg-zinc-900"
									title="Copy message"
								>
									<Copy size={14} />
								</button>
								<button
									onClick={() => {
										reload();
									}}
									className="p-1 rounded hover:bg-zinc-100 transition-colors dark:hover:bg-zinc-900"
									title="Retry"
								>
									<RotateCcw size={14} />
								</button>
							</div>
						</div>
					)}

					<div className="prose max-w-none">
						{isUser && message?.content?.length > 0 ? (
							<div className="flex items-center justify-start gap-2 mb-2">
								<div className="bg-zinc-50 p-2 rounded-xl dark:bg-zinc-900 dark:text-zinc-100">
									{message?.content}
								</div>
								<div className="flex items-center justify-start gap-2 mb-2 text-sm text-gray-400">
									<button
										onClick={() => copyToClipboard(message.content)}
										className="p-1 rounded hover:bg-zinc-50 transition-colors dark:hover:bg-zinc-900"
										title="Copy message"
									>
										<Copy size={14} />
									</button>
								</div>
							</div>
						) : (
							<div className="markdown-content">
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									components={{
										code({ node, inline, className, children, ...props }) {
											const match = /language-(\w+)/.exec(className || "");
											return !inline && match ? (
												<div className="relative group">
													<SyntaxHighlighter
														{...props}
														style={theme === "light" ? oneLight : oneDark}
														language={match[1]}
														PreTag="div"
													>
														{String(children).replace(/\n$/, "")}
													</SyntaxHighlighter>
													<button
														onClick={() => copyToClipboard(String(children))}
														className="absolute top-2 right-2 p-1 rounded bg-gray-700 dark:bg-zinc-900 dark:text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity"
													>
														<Copy size={14} className="text-white" />
													</button>
												</div>
											) : (
												<code {...props} className={className}>
													{children}
												</code>
											);
										},
										table({ children }) {
											return (
												<div className="overflow-x-auto">
													<table className="border-collapse border border-gray-300 dark:border-zinc-900">
														{children}
													</table>
												</div>
											);
										},
										th({ children }) {
											return (
												<th className="border border-gray-300 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100">
													{children}
												</th>
											);
										},
										td({ children }) {
											return (
												<td className="border border-gray-300 px-4 py-2 dark:text-zinc-100">
													{children}
												</td>
											);
										},
										a({ children, href }) {
											const isExternal = href.startsWith("http");
											return (
												<div className="relative group dark:text-zinc-100">
													<a
														href={href}
														target={isExternal ? "_blank" : "_self"}
														rel={isExternal ? "noopener noreferrer" : undefined}
														className={`flex items-center gap-1 text-gray-600 font-semibold w-fit text-sm underline ${
															isExternal
																? "hover:bg-zinc-50 p-2 rounded-xl"
																: ""
														}`}
													>
														{children}
														<ExternalLink color={colors.gray[600]} size={14} />
													</a>
													{isExternal && (
														<div className="absolute left-0 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 dark:text-zinc-100">
															<iframe
																src={href}
																className="w-96 h-48 border border-gray-200 rounded-xl shadow-lg bg-white hidden group-hover:block dark:bg-zinc-900"
																title="Preview"
															/>
														</div>
													)}
												</div>
											);
										},
										ul({ children }) {
											return (
												<ul className="list-disc pl-5 dark:text-zinc-100">
													{children}
												</ul>
											);
										},
										ol({ children }) {
											return (
												<ol className="list-decimal pl-5 dark:text-zinc-100">
													{children}
												</ol>
											);
										},
										li({ children }) {
											return (
												<li className="mb-1 dark:text-zinc-100">{children}</li>
											);
										},
										h1: ({ node, ...props }) => (
											<h1 className="markdown-heading" {...props} />
										),
										h2: ({ node, ...props }) => (
											<h2 className="markdown-subheading" {...props} />
										),
										p: ({ node, ...props }) => (
											<p className="markdown-paragraph" {...props} />
										),
									}}
								>
									{message?.content}
								</ReactMarkdown>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Message;
