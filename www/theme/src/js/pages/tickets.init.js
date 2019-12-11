/*
Template Name: Highdmin - Responsive Bootstrap 4 Admin & Dashboard
Author: CoderThemes
File: Tickets 
*/

$(document).ready(function () {
    $('#datatable').DataTable({
        "language": {
            "paginate": {
                "previous": "<i class='mdi mdi-chevron-left'>",
                "next": "<i class='mdi mdi-chevron-right'>"
            }
        },
        "drawCallback": function () {
            $('.dataTables_paginate > .pagination').addClass('pagination-rounded');
        }
    });
});