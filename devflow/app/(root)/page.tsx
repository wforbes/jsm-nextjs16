import { auth, signOut } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { api } from "@/lib/api";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import Link from "next/link";

const questions = [
	{
		_id: "1",
		title: "How to learn React?",
		description: "I want to learn React, can anyone help me?",
		tags: [
			{ _id: "1", name: "react" },
			{ _id: "2", name: "javascript" },
		],
		author: {
			_id: "1",
			name: "Jimmy Page",
			image: "https://www.svgrepo.com/show/382109/male-avatar-boy-face-man-user-7.svg",
		},
		upvotes: 10,
		answers: 5,
		views: 100,
		createdAt: new Date("2024-06-20T10:00:00Z"),
	},
	{
		_id: "2",
		title: "How to learn JavaScript?",
		description: "I want to learn Javascript, can anyone help me?",
		tags: [
			{ _id: "1", name: "javascript" },
			{ _id: "2", name: "react" },
		],
		author: {
			_id: "1",
			name: "Jimmy Page",
			image: "https://www.svgrepo.com/show/382109/male-avatar-boy-face-man-user-7.svg",
		},
		upvotes: 11,
		answers: 0,
		views: 10,
		createdAt: new Date("2025-10-09T11:32:00Z"),
	},
	{
		_id: "3",
		title: "How to learn Go?",
		description: "I want to learn golang, can anyone help me?",
		tags: [{ _id: "3", name: "go" }],
		author: {
			_id: "1",
			name: "Jimmy Page",
			image: "https://www.svgrepo.com/show/382109/male-avatar-boy-face-man-user-7.svg",
		},
		upvotes: 4,
		answers: 1,
		views: 45,
		createdAt: new Date(),
	},
];

interface SearchParams {
	searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
	const session = await auth();

	console.log(`Session ${JSON.stringify(session)}`);

	//const session = await auth();
	const { query = "", filter = "" } = await searchParams;
	// const { data } = await axios.get("/api/questions", { query: { search: query }});

	const filteredQuestions = questions.filter((question) => {
		const matchQuery = question.title
			.toLowerCase()
			.includes(query?.toLowerCase());
		const matchFilter = filter
			? question.tags[0].name.toLowerCase() === filter.toLowerCase()
			: true;
		return matchQuery && matchFilter;
	});

	return (
		<>
			<section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">All Questions</h1>
				<Button
					className="primary-gradient text-light-900! min-h-[46px] px-4 py-3"
					asChild
				>
					<Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
				</Button>
			</section>
			<section className="mt-11">
				<LocalSearch
					route="/"
					imgSrc="/icons/search.svg"
					placeholder="Search questions..."
					otherClasses="flex-1"
				/>
			</section>
			<HomeFilter />
			<div className="mt-10 flex w-full flex-col gap-6">
				{filteredQuestions.map((question) => (
					<QuestionCard key={question._id} question={question} />
				))}
			</div>
		</>
	);
};

export default Home;
