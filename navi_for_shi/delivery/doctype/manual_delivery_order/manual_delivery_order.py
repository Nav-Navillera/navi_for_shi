# Copyright (c) 2025, Navi and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import re

class ManualDeliveryOrder(Document):
    def before_insert(self):
        self.dom_number = None

    def after_insert(self):
        # Format nama dokumen
        self.dom_number = self.generate_document_name(str(self.name))
        self.save()

    def before_save(self):
        self.generate_do_item_field()

    def generate_document_name(self, doc_name):
        """
        generate dom_number format visual cetak:
        - Replace '-' dengan '/' untuk semua dokumen non-revisi.
        - Mempertahankan revisi (-##) untuk dokumen revisi.
        """
        
        # Memastikan doc_name adalah string
        if not isinstance(doc_name, str):
            raise TypeError(f"Expected string for doc_name, got {type(doc_name).__name__}")

        # Cari posisi tanda "-" terakhir
        last_hyphen_index = doc_name.rfind("-")

        # Memeriksa apakah dokumen adalah tipe revisi
        is_revision = (
            last_hyphen_index != -1
            and len(doc_name) - last_hyphen_index <= 3
            and doc_name[last_hyphen_index + 1:].isdigit()
        )

        if is_revision:
            base_name = doc_name[:last_hyphen_index]  # Nama utama
            revision = doc_name[last_hyphen_index:]  # Bagian revisi (-##)
        else:
            base_name = doc_name
            revision = ""

        # Mengganti "-" dengan "/" hanya pada bagian nama utama
        formatted_base_name = base_name.replace("-", "/")

        # Gabung kode asli dan revisi
        return f"{formatted_base_name}{revision}"
    
    def generate_do_item_field(self):
        # Membuat string field dari child table untuk query pencarian
        isi_do = ""
        jumlah_item = 0
        keterangan = ""
        item_code = ""

        for idx, row in enumerate(self.item_list):
            #keterangan = self.check_value(row.notes)
            #item_code = self.check_value(row.item_code)
            isi_do = isi_do + "#" + str(idx+1) + "  " + str(row.item_name) + "; " + str(row.quantity) + " " + str(row.uom) + "\n"
            jumlah_item = jumlah_item + 1
            
        jumlah_item = str(jumlah_item)
        jumlah_item = jumlah_item + " Item \n"

        self.creator = self.owner
        self.list_of_do = jumlah_item + isi_do

    def check_value(self, item_val):
        item_val = str(item_val)
        if item_val == "" or item_val == "None" :
            result = "-"
        else:
            result = item_val
        return result


