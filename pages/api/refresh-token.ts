import type { NextApiRequest, NextApiResponse } from "next";
import { AuthService } from "@/Services/authService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  // Get the refresh token from the cookie or request body
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const authService = new AuthService();

    // Call the server-side token refresh method
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTHSERVER_BASE_URL}/o/token/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_AUTHSERVER_CLIENT_ID}:${process.env.AUTHSERVER_CLIENT_SECRET}`,
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(401).json({
        error: errorData.error_description || "Token refresh failed",
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    console.error("API refresh token error:", error);
    res.status(401).json({ error: error.message || "Token refresh failed" });
  }
}
