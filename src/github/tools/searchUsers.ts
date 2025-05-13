import { searchUsers } from "../githubApi";
import { searchUsersSchema } from "../schemas/searchSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerSearchUsersTool(server: McpServer, props: Props) {
  server.tool(
    "search_users",
    "Search for users on GitHub",
    searchUsersSchema,
    async (args) => {
      const { q, sort, order, per_page, page } = args;
      const accessToken = props.accessToken;
      const result = await searchUsers(q, sort, order, per_page, page, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 