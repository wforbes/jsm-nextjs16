import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const Home = async () => {
	const session = await auth();
	console.log(session);
	return (
		<div>
			<h1 className="h1-bold">Welcome to Next.js! 👋</h1>
		</div>
	);
};

export default Home;
