import { auth, signOut } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { getQuestions } from "@/lib/actions/question.action";
import { api } from "@/lib/api";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import Link from "next/link";

interface SearchParams {
	searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
	//const session = await auth();

	// const { data } = await axios.get("/api/questions", { query: { search: query }});
	const { page, pageSize, query, filter } = await searchParams;
	const { success, data, error } = await getQuestions({
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 10,
		query: query || "",
		filter: filter || "",
	});

	const questions = data?.questions || [];

	// const filteredQuestions = questions.filter((question) => {
	// 	const matchQuery = question.title
	// 		.toLowerCase()
	// 		.includes(query?.toLowerCase());
	// 	const matchFilter = filter
	// 		? question.tags[0].name.toLowerCase() === filter.toLowerCase()
	// 		: true;
	// 	return matchQuery && matchFilter;
	// });

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
			{success ? (
				<div className="mt-10 flex w-full flex-col gap-6">
					{questions && questions.length > 0 ? (
						questions.map((question) => (
							<QuestionCard
								key={question._id}
								question={question}
							/>
						))
					) : (
						<div className="mt-10 flex w-full items-center justify-center">
							<p className="text-dark400_light700">
								No questions found.
							</p>
						</div>
					)}
				</div>
			) : (
				<div className="mt-10 flex w-full items-center justify-center">
					<p className="text-red-500">
						{error?.message ||
							"An error occurred while fetching questions."}
					</p>
				</div>
			)}
		</>
	);
};

export default Home;
