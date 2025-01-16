// Copyright (c) 2025, Navi and contributors
// For license information, please see license.txt

frappe.ui.form.on('Manual Delivery Order', {
    setup: function (frm) {
        // Setup awal jika diperlukan
        update_branch_options(frm);
    },

    refresh: function (frm) {
        // Panggil fungsi untuk update branch dan address jika sudah ada nilai receiver
        if (frm.doc.receiver) {
            update_branch_options(frm);
        }
    },

    receiver: function (frm) {
        // Reset branch dan address saat receiver berubah
        frm.set_value('branch', '');
        frm.set_value('receiver_address', '');

        // Update branch options berdasarkan receiver yang baru
        if (frm.doc.receiver) {
            update_branch_options(frm);
        }
    },

    branch: function (frm) {
        // Update address saat branch berubah
        if (frm.doc.receiver && frm.doc.branch) {
            update_address(frm);
        } else {
            frm.set_value('receiver_address', '');
        }
    }
});

// Fungsi untuk mengambil opsi branch dari receiver (Customer and Vendor)
function update_branch_options(frm) {
    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: 'Customer and Vendor',
            name: frm.doc.receiver
        },
        callback: function (r) {
            if (r.message) {
                // Ambil semua address_name dari table_address
                const options = (r.message.table_address || []).map(row => row.address_name);
                frm.set_df_property('branch', 'options', [''].concat(options)); // Tambahkan opsi kosong di awal
                frm.refresh_field('branch');
            }
        }
    });
}

// Fungsi untuk mengambil address dari branch yang dipilih
function update_address(frm) {
    frappe.call({
        method: 'frappe.client.get_value',
        args: {
            doctype: 'Customer and Vendor',
            name: frm.doc.receiver,
            fieldname: 'table_address'
        },
        callback: function (r) {
            if (r.message) {
                const table_address = JSON.parse(r.message.table_address || '[]');
                console.log(r.message)
                const selected_row = table_address.find(row => row.address_name === frm.doc.branch);
                
                if (selected_row) {
                    frm.set_value('receiver_address', selected_row.address);
                } else {
                    frm.set_value('receiver_address', '');
                }
            }
        }
    });
}


