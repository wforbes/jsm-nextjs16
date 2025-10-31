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

const QuestionForm = () => {
	const form = useForm({
		resolver: zodResolver(AskQuestionSchema),
		defaultValues: {
			title: "",
			body: "",
			tags: [],
		},
	});

	const handleCreateQuestion = (data: any) => {
		console.log("Question Data:", data);
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
					name="body"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Detailed explanation of your problem{" "}
								<span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>Editor</FormControl>
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
										{...field}
										className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
										placeholder="Add tags..."
									/>
									Tags
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
						className="primary-gradient !text-light-900 w-fit"
					>
						Ask Question
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default QuestionForm;
