import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { techIconMap } from "./techIconMap";

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
