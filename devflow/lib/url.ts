import qs from "query-string";

interface UrlQueryParams {
	params: string;
	key: string;
	value: string;
}
interface RemoveUrlQueryParams {
	params: string;
	keysToRemove: string[];
}

// take the current query string from the url
//  update provided key with a new value
//  and return the new URL that includes it
export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
	const queryString = qs.parse(params);
	queryString[key] = value;
	return qs.stringifyUrl({
		url: window.location.pathname,
		query: queryString,
	});
};

export const removeKeysFromUrlQuery = ({
	params,
	keysToRemove,
}: RemoveUrlQueryParams) => {
	const queryString = qs.parse(params);
	keysToRemove.forEach((key) => {
		delete queryString[key];
	});
	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: queryString,
		},
		{ skipNull: true }
	);
};
