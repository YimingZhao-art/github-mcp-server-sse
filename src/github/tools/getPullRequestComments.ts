import { getPullRequestComments } from "../githubApi";
import { getPullRequestCommentsSchema } from "../schemas/pullSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerGetPullRequestCommentsTool(server: McpServer, props: Props) {
  server.tool(
    "get_pull_request_comments",
    "Get the review comments on a pull request",
    getPullRequestCommentsSchema,
    async (args) => {
      const { owner, repo, pull_number } = args;
      const accessToken = props.accessToken;
      const result = await getPullRequestComments(owner, repo, pull_number, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 