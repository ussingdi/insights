import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable({ schema: "files", name: "plan_update_request_attachments" });
	pgm.dropTable({ schema: "organizations", name: "floor_plan_updates" });
	pgm.createTable(
		{ schema: "organizations", name: "floor_plan_updates" },
		{
			id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
			message: { type: "text", notNull: true, default: "none", check: "length(message) < 500" },
			created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			user_id: { type: "uuid", onUpdate: "CASCADE", onDelete: "SET NULL", references: { schema: "users", name: "users" } },
			floor_plan_id: {
				type: "uuid",
				notNull: true,
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				references: { schema: "organizations", name: "building_floor_plans" },
			},
		}
	);
	pgm.createTable(
		{ schema: "files", name: "floor_plan_update_attachments" },
		{
			id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
			path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
			name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
			created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			floor_plan_update_id: {
				type: "uuid",
				notNull: false,
				references: { schema: "organizations", name: "floor_plan_updates" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		}
	);
	pgm.revokeOnTables({
		tables: [
			{ schema: "organizations", name: "floor_plan_updates" },
			{ schema: "files", name: "floor_plan_update_attachments" },
		],
		roles: { name: "fi_api_user" },
		privileges: "ALL",
	});
	pgm.grantOnTables({
		tables: [
			{ schema: "organizations", name: "floor_plan_updates" },
			{ schema: "files", name: "floor_plan_update_attachments" },
		],
		roles: { name: "fi_api_user" },
		privileges: ["SELECT", "INSERT", "UPDATE", "DELETE"],
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
