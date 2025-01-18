// Copyright (c) 2025, Navi and contributors
// For license information, please see license.txt

frappe.ui.form.on('Cost Breakdown Sheet', {
    refresh: function (frm) {
        frm.trigger('update_all_table_totals');
        // Contoh penggunaan fungsi untuk mengatur kelas kolom
        // Ubah kolom 'column_break_bxor' di section 'section_break_qjtm' menjadi 'col-sm-8'
        frm.trigger('column_break_mapping');
        frm.events.num2txt(frm, 'grand_total_text', frm.doc.grand_total);
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
        frm.events.num2txt(frm, 'grand_total_text', frm.doc.grand_total);
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
    },

    column_break_mapping: function(frm) {
        // Fungsi untuk mengubah kelas kolom
        function setColumnClass(sectionName, columnFieldName, newGridClass) {
            // Validasi newGridClass agar sesuai dengan format 'col-sm-{1-12}'
            if (!/^col-sm-(1[0-2]|[1-9])$/.test(newGridClass)) {
                return;
            }

            // Temukan elemen section berdasarkan data-fieldname
            const section = frm.wrapper.querySelector(`[data-fieldname="${sectionName}"]`);
            if (!section) {
                return;
            }

            // Temukan elemen kolom di dalam section berdasarkan data-fieldname
            const column = section.querySelector(`[data-fieldname="${columnFieldName}"]`);
            if (!column) {
                return;
            }

            // Hapus semua kelas grid sebelumnya (col-sm-*)
            column.className = column.className.replace(/col-sm-\d+/g, '').trim();

            // Tambahkan kelas grid baru
            column.classList.add(newGridClass);
       };

        const map_column_break = {
            sb_material_u: {
                cb_material_1: 'col-sm-9',
                cb_material_2: 'col-sm-3',
            },
            sb_consumable_u: {
                cb_consumable_1: 'col-sm-9',
                cb_consumable_2: 'col-sm-3',
            },
            sb_process_u: {
                cb_process_1: 'col-sm-6',
                cb_process_2: 'col-sm-3',
                cb_process_3: 'col-sm-3',
            },
            sb_depreciation_u: {
                cb_depreciation_1: 'col-sm-9',
                cb_depreciation_2: 'col-sm-3',
            },
            sb_total_3: {
                cb_total_3_1: 'col-sm-9',
                cb_total_3_2: 'col-sm-3',
            },
        };

        for (const [sectionName, columns] of Object.entries(map_column_break)) {
            for (const [columnFieldName, gridClass] of Object.entries(columns)) {
                setColumnClass(sectionName, columnFieldName, gridClass);
            }
        };
        
    },

    num2txt: function(frm, target, amount) {
        // Hanya tampilkan teks bilangan terbilang saat form dalam mode read-only
        if (!frm.is_new() && amount) {
            const angkaDasar = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan"];
            const tingkat = ["", "Ribu", "Juta", "Miliar", "Triliun"];

            // Fungsi untuk mengubah angka tiga digit ke kata
            function tigaDigitToKata(angka) {
                let hasil = "";
                const ratusan = Math.floor(angka / 100);
                const sisa = angka % 100;
                const puluhan = Math.floor(sisa / 10);
                const satuan = sisa % 10;

                if (ratusan > 0) {
                    hasil += (ratusan === 1 ? "Seratus" : angkaDasar[ratusan] + " Ratus") + " ";
                }

                if (puluhan > 1) {
                    hasil += angkaDasar[puluhan] + " Puluh ";
                    if (satuan > 0) hasil += angkaDasar[satuan] + " ";
                } else if (puluhan === 1) {
                    hasil += (satuan === 0 ? "Sepuluh" : satuan === 1 ? "Sebelas" : angkaDasar[satuan] + " Belas") + " ";
                } else if (satuan > 0) {
                    hasil += angkaDasar[satuan] + " ";
                }

                return hasil.trim();
            }

            // Fungsi utama untuk angka sebelum koma
            function angkaUtamaToKata(angka) {
                if (angka === 0) return "Nol";

                let hasil = "";
                let tingkatIndex = 0;

                while (angka > 0) {
                    const tigaDigit = angka % 1000;
                    if (tigaDigit > 0) {
                        const kata = tigaDigitToKata(tigaDigit);
                        hasil = kata + (tingkat[tingkatIndex] ? " " + tingkat[tingkatIndex] : "") + " " + hasil;
                    }
                    angka = Math.floor(angka / 1000);
                    tingkatIndex++;
                }

                return hasil.trim();
            }

            // Pisahkan angka sebelum dan sesudah koma
            const [angkaUtama, angkaDesimal] = amount.toString().split(".");

            let hasilTerbilang = angkaUtamaToKata(parseInt(angkaUtama, 10));

            // Tangani angka desimal
            if (angkaDesimal) {
                let desimalKata = "";
                for (const digit of angkaDesimal) {
                    // Konversi digit ke angka (termasuk nol)
                    if (digit == '0') {
                        desimalKata += "Nol ";
                    }
                    desimalKata += angkaDasar[digit] + " ";
                }
                hasilTerbilang += " Koma " + desimalKata.trim();
            }

            // Update kolom kosong (bilangan_terbilang)
            frm.set_value(target, hasilTerbilang + " Rupiah")
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


