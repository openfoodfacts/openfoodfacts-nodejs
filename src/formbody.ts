export function formBody(params: Record<string, string>) {
	const formBody = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		formBody.append(key, value);
	}
	return formBody;
}
