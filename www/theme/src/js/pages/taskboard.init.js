/**
* Theme: Highdmin - Responsive Bootstrap 4 Admin & Dashboard
* Author: Coderthemes
* file: Tooltips
*/

$(document).ready(function () {

  $("#upcoming, #inprogress, #completed").sortable({
      connectWith: ".taskList",
      placeholder: 'task-placeholder',
      forcePlaceholderSize: true,
      update: function (event, ui) {

          var todo = $("#todo").sortable("toArray");
          var inprogress = $("#inprogress").sortable("toArray");
          var completed = $("#completed").sortable("toArray");
      }
  }).disableSelection();

});
