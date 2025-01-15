// Copyright (c) 2025, Navi and contributors
// For license information, please see license.txt

frappe.ui.form.on('Machine Rate', {
    // On refresh or load of the form
    refresh: function (frm) {
        frm.trigger('update_parent_fields');
    },

    // Trigger before saving the form
    before_save: function (frm) {
        frm.trigger('update_parent_fields');
    },

    update_parent_fields: function (frm) {
        if (frm.doc.table_data && frm.doc.table_data.length > 0) {
            // Sort child table by update_date descending
            const sorted_data = frm.doc.table_data
                .filter(row => row.update_date)
                .sort((a, b) => new Date(b.update_date) - new Date(a.update_date));

            // Get the most recent entry
            const latest_entry = sorted_data[0];
            
            // Update parent fields
            frm.set_value('update_date', latest_entry.update_date);
            frm.set_value('full_cost', latest_entry.full_cost);
            frm.set_value('cash_cost', latest_entry.cash_cost);
            frm.refresh_field('update_date');
            frm.refresh_field('full_cost');
            frm.refresh_field('cash_cost');
        }
    }
});

frappe.ui.form.on('Machine Rate History', {
    // triggering update realtime when value updated

    refresh: function (frm) {
        frm.trigger('update_parent_fields');
    },

    update_date: function (frm) {
        frm.trigger('update_parent_fields'); 
        console.log("date")
    },

    full_cost: function (frm) {
        frm.trigger('update_parent_fields'); 
    },

    cash_cost: function (frm) {
        frm.trigger('update_parent_fields'); 
    },

    table_data_remove: function (frm) {
        frm.trigger('update_parent_fields');
    }
});
