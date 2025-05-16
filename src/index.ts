import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Octokit } from "octokit";
import { GitHubHandler } from "./github-handler";
import { createIssue } from "./utils";
import { registerCreateIssueTool } from "./github/tools/createIssue";
import { registerCreateOrUpdateFileTool } from "./github/tools/createOrUpdateFile";
import { registerSearchRepositoriesTool } from "./github/tools/searchRepositories";
import { registerCreateRepositoryTool } from "./github/tools/createRepository";
import { registerGetFileContentsTool } from "./github/tools/getFileContents";
import { registerPushFilesTool } from "./github/tools/pushFiles";
import { registerCreatePullRequestTool } from "./github/tools/createPullRequest";
import { registerForkRepositoryTool } from "./github/tools/forkRepository";
import { registerCreateBranchTool } from "./github/tools/createBranch";
import { registerListCommitsTool } from "./github/tools/listCommits";
import { registerListIssuesTool } from "./github/tools/listIssues";
import { registerUpdateIssueTool } from "./github/tools/updateIssue";
import { registerAddIssueCommentTool } from "./github/tools/addIssueComment";
import { registerSearchCodeTool } from "./github/tools/searchCode";
import { registerSearchIssuesTool } from "./github/tools/searchIssues";
import { registerSearchUsersTool } from "./github/tools/searchUsers";
import { registerGetIssueTool } from "./github/tools/getIssue";
import { registerGetPullRequestTool } from "./github/tools/getPullRequest";
import { registerListPullRequestsTool } from "./github/tools/listPullRequests";
import { registerCreatePullRequestReviewTool } from "./github/tools/createPullRequestReview";
import { registerMergePullRequestTool } from "./github/tools/mergePullRequest";
import { registerGetPullRequestFilesTool } from "./github/tools/getPullRequestFiles";
import { registerGetPullRequestStatusTool } from "./github/tools/getPullRequestStatus";
import { registerUpdatePullRequestBranchTool } from "./github/tools/updatePullRequestBranch";
import { registerGetPullRequestCommentsTool } from "./github/tools/getPullRequestComments";
import { registerGetPullRequestReviewsTool } from "./github/tools/getPullRequestReviews";

// Context from the auth process, encrypted & stored in the auth token
// and provided to the DurableMCP as this.props
type Props = {
	login: string;
	name: string;
	email: string;
	accessToken: string;
};

const ALLOWED_USERNAMES = new Set([
	// Add GitHub usernames of users who should have access to the image generation tool
	// For example: 'yourusername', 'coworkerusername'
]);

export class MyMCP extends McpAgent<Props, Env> {
	server = new McpServer({
		name: "Github OAuth Proxy Demo",
		version: "1.0.0",
	});

	async init() {

		// Use the upstream access token to facilitate tools
		this.server.tool(
			"user_info",
			"Get user info from GitHub, via Octokit",
			{},
			async () => {
				console.log("[userInfoOctokit] accessToken:", this.props.accessToken);
				const octokit = new Octokit({ auth: this.props.accessToken });
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(await octokit.rest.users.getAuthenticated()),
						},
					],
				};
			},
		);

		registerCreateIssueTool(this.server, this.props);
		registerCreateOrUpdateFileTool(this.server, this.props);
		registerSearchRepositoriesTool(this.server, this.props);
		registerCreateRepositoryTool(this.server, this.props);
		registerGetFileContentsTool(this.server, this.props);
		registerPushFilesTool(this.server, this.props);
		registerCreatePullRequestTool(this.server, this.props);
		registerForkRepositoryTool(this.server, this.props);
		registerCreateBranchTool(this.server, this.props);
		registerListCommitsTool(this.server, this.props);
		registerListIssuesTool(this.server, this.props);
		registerUpdateIssueTool(this.server, this.props);
		registerAddIssueCommentTool(this.server, this.props);
		registerSearchCodeTool(this.server, this.props);
		registerSearchIssuesTool(this.server, this.props);
		registerSearchUsersTool(this.server, this.props);
		registerGetIssueTool(this.server, this.props);
		registerGetPullRequestTool(this.server, this.props);
		registerListPullRequestsTool(this.server, this.props);
		registerCreatePullRequestReviewTool(this.server, this.props);
		registerMergePullRequestTool(this.server, this.props);
		registerGetPullRequestFilesTool(this.server, this.props);
		registerGetPullRequestStatusTool(this.server, this.props);
		registerUpdatePullRequestBranchTool(this.server, this.props);
		registerGetPullRequestCommentsTool(this.server, this.props);
		registerGetPullRequestReviewsTool(this.server, this.props);
	}
}

export default new OAuthProvider({
	apiRoute: "/sse",
	apiHandler: MyMCP.mount("/sse"),
	defaultHandler: GitHubHandler,
	authorizeEndpoint: "/authorize",
	tokenEndpoint: "/token",
	clientRegistrationEndpoint: "/register",
});
