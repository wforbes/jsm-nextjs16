import { NextResponse } from "next/server";
export { auth as middleware } from "@/auth";

export function proxy() {
	return NextResponse.next();
}
