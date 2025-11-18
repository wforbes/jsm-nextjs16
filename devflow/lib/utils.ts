import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { techIconMap } from "./techIconMap";
import { techDescriptionMap } from "./techDescriptionMap";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getDeviconClassName(name: string) {
	const normalized = name.replace(/[ .]/g, "").toLowerCase();
	let classStr = techIconMap[normalized];
	if (classStr) {
		classStr += " colored";
	}

	return `${classStr ?? techIconMap["devicon"]}`;
}

export function getTechDescription(name: string) {
	const normalized = name.replace(/[ .]/g, "").toLowerCase();
	const desc = techDescriptionMap[normalized];

	if (desc) return desc;

	// fallback / wildcard description
	return `${name} is a tool or concept widely used in software engineering, providing valuable capabilities and benefits.`;
}

export const getDurationAgoOfDate = (createdAt: Date) => {
	const date = new Date(createdAt);
	const now = new Date();
	const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

	const units = [
		{ name: "year", seconds: 31536000 },
		{ name: "month", seconds: 2592000 },
		{ name: "week", seconds: 604800 },
		{ name: "day", seconds: 86400 },
		{ name: "hour", seconds: 3600 },
		{ name: "minute", seconds: 60 },
		{ name: "second", seconds: 1 },
	];

	for (const unit of units) {
		const interval = Math.floor(secondsAgo / unit.seconds);
		if (interval >= 1) {
			return `${interval} ${unit.name}${interval !== 1 ? "s" : ""} ago`;
		}
	}

	return "just now";
};

export const formatNumber = (num: number) => {
	if (num >= 1_000_000) {
		return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
	}
	if (num >= 1_000) {
		return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
	}
	return num.toString();
};
