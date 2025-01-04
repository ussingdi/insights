import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createExtension(["pg_graphql", "pg_jsonschema"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropExtension(["pg_graphql", "pg_jsonschema"]);
	pgm.dropSchema("graphql");
}
