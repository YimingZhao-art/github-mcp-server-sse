import { searchCode } from "../githubApi";
import { searchCodeSchema } from "../schemas/searchSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerSearchCodeTool(server: McpServer, props: Props) {
  server.tool(
    "search_code",
    "Search for code across GitHub repositories",
    searchCodeSchema,
    async (args) => {
      const { q, sort, order, per_page, page } = args;
      const accessToken = props.accessToken;
      const result = await searchCode(q, sort, order, per_page, page, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 