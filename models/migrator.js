import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import { resolve } from "node:path";
import { ServiceError } from "infra/errors";

async function runMigrations({ dryRun } = { dryRun: true }) {
  const dbClient = await database.getNewClient();

  try {
    return await migrationRunner({
      dbClient,
      dryRun,
      dir: resolve("infra", "migrations"),
      direction: "up",
      log: () => {},
      migrationsTable: "pgmigrations",
    });
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Migration runner failed.",
      cause: error,
    });

    throw serviceErrorObject;
  } finally {
    await dbClient?.end();
  }
}

function listPendingMigrations() {
  return runMigrations({ dryRun: true });
}

function runPendingMigrations() {
  return runMigrations({ dryRun: false });
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
