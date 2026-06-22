import { app } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { seedSuperAdmin } from "./database/seedSuperAdmin";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log("[DATABASE] Connected successfully");

    await seedSuperAdmin();
    console.log("[SEED] Super admin check completed");

    app.listen(Number(env.port), "0.0.0.0", () => {
      console.log(`[SERVER] Running on port ${env.port}`);
      console.log(`[SERVER] Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error("[SERVER_START_ERROR]", error);
    process.exit(1);
  }
};

void startServer();
