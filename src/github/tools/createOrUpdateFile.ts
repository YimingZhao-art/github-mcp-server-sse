import { createOrUpdateFile } from "../githubApi";
import { createOrUpdateFileSchema } from "../schemas/fileSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerCreateOrUpdateFileTool(server: McpServer, props: Props) {
  server.tool(
    "create_or_update_file",
    "Create or update a single file in a GitHub repository",
    createOrUpdateFileSchema,
    async (args) => {
      const { owner, repo, path, ...options } = args;
      const accessToken = props.accessToken;
      const result = await createOrUpdateFile(owner, repo, path, options, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 