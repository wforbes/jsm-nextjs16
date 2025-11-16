"use client";

import Link from "next/link";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z, ZodType } from "zod";
import {
	DefaultValues,
	FieldValues,
	SubmitHandler,
	Path,
	useForm,
} from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import ROUTES from "@/constants/routes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthFormProps<T extends FieldValues> {
	schema: ZodType<T>;
	defaultValues: T;
	onSubmit: (data: T) => Promise<ActionResponse>;
	formType: "SIGN_IN" | "SIGN_UP";
}

export function AuthForm<T extends FieldValues>({
	schema,
	defaultValues,
	formType,
	onSubmit,
}: AuthFormProps<T>) {
	const router = useRouter();
	const form = useForm<z.infer<typeof schema>>({
		resolver: standardSchemaResolver(schema),
		defaultValues: defaultValues as DefaultValues<T>,
	});

	const handleSubmit: SubmitHandler<T> = async (data) => {
		const result = (await onSubmit(data)) as ActionResponse;

		if (result?.success) {
			toast.success(
				formType === "SIGN_IN"
					? "Signed in successfully"
					: "Account created successfully"
			);
			router.push(ROUTES.HOME);
		} else {
			// TODO: does this error need to be more generic?
			return toast.error(
				result?.error?.message ||
					"Something went wrong. Please try again."
			);
		}
	};

	const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";
	const buttonLoadingText =
		formType === "SIGN_IN" ? "Signing In..." : "Signing Up...";

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="mt-10 space-y-6"
			>
				{Object.keys(defaultValues).map((field) => (
					<FormField
						key={`${field}-field`}
						control={form.control}
						name={field as Path<T>}
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-2.5">
								<FormLabel className="paragraph-medium text-dark400_light700">
									{field.name.charAt(0).toUpperCase() +
										field.name.slice(1)}
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border"
										type={
											field.name === "password"
												? "password"
												: "text"
										}
										required
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}

				<Button
					disabled={form.formState.isSubmitting}
					className="primary-gradient paragraph-medium rounded-2 font-inter !text-light-900 min-h-12 w-full px-4 py-3"
				>
					{form.formState.isSubmitting
						? buttonLoadingText
						: buttonText}
				</Button>

				<p className="text-center">
					{formType === "SIGN_IN" ? (
						<>
							<span>Don&apos;t have an account? </span>
							<Link
								href={ROUTES.SIGN_UP}
								className="paragraph-semibold primary-text-gradient"
							>
								Sign Up
							</Link>
						</>
					) : (
						<>
							<span>Already have an account? </span>
							<Link
								href={ROUTES.SIGN_IN}
								className="paragraph-semibold primary-text-gradient"
							>
								Sign In
							</Link>
						</>
					)}
				</p>
			</form>
		</Form>
	);
}
