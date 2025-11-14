import { NextResponse } from "next/server";
import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { ForbiddenError, ValidationError } from "@/lib/http-errors";
import Account from "@/database/account.model";

export async function GET() {
	try {
		await dbConnect();
		const accounts = await Account.find();
		return NextResponse.json(
			{ success: true, data: accounts },
			{ status: 200 }
		);
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}

export async function POST(request: Request) {
	try {
		await dbConnect();
		const body = await request.json();
		const validatedData = AccountSchema.parse(body);
		/* dont need safeParse here (because password is not included?)
		if (!validatedData.success) {
			throw new ValidationError(
				validatedData.error.flatten().fieldErrors
			);
		}*/

		const existingAccount = await Account.findOne({
			provider: validatedData.provider,
			providerAccountId: validatedData.providerAccountId,
		});
		if (existingAccount) {
			throw new ForbiddenError(
				"An account with the same provider already exists."
			);
		}

		const newAccount = await Account.create(validatedData);
		return NextResponse.json(
			{ success: true, data: newAccount },
			{ status: 201 }
		);
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}
