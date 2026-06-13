import { app } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { seedSuperAdmin } from "./database/seedSuperAdmin";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await seedSuperAdmin();

    app.listen(Number(env.port), () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

void startServer();
