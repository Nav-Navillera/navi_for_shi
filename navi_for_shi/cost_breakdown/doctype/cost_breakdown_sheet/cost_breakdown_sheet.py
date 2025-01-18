# Copyright (c) 2025, Navi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CostBreakdownSheet(Document):

    def before_insert(self):
        self.doc_number = None

    def after_insert(self):
        # Format nama dokumen
        self.doc_number = self.generate_document_name(str(self.name))
        self.save()

    def before_save(self):
        # List of child tables and their corresponding total fields
        tables = {
            "table_material": "total_material_cost",
            "table_consumable": "total_consumable_cost",
            "table_process": "total_process_cost",
            "table_depreciation": "total_depreciation_cost"
        }

        # Update totals for each table
        for table_name, total_field in tables.items():
            if table_name == "table_process":
                self.update_time_totals(table_name, 'total_process_time')
            self.update_table_totals(table_name, total_field)

    def update_table_totals(self, table_name, total_field):
        """
        Calculate subtotals and total cost for a specific child table.
        """
        if getattr(self, table_name, None):

            total_cost = 0
            for row in getattr(self, table_name):
                # Calculate subtotal for each row
                row.subtotal_cost = row.quantity * row.cost_per_uom
                # Add to total
                total_cost += row.subtotal_cost

            # Update total field in the parent Doctype
            setattr(self, total_field, total_cost)

    def update_time_totals(self, table_name, total_field):
        """
        Calculate total cost times for a specific child table.
        """
        if getattr(self, table_name, None):
            if table_name == "table_process":
                total_time = 0
                for row in getattr(self, table_name):
                    # Calculate subtotal for each row
                    total_time += row.quantity
                setattr(self, total_field, total_time)

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
    