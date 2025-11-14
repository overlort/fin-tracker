import { SQLiteDBConnection } from "@capacitor-community/sqlite";

export interface Migration {
  version: number;
  up: (db: SQLiteDBConnection) => Promise<void>;
  down?: (db: SQLiteDBConnection) => Promise<void>;
}