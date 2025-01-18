frappe.listview_settings['Manual Delivery Order'] = {
    hide_name_column: true,  // Menghilangkan kolom name
    hide_name_filter: true,  // Menghilangkan filter name
    onload(listview) {
        // Menambahkan style custom langsung di file JS
        var styles = `
            .list-row .level-left { 
                flex: 4;
                min-width: 90% !important;
            }
        `;
        var styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Menambahkan style khusus pada elemen dengan class tertentu
        var elements = document.getElementsByClassName('level-left list-header-subject');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.minWidth = '90%';
        }

        // Periksa apakah pengguna bukan pengguna mobile
        if (window.innerWidth > 768) { // 768px adalah breakpoint umum untuk mobile
            // Menyembunyikan sidebar
            var sidebar = document.getElementsByClassName('col-lg-2 layout-side-section');
            for (var i = 0; i < sidebar.length; i++) {
                sidebar[i].style.display = 'none';
            }
        }
    },
};
