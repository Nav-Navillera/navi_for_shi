// Make sure we have a dictionary to add our custom settings
const map_settings = frappe.provide("frappe.utils.map_defaults");

// Center and zoomlevel can be copied from the URL of
// the map view at openstreetmap.org.

// New default location (middle of germany).
map_settings.center = [-6.307923, 107.172089];
// new zoomlevel: see the whole country, not just a single city
map_settings.zoom = 4;

