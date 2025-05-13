import { createRepository } from "../githubApi";
import { createRepositorySchema } from "../schemas/repoSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerCreateRepositoryTool(server: McpServer, props: Props) {
  server.tool(
    "create_repository",
    "Create a new GitHub repository in your account",
    createRepositorySchema,
    async (args) => {
      const accessToken = props.accessToken;
      const result = await createRepository(args, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 