import { updatePullRequestBranch } from "../githubApi";
import { updatePullRequestBranchSchema } from "../schemas/pullSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerUpdatePullRequestBranchTool(server: McpServer, props: Props) {
  server.tool(
    "update_pull_request_branch",
    "Update a pull request branch with the latest changes from the base branch",
    updatePullRequestBranchSchema,
    async (args) => {
      const { owner, repo, pull_number, expected_head_sha } = args;
      const accessToken = props.accessToken;
      const result = await updatePullRequestBranch(owner, repo, pull_number, expected_head_sha, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 