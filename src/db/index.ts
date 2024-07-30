import { env } from "@/env.mjs";
import { neon, NeonQueryFunction, neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle as neonDrizzle, NeonDatabase } from "drizzle-orm/neon-serverless";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import ws from "ws";

// const sql = neon(env.DATABASE_URL) as NeonQueryFunction<boolean, boolean>;

// export const db = drizzle(sql);

neonConfig.webSocketConstructor = ws;

export const drizzleClient = (datasourceUrl: string | undefined) => {
  const connectionString = datasourceUrl || env.DATABASE_URL;

  const client = () => {
    if (process.env.SERVERLESS_DRIVER) {
      const pool = new Pool({ connectionString });
      return drizzle(pool, { schema });
    }

    return drizzle(postgres(connectionString!), { schema }) as unknown as NeonDatabase<typeof schema>;
  };

  if (!connectionString) {
    return null as any as ReturnType<typeof client>;
  }

  return client();
};

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var localDrizzle: ReturnType<typeof drizzleClient>;
}

export const getDrizzleClient = (url?: string): ReturnType<typeof drizzleClient> => {
  if (process.env.SERVER || url) {
    return drizzleClient(url);
  }

  if (!global.localDrizzle) {
    global.localDrizzle = drizzleClient(url);
  }
  return global.localDrizzle;
};

export const db = getDrizzleClient();
