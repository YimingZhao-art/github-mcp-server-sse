import { searchIssues } from "../githubApi";
import { searchIssuesSchema } from "../schemas/searchSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerSearchIssuesTool(server: McpServer, props: Props) {
  server.tool(
    "search_issues",
    "Search for issues and pull requests across GitHub repositories",
    searchIssuesSchema,
    async (args) => {
      const { q, sort, order, per_page, page } = args;
      const accessToken = props.accessToken;
      const result = await searchIssues(q, sort, order, per_page, page, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 