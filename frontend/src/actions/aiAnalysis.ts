"use server";

import { getServerApiUrl } from "../lib/api";

export async function executeAnalysisAction(question: string) {
  try {
    const baseUrl = getServerApiUrl();
    const response = await fetch(`${baseUrl}/api/v1/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`Failed to communicate with analysis engine: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Server Action Error: failed to execute analysis", error);
    throw new Error("AI分析エンジンの呼び出しに失敗しました。サーバー側の動作状況を確認してください。");
  }
}
