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
        generationPieChart(data);
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
          generationPieChart(data);
        }
      });
    }
  });

  $('a[href="#panel-recherche"]').on("click", function() {
    $("#chart").hide();
  });

  $('a[href="#panel-stats"]').on("click", function() {
    $("#chart").show();
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
  $("#chart").children().remove();

  if ($("#statutParRegion").attr("active") === "true") {
    $("#regionStats").attr("disabled", false);
  } else {
    $("#regionStats").attr("disabled", true);
  }
}

function generationPieChart(data) {
  var w = $("#panel-stats").width()/3;
  var h = w;
  var r = h / 2;
  var color = d3.scale.category20c();


  var vis = d3.select('#chart')
    .data([data])
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(" + r + "," + r + ")");

  var pie = d3.layout.pie().value(function(d) {
    return d.value;
  });

  var arc = d3.svg.arc().outerRadius(r);

  var arcs = vis
    .selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

  arcs.append("path")
    .attr("fill", function(d, i) {
      return color(i);
    })
    .attr("d", function(d) {
      return arc(d);
    });

  arcs.append("text")
  .attr("transform", function(d) {
    d.innerRadius = r/2;
    d.outerRadius = r;
    return "translate(" + arc.centroid(d) + ")";
  })
  .attr("text-anchor", "middle")
  .text(function(d, i) {
    return `${data[i].key} (${data[i].value})`;
  });

  // var legendRectSize = 15,
  //     legendSpacing = 5;
  //
  // var legend = vis.append('g')
  //     .attr('class', 'legend')
  //     .attr('transform', function(d, i) {
  //       var height = legendRectSize;
  //       var x = 100;
  //       var y = i * height;
  //       return 'translate(' + x + ',' + y + ')';
  //   });
  //
  // legend.append('rect')
  //   .attr('width', legendRectSize)
  //   .attr('height', legendRectSize)
  //   .style('fill', color)
  //   .style('stroke', color);
  //
  // legend.append('text')
  //   .attr('x', 100 + legendRectSize + legendSpacing)
  //   .attr('y', 100 + legendRectSize - legendSpacing)
  //   .text(function(d) { return d; });
}

function generationGraphe(data) {

  var width = $("#panel-stats").width(),
    barHeight = 15;

  var x = d3.scale.linear()
    .range([0, width]);

  var chart = d3.select("#chart")
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
