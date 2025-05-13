import { getFileContents } from "../githubApi";
import { getFileContentsSchema } from "../schemas/fileSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerGetFileContentsTool(server: McpServer, props: Props) {
  server.tool(
    "get_file_contents",
    "Get the contents of a file or directory from a GitHub repository",
    getFileContentsSchema,
    async (args) => {
      const { owner, repo, path, branch } = args;
      const accessToken = props.accessToken;
      const result = await getFileContents(owner, repo, path, branch, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 