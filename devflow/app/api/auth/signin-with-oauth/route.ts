import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
import mongoose from "mongoose";
import slugify from "slugify";
import { NextResponse } from "next/server";
import User from "@/database/user.model";
import Account from "@/database/account.model";

export async function POST(request: Request) {
	const { provider, providerAccountId, user } = await request.json();
	await dbConnect();

	// startSession is from mongodb transactions API
	//  this allows multiple ops to be executed as a single atomic unit
	//  they ensure all ops succeed or none are applied
	//  which ensures data consistency
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const validatedData = SignInWithOAuthSchema.safeParse({
			provider,
			providerAccountId,
			user,
		});
		if (!validatedData.success) {
			throw new ValidationError(
				validatedData.error.flatten().fieldErrors
			);
		}

		const { name, username, email, image } = validatedData.data.user;

		const slugifiedUsername = slugify(username, {
			lower: true,
			strict: true,
			trim: true,
		});
		let existingUser = await User.findOne({ email }).session(session);
		if (!existingUser) {
			[existingUser] = await User.create(
				[{ name, username: slugifiedUsername, email, image }],
				{ session }
			);
		} else {
			const updatedData: { name?: string; image?: string } = {};
			if (existingUser.name !== name) updatedData.name = name;
			if (existingUser.image !== image) updatedData.image = image;
			if (Object.keys(updatedData).length > 0) {
				await User.updateOne(
					{ _id: existingUser._id },
					{ $set: updatedData }
				).session(session);
			}
		}
		const existingAccount = await Account.findOne({
			userId: existingUser._id,
			provider,
			providerAccountId,
		}).session(session);
		if (!existingAccount) {
			await Account.create(
				[
					{
						userId: existingUser._id,
						name,
						image,
						provider,
						providerAccountId,
					},
				],
				{ session }
			);
		}
		await session.commitTransaction();

		// should we return a response here?
	} catch (error: unknown) {
		await session.abortTransaction();
		return handleError(error, "api") as APIErrorResponse;
	} finally {
		session.endSession();
	}
}
