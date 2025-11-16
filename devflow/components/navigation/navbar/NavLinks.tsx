"use client";
import React, { Dispatch, SetStateAction } from "react";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";

const NavLinks = ({
	isMobileNav = false,
	userId,
}: {
	isMobileNav?: boolean;
	userId?: string;
}) => {
	const pathname = usePathname();
	// TODO: Hydration error stemming from changing profile userId
	//	dynamically. Need to find a way to fix this.
	return (
		<>
			{sidebarLinks.map((item) => {
				const isActive =
					(pathname.includes(item.route) && item.route.length > 1) ||
					item.route === pathname;

				if (item.route === "/profile") {
					if (!userId) return null;
					item.route = `${item.route}/${userId}`;
				}

				const LinkComponent = (
					<Link
						href={item.route}
						key={item.label}
						className={cn(
							isActive
								? "primary-gradient text-light-900 rounded-lg"
								: "text-dark300_light900",
							"flex items-center justify-start gap-4 bg-transparent p-4"
						)}
					>
						<Image
							src={item.imgURL}
							alt={item.label}
							width={20}
							height={20}
							className={cn({ "invert-colors": !isActive })}
						/>
						<p
							className={cn(
								isActive ? "base-bold" : "base-medium",
								!isMobileNav && "max-lg:hidden"
							)}
						>
							{item.label}
						</p>
					</Link>
				);
				return isMobileNav ? (
					<SheetClose asChild key={item.route}>
						{LinkComponent}
					</SheetClose>
				) : (
					<React.Fragment key={item.route}>
						{LinkComponent}
					</React.Fragment>
				);
			})}
		</>
	);
};

export default NavLinks;
