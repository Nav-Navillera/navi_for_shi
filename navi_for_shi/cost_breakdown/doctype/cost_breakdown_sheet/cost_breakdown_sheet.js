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
            if (frm.doc[table_name] && frm.doc[table_name].length > 0) {
                if (table_name == 'table_process') {
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

        // total a + b + c + d
        let ttl = 
        (frm.doc.total_material_cost ?? 0) +
        (frm.doc.total_consumable_cost ?? 0) +
        (frm.doc.total_process_cost ?? 0) +
        (frm.doc.total_depreciation_cost ?? 0);    
        frm.set_value('total_1', ttl);

        // Overhead (persentase dari total)
        let overhead_ttl = (frm.doc.overhead ?? 0) * ttl / 100;
        frm.set_value('overhead_total', overhead_ttl);

        // Profit (persentase dari total)
        let profit_ttl = (frm.doc.profit ?? 0) * ttl / 100;
        frm.set_value('profit_total', profit_ttl);

        // grand total
        let grand_ttl =         
        (frm.doc.total_1 ?? 0) +
        (frm.doc.transport_and_handling ?? 0) +
        (frm.doc.overhead_total ?? 0) +
        (frm.doc.profit_total ?? 0); 
        frm.set_value('grand_total', grand_ttl);
    },

    overhead: function(frm) {
        frm.trigger('update_all_table_totals');
    },

    profit: function(frm) {
        frm.trigger('update_all_table_totals');
    },

    transport_and_handling: function(frm) {
        frm.trigger('update_all_table_totals');
    },

    update_table_totals: function (frm, { table_name, total_field }) {

        if (frm.doc[table_name]) {
            let total_cost = 0;
            frm.doc[table_name].forEach(row => {
                row.subtotal_cost = row.quantity * row.cost_per_uom;
                total_cost += row.subtotal_cost;
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

frappe.ui.form.on('CBD Material', {
    quantity: function(frm) {
        frm.trigger('update_all_table_totals');
    },

    cost_per_uom: function(frm) {
        frm.trigger('update_all_table_totals');
    },

    table_material_remove: function(frm) {
        frm.trigger('update_all_table_totals');
    }
});

frappe.ui.form.on('CBD Consumable', {
    quantity: function(frm) {
        frm.trigger('update_all_table_totals');
    },

    cost_per_uom: function(frm) {
        frm.trigger('update_all_table_totals');
    },

    table_consumable_remove: function(frm) {
        frm.trigger('update_all_table_totals');
    }
});

frappe.ui.form.on('CBD Process', {
    quantity: function(frm) {
        frm.trigger('update_all_table_totals');
    },

    cost_per_uom: function(frm) {
        frm.trigger('update_all_table_totals');
    },

    table_process_remove: function(frm) {
        frm.trigger('update_all_table_totals');
    }
});

frappe.ui.form.on('CBD Depreciation', {
    quantity: function(frm) {
        frm.trigger('update_all_table_totals');
    },

    cost_per_uom: function(frm) {
        frm.trigger('update_all_table_totals');
    },

    table_depreciation_remove: function(frm) {
        frm.trigger('update_all_table_totals');
    }
});
