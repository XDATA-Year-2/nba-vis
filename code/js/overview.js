;
(function($, window, document, undefined) {
    $.fn.overview_visualization = function(options) {
        var defaults = {
            divSelector: undefined,
            colors: {
                win: '#2C7BB6',
                loss: '#D7191C'
            },
            dimensions: {
                square_width: 10
            }
        },
        opts = $.extend(true, {}, defaults, options);
        var privateMethods = {
            drawViz: function(json) {
                var svg = d3.select(opts.divSelector).append("svg")
                        .attr("width", 1000)
                        .attr("height", 1000);
                svg.selectAll('.season-stats').data(json.data).enter()
                        .append('g')
                        .attr('class', 'season-stats')
                        .attr("transform", function(datum, index) {
                            return "translate(0," + (index * opts.dimensions.square_width) + ")"
                        })
                        .each(function(season) {
                            var season_element = d3.select(this);
                            season_element.selectAll('.squares').data(season.stats).enter()
                                    .append("rect")
                                    .attr("class", "squares")
                                    .attr('width', opts.dimensions.square_width)
                                    .attr('height', opts.dimensions.square_width)
                                    .attr('style', function(datum) {
                                        var color = (datum.won === 0) ? opts.colors.loss : opts.colors.win;
                                        return "fill: " + color;
                                    })
                                    .attr("x", function(datum, index) {
                                        return index * opts.dimensions.square_width;
                                    })
                                    .attr("y", 0);
                        });
            }
        };
        /** Code from where the execution starts **/
        this.each(function() {
            opts.divSelector = "#" + $(this).attr('id');
            d3.json('/mia_all_seasons.json', function(error, json) {
                privateMethods.drawViz(json);
            });
        });
    };
})(jQuery, window, document, undefined);