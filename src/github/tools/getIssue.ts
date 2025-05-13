import { getIssue } from "../githubApi";
import { getIssueSchema } from "../schemas/issueSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerGetIssueTool(server: McpServer, props: Props) {
  server.tool(
    "get_issue",
    "Get details of a specific issue in a GitHub repository.",
    getIssueSchema,
    async (args) => {
      const { owner, repo, issue_number } = args;
      const accessToken = props.accessToken;
      const result = await getIssue(owner, repo, issue_number, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 