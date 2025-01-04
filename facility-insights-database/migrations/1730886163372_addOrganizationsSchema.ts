import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createSchema("organizations");
	pgm.sql(`comment on schema organizations is e'@graphql({"inflect_names": true, "max_rows": 100, "totalCount": {"enabled": true}})'`);
	pgm.grantOnSchemas({
		schemas: ["organizations"],
		roles: "fi_api_user",
		privileges: "USAGE",
	});
	pgm.sql("alter role fi_api_user set search_path to users, organizations");

	pgm.createTable(
		{ schema: "organizations", name: "organizations" },
		{
			id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
			name: { type: "text", notNull: true, default: "none", check: "length(name) < 100" },
			description: { type: "text", notNull: true, default: "none", check: "length(description) < 500" },
			disabled: { type: "boolean", notNull: true, default: false },
			created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
		}
	);

	pgm.addColumn(
		{ schema: "users", name: "preferences" },
		{
			active_organization_id: {
				type: "uuid",
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "packages" },
		{
			id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
			view: { type: "boolean", notNull: true, default: true },
			view_plus_base: { type: "boolean", notNull: true, default: false },
			view_plus_room_data: { type: "boolean", notNull: true, default: false },
			view_plus_plan_update: { type: "boolean", notNull: true, default: false },
			assessments_base: { type: "boolean", notNull: true, default: false },
			assessments_icra: { type: "boolean", notNull: true, default: false },
			assessments_pcra: { type: "boolean", notNull: true, default: false },
			assessments_condition: { type: "boolean", notNull: true, default: false },
			assessments_environment_of_care: { type: "boolean", notNull: true, default: false },
			asset_manager: { type: "boolean", notNull: true, default: false },
			vendor_database: { type: "boolean", notNull: true, default: false },
			maintenance_management_system: { type: "boolean", notNull: true, default: false },
			project_information_collaboration_system: { type: "boolean", notNull: true, default: false },
			work_order: { type: "boolean", notNull: true, default: false },
			created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
		}
	);

	pgm.addColumn(
		{ schema: "organizations", name: "organizations" },
		{
			packages_id: {
				type: "uuid",
				notNull: false,
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
				references: { schema: "organizations", name: "packages" },
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "members" },
		{
			id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
			type: { type: "text", notNull: true, default: "Guest", check: "length(type) < 100" },
			created_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			updated_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
			organization_id: {
				type: "uuid",
				notNull: true,
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				references: { schema: "organizations", name: "organizations" },
			},
			user_id: {
				type: "uuid",
				notNull: true,
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				references: { schema: "users", name: "users" },
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "regions" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 100",
			},
			state: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(state) < 100",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			organization_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "floor_plan_types" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 100",
			},
			is_enabled: { type: "boolean", notNull: true, default: false },
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			organization_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "building_types" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 100",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			organization_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "floor_levels" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 100",
			},
			index: {
				type: "integer",
				notNull: true,
				default: 0,
				check: "index < 5000",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			organization_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);
	pgm.createTable(
		{ schema: "organizations", name: "folder_templates" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 100",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			organization_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);
	pgm.createTable(
		{ schema: "organizations", name: "folder_template_folders" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 100",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			parent_folder_id: {
				type: "uuid",
				references: {
					schema: "organizations",
					name: "folder_template_folders",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			folder_template_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "folder_templates" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "user_groups" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 100",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			organization_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "user_group_enabled_regions" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			user_group_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "user_groups" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			region_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "regions" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "user_group_members" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			user_group_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "user_groups" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			member_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "members" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "buildings" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 100",
			},
			address: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(address) < 150",
			},
			latitude: { type: "double", notNull: true, default: 41.850033 },
			longitude: { type: "double", notNull: true, default: -87.6500523 },
			isArchived: { type: "boolean", notNull: true, default: false },
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			organization_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			building_type_id: {
				type: "uuid",
				references: { schema: "organizations", name: "building_types" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			region_id: {
				type: "uuid",
				references: { schema: "organizations", name: "regions" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "building_available_floor_levels" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			building_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "buildings" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			floor_level_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "floor_levels" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "building_floor_plans" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			status: {
				type: "text",
				notNull: true,
				default: "Latest",
				check: "length(status) < 100",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			building_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "buildings" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			floor_level_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "floor_levels" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			floor_plan_type_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "floor_plan_types" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "building_projects" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 100",
			},
			description: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(description) < 500",
			},
			code: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 100",
			},
			status: {
				type: "text",
				notNull: true,
				default: "In Progress",
				check: "length(status) < 100",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			building_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "buildings" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			member_id: {
				type: "uuid",
				notNull: false,
				references: { schema: "organizations", name: "members" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "building_project_collaborators" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			collaborator_type: {
				type: "text",
				notNull: true,
				default: "Viewer",
				check: "length(collaborator_type) < 100",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			member_id: {
				type: "uuid",
				notNull: false,
				references: { schema: "organizations", name: "members" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			building_project_id: {
				type: "uuid",
				notNull: false,
				references: { schema: "organizations", name: "building_projects" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "vendors" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 50",
			},
			description: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(description) < 500",
			},
			company_email: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(company_email) < 50",
			},
			company_phone_number: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(company_phone_number) < 50",
			},
			company_website: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(company_website) < 100",
			},
			type: {
				type: "text",
				notNull: true,
				default: "IT",
				check: "length(type) < 100",
			},
			address: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(address) < 100",
			},
			latitude: { type: "double", notNull: true, default: 41.850033 },
			longitude: { type: "double", notNull: true, default: -87.6500523 },
			main_contact_name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(main_contact_name) < 100",
			},
			main_contact_email: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(main_contact_email) < 100",
			},
			main_contact_phone_number: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(main_contact_phone_number) < 100",
			},
			main_contact_office_number: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(main_contact_office_number) < 100",
			},
			secondary_contact_name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(secondary_contact_name) < 100",
			},
			secondary_contact_email: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(secondary_contact_email) < 100",
			},
			secondary_contact_phone_number: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(secondary_contact_phone_number) < 100",
			},
			secondary_contact_office_number: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(secondary_contact_office_number) < 100",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			organization_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "assets" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 50",
			},
			description: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(description) < 500",
			},
			model: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(model) < 50",
			},
			manufacturer: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(manufacturer) < 50",
			},
			serial_number: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(serial_number) < 100",
			},
			barcode: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(barcode) < 100",
			},
			category: {
				type: "text",
				notNull: true,
				default: "HVAC",
				check: "length(category) < 100",
			},
			status: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(status) < 100",
			},
			floor: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(status) < 100",
			},
			room: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(status) < 100",
			},
			purchase_price: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(purchase_price) < 100",
			},
			purchase_date: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			residual_value: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(residual_value) < 100",
			},
			useful_life: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(useful_life) < 100",
			},
			placed_in_service: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			warrany_expiration: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			organization_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			building_id: {
				type: "uuid",
				references: { schema: "organizations", name: "buildings" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			parent_asset_id: {
				type: "uuid",
				references: { schema: "organizations", name: "assets" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			assigned_member_id: {
				type: "uuid",
				references: { schema: "organizations", name: "members" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			assigned_vendor_id: {
				type: "uuid",
				references: { schema: "organizations", name: "vendors" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "asset_updates" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			message: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(message) < 500",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			asset_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "assets" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			user_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "users", name: "users" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "work_orders" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			work_order_number: {
				type: "integer",
				notNull: true,
				check: "work_order_number > 0",
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 50",
			},
			description: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(description) < 500",
			},
			category: {
				type: "text",
				notNull: true,
				default: "Preventative",
				check: "length(category) < 100",
			},
			priority: {
				type: "text",
				notNull: true,
				default: "Low",
				check: "length(priority) < 100",
			},
			status: {
				type: "text",
				notNull: true,
				default: "Open",
				check: "length(status) < 100",
			},
			floor: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(floor) < 100",
			},
			room: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(room) < 100",
			},
			start_date: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			due_date: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			complete_date: { type: "timestamp" },
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			organization_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			building_id: {
				type: "uuid",
				references: { schema: "organizations", name: "buildings" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			asset_id: {
				type: "uuid",
				references: { schema: "organizations", name: "assets" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			assigned_member_id: {
				type: "uuid",
				references: { schema: "organizations", name: "members" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "work_order_updates" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			message: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(message) < 500",
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			work_order_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "work_orders" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			user_id: {
				type: "uuid",
				references: { schema: "users", name: "users" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "scheduled_maintenance_triggers" },
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: pgm.func("gen_random_uuid()"),
			},
			name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(name) < 50",
			},
			cycle_type: {
				type: "text",
				notNull: true,
				default: "On Day",
				check: "length(cycle_type) < 100",
			},
			cycle_amount: { type: "integer", notNull: true, default: 0 },
			repeat_type: {
				type: "text",
				notNull: true,
				default: "Once",
				check: "length(repeat_type) < 100",
			},
			work_order_name: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(work_order_name) < 50",
			},
			work_order_description: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(work_order_description) < 500",
			},
			work_order_category: {
				type: "text",
				notNull: true,
				default: "Preventative",
				check: "length(work_order_category) < 100",
			},
			work_order_priority: {
				type: "text",
				notNull: true,
				default: "Low",
				check: "length(work_order_priority) < 100",
			},
			work_order_status: {
				type: "text",
				notNull: true,
				default: "Open",
				check: "length(work_order_status) < 100",
			},
			work_order_floor: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(work_order_floor) < 100",
			},
			work_order_room: {
				type: "text",
				notNull: true,
				default: "none",
				check: "length(work_order_room) < 100",
			},
			work_order_due_type: {
				type: "text",
				notNull: true,
				default: "Day",
				check: "length(work_order_due_type) < 100",
			},
			work_order_due_amount: {
				type: "integer",
				notNull: true,
				default: 0,
				check: "work_order_due_amount > 0",
			},
			start_date: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			end_date: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("now()"),
			},
			organization_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "organizations" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			work_order_asset_id: {
				type: "uuid",
				references: { schema: "organizations", name: "assets" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			work_order_assigned_member_id: {
				type: "uuid",
				references: { schema: "organizations", name: "members" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			work_order_building_id: {
				type: "uuid",
				references: { schema: "organizations", name: "buildings" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

	pgm.addColumn(
		{ schema: "organizations", name: "work_orders" },
		{
			trigger_id: {
				type: "uuid",
				references: {
					schema: "organizations",
					name: "scheduled_maintenance_triggers",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		}
	);

	pgm.createTable(
		{ schema: "organizations", name: "building_data" },
		{
			id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
			site: { type: "text", notNull: true, default: "none", check: "length(site) < 50" },
			building_name: { type: "text", notNull: true, default: "none", check: "length(building) < 50" },
			floor: { type: "text", notNull: true, default: "none", check: "length(floor) < 50" },
			room_number: { type: "text", notNull: true, default: "none", check: "length(room_number) < 50" },
			room_name_a: { type: "text", notNull: true, default: "none", check: "length(room_name_a) < 50" },
			room_name_b: { type: "text", notNull: true, default: "none", check: "length(room_name_b) < 50" },
			room_name_c: { type: "text", notNull: true, default: "none", check: "length(room_name_c) < 50" },
			cost_center_number: { type: "text", notNull: true, default: "none", check: "length(cost_center_number) < 50" },
			cost_center_description: { type: "text", notNull: true, default: "none", check: "length(cost_center_description) < 50" },
			area_gross: { type: "text", notNull: true, default: "none", check: "length(area_gross) < 50" },
			area_net: { type: "text", notNull: true, default: "none", check: "length(area_net) < 50" },
			department_name: { type: "text", notNull: true, default: "none", check: "length(department_name) < 50" },
			department_number: { type: "text", notNull: true, default: "none", check: "length(department_number) < 50" },
			room_type: { type: "text", notNull: true, default: "none", check: "length(room_type) < 50" },
			suite: { type: "text", notNull: true, default: "none", check: "length(suite) < 50" },
			date_of_construction: { type: "text", notNull: true, default: "none", check: "length(date_of_construction) < 50" },
			date_of_renovation: { type: "text", notNull: true, default: "none", check: "length(date_of_renovation) < 50" },
			icra_level: { type: "text", notNull: true, default: "none", check: "length(icra_level) < 50" },
			air_pressure: { type: "text", notNull: true, default: "none", check: "length(air_pressure) < 50" },
			air_exchanges: { type: "text", notNull: true, default: "none", check: "length(air_exchanges) < 50" },
			air_handler_unit_zone: { type: "text", notNull: true, default: "none", check: "length(air_handler_unit_zone) < 50" },
			exhaust_fan_zone: { type: "text", notNull: true, default: "none", check: "length(exhaust_fan_zone) < 50" },
			sprinkled_zone: { type: "text", notNull: true, default: "none", check: "length(sprinkled_zone) < 50" },
			med_gas_zone: { type: "text", notNull: true, default: "none", check: "length(med_gas_zone) < 50" },
			smoke_compartment: { type: "text", notNull: true, default: "none", check: "length(smoke_compartment) < 50" },
			object_id: { type: "integer", notNull: true, default: 0 },
			floor_plan_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "building_floor_plans" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			building_id: {
				type: "uuid",
				notNull: true,
				references: { schema: "organizations", name: "buildings" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		}
	);

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
		{ schema: "organizations", name: "member_requests" },
		{
			id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
			first_name: { type: "text", notNull: true, default: "none", check: "length(first_name) < 100" },
			last_name: { type: "text", notNull: true, default: "none", check: "length(last_name) < 100" },
			email: { type: "text", notNull: true, check: "length(email) < 100", unique: true },
			company: { type: "text", notNull: true, default: "none", check: "length(company) < 100" },
			phone_number: { type: "text", notNull: true, default: "none", check: "length(phone_number) < 50" },
			type: { type: "text", notNull: true, default: "Guest", check: "length(type) < 100" },
			organization_id: {
				type: "uuid",
				notNull: true,
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				references: { schema: "organizations", name: "organizations" },
			},
		}
	);

	pgm.revokeOnTables({
		tables: [
			{ schema: "organizations", name: "organizations" },
			{ schema: "organizations", name: "packages" },
			{ schema: "organizations", name: "members" },
			{ schema: "organizations", name: "regions" },
			{ schema: "organizations", name: "floor_plan_types" },
			{ schema: "organizations", name: "building_types" },
			{ schema: "organizations", name: "floor_levels" },
			{ schema: "organizations", name: "user_groups" },
			{ schema: "organizations", name: "user_group_enabled_regions" },
			{ schema: "organizations", name: "user_group_members" },
			{ schema: "organizations", name: "buildings" },
			{ schema: "organizations", name: "building_available_floor_levels" },
			{ schema: "organizations", name: "building_floor_plans" },
			{ schema: "organizations", name: "building_projects" },
			{ schema: "organizations", name: "building_project_collaborators" },
			{ schema: "organizations", name: "vendors" },
			{ schema: "organizations", name: "assets" },
			{ schema: "organizations", name: "asset_updates" },
			{ schema: "organizations", name: "work_orders" },
			{ schema: "organizations", name: "work_order_updates" },
			{ schema: "organizations", name: "scheduled_maintenance_triggers" },
			{ schema: "organizations", name: "folder_templates" },
			{ schema: "organizations", name: "folder_template_folders" },
			{ schema: "organizations", name: "building_data" },
			{ schema: "organizations", name: "floor_plan_updates" },
			{ schema: "organizations", name: "member_requests" },
		],
		roles: { name: "fi_api_user" },
		privileges: "ALL",
	});
	pgm.grantOnTables({
		tables: [
			{ schema: "organizations", name: "organizations" },
			{ schema: "organizations", name: "packages" },
			{ schema: "organizations", name: "members" },
			{ schema: "organizations", name: "regions" },
			{ schema: "organizations", name: "floor_plan_types" },
			{ schema: "organizations", name: "building_types" },
			{ schema: "organizations", name: "floor_levels" },
			{ schema: "organizations", name: "user_groups" },
			{ schema: "organizations", name: "user_group_enabled_regions" },
			{ schema: "organizations", name: "user_group_members" },
			{ schema: "organizations", name: "buildings" },
			{ schema: "organizations", name: "building_available_floor_levels" },
			{ schema: "organizations", name: "building_floor_plans" },
			{ schema: "organizations", name: "building_projects" },
			{ schema: "organizations", name: "building_project_collaborators" },
			{ schema: "organizations", name: "vendors" },
			{ schema: "organizations", name: "assets" },
			{ schema: "organizations", name: "asset_updates" },
			{ schema: "organizations", name: "work_orders" },
			{ schema: "organizations", name: "work_order_updates" },
			{ schema: "organizations", name: "scheduled_maintenance_triggers" },
			{ schema: "organizations", name: "folder_templates" },
			{ schema: "organizations", name: "folder_template_folders" },
			{ schema: "organizations", name: "building_data" },
			{ schema: "organizations", name: "floor_plan_updates" },
			{ schema: "organizations", name: "member_requests" },
		],
		roles: { name: "fi_api_user" },
		privileges: ["SELECT", "INSERT", "UPDATE", "DELETE"],
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropSchema("organizations", { cascade: true });
	pgm.sql("alter role fi_api_user set search_path to users");
}
