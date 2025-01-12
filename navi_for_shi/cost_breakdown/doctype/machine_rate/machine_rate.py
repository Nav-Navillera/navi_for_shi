# Copyright (c) 2025, Navi and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class MachineRate(Document):
    def before_save(self):
        # Sort the child table by update_date in descending order
        if self.table_data:
            latest_entry = max(self.table_data, key=lambda x: x.update_date)
            
            # Update the parent fields with the latest data from child table
            self.update_date = latest_entry.update_date
            self.full_cost = latest_entry.full_cost
            self.cash_cost = latest_entry.cash_cost
