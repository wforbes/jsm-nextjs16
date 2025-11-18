import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { formatNumber, getDurationAgoOfDate } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function QuestionDetails({ params }: RouteParams) {
	const { id } = await params;
	const {
		success,
		data: question,
		error,
	} = await getQuestion({
		questionId: id,
	});
	if (!success || !question) return redirect(ROUTES.NOT_FOUND);

	const { title, content, author, createdAt, answers, views, tags } =
		question;

	return (
		<>
			<div className="flex-start w-full flex-col">
				<div className="flex w-full flex-col-reverse justify-between">
					<div className="flex items-center justify-start gap-1">
						<UserAvatar
							id={author._id}
							name={author.name}
							imageUrl={author.image}
							className="size-22"
							fallbackClassName="text-[10px]"
						/>
						<Link href={ROUTES.PROFILE(author._id)}>
							<p className="paragraph-semibold text-dark300_light700">
								{author.name}
							</p>
						</Link>
					</div>
					<div className="flex justify-end">
						<p>Votes</p>
					</div>
				</div>
				<h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
					{title}
				</h2>
			</div>
			<div className="mt-5 mb-8 flex flex-wrap gap-4">
				<Metric
					imgUrl="/icons/clock.svg"
					alt="clock icon"
					value={`asked ${getDurationAgoOfDate(new Date(createdAt))}`}
					title=""
					textStyles="small-regular text-dark400_light700"
				/>
				<Metric
					imgUrl="/icons/message.svg"
					alt="message icon"
					value={formatNumber(answers)}
					title=""
					textStyles="small-regular text-dark400_light700"
				/>
				<Metric
					imgUrl="/icons/eye.svg"
					alt="eye icon"
					value={formatNumber(views)}
					title=""
					textStyles="small-regular text-dark400_light700"
				/>
			</div>

			<Preview content={content} />

			<div className="mt-8 flex flex-wrap gap-2">
				{tags.map((tag) => (
					<TagCard
						key={tag._id}
						_id={tag._id as string}
						name={tag.name}
						compact
					/>
				))}
			</div>
		</>
	);
}
