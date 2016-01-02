$(function() {
  $("#etablParRegion").on("click", function() {
    $.getJSON("/controller/etablissementParRegion", function(data) {

      var total = 0, count = 0;
      data.forEach(function (etablissement) {
        total += parseFloat(etablissement.nb);
        count++;
      });
      var width = $("#panel-373365").width(),
      barHeight = 20;

      var x = d3.scale.linear()
          .range([0, width]);

      var chart = d3.select(".chart")
          .attr("width", width);

      x.domain([0, d3.max(data, function(item) {return item.nb;})]);
      chart.attr("height", barHeight * data.length);

      var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

      bar.append("rect")
        .attr("width", function(d) {return x(d.nb) * 0.8;})
        .attr("height", barHeight - 1);

      bar.append("text")
        .attr("x", function(d) {return x(d.nb) * 0.8 + 5;})
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return `${d.region} (${d.nb})`; });
    });
  });
});
