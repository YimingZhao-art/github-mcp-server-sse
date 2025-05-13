import { getPullRequestStatus } from "../githubApi";
import { getPullRequestStatusSchema } from "../schemas/pullSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerGetPullRequestStatusTool(server: McpServer, props: Props) {
  server.tool(
    "get_pull_request_status",
    "Get the combined status of all status checks for a pull request",
    getPullRequestStatusSchema,
    async (args) => {
      const { owner, repo, pull_number } = args;
      const accessToken = props.accessToken;
      const result = await getPullRequestStatus(owner, repo, pull_number, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 