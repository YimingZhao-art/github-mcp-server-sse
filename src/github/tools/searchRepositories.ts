import { searchRepositories } from "../githubApi";
import { searchRepositoriesSchema } from "../schemas/repoSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerSearchRepositoriesTool(server: McpServer, props: Props) {
  server.tool(
    "search_repositories",
    "Search for GitHub repositories",
    searchRepositoriesSchema,
    async (args) => {
      const { query, page, perPage } = args;
      const accessToken = props.accessToken;
      const result = await searchRepositories(query, page, perPage, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 