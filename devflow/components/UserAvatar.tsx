import ROUTES from "@/constants/routes";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
	id: string;
	name: string;
	imageUrl?: string | null;
	className?: string;
	fallbackClassName?: string;
}

export default function UserAvatar({
	id,
	name,
	imageUrl,
	className = "h-9 w-9",
	fallbackClassName,
}: Props) {
	const initials = name
		.split(" ")
		.map((n: string) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
	return (
		<Link href={ROUTES.PROFILE(id)}>
			<Avatar className={className}>
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={name}
						width={36}
						height={36}
						className="w-full object-cover"
						quality={75}
					/>
				) : (
					<AvatarFallback
						className={cn(
							fallbackClassName,
							"primary-gradient font-space-grotesk font-bold"
						)}
					>
						{initials}
					</AvatarFallback>
				)}
			</Avatar>
		</Link>
	);
}
