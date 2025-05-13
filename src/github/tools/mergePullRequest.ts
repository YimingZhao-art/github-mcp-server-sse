import { mergePullRequest } from "../githubApi";
import { mergePullRequestSchema } from "../schemas/pullSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerMergePullRequestTool(server: McpServer, props: Props) {
  server.tool(
    "merge_pull_request",
    "Merge a pull request",
    mergePullRequestSchema,
    async (args) => {
      const { owner, repo, pull_number, ...options } = args;
      const accessToken = props.accessToken;
      const result = await mergePullRequest(owner, repo, pull_number, options, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 