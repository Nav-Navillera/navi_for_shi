// Copyright (c) 2025, Navi and contributors
// For license information, please see license.txt

frappe.ui.form.on('Cost Breakdown Sheet', {
    refresh: function (frm) {
        frm.trigger('update_all_table_totals');
    },
    before_save: function (frm) {
        frm.trigger('update_all_table_totals');
    },

    update_all_table_totals: function (frm) {
        const tables = {
            table_material: 'total_material_cost',
            table_consumable: 'total_consumable_cost',
            table_process: 'total_process_cost',
            table_depreciation: 'total_depreciation_cost'
        };

        Object.keys(tables).forEach(table_name => {
            console.log(`Checking table: ${table_name}`, frm.doc[table_name]);
            if (frm.doc[table_name] && frm.doc[table_name].length > 0) {
                console.log(`Processing table: ${table_name}`);
                if (table_name == 'table_process') {
                    console.log('table process pass');
                    frm.events.update_time_totals(frm, {
                        table_name: table_name,
                        total_field: 'total_process_time'
                    });                
                }
                frm.events.update_table_totals(frm, {
                    table_name: table_name,
                    total_field: tables[table_name]
                });                
            }
        });
    },

    update_table_totals: function (frm, { table_name, total_field }) {

        if (frm.doc[table_name]) {
            let total_cost = 0;
            frm.doc[table_name].forEach(row => {
                row.subtotal_cost = row.quantity * row.cost_per_uom;
                total_cost += row.subtotal_cost;
                console.log(`Row quantity: ${row.quantity}, cost per uom: ${row.cost_per_uom}`);
            });

            frm.set_value(total_field, total_cost);
            frm.refresh_field(table_name);
            frm.refresh_field(total_field);
        }
    },

    update_time_totals: function (frm, { table_name, total_field }) {

        if (frm.doc[table_name]) {
            let total_time = 0;
            frm.doc[table_name].forEach(row => {
                total_time += row.quantity;
            });

            frm.set_value(total_field, total_time);
            frm.refresh_field(total_field);
        }
    }
});
