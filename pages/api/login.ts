import type { NextApiRequest, NextApiResponse } from "next";
import { AuthService } from "@/Services/authService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ error: "Email/username and password are required" });
  }

  try {
    const authService = new AuthService();
    const data = await authService.login(identifier, password);

    // Set refresh token in an HTTP-only cookie for better security
    if (data.refresh_token) {
      res.setHeader(
        "Set-Cookie",
        `refreshToken=${data.refresh_token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=2592000; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,
      );
    }

    // Always ensure we have a token, even if the response format is unexpected
    if (!data.access_token) {
      console.warn("Access token not found in response, using data directly");
      return res.status(200).json(data);
    }

    // Return the access token to the client
    res.status(200).json(data.access_token || data);
  } catch (error: any) {
    console.error("API login error:", error);
    res.status(401).json({ error: error.message || "Authentication failed" });
  }
}
