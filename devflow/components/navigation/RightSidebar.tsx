import Link from "next/link";
import React from "react";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import { cn } from "@/lib/utils";
import TagCard from "../cards/TagCard";

const RightSidebar = () => {
	const topQuestions = [
		{ _id: "1", title: "How to create a custom hook in React?" },
		{ _id: "2", title: "Where is my mind?" },
		{ _id: "3", title: "Should I have bought this course?" },
		{ _id: "4", title: "How to run a Golang script?" },
		{ _id: "5", title: "How to dismantle captialism?" },
		{ _id: "6", title: "Is there a God?" },
		{ _id: "7", title: "Why are you punching me?" },
	];

	const popularTags = [
		{ _id: "1", name: "react", questions: 100 },
		{ _id: "2", name: "javascript", questions: 200 },
		{ _id: "3", name: "golang", questions: 150 },
		{ _id: "4", name: "python", questions: 70 },
		{ _id: "5", name: "next.js", questions: 50 },
		{ _id: "6", name: "tanstack-start", questions: 120 },
		{ _id: "7", name: "vue.js", questions: 67 },
	];

	return (
		<section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 max-xl:hidden dark:shadow-none">
			<div>
				<h3 className="h3-bold text-dark200_light900">Top Questions</h3>
				<div className="mt-7 flex w-full flex-col gap-[30px]">
					{topQuestions.map(({ _id, title }, idx) => (
						<Link
							href={ROUTES.QUESTION(_id)}
							key={`q${_id}`}
							className="flex cursor-pointer items-center justify-between gap-5"
						>
							<div className="flex gap-3">
								<Image
									src="/icons/question.svg"
									alt="Question Icon"
									width={20}
									height={20}
									className={cn(
										idx % 2 == 0 && "some-color",
										"flex self-start pt-[3px]"
									)}
								/>
								<p className="body-medium text-dark500_light700 text-left">
									{title}
								</p>
							</div>
							<Image
								src="/icons/chevron-right.svg"
								alt="Chevron Right"
								width={20}
								height={20}
								className="invert-colors"
							/>
						</Link>
					))}
				</div>
			</div>

			<div className="mt-16">
				<h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
				<div className="mt-7 flex flex-col gap-4">
					{popularTags.map(({ _id, name, questions }) => (
						<TagCard
							key={_id}
							_id={_id}
							name={name}
							questions={questions}
							showCount
							compact
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default RightSidebar;
