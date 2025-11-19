"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { AnswerClientSchema } from "@/lib/validations";
import { createAnswer } from "@/lib/actions/answer.action";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), {
	// https://mdxeditor.dev/editor/docs/getting-started
	ssr: false,
});

export default function AnswerForm({ questionId }: { questionId: string }) {
	const [isAnswering, startAnsweringTransition] = useTransition();
	const [isAISubmitting, setisAISubmitting] = useState(false);
	const editorRef = useRef<MDXEditorMethods>(null);
	const form = useForm<z.infer<typeof AnswerClientSchema>>({
		resolver: zodResolver(AnswerClientSchema), //standardSchemaResolver(AnswerClientSchema),
		defaultValues: {
			content: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof AnswerClientSchema>) => {
		startAnsweringTransition(async () => {
			const result = await createAnswer({
				questionId,
				content: values.content,
			});
			if (result.success) {
				form.reset();
				toast.success("Answer posted successfully!");
			} else {
				toast.error(result.error?.message || "Something went wrong.");
			}
		});
	};

	return (
		<div>
			<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
				<h4 className="paragraph-semibold text-dark400_light800">
					Write your answer here
				</h4>
				<Button
					className="btn light-border-2 text-primary-500 dark:text-primary-500 gap-1.5 rounded-md border px-4 py-2.5 shadow-none"
					disabled={isAISubmitting}
				>
					{isAISubmitting ? (
						<>
							<ReloadIcon className="mr-2 size-4 animate-spin" />
							Generating...
						</>
					) : (
						<>
							<Image
								src="/icons/stars.svg"
								alt="Generate AI Answer"
								width={12}
								height={12}
								className="object-contain"
							/>
							Generate AI Answer
						</>
					)}
				</Button>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="mt-6 flex w-full flex-col gap-10"
				>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-3 rounded-sm">
								{/*
                                    for some reason the Editor's classNames aren't being applied here
                                    like they are in QuestionForm ... so I'm adding them directly to
                                    FormControl. Otherwise the editor content area doesn't get styled
                                    correctly (dark-editor, border)
                                */}
								<FormControl className="background-light800_dark200 light-border-2 markdown-editor dark-editor grid w-full rounded-md border">
									<Editor
										value={field.value}
										editorRef={editorRef}
										fieldChange={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-end">
						<Button
							type="submit"
							disabled={isAnswering || isAISubmitting}
							className="primary-gradient w-fit font-bold"
						>
							{isAnswering ? (
								<>
									<ReloadIcon className="mr-2 size-4 animate-spin" />
									Posting...
								</>
							) : (
								"Post Answer"
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
