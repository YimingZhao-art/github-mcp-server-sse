/**
 * Constructs an authorization URL for an upstream service.
 *
 * @param {Object} options
 * @param {string} options.upstream_url - The base URL of the upstream service.
 * @param {string} options.client_id - The client ID of the application.
 * @param {string} options.redirect_uri - The redirect URI of the application.
 * @param {string} [options.state] - The state parameter.
 *
 * @returns {string} The authorization URL.
 */
export function getUpstreamAuthorizeUrl({
	upstream_url,
	client_id,
	scope,
	redirect_uri,
	state,
}: {
	upstream_url: string;
	client_id: string;
	scope: string;
	redirect_uri: string;
	state?: string;
}) {
	const upstream = new URL(upstream_url);
	upstream.searchParams.set("client_id", client_id);
	upstream.searchParams.set("redirect_uri", redirect_uri);
	upstream.searchParams.set("scope", scope);
	if (state) upstream.searchParams.set("state", state);
	upstream.searchParams.set("response_type", "code");
	return upstream.href;
}

/**
 * Fetches an authorization token from an upstream service.
 *
 * @param {Object} options
 * @param {string} options.client_id - The client ID of the application.
 * @param {string} options.client_secret - The client secret of the application.
 * @param {string} options.code - The authorization code.
 * @param {string} options.redirect_uri - The redirect URI of the application.
 * @param {string} options.upstream_url - The token endpoint URL of the upstream service.
 *
 * @returns {Promise<[string, null] | [null, Response]>} A promise that resolves to an array containing the access token or an error response.
 */
export async function fetchUpstreamAuthToken({
	client_id,
	client_secret,
	code,
	redirect_uri,
	upstream_url,
}: {
	code: string | undefined;
	upstream_url: string;
	client_secret: string;
	redirect_uri: string;
	client_id: string;
}): Promise<[string, null] | [null, Response]> {
	if (!code) {
		return [null, new Response("Missing code", { status: 400 })];
	}

	const resp = await fetch(upstream_url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({ client_id, client_secret, code, redirect_uri }).toString(),
	});
	if (!resp.ok) {
		console.log(await resp.text());
		return [null, new Response("Failed to fetch access token", { status: 500 })];
	}

	const contentType = resp.headers.get("content-type");
	let accessToken: string | null = null;
	if (contentType?.includes("application/json")) {
		const json = await resp.json();
		accessToken = json.access_token;
	} else {
		const text = await resp.text();
		const params = new URLSearchParams(text);
		accessToken = params.get("access_token");
	}
	if (!accessToken) {
		return [null, new Response("Missing access token", { status: 400 })];
	}
	return [accessToken, null];
}

// Context from the auth process, encrypted & stored in the auth token
// and provided to the DurableMCP as this.props
export type Props = {
	login: string
	name: string
	email: string
	accessToken: string
}

import { z } from "zod";

export const CreateIssueSchema = z.object({
	owner: z.string(),
	repo: z.string(),
	title: z.string(),
	body: z.string().optional(),
	assignees: z.array(z.string()).optional(),
	milestone: z.number().optional(),
	labels: z.array(z.string()).optional(),
});

export async function githubRequest(
	url: string,
	options: any = {},
	accessToken?: string
) {
	const headers: Record<string, string> = {
		Accept: "application/vnd.github.v3+json",
		"Content-Type": "application/json",
		"User-Agent": "my-mcp-server-github-auth",
		...options.headers,
	};
	if (accessToken) {
		headers["Authorization"] = `Bearer ${accessToken}`;
	}
	console.log("[githubRequest] accessToken:", accessToken);
	console.log("[githubRequest] headers:", headers);
	const response = await fetch(url, {
		method: options.method || "POST",
		headers,
		body: options.body ? JSON.stringify(options.body) : undefined,
	});
	const responseBody = await response.json();
	if (!response.ok) {
		throw new Error(JSON.stringify(responseBody));
	}
	return responseBody;
}

export async function createIssue(
	owner: string,
	repo: string,
	options: any,
	accessToken: string
) {
	return githubRequest(
		`https://api.github.com/repos/${owner}/${repo}/issues`,
		{ method: "POST", body: options },
		accessToken
	);
}
