"use client";
import { Path, useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { AskQuestionSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRef, useTransition } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { z } from "zod";
import TagCard from "../cards/TagCard";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { LoaderCircle } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";

const Editor = dynamic(() => import("@/components/editor"), {
	// https://mdxeditor.dev/editor/docs/getting-started
	ssr: false,
});

interface Params {
	question?: Question;
	isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit = false }: Params) => {
	const router = useRouter();
	const editorRef = useRef<MDXEditorMethods>(null);
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof AskQuestionSchema>>({
		resolver: zodResolver(AskQuestionSchema),
		defaultValues: {
			title: question?.title || "",
			content: question?.content || "",
			tags: question?.tags.map((tag) => tag.name) || [],
		},
	});

	const handleInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		field: { value: string[] }
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const tagInput = e.currentTarget.value.trim();
			if (
				tagInput &&
				tagInput.length < 15 &&
				!field.value.includes(tagInput)
			) {
				form.setValue("tags", [...field.value, tagInput]);
				e.currentTarget.value = "";
			} else if (tagInput.length >= 15) {
				form.setError("tags", {
					type: "manual",
					message: "Tag must be less than 15 characters.",
				});
			} else if (field.value.includes(tagInput)) {
				form.setError("tags", {
					type: "manual",
					message: "Tag already exists.",
				});
			}
		}
	};

	const handleTagRemove = (tag: string, field: { value: string[] }) => {
		const updatedTags = field.value.filter((t) => t !== tag);
		form.setValue("tags", updatedTags);
		if (updatedTags.length === 0) {
			form.setError("tags", {
				type: "manual",
				message: "At least one tag is required.",
			});
		}
	};

	const handleCreateQuestion = async (
		data: z.infer<typeof AskQuestionSchema>
	) => {
		startTransition(async () => {
			if (isEdit && question) {
				// Edit Question Flow
				const result = await editQuestion({
					questionId: question?._id,
					...data,
				});
				if (result.success) {
					toast.success("Question updated successfully!");
					if (result.data)
						router.push(
							ROUTES.QUESTION(result.data!._id as string)
						);
				} else {
					toast.error(
						result.error?.message || "Something went wrong."
					);
				}
				return;
			}
			// Create Question Flow
			const result = await createQuestion(data);

			if (result.success) {
				toast.success("Question created successfully!");
				if (result.data) router.push(ROUTES.QUESTION(result.data!._id));
			} else {
				toast.error(result.error?.message || "Something went wrong.");
			}
		});
	};

	return (
		<Form {...form}>
			<form
				className="flex w-full flex-col gap-10"
				onSubmit={form.handleSubmit(handleCreateQuestion)}
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Question Title{" "}
								<span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
								/>
							</FormControl>
							<FormDescription className="body-regular text-light-500 mt-1">
								Be specific and image you&apos;re asking a
								question to another person.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Detailed explanation of your problem{" "}
								<span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>
								<Editor
									editorRef={editorRef}
									value={field.value}
									fieldChange={field.onChange}
								/>
							</FormControl>
							<FormDescription className="body-regular text-light-500 mt-1">
								Introduce the problem and expand on what
								you&apos;ve put in the title.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col gap-3">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Tags <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>
								<div>
									<Input
										className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
										placeholder="Add tags..."
										onKeyDown={(e) =>
											handleInputKeyDown(e, field)
										}
									/>
									{field.value.length > 0 && (
										<div className="flex-start mt-2.5 flex-wrap gap-2.5">
											{field.value.map((tag: string) => (
												<TagCard
													_id={tag}
													key={tag}
													name={tag}
													compact
													remove
													isButton
													handleRemove={() =>
														handleTagRemove(
															tag,
															field
														)
													}
												/>
											))}
										</div>
									)}
								</div>
							</FormControl>
							<FormDescription className="body-regular text-light-500 mt-1">
								Add up to 3 tags to describe what your question
								is about. Press enter to add each tag.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="mt-16 flex justify-end">
					<Button
						type="submit"
						disabled={isPending}
						className="primary-gradient !text-light-900 w-fit"
					>
						{isPending ? (
							<>
								{/*<LoaderCircle className="mr-2 size-4 animate-spin" />*/}
								<ReloadIcon className="mr-2 size-4 animate-spin" />
								<span>Submitting</span>
							</>
						) : (
							<>{isEdit ? "Update Question" : "Ask Question"}</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default QuestionForm;
