import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	serverExternalPackages: ["pino", "pino-pretty"],
	turbopack: {
		root: __dirname,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.svgrepo.com",
				port: "",
			},
		],
	},
};

export default nextConfig;
