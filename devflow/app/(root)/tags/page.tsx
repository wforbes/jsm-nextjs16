import { getTags } from "@/lib/actions/tag.action";
import React from "react";

export default async function TagsPage() {
	const { success, data, error } = await getTags({
		page: 1,
		pageSize: 10,
		query: "",
	});

	const { tags } = data || {};
	console.log("TAGS", JSON.stringify(tags, null, 2));
	return <div>TagsPage</div>;
}
