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

    def generate_document_name(self, doc_name):
        """
        generate dom_number format visual cetak:
        - Replace '-' dengan '/' untuk semua dokumen non-revisi.
        - Mempertahankan revisi (-##) untuk dokumen revisi.
        """
        # Pastikan doc_name adalah string
        if not isinstance(doc_name, str):
            raise TypeError(f"Expected string for doc_name, got {type(doc_name).__name__}")

        # Cari posisi tanda "-" terakhir
        last_hyphen_index = doc_name.rfind("-")

        # Periksa apakah dokumen adalah tipe revisi
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

        # Ganti "-" dengan "/" hanya pada bagian nama utama
        formatted_base_name = base_name.replace("-", "/")

        # Gabungkan kembali dengan revisi (jika ada)
        return f"{formatted_base_name}{revision}"

