export default async function QuestionDetails({ params }: RouteParams) {
	const { id } = await params;

	return <div>Question Page: {id}</div>;
}
