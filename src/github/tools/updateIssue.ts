import { updateIssue } from "../githubApi";
import { updateIssueSchema } from "../schemas/issueSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerUpdateIssueTool(server: McpServer, props: Props) {
  server.tool(
    "update_issue",
    "Update an existing issue in a GitHub repository",
    updateIssueSchema,
    async (args) => {
      const { owner, repo, issue_number, ...options } = args;
      const accessToken = props.accessToken;
      const result = await updateIssue(owner, repo, issue_number, options, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 