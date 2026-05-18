export const getServerApiUrl = (): string => {
  // サーバー側（windowがない環境）のときは、安全な「API_BASE_URL」を最優先で見る
  if (typeof window === "undefined") {
    return process.env.API_BASE_URL || "http://localhost:8080";
  }
  // ブラウザ側のときは、公開用の「NEXT_PUBLIC_API_BASE_URL」を見る
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};
