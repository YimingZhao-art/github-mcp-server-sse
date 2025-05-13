import { getPullRequestReviews } from "../githubApi";
import { getPullRequestReviewsSchema } from "../schemas/pullSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerGetPullRequestReviewsTool(server: McpServer, props: Props) {
  server.tool(
    "get_pull_request_reviews",
    "Get the reviews on a pull request",
    getPullRequestReviewsSchema,
    async (args) => {
      const { owner, repo, pull_number } = args;
      const accessToken = props.accessToken;
      const result = await getPullRequestReviews(owner, repo, pull_number, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 