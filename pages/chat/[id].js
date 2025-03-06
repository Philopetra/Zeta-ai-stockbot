import { useRouter } from "next/router";
import Chat from "../../components/Chat";

const ChatPage = ({ initialMessages }) => {
	const router = useRouter();
	const { id } = router.query;

	return <Chat chatId={id} initialMessages={initialMessages} />;
};

export default ChatPage;
