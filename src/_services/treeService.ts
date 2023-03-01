import config from "../config";
import { Expression } from "../Model/iTechRestApi/Expression";
import { ResultSet } from "../Model/iTechRestApi/ResultSet";
import { TreeNode } from "../Model/iTechRestApi/TreeList";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const treeService = {
  get,
};

async function fetchWithTimeout(resource: string, options: any) {
  const { timeout = 20000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

function get(
  iTechControlColumnRowId: number,
  expressions: Expression[]
): Promise<ResultSet<TreeNode>> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(expressions),
    timeout: 60000,
  };
  return fetchWithTimeout(
    `${config.apiUrl}/api/iTechTree/${iTechControlColumnRowId}`,
    requestOptions
  ).then(handleResponse);
}
