import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createSchema("support");
    pgm.sql(`comment on schema support is e'@graphql({"inflect_names": true, "max_rows": 100, "totalCount": {"enabled": true}})'`);
    pgm.grantOnSchemas({ schemas: ["support"], roles: "fi_api_user", privileges: "USAGE" });
    pgm.sql("alter role fi_api_user set search_path to users, organizations, platform_analytics, files, support");

    pgm.createType({ schema: "support", name: "ticket_status" }, ["complete", "in_progress", "open"]);
    pgm.createTable({ schema: "support", name: "tickets" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        user_id: {
            type: "uuid", notNull: true, references: { schema: "users", name: "users" },
            onUpdate: "SET NULL", onDelete: "SET NULL"
        },
        title: { type: "text", notNull: true, default: "none", check: "length(title) < 100" },
        description: { type: "text", notNull: true, default: "none", check: "length(description) < 500" },
        status: { type: "support.ticket_status", notNull: true, default: "open" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
    });

    pgm.createTable({ schema: "support", name: "ticket_messages" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        user_id: {
            type: "uuid", notNull: true, references: { schema: "users", name: "users" },
            onUpdate: "SET NULL", onDelete: "SET NULL"
        },
        message: { type: "text", notNull: true, default: "none", check: "length(message) < 500" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
    });

    pgm.createTable({ schema: "support", name: "package_upgrade_requests" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        assigned_user_id: {
            type: "uuid", notNull: true, references: { schema: "users", name: "users" },
            onUpdate: "CASCADE", onDelete: "CASCADE"
        },
        requested_package: { type: "text", notNull: true, default: "none" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
    });
    pgm.revokeOnTables({
        tables: [
            { schema: "support", name: "tickets" },
            { schema: "support", name: "ticket_messages" },
            { schema: "support", name: "package_upgrade_requests" }
        ],
        roles: { name: "fi_api_user" }, privileges: "ALL",
    });
    pgm.grantOnTables({
        tables: [
            { schema: "support", name: "tickets" },
            { schema: "support", name: "ticket_messages" },
            { schema: "support", name: "package_upgrade_requests" }
        ],
        roles: { name: "fi_api_user" },
        privileges: [
            "SELECT",
            "INSERT",
            "UPDATE",
            "DELETE"
        ],
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropSchema("support", { cascade: true });
    pgm.sql("alter role fi_api_user set search_path to users, organizations, platform_analytics, files");
}
