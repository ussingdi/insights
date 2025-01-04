import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createSchema("files");
    pgm.sql(`comment on schema files is e'@graphql({"inflect_names": true, "max_rows": 100, "totalCount": {"enabled": true}})'`);
    pgm.grantOnSchemas({ schemas: ["files"], roles: "fi_api_user", privileges: "USAGE" });
    pgm.sql("alter role fi_api_user set search_path to users, organizations, files");

    pgm.createTable({ schema: "files", name: "organization_images" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
        name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
    });
    pgm.addColumn({ schema: "organizations", name: "organizations" }, {
        image_id: {
            type: "uuid", notNull: false,
            references: { schema: "files", name: "organization_images" }, onUpdate: "CASCADE", onDelete: "SET NULL",
        }
    });

    pgm.createTable({ schema: "files", name: "user_images" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
        name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
    });
    pgm.addColumn({ schema: "users", name: "users" }, {
        image_id: {
            type: "uuid", notNull: false,
            references: { schema: "files", name: "user_images" }, onUpdate: "CASCADE", onDelete: "SET NULL",
        }
    });

    pgm.createTable({ schema: "files", name: "building_images" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
        name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
    });
    pgm.addColumn({ schema: "organizations", name: "buildings" }, {
        image_id: {
            type: "uuid", notNull: false,
            references: { schema: "files", name: "building_images" }, onUpdate: "CASCADE", onDelete: "SET NULL",
        }
    });


    pgm.createTable({ schema: "files", name: "floor_plan_drawings" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
        name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
        aps_status: { type: "text", notNull: true, default: "Not Uploaded", check: "length(aps_status) < 100" },
        aps_urn: { type: "text", notNull: true, default: "none", check: "length(aps_urn) < 200" },
        drawing_references: { type: "uuid[]", notNull: true, default: "{}" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
    });
    pgm.addColumn({ schema: "organizations", name: "building_floor_plans" }, {
        floor_plan_drawing_id: {
            type: "uuid", notNull: false,
            references: { schema: "files", name: "floor_plan_drawings" }, onUpdate: "CASCADE", onDelete: "SET NULL",
        }
    });

    pgm.createTable({ schema: "files", name: "floor_plan_pdfs" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
        name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
    });
    pgm.addColumn({ schema: "organizations", name: "building_floor_plans" }, {
        floor_plan_pdf_id: {
            type: "uuid", notNull: false,
            references: { schema: "files", name: "floor_plan_pdfs" }, onUpdate: "CASCADE", onDelete: "SET NULL",
        }
    });

    pgm.createType({ schema: "files", name: "project_file_type" }, ["folder", "file"]);
    pgm.createTable({ schema: "files", name: "project_files" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
        name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
        type: { type: "files.project_file_type" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        project_id: {
            type: "uuid", notNull: false, references: { schema: "organizations", name: "building_projects" },
            onUpdate: "CASCADE", onDelete: "SET NULL"
        },
        parent_folder_id: {
            type: "uuid", references: { schema: "files", name: "project_files" },
            onUpdate: "CASCADE", onDelete: "SET NULL"
        },
    });

    pgm.createTable({ schema: "files", name: "asset_images" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
        name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
    });

    pgm.addColumn({ schema: "organizations", name: "assets" }, {
        image_id: {
            type: "uuid", notNull: false,
            references: { schema: "files", name: "asset_images" }, onUpdate: "CASCADE", onDelete: "SET NULL",
        }
    });

    pgm.createTable({ schema: "files", name: "asset_attachments" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
        name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        asset_id: {
            type: "uuid", notNull: false, references: { schema: "organizations", name: "assets" },
            onUpdate: "CASCADE", onDelete: "SET NULL"
        },
    });

    pgm.createTable({ schema: "files", name: "asset_update_attachments" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
        name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        asset_update_id: {
            type: "uuid", notNull: false,
            references: { schema: "organizations", name: "asset_updates" }, onUpdate: "CASCADE", onDelete: "SET NULL",
        }
    });

    pgm.createTable({ schema: "files", name: "work_order_update_attachments" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
        name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        work_order_update_id: {
            type: "uuid", notNull: false,
            references: { schema: "organizations", name: "work_order_updates" }, onUpdate: "CASCADE", onDelete: "SET NULL",
        }
    });

    pgm.createTable({ schema: "files", name: "floor_plan_update_attachments" }, {
        id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
        path: { type: "text", notNull: true, default: "temp/", check: "length(path) < 300" },
        name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
        created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
        floor_plan_update_id: {
            type: "uuid", notNull: false,
            references: { schema: "organizations", name: "floor_plan_updates" }, onUpdate: "CASCADE", onDelete: "SET NULL",
        }
    });

    pgm.revokeOnTables({
        tables: [
            { schema: "files", name: "organization_images" },
            { schema: "files", name: "user_images" },
            { schema: "files", name: "building_images" },
            { schema: "files", name: "floor_plan_drawings" },
            { schema: "files", name: "floor_plan_pdfs" },
            { schema: "files", name: "project_files" },
            { schema: "files", name: "asset_attachments" },
            { schema: "files", name: "asset_images" },
            { schema: "files", name: "asset_update_attachments" },
            { schema: "files", name: "work_order_update_attachments" },
            { schema: "files", name: "floor_plan_update_attachments" }

        ],
        roles: { name: "fi_api_user" }, privileges: "ALL",
    });
    pgm.grantOnTables({
        tables: [
            { schema: "files", name: "organization_images" },
            { schema: "files", name: "user_images" },
            { schema: "files", name: "building_images" },
            { schema: "files", name: "floor_plan_drawings" },
            { schema: "files", name: "floor_plan_pdfs" },
            { schema: "files", name: "project_files" },
            { schema: "files", name: "asset_attachments" },
            { schema: "files", name: "asset_images" },
            { schema: "files", name: "asset_update_attachments" },
            { schema: "files", name: "work_order_update_attachments" },
            { schema: "files", name: "floor_plan_update_attachments" }
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
    pgm.dropSchema("files", { cascade: true });
    pgm.sql("alter role fi_api_user set search_path to users, organizations");
}
