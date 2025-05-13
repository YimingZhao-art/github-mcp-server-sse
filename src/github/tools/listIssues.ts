import { listIssues } from "../githubApi";
import { listIssuesSchema } from "../schemas/issueSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerListIssuesTool(server: McpServer, props: Props) {
  server.tool(
    "list_issues",
    "List issues in a GitHub repository with filtering options",
    listIssuesSchema,
    async (args) => {
      const { owner, repo, ...options } = args;
      const accessToken = props.accessToken;
      const result = await listIssues(owner, repo, options, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 