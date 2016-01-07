$(function() {

  $("#etablParRegion").on("click", function() {
    $.getJSON("/controller/etablissementParRegion", function(data) {
      cleanChart("#etablParRegion");
      generationGraphe(data);
    });
  });

  $("#etablParAcademie").on("click", function() {
    $.getJSON("/controller/etablissementParAcademie", function(data) {
      cleanChart("#etablParAcademie");
      generationGraphe(data);
    });
  });

  $.getJSON("/controller/region", function(data) {
    loadRegionList(data);
  });

  $("#statutParRegion").on("click", function() {
    cleanChart("#statutParRegion");
    $.ajax({
      url: "/controller/statutParRegion",
      dataType: 'json',
      data: {
        region: $("#regionStats").val()
      },
      success: function(data) {
        generationGraphe(data);
      }
    });

  });

  $("#regionStats").on("change", function() {
    if ($("#statutParRegion").attr("active")) {
      cleanChart("#statutParRegion");
      $.ajax({
        url: "/controller/statutParRegion",
        dataType: 'json',
        data: {
          region: $("#regionStats").val()
        },
        success: function(data) {
          generationGraphe(data);
        }
      });
    }
  });

  $('a[href="#panel-recherche"]').on("click", function() {
    $(".chart").hide();
  });

  $('a[href="#panel-stats"]').on("click", function() {
    $(".chart").show();
  });

});

function loadRegionList(data) {
  $('#regionStats option').remove();
  $.each(data, function(key, val) {
    $('#regionStats').append('<option value="' + val.name + '">' + val.name + '</option>');
  });
}

function cleanChart(buttonId) {
  var statsButtons = $(".stats-button");
  statsButtons.attr("active", false).removeClass("btn-primary").addClass("btn-default");
  $(buttonId).attr("active", true).removeClass("btn-default").addClass("btn-primary");
  $(".chart").children().remove();

  if ($("#statutParRegion").attr("active") === "true") {
    $("#regionStats").attr("disabled", false);
  } else {
    $("#regionStats").attr("disabled", true);
  }
}

function generationGraphe(data) {

  var width = $("#panel-stats").width(),
    barHeight = 15;

  var x = d3.scale.linear()
    .range([0, width]);

  var chart = d3.select(".chart")
    .attr("width", width);

  x.domain([0, d3.max(data, function(item) {
    return item.value;
  })]);
  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(0," + i * barHeight + ")";
    });

  bar.append("rect")
    .attr("width", function(d) {
      return x(d.value) * 0.8;
    })
    .attr("height", barHeight - 1);

  bar.append("text")
    .attr("x", function(d) {
      return x(d.value) * 0.8 + 5;
    })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) {
      return `${d.key} (${d.value})`;
    });
}
