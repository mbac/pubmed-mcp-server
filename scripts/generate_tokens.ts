
import { SignJWT } from "jose";
import { randomBytes } from "crypto";

const generateTokens = async () => {
  let secretKey = process.env.MCP_AUTH_SECRET_KEY;
  let isGeneratedKey = false;

  if (!secretKey) {
    secretKey = randomBytes(32).toString("hex");
    isGeneratedKey = true;
  }

  const secret = new TextEncoder().encode(secretKey);

  console.log("--- Token Generation ---");
  if (isGeneratedKey) {
    console.log("⚠️  No MCP_AUTH_SECRET_KEY found in environment.");
    console.log("⚠️  Generated a temporary secret key for these tokens.");
    console.log(`🔑 SECRET KEY: ${secretKey}`);
    console.log("👉 You MUST set this as MCP_AUTH_SECRET_KEY on your server for these tokens to work.\n");
  } else {
    console.log("✅ Using MCP_AUTH_SECRET_KEY from environment.\n");
  }

  const clients = [
    { id: "manus", scopes: ["global"], name: "Manus Client" },
    { id: "gemini", scopes: ["global"], name: "Gemini Client" },
    { id: "perplexity", scopes: ["global"], name: "Perplexity Client" },
  ];

  for (const client of clients) {
    const token = await new SignJWT({
      cid: client.id,
      scp: client.scopes,
      name: client.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1y") // Long expiration for testing
      .sign(secret);

    console.log(`🎫 Token for ${client.name} (ID: ${client.id}, Scopes: ${client.scopes.join(", ")}):`);
    console.log(token);
    console.log("");
  }
};

generateTokens().catch(console.error);
