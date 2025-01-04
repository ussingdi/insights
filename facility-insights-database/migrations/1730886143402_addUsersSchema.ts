import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createSchema("users");
	pgm.grantOnSchemas({ schemas: ["users", "graphql"], roles: "fi_api_user", privileges: "USAGE" });
	pgm.sql("alter role fi_api_user set search_path to users");
	pgm.sql(`comment on schema users is e'@graphql({"inflect_names": true, "max_rows": 100, "totalCount": {"enabled": true}})'`);

	pgm.createTable(
		{ schema: "users", name: "users" },
		{
			id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
			first_name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(first_name) < 100",
			},
			last_name: { type: "text", notNull: true, default: "none", check: "length(last_name) < 100" },
			email: { type: "text", notNull: true, check: "length(email) < 100", unique: true },
			company: { type: "text", notNull: true, default: "none", check: "length(company) < 100" },
			phone_number: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(phone_number) < 50",
			},
			password_hash: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(password_hash) < 100",
			},
			disabled: { type: "boolean", notNull: true, default: false },
			created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
		}
	);

	pgm.createTable(
		{ schema: "users", name: "preferences" },
		{
			id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
			dark_theme: { type: "boolean", notNull: true, default: true },
			pinned_buildings: { type: "uuid[]", notNull: true, default: "{}" },
			pinned_projects: { type: "uuid[]", notNull: true, default: "{}" },
			created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
		}
	);

	pgm.addColumn(
		{ schema: "users", name: "users" },
		{
			preferences_id: {
				type: "uuid",
				references: { schema: "users", name: "preferences" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		}
	);

	pgm.createFunction(
		{ schema: "users", name: "create_preferences_on_user_insert" },
		[],
		{
			language: "plpgsql",
			behavior: "VOLATILE",
			replace: true,
			returns: "trigger",
			parallel: "UNSAFE",
		},
		`   declare
  	            pref_id uuid;
            begin
	            insert into users.preferences (dark_theme) VALUES (false) RETURNING id into pref_id;
	            update users.users set preferences_id = (pref_id)  where id=new.id;
                return new;
            end`
	);

	pgm.createTrigger({ schema: "users", name: "users" }, "create_preferences_on_user_insert_trigger", {
		operation: "INSERT",
		function: { schema: "users", name: "create_preferences_on_user_insert" },
		level: "ROW",
		when: "AFTER",
	});

	pgm.createTable(
		{ schema: "users", name: "reset_password_verification_codes" },
		{
			id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
			is_used: { type: "boolean", notNull: true, default: true },
			created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			user_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "users", name: "users" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "users", name: "refresh_tokens" },
		{
			id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
			is_valid: { type: "boolean", notNull: true, default: true },
			created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			user_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "users", name: "users" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.revokeOnTables({
		tables: [
			{ schema: "users", name: "users" },
			{ schema: "users", name: "preferences" },
			{ schema: "users", name: "reset_password_verification_codes" },
			{ schema: "users", name: "refresh_tokens" },
		],
		roles: { name: "fi_api_user" },
		privileges: "ALL",
	});
	pgm.grantOnTables({
		tables: [
			{ schema: "users", name: "users" },
			{ schema: "users", name: "preferences" },
			{ schema: "users", name: "reset_password_verification_codes" },
			{ schema: "users", name: "refresh_tokens" },
		],
		roles: { name: "fi_api_user" },
		privileges: ["SELECT", "INSERT", "UPDATE", "DELETE"],
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropSchema("users", { cascade: true });
	pgm.sql("alter role fi_api_user set search_path to public");
}
