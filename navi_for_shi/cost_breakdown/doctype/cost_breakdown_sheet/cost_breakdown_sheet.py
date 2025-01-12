# Copyright (c) 2025, Navi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CostBreakdownSheet(Document):
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