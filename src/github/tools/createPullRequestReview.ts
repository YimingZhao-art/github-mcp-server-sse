import { createPullRequestReview } from "../githubApi";
import { createPullRequestReviewSchema } from "../schemas/pullSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerCreatePullRequestReviewTool(server: McpServer, props: Props) {
  server.tool(
    "create_pull_request_review",
    "Create a review on a pull request",
    createPullRequestReviewSchema,
    async (args) => {
      const { owner, repo, pull_number, ...options } = args;
      const accessToken = props.accessToken;
      const result = await createPullRequestReview(owner, repo, pull_number, options, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 