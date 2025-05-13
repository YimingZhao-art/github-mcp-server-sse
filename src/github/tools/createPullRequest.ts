import { createPullRequest } from "../githubApi";
import { createPullRequestSchema } from "../schemas/pullSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerCreatePullRequestTool(server: McpServer, props: Props) {
  server.tool(
    "create_pull_request",
    "Create a new pull request in a GitHub repository",
    createPullRequestSchema,
    async (args) => {
      const { owner, repo, ...options } = args;
      const accessToken = props.accessToken;
      const result = await createPullRequest(owner, repo, options, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 