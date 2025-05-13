import { listPullRequests } from "../githubApi";
import { listPullRequestsSchema } from "../schemas/pullSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerListPullRequestsTool(server: McpServer, props: Props) {
  server.tool(
    "list_pull_requests",
    "List and filter repository pull requests",
    listPullRequestsSchema,
    async (args) => {
      const { owner, repo, ...options } = args;
      const accessToken = props.accessToken;
      const result = await listPullRequests(owner, repo, options, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 