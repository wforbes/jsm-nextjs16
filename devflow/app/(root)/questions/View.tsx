"use client";

import { incrementViews } from "@/lib/actions/question.action";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const View = ({ questionId }: { questionId: string }) => {
	const [hasIncremented, setHasIncremented] = useState(false);
	const handleIncrement = async () => {
		const result = await incrementViews({ questionId });
		if (result.success) {
			toast.success("View count incremented");
		} else {
			toast.error(
				result.error?.message || "Failed to increment view count"
			);
		}
	};

	useEffect(() => {
		if (!hasIncremented) {
			handleIncrement();
			setHasIncremented(true);
		}
	});
	return null;
};

export default View;
