import { getPullRequest } from "../githubApi";
import { getPullRequestSchema } from "../schemas/pullSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerGetPullRequestTool(server: McpServer, props: Props) {
  server.tool(
    "get_pull_request",
    "Get details of a specific pull request",
    getPullRequestSchema,
    async (args) => {
      const { owner, repo, pull_number } = args;
      const accessToken = props.accessToken;
      const result = await getPullRequest(owner, repo, pull_number, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 