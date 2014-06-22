var margin = {top: 20, right: 20, bottom: 50, left: 40},
    width = 1180 - margin.left - margin.right,
    height = 640 - margin.top - margin.bottom;

var season=2012

var timeFormat = d3.time.format("%M:%S");

var xScale = d3.scale.linear()
        .range([0, width]);

var yScale = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var tooltipBox = d3.tip()
    .attr("id", "tooltipTxtBox")
    .attr("class", "tooltip")
    .offset([-10, 0])
    .html(function(d) {
        return "<span class='tooltip-txt'>Click to see game info</span>";
    });

var gameBarTooltip = d3.tip()
    .attr("id", "gameBarTooltipBox")
    .attr("class", "tooltip")
    .offset([-10, 0])
    .html(function(d) {
        return "<span class='tooltip-txt'>Click to see game info</span>";
    });

function init() {
    update();
    calcPlayerStats();
    // playerImgInteraction();
    //gameScoreBarInteraction();
}

var isWinLossSelected = 0;
var isCircleSelected = false;
var numOfGameSelected = 0;
var numOfPlayersSelected = 0;
var gamesSelectedPlayersPlayed = [];
var teamWinDatesArray = [];
var teamLossDatesArray = [];

function playerImgInteraction() {
    $(".img-thumbnail").click(function() {
        //console.log(gamesSelectedPlayersPlayed);
        
        isWinLossSelected = 0;
        $("#btnWin").attr("class", "winlossBtn-default");
        $("#btnLoss").attr("class", "winlossBtn-default");
        
        // if no game is selected, then select player as usual
        if (numOfGameSelected == 0 && isCircleSelected == false) {
            // if this player has not been selected
            if (!$(this).hasClass("img-thumbnail-selected")) {
                $(this).addClass("img-thumbnail-selected");
                numOfPlayersSelected = numOfPlayersSelected + 1;
                var clickedPlayer = $(this).parent()[0].dataset.name;
                
                var selectedStarters = d3.selectAll(".starter").filter(function(d) {
                        if(d.Name == clickedPlayer) {
                            gamesSelectedPlayersPlayed.push(d.Date);
                            return true;
                        }
                    })
                    .classed("circle-highlighted", true);
                var selectedReserves = d3.selectAll(".reserve").filter(function(d) {
                        if(d.Name == clickedPlayer) {
                            gamesSelectedPlayersPlayed.push(d.Date);
                            return true;
                        }
                    })
                    .classed("circle-highlighted", true);
                d3.selectAll(".starter").filter(function(d) {
                    return (d.Name != clickedPlayer) && !$(this).hasClass("circle-highlighted") })
                    .classed("circle-dim", true);
                d3.selectAll(".reserve").filter(function(d) {
                    return d.Name != clickedPlayer && !$(this).hasClass("circle-highlighted") })
                    .classed("circle-dim", true);

                // console.log(selectedStarters);
                // console.log(selectedReserves);
                console.log("after add selected games: " + gamesSelectedPlayersPlayed.length);
                console.log(gamesSelectedPlayersPlayed);

                //select bars which represent games this player played                
                d3.selectAll(".game-score-bar").filter(function(d) {
                        //console.log(d);
                        var isGameFound = false;
                        $.each(gamesSelectedPlayersPlayed, function(index, item) {
                            //console.log(item);
                            if(d.Date == item) {
                                isGameFound = true;
                            }
                        });
                        return isGameFound;
                    })
                    .classed("bar-selected", true);

                //scan through starters data to find matched player
                $.each(nested_starters, function(index, item) {
                    if (item.key == clickedPlayer) {
                        $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");                        
                    };
                });
                //scan through reserves data to find matched player
                $.each(nested_reserves, function(index, item) {
                    if (item.key == clickedPlayer) {
                        $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                    };
                });                
            }
            // If this player has been selected, then deselect
            else {
                $(this).removeClass("img-thumbnail-selected");
                numOfPlayersSelected = numOfPlayersSelected - 1;
                var clickedPlayer = $(this).parent()[0].dataset.name;
                d3.selectAll(".starter").filter(function(d) {
                        if (d.Name == clickedPlayer) {
                            if(gamesSelectedPlayersPlayed.lastIndexOf(d.Date) != -1){
                                console.log(d.Date);
                                gamesSelectedPlayersPlayed.splice(gamesSelectedPlayersPlayed.lastIndexOf(d.Date), 1);
                            }
                            return true;
                        }
                    })
                    .classed("circle-highlighted", false);
                d3.selectAll(".reserve").filter(function(d) {
                        if (d.Name == clickedPlayer) {
                            if(gamesSelectedPlayersPlayed.lastIndexOf(d.Date) != -1){
                                gamesSelectedPlayersPlayed.splice(gamesSelectedPlayersPlayed.lastIndexOf(d.Date), 1);
                            }
                            return true;
                        }
                    })
                    .classed("circle-highlighted", false);

                console.log("after delete selected games: " + gamesSelectedPlayersPlayed.length);
                console.log(gamesSelectedPlayersPlayed);
                //select bars which represent games this player played    
                d3.selectAll(".game-score-bar").classed("bar-selected", false);            
                d3.selectAll(".game-score-bar").filter(function(d) {
                        //console.log(d);
                        var gameFound = false;
                        $.each(gamesSelectedPlayersPlayed, function(index, item) {
                            //console.log(item);
                            if(d.Date == item) {
                                gameFound = true;
                            };
                        });
                        return gameFound;
                    })
                    .classed("bar-selected", true);

                //console.log("numOfPlayersSelected: " + numOfPlayersSelected);
                if (numOfPlayersSelected == 0) {
                    d3.selectAll(".starter")
                        .classed("circle-dim", false);
                    d3.selectAll(".reserve")
                        .classed("circle-dim", false);
                    d3.selectAll(".game-score-bar")
                        .classed("bar-selected", false);
                }

                $("#playerStatsLeft").empty();
                $("#playerStatsRight").empty();
            }
        }
        // if there are games selected, then deselect all the circles then select player circles
        else if(numOfGameSelected > 0 || isCircleSelected == true) {
            d3.selectAll(".starter").classed("circle-highlighted", false);
            d3.selectAll(".starter").classed("circle-dim", false);            
            d3.selectAll(".starter").classed("circle-selected", false);
            d3.selectAll(".reserve").classed("circle-highlighted", false);
            d3.selectAll(".reserve").classed("circle-dim", false);
            d3.selectAll(".reserve").classed("circle-selected", false);
            $(".img-thumbnail-selected").removeClass("img-thumbnail-selected");
            $(".player-default").removeClass("player-dim");
            $(".player-default").removeClass("player-selected");
            d3.selectAll(".bar-selected").attr("class", "game-score-bar bar-default");
            numOfGameSelected = 0;
            isCircleSelected = false;
            numOfGameSelected = 0;

            numOfPlayersSelected++;
            $(this).addClass("img-thumbnail-selected");
            var clickedPlayer = $(this).parent()[0].dataset.name;

            // d3.selectAll(".starter").filter(function(d) {return d.Name == clickedPlayer})
            //     .classed("circle-highlighted", true);
            // d3.selectAll(".reserve").filter(function(d) {return d.Name == clickedPlayer})
            //     .classed("circle-highlighted", true);
            // d3.selectAll(".starter").filter(function(d) {
            //     return (d.Name != clickedPlayer) && !$(this).hasClass("circle-highlighted") })
            //     .classed("circle-dim", true);
            // d3.selectAll(".reserve").filter(function(d) {
            //     return d.Name != clickedPlayer && !$(this).hasClass("circle-highlighted") })
            //     .classed("circle-dim", true);
            var selectedStarters = d3.selectAll(".starter").filter(function(d) {
                    if(d.Name == clickedPlayer) {
                        gamesSelectedPlayersPlayed.push(d.Date);
                        return true;
                    }
                })  
                .classed("circle-highlighted", true);
            var selectedReserves = d3.selectAll(".reserve").filter(function(d) {
                    if(d.Name == clickedPlayer) {
                        gamesSelectedPlayersPlayed.push(d.Date);
                        return true;
                    }
                })
                .classed("circle-highlighted", true);
            d3.selectAll(".starter").filter(function(d) {
                return (d.Name != clickedPlayer) && !$(this).hasClass("circle-highlighted") })
                .classed("circle-dim", true);
            d3.selectAll(".reserve").filter(function(d) {
                return d.Name != clickedPlayer && !$(this).hasClass("circle-highlighted") })
                .classed("circle-dim", true);

            // console.log(selectedStarters);
            // console.log(selectedReserves);
            console.log("after add selected games: " + gamesSelectedPlayersPlayed.length);
            console.log(gamesSelectedPlayersPlayed);

            //select bars which represent games this player played                
            d3.selectAll(".game-score-bar").filter(function(d) {
                    //console.log(d);
                    var isGameFound = false;
                    $.each(gamesSelectedPlayersPlayed, function(index, item) {
                        //console.log(item);
                        if(d.Date == item) {
                            isGameFound = true;
                        }
                    });
                    return isGameFound;
                })
                .classed("bar-selected", true);

            $.each(nested_starters, function(index, item) {
                if (item.key == clickedPlayer) {
                    $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                };
            });
            $.each(nested_reserves, function(index, item) {
                if (item.key == clickedPlayer) {
                    $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                };
            });
        }
        
    });
}

function gameScoreBarInteraction() {
    console.log("interaction with a bar");
    $(".bar-default").click(function() {
        console.log("clicked a bar");
        if (!$(this).hasClass("bar-selected")) {
            $(this).addClass("bar-selected");
        }
        else {
            $(this).removeClass("bar-selected");
        }
    });
}

var nested_starters;
var nested_reserves;
function calcPlayerStats() {
    d3.csv(teamStarterDataPath, function(starters) {
        nested_starters = d3.nest()
            .key(function(d) { return d.Name; })
            .rollup( function(leaves) { 
                return {
                    "Games Players": leaves.length,
                    "avg_MP": d3.round(d3.mean(leaves, function(e) {return roundMinutesPlayed(e.MP);}), 0),
                    "avg_FG": d3.round(d3.mean(leaves, function(e) {return +e.FG;}), 1),
                    "avg_FGA": d3.round(d3.mean(leaves, function(e) {return +e.FGA;}), 1),
                    "avg_FG%": d3.round(d3.mean(leaves, function(e) {return +e['FG%'];}), 1),
                    "avg_3P": d3.round(d3.mean(leaves, function(e) {return +e['3P'];}),1),
                    "avg_3PA": d3.round(d3.mean(leaves, function(e) {return +e['3PA'];}),1),
                    "avg_3P%": d3.round(d3.mean(leaves, function(e) {return +e['3P%'];}),1),
                    "avg_FT": d3.round(d3.mean(leaves, function(e) {return +e['FT'];}),1),
                    "avg_FTA": d3.round(d3.mean(leaves, function(e) {return +e['FTA'];}),1),
                    "avg_FT%": d3.round(d3.mean(leaves, function(e) {return +e['FT%'];}),1),
                    "avg_ORB": d3.round(d3.mean(leaves, function(e) {return +e['ORB'];}),1),
                    "avg_DRB": d3.round(d3.mean(leaves, function(e) {return +e['DRB'];}),1),
                    "avg_TRB": d3.round(d3.mean(leaves, function(e) {return +e['TRB'];}),1),
                    "avg_AST": d3.round(d3.mean(leaves, function(e) {return +e['AST'];}),1),
                    "avg_STL": d3.round(d3.mean(leaves, function(e) {return +e['STL'];}),1),
                    "avg_BLK": d3.round(d3.mean(leaves, function(e) {return +e['BLK'];}),1),
                    "avg_TOV": d3.round(d3.mean(leaves, function(e) {return +e['TOV'];}),1),
                    "avg_PF": d3.round(d3.mean(leaves, function(e) {return +e['PF'];}),1),
                    "avg_PTS": d3.round(d3.mean(leaves, function(e) {return +e['PTS'];}),1)
                } 
            })
            .entries(starters);
    });    

    d3.csv(teamReserveDataPath, function(reserves) {
        nested_reserves = d3.nest()
            .key(function(d) { return d.Name; })
            .rollup( function(leaves) { 
                return {
                    "Games Players": leaves.length,
                    "avg_MP": d3.round(d3.mean(leaves, function(e) {return roundMinutesPlayed(e.MP);}), 0),
                    "avg_FG": d3.round(d3.mean(leaves, function(e) {return +e.FG;}), 1),
                    "avg_FGA": d3.round(d3.mean(leaves, function(e) {return +e.FGA;}), 1),
                    "avg_FG%": d3.round(d3.mean(leaves, function(e) {return +e['FG%'];}), 1),
                    "avg_3P": d3.round(d3.mean(leaves, function(e) {return +e['3P'];}),1),
                    "avg_3PA": d3.round(d3.mean(leaves, function(e) {return +e['3PA'];}),1),
                    "avg_3P%": d3.round(d3.mean(leaves, function(e) {return +e['3P%'];}),1),
                    "avg_FT": d3.round(d3.mean(leaves, function(e) {return +e['FT'];}),1),
                    "avg_FTA": d3.round(d3.mean(leaves, function(e) {return +e['FTA'];}),1),
                    "avg_FT%": d3.round(d3.mean(leaves, function(e) {return +e['FT%'];}),1),
                    "avg_ORB": d3.round(d3.mean(leaves, function(e) {return +e['ORB'];}),1),
                    "avg_DRB": d3.round(d3.mean(leaves, function(e) {return +e['DRB'];}),1),
                    "avg_TRB": d3.round(d3.mean(leaves, function(e) {return +e['TRB'];}),1),
                    "avg_AST": d3.round(d3.mean(leaves, function(e) {return +e['AST'];}),1),
                    "avg_STL": d3.round(d3.mean(leaves, function(e) {return +e['STL'];}),1),
                    "avg_BLK": d3.round(d3.mean(leaves, function(e) {return +e['BLK'];}),1),
                    "avg_TOV": d3.round(d3.mean(leaves, function(e) {return +e['TOV'];}),1),
                    "avg_PF": d3.round(d3.mean(leaves, function(e) {return +e['PF'];}),1),
                    "avg_PTS": d3.round(d3.mean(leaves, function(e) {return +e['PTS'];}),1)
                } 
            })
            .entries(reserves);
    });    
}

var selectedCircle;
var selectedPlayer;

var plusMinusColorTable = ["#3374DC", "#F26823", "#C9F013"];
var starterReserveColorTable = ["#3498db", "#B359D8"];
var playerPositionColorTable = ["#3374dc", "#f39c12", "#e74c3c", "#9b59b6"];
//var playerPositionColorTable = ["#3374dc", "#f39c12", "#e74c3c", "#9b59b6", "#66a61e"];
var winLossColorTable = ["#3288bd", "#d53e4f", "#27ae60"];

var gameScoreBarHeight = 80;
var gameScoreBarWidth = 10;
var gameScoreBarY = d3.scale.linear()
    .range([gameScoreBarHeight, 0]);

var selectedTeam;
var teamStarterDataPath, teamReserveDataPath;
function updateTeam() {
    selectedTeam = getTeamSelectedOption();
    console.log(selectedTeam);
    $("#selectedTeam").text(selectedTeam);
}


function update() {  
    //remove old graphics and set everything back to default
    d3.select("#scatterPlotVis svg").remove();
    d3.select("#gameStatsBarChartVis svg").remove();
    d3.selectAll(".starter").classed("circle-highlighted", false);
    d3.selectAll(".starter").classed("circle-dim", false);
    d3.selectAll(".starter").classed("circle-selected", false);
    d3.selectAll(".reserve").classed("circle-highlighted", false);
    d3.selectAll(".reserve").classed("circle-dim", false);
    d3.selectAll(".reserve").classed("circle-selected", false);
    d3.selectAll(".game-score-bar").classed("bar-selected", false);
    $(".img-thumbnail-selected").removeClass("img-thumbnail-selected");
    $(".player-default").removeClass("player-dim");
    $(".player-default").removeClass("player-selected");

    numOfPlayersSelected = 0;
    isCircleSelected = false;
    numOfGameSelected = 0;
    isWinLossSelected = 0;

    updateTeam();

    //create svg canvas
    var scatterPlot = d3.select("#scatterPlotVis").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    scatterPlot.call(tooltipBox);

    //loading data
    if (selectedTeam == "ALL") {
        allTeamsDataPath = "data/player-stats-by-team/teamlines.csv";
        $("#playerPicSection").empty();

        $("#colorDropdown option[value='StarterReserve']").attr("disabled","true");        
        $("#colorDropdown option[value='PlayerPosition']").attr("disabled","true");       

        d3.csv(allTeamsDataPath, function(teams) {
            console.log(teams);
                
            d3.json("data/Miami-Heat-2012-2013/miamiPlayersPos.json", function(playersPos) {                      

                setAllTeamXScale(teams);
                setAllTeamYScale(teams);

                //define and draw two axises
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

                scatterPlot.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                .append("text")
                    .attr("class", "label")
                    .attr("x", width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text(getXSelectedOption());

                scatterPlot.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                .append("text")
                    .attr("class", "label")
                    //.attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dx", "0.5em")
                    .attr("dy", "0em")
                    .style("text-anchor", "start")
                    .text(getYSelectedOption());
                
                //draw circles representing starter players
                var starterItem = scatterPlot.selectAll(".starter")
                        .data(teams)
                    .enter().append("g");

                var starterCircle = starterItem.append("circle")
                    .attr("class", function(d) {                        
                        return "dot starter circle-default";
                    })
                    .attr("r", 6)
                    .attr("fill", function(d) {
                        if (getColorSelectionOption() == "StarterReserve") {
                            return starterReserveColorTable[0];
                        }
                        else if (getColorSelectionOption() == "PlusMinus") {
                            return changeColorScheme(d);   
                        }
                        else if (getColorSelectionOption() == "PlayerPosition") {
                            var posColor;
                            $.each(playersPos.players, function(index, item) {
                                if (item.name == d.Name) {
                                    switch (item.positions[0]) {
                                        case "Point guard":
                                            posColor = playerPositionColorTable[0];
                                            break;
                                        case "Shooting guard":
                                            posColor = playerPositionColorTable[1];
                                            break;
                                        case "Small forward":
                                            posColor = playerPositionColorTable[2];
                                            break;
                                        case "Power forward":
                                            posColor = playerPositionColorTable[3];
                                            break;
                                        case "Center":
                                            posColor = playerPositionColorTable[4];
                                            break;
                                        default:
                                            posColor = "#f00";
                                    }
                                }
                            })
                            return posColor;
                        }
                        else if (getColorSelectionOption() == "WinLoss") {
                            // console.log(d);
                            switch(d["Win/Loss"]) {
                                case "W":
                                    return winLossColorTable[0];
                                    break;
                                case "L":
                                    return winLossColorTable[1];
                                    break;
                            }
                        }
                    })
                    .attr("cx", function(d) {
                        if (getXSelectedOption() == "MP") {
                            return d3.round(calcTeamMinutesPlayed(d, "x") + (15 * (Math.random()-0.5)));
                        }
                        else {
                            return d3.round(xScale(d[getXSelectedOption()]) + (15 * (Math.random()-0.5)));
                        }
                    })
                    .attr("cy", function(d) { 
                        if (getYSelectedOption() == "MP") {
                            var pos = calcTeamMinutesPlayed(d, "y");
                            var newPos = d3.round(pos + (15 * (Math.random()-0.5)));
                            return newPos;
                        }
                        else {
                            var pos = yScale(d[getYSelectedOption()]);
                            var newPos = d3.round(pos + (10 * (Math.random()-0.5)));
                            return newPos;
                        }
                    })    
                    .on("mouseover", function(d) {
                        if (d['Win/Loss'] == "W") {
                            tooltipBox.html("<span class='tooltipHeader'>" + d['Date'] + "</span></br>" + "<span class='tooltip-row-name'>Win / Loss: </span><span class='tooltip-win'>Win" + "</span></br>" + "<span class='tooltip-row-name'>Opponent: </span><span class='tooltip-opponent'>" + d['Opponent'] + "</span>");
                        }
                        else if (d['Win/Loss'] == "L") {
                            tooltipBox.html("<span class='tooltipHeader'>" + d['Date'] + "</span></br>" + "<span class='tooltip-row-name'>Win / Loss: </span><span class='tooltip-loss'>Loss" + "</span></br>" + "<span class='tooltip-row-name'>Opponent: </span><span class='tooltip-opponent'>" + d['Opponent'] + "</span>");
                        }
                        tooltipBox.show();
                        // console.log("mouse over: ");
                        // console.log(d);
                        if (isCircleSelected == false) {
                            //highlighting and diming player profile pictures
                            $(".player-default").addClass("player-dim");
                            var playerPhotos = $(".player-default");
                            $.each(playerPhotos, function(index, item) {
                                if (item.dataset.name == d.Name) {
                                    $(this).removeClass("player-dim").addClass("player-selected");
                                };
                            });

                            //highlight bar for the game
                            d3.selectAll(".game-score-bar").filter(function(b) {
                                //console.log(d);
                                return b.Date == d.Date;
                            })
                            .classed("bar-selected", true);

                            // $.each(gameBars, function(index, item) {
                            //     if (item.dataset.name == d.Name) {
                            //         $(this).addClass("player-selected");
                            //     };
                            // });

                            var pmColor;                        
                            if(d['+/-'].charAt(0) == "-") {
                                pmColor = "#e74c3c";
                            }
                            else if(d['+/-'].charAt(0) == "0") {
                                pmColor = "#f39c12";
                            }
                            else {
                                pmColor = "#2ecc71";
                            }
                            $("#playerStatsLeft").html("<span class='tooltipHeader' style='color:#ddd'>" + d.Name + "</span> &nbsp <span class='tooltipHeader' style='color:" + pmColor + "'>" + d['+/-'] + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + d.MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + d.FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + d['3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + d['3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + d.FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + d.AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + d.STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + d.BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + d.TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + d.PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> +/-: </span>" + "<span class='tooltip-detail-num'>" + d['+/-'] + "</span>");
                            $.each(nested_starters, function(index, item) {
                                if (item.key == d.Name) {
                                    $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                                };
                            });
                        }
                    })             
                    .on("mouseout", function(d) {
                        tooltipBox.hide();
                        if (isCircleSelected == false) {
                            $(".player-default").removeClass("player-dim");

                            var playerPhotos = $(".player-default");
                            $.each(playerPhotos, function(index, item) {
                                if (item.dataset.name == d.Name) {
                                    $(this).removeClass("player-selected");
                                };
                            });

                            //remove highlighting effect of game bar
                            d3.selectAll(".game-score-bar").filter(function(b) {
                                console.log(gamesSelectedPlayersPlayed);

                                // if Win button is selected
                                if (isWinLossSelected == 1) {
                                    return ((b.Date == d.Date) && $.inArray(b.Date, gamesSelectedPlayersPlayed) == -1 && $.inArray(b.Date, teamWinDatesArray) == -1);
                                }
                                // if loss button got seletect
                                else if (isWinLossSelected == 2) {
                                    return ((b.Date == d.Date) && $.inArray(b.Date, gamesSelectedPlayersPlayed) == -1 && $.inArray(b.Date, teamLossDatesArray) == -1);
                                }

                                else if (isWinLossSelected == 0) {
                                    //only remove the highlight effect when the matched date was found and it is not a date selected player played on
                                    return ((b.Date == d.Date) && $.inArray(b.Date, gamesSelectedPlayersPlayed) == -1);
                                }
                            })
                            .classed("bar-selected", false);

                            $("#playerStatsLeft").empty();
                            $("#playerStatsRight").empty();
                        }
                    })
                    // click on a circle
                    .on("click", function(d) {
                        var self = $(this);

                        isWinLossSelected = 0;
                        $("#btnWin").attr("class", "winlossBtn-default");
                        $("#btnLoss").attr("class", "winlossBtn-default");

                        if(numOfPlayersSelected > 0 || numOfGameSelected > 0) {
                            d3.selectAll(".starter").classed("circle-highlighted", false);
                            d3.selectAll(".starter").classed("circle-dim", false);
                            d3.selectAll(".starter").classed("circle-selected", false);
                            d3.selectAll(".reserve").classed("circle-highlighted", false);
                            d3.selectAll(".reserve").classed("circle-dim", false);
                            d3.selectAll(".reserve").classed("circle-selected", false);
                            $(".img-thumbnail-selected").removeClass("img-thumbnail-selected");
                            $(".player-default").removeClass("player-dim");
                            $(".player-default").removeClass("player-selected");

                            d3.selectAll(".bar-selected").attr("class", "game-score-bar bar-default");

                            numOfPlayersSelected = 0;
                            numOfGameSelected = 0;

                            $("#playerStatsLeft").empty();
                            $("#playerStatsRight").empty();
                        }

                        //if no circle has been selected
                        if (isCircleSelected == false) {     
                            isCircleSelected = true;                   
                            var oldTooltipBoxTop = $("#tooltipTxtBox").position().top;
                            
                            self.attr("class", "dot starter circle-default circle-selected");

                            $(".player-default").addClass("player-dim");

                            var playerPhotos = $(".player-default");
                            $.each(playerPhotos, function(index, item) {
                                if (item.dataset.name == d.Name) {
                                    $(this).removeClass("player-dim").addClass("player-selected");
                                };
                            });

                            var pmColor;                        
                            if(d['+/-'].charAt(0) == "-") {
                                pmColor = "#e74c3c";
                            }
                            else if(d['+/-'].charAt(0) == "0") {
                                pmColor = "#f39c12";
                            }
                            else {
                                pmColor = "#2ecc71";
                            }
                            $("#playerStatsLeft").html("<span class='tooltipHeader' style='color:#ddd'>" + d.Name + "</span> &nbsp <span class='tooltipHeader' style='color:" + pmColor + "'>" + d['+/-'] + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + d.MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + d.FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + d['3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + d['3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + d.FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + d.AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + d.STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + d.BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + d.TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + d.PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> +/-: </span>" + "<span class='tooltip-detail-num'>" + d['+/-'] + "</span>");
                            $.each(nested_starters, function(index, item) {
                                if (item.key == d.Name) {
                                    $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                                };
                            });
                        }
                        //if the same circle has been clicked again, then deselect this circle
                        else if (isCircleSelected == true) {  
                            //console.log(self);  
                            if (selectedCircle[0] == self[0]) {
                                isCircleSelected = false;               
                                $(".player-default").removeClass("player-dim");
                                self.attr("class", "dot starter circle-default");

                                var playerPhotos = $(".player-default");
                                $.each(playerPhotos, function(index, item) {
                                    if (item.dataset.name == d.Name) {
                                        $(this).removeClass("player-selected");
                                    };
                                });
                                $("#playerStatsLeft").empty();
                                $("#playerStatsRight").empty();
                            }
                            //if select another circle
                            else {
                                isCircleSelected = true;
                                $('.circle-selected').attr("class", "dot starter circle-default");
                                self.attr("class", "dot starter circle-default circle-selected");

                                $(".player-selected").removeClass("player-selected");
                                $(".player-default").addClass("player-dim");
                                var playerPhotos = $(".player-default");
                                $.each(playerPhotos, function(index, item) {
                                    if (item.dataset.name == d.Name) {
                                        $(this).removeClass("player-dim").addClass("player-selected");
                                    };
                                });

                                var pmColor;                        
                                if(d['+/-'].charAt(0) == "-") {
                                    pmColor = "#e74c3c";
                                }
                                else if(d['+/-'].charAt(0) == "0") {
                                    pmColor = "#f39c12";
                                }
                                else {
                                    pmColor = "#2ecc71";
                                }
                                $("#playerStatsLeft").html("<span class='tooltipHeader' style='color:#ddd'>" + d.Name + "</span> &nbsp <span class='tooltipHeader' style='color:" + pmColor + "'>" + d['+/-'] + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + "<span class='tooltip-detail-num'>" + d.MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + d.FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + d['3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + d['3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + d.FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + d.AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + d.STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + d.BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + d.TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + d.PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> +/-: </span>" + "<span class='tooltip-detail-num'>" + d['+/-'] + "</span>");
                                $.each(nested_starters, function(index, item) {
                                    if (item.key == d.Name) {
                                        $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                                    };
                                });
                            }
                        }
                        selectedCircle = self;
                    })
                    .transition()
                    .duration(500);


            }); //load data     
        }); // load data

        //draw legends for circles
        var scatterPlotLegend = scatterPlot.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(0," + (height+40) + ")");
        
        var legendOffset = 80;
        scatterPlotLegend.selectAll(".legend-circle-winloss")
                .data(["Win", "Loss"])
            .enter().append("circle")
                .attr("class", "legend-circle-winloss")
                .attr("r", 6)
                .attr("fill", function(d, i) { return winLossColorTable[i]; })
                .attr("transform", function(d, i) { return "translate(" + (width - legendOffset * (i+1)) + ", 0)"; })

        scatterPlotLegend.selectAll(".legend-text-winloss")
                .data(winLossColorTable)
            .enter().append("text")
                .attr("class", "legend-text-winloss")
                .attr("r", 6)
                .attr("dx", "1em")
                    .attr("dy", "0.4em")
                    .attr("fill", "#888")
                    .attr("transform", function(d, i) { return "translate(" + (width - legendOffset * (i+1)) + ", 0)"; })
                    .text(function(d, i) {
                        switch (i) {
                            case 0:
                                return "Win";
                                break;
                            case 1:
                                return "Loss";
                                break;
                        }
                    });

        legendOffset = 100;
        if (getColorSelectionOption() == "PlusMinus") {
            scatterPlotLegend.selectAll(".legend-circle")
                    .data(plusMinusColorTable)
                .enter().append("circle")
                    .attr("class", "legend-circle")
                    .attr("r", 6)
                    .attr("fill", function(d, i) { return plusMinusColorTable[i]; })
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; });

            scatterPlotLegend.selectAll(".legend-text")
                    .data(plusMinusColorTable)
                .enter().append("text")
                    .attr("class", "legend-text")
                    .attr("dx", "1em")
                    .attr("dy", "0.4em")
                    .attr("fill", "#888")
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; })
                    .text(function(d, i) {
                        switch (i) {
                            case 0:
                                return "Plus";
                                break;
                            case 1:
                                return "Minus";
                                break;
                            case 2:
                                return "Zero";
                                break;
                        }
                    });
        }
        else if (getColorSelectionOption() == "StarterReserve") {
            scatterPlotLegend.selectAll(".legend-circle")
                    .data(starterReserveColorTable)
                .enter().append("circle")
                    .attr("class", "legend-circle")
                    .attr("r", 6)
                    .attr("fill", function(d, i) { return starterReserveColorTable[i]; })
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; });

            scatterPlotLegend.selectAll(".legend-text")
                    .data(plusMinusColorTable)
                .enter().append("text")
                    .attr("class", "legend-text")
                    .attr("dx", "1em")
                    .attr("dy", "0.4em")
                    .attr("fill", "#888")
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; })
                    .text(function(d, i) {
                        switch (i) {
                            case 0:
                                return "Starter";
                                break;
                            case 1:
                                return "Reserve";
                                break;
                        }
                    });
        }
        else if (getColorSelectionOption() == "PlayerPosition") {
            legendOffset = 160;
            scatterPlotLegend.selectAll(".legend-circle")
                    .data(playerPositionColorTable)
                .enter().append("circle")
                    .attr("class", "legend-circle")
                    .attr("r", 6)
                    .attr("fill", function(d, i) { return playerPositionColorTable[i]; })
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; });

            scatterPlotLegend.selectAll(".legend-text")
                    .data(playerPositionColorTable)
                .enter().append("text")
                    .attr("class", "legend-text")
                    .attr("dx", "1em")
                    .attr("dy", "0.4em")
                    .attr("fill", "#888")
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; })
                    .text(function(d, i) {
                        switch (i) {
                            case 0:
                                return "Point guard";
                                break;
                            case 1:
                                return "Shooting guard";
                                break;
                            case 2:
                                return "Small forward";
                                break;
                            case 3:
                                return "Power forward";
                                break;
                            case 4:
                                return "Center";
                                break;
                        }
                    });
        }
        else if (getColorSelectionOption() == "WinLoss") {
            scatterPlotLegend.selectAll(".legend-circle")
                    .data(winLossColorTable)
                .enter().append("circle")
                    .attr("class", "legend-circle")
                    .attr("r", 6)
                    .attr("fill", function(d, i) { return winLossColorTable[i]; })
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; });

            scatterPlotLegend.selectAll(".legend-text")
                    .data(playerPositionColorTable)
                .enter().append("text")
                    .attr("class", "legend-text")
                    .attr("dx", "1em")
                    .attr("dy", "0.4em")
                    .attr("fill", "#888")
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; })
                    .text(function(d, i) {
                        switch (i) {
                            case 0:
                                return "Win";
                                break;
                            case 1:
                                return "Loss";
                                break;
                        }
                    });
        }

    }
    else if (selectedTeam != "ALL") {
        $("#colorDropdown option[value='StarterReserve']").attr("disabled",false);        
        $("#colorDropdown option[value='PlayerPosition']").attr("disabled",false);

        teamStarterDataPath = "data/playerstats/"+season+"/" + selectedTeam + "/Starters";
        teamReserveDataPath = "data/playerstats/"+season+"/" + selectedTeam + "/Reserves";
        teamStatsDataPath = "data/teamstats/"+season+"/" + selectedTeam;
        teamPlayersDataPath = "data/teamplayers/"+season+"/" + selectedTeam;

        d3.csv(teamStarterDataPath, function(starters) {

            d3.csv(teamReserveDataPath, function(reserves) {
                
                d3.json(teamPlayersDataPath, function(playersPos) {

                    //change to selected team's player profile images
                    $("#playerPicSection").empty();
                    $.each(playersPos.players, function(index, item) {
                        console.log(item.name);
                        var outerDiv = "<div class='col-xs-6 col-sm-2 placeholder player-default' data-name='" + item.name + "'>";
                        console.log(outerDiv);
                        var playerPicDiv = $("#playerPicSection")
                            .append($("<div>")
                                .addClass("col-xs-6 col-sm-2 placeholder player-default")
                                .attr("data-name", item.name)
                                .append($("<img>")
                                    .addClass("img-thumbnail")
                                    .attr("src", function() { return "images/" + selectedTeam + "/" + item.name + ".jpg"; })
                                    .attr("alt", "Generic placeholder thumbnail")
                                )
                                .append($("<h4>" + item.name + "</h4>")
                                    .addClass("player-name")                                    
                                )
                            );
                        
                    });
                    playerImgInteraction();
                    //change to selected team's player profile images

                    setXScale(starters, reserves);
                    setYScale(starters, reserves);

                    //define and draw two axises
                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");

                    scatterPlot.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis)
                    .append("text")
                        .attr("class", "label")
                        .attr("x", width)
                        .attr("y", -6)
                        .style("text-anchor", "end")
                        .text(getXSelectedOption());

                    scatterPlot.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                    .append("text")
                        .attr("class", "label")
                        //.attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dx", "0.5em")
                        .attr("dy", "0em")
                        .style("text-anchor", "start")
                        .text(getYSelectedOption());
                    
                    //draw circles representing starter players
                    var starterItem = scatterPlot.selectAll(".starter")
                            .data(starters)
                        .enter().append("g");

                    var starterCircle = starterItem.append("circle")
                        .attr("class", function(d) {                        
                            return "dot starter circle-default";
                        })
                        .attr("r", 6)
                        .attr("fill", function(d) {
                            if (getColorSelectionOption() == "StarterReserve") {
                                return starterReserveColorTable[0];
                            }
                            else if (getColorSelectionOption() == "PlusMinus") {
                                return changeColorScheme(d);   
                            }
                            else if (getColorSelectionOption() == "PlayerPosition") {
                                switch(d["Position"]) {
                                    case "G":
                                        return playerPositionColorTable[0];
                                        break;
                                    case "F":
                                        return playerPositionColorTable[1];
                                        break;
                                    case "C":
                                        return playerPositionColorTable[2];
                                        break;
                                    case "":
                                        return playerPositionColorTable[3];
                                        break;
                                    default:
                                        return "#f00";
                                }
                                // var posColor;
                                // $.each(playersPos.players, function(index, item) {
                                //     if (item.name == d.Name) {
                                //         switch (item.positions[0]) {
                                //             case "Point guard":
                                //                 posColor = playerPositionColorTable[0];
                                //                 break;
                                //             case "Shooting guard":
                                //                 posColor = playerPositionColorTable[1];
                                //                 break;
                                //             case "Small forward":
                                //                 posColor = playerPositionColorTable[2];
                                //                 break;
                                //             case "Power forward":
                                //                 posColor = playerPositionColorTable[3];
                                //                 break;
                                //             case "Center":
                                //                 posColor = playerPositionColorTable[4];
                                //                 break;
                                //             default:
                                //                 posColor = "#f00";
                                //         }
                                //     }
                                // })
                                // return posColor;
                            }
                            else if (getColorSelectionOption() == "WinLoss") {
                                // console.log(d);
                                switch(d["Win/Loss"]) {
                                    case "W":
                                        return winLossColorTable[0];
                                        break;
                                    case "L":
                                        return winLossColorTable[1];
                                        break;
                                }
                            }
                        })
                        .attr("cx", function(d) {
                            if (getXSelectedOption() == "MP") {
                                return d3.round(calcMinutesPlayed(d, "x") + (15 * (Math.random()-0.5)));
                            }
                            else {
                                return d3.round(xScale(d[getXSelectedOption()]) + (15 * (Math.random()-0.5)));
                            }
                        })
                        .attr("cy", function(d) { 
                            if (getYSelectedOption() == "MP") {
                                var pos = calcMinutesPlayed(d, "y");
                                var newPos = d3.round(pos + (15 * (Math.random()-0.5)));
                                return newPos;
                            }
                            else {
                                var pos = yScale(d[getYSelectedOption()]);
                                var newPos = d3.round(pos + (10 * (Math.random()-0.5)));
                                return newPos;
                            }
                        })    
                        .on("mouseover", function(d) {
                            if (d['Win/Loss'] == "W") {
                                tooltipBox.html("<span class='tooltipHeader'>" + d['Date'] + "</span></br>" + "<span class='tooltip-row-name'>Win / Loss: </span><span class='tooltip-win'>Win" + "</span></br>" + "<span class='tooltip-row-name'>Opponent: </span><span class='tooltip-opponent'>" + d['Opponent'] + "</span>");
                            }
                            else if (d['Win/Loss'] == "L") {
                                tooltipBox.html("<span class='tooltipHeader'>" + d['Date'] + "</span></br>" + "<span class='tooltip-row-name'>Win / Loss: </span><span class='tooltip-loss'>Loss" + "</span></br>" + "<span class='tooltip-row-name'>Opponent: </span><span class='tooltip-opponent'>" + d['Opponent'] + "</span>");
                            }
                            tooltipBox.show();
                            // console.log("mouse over: ");
                            // console.log(d);
                            if (isCircleSelected == false) {
                                //highlighting and diming player profile pictures
                                $(".player-default").addClass("player-dim");
                                var playerPhotos = $(".player-default");
                                $.each(playerPhotos, function(index, item) {
                                    if (item.dataset.name == d.Name) {
                                        $(this).removeClass("player-dim").addClass("player-selected");
                                    };
                                });

                                //highlight bar for the game
                                d3.selectAll(".game-score-bar").filter(function(b) {
                                    //console.log(d);
                                    return b.Date == d.Date;
                                })
                                .classed("bar-selected", true);

                                // $.each(gameBars, function(index, item) {
                                //     if (item.dataset.name == d.Name) {
                                //         $(this).addClass("player-selected");
                                //     };
                                // });

                                var pmColor;                        
                                if(d['+/-'].charAt(0) == "-") {
                                    pmColor = "#e74c3c";
                                }
                                else if(d['+/-'].charAt(0) == "0") {
                                    pmColor = "#f39c12";
                                }
                                else {
                                    pmColor = "#2ecc71";
                                }
                                $("#playerStatsLeft").html("<span class='tooltipHeader' style='color:#ddd'>" + d.Name + "</span> &nbsp <span class='tooltipHeader' style='color:" + pmColor + "'>" + d['+/-'] + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + d.MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + d.FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + d['3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + d['3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + d.FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + d.AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + d.STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + d.BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + d.TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + d.PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> +/-: </span>" + "<span class='tooltip-detail-num'>" + d['+/-'] + "</span>");
                                $.each(nested_starters, function(index, item) {
                                    if (item.key == d.Name) {
                                        $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                                    };
                                });
                            }
                        })             
                        .on("mouseout", function(d) {
                            tooltipBox.hide();
                            if (isCircleSelected == false) {
                                $(".player-default").removeClass("player-dim");

                                var playerPhotos = $(".player-default");
                                $.each(playerPhotos, function(index, item) {
                                    if (item.dataset.name == d.Name) {
                                        $(this).removeClass("player-selected");
                                    };
                                });

                                //remove highlighting effect of game bar
                                d3.selectAll(".game-score-bar").filter(function(b) {
                                    // console.log(gamesSelectedPlayersPlayed);

                                    // if Win button is selected
                                    if (isWinLossSelected == 1) {
                                        return ((b.Date == d.Date) && $.inArray(b.Date, gamesSelectedPlayersPlayed) == -1 && $.inArray(b.Date, teamWinDatesArray) == -1);
                                    }
                                    // if loss button got seletect
                                    else if (isWinLossSelected == 2) {
                                        return ((b.Date == d.Date) && $.inArray(b.Date, gamesSelectedPlayersPlayed) == -1 && $.inArray(b.Date, teamLossDatesArray) == -1);
                                    }

                                    else if (isWinLossSelected == 0) {
                                        //only remove the highlight effect when the matched date was found and it is not a date selected player played on
                                        return ((b.Date == d.Date) && $.inArray(b.Date, gamesSelectedPlayersPlayed) == -1);
                                    }
                                })
                                .classed("bar-selected", false);

                                $("#playerStatsLeft").empty();
                                $("#playerStatsRight").empty();
                            }
                        })
                        // click on a circle
                        .on("click", function(d) {
                            var self = $(this);

                            isWinLossSelected = 0;
                            $("#btnWin").attr("class", "winlossBtn-default");
                            $("#btnLoss").attr("class", "winlossBtn-default");

                            if(numOfPlayersSelected > 0 || numOfGameSelected > 0) {
                                d3.selectAll(".starter").classed("circle-highlighted", false);
                                d3.selectAll(".starter").classed("circle-dim", false);
                                d3.selectAll(".starter").classed("circle-selected", false);
                                d3.selectAll(".reserve").classed("circle-highlighted", false);
                                d3.selectAll(".reserve").classed("circle-dim", false);
                                d3.selectAll(".reserve").classed("circle-selected", false);
                                $(".img-thumbnail-selected").removeClass("img-thumbnail-selected");
                                $(".player-default").removeClass("player-dim");
                                $(".player-default").removeClass("player-selected");

                                d3.selectAll(".bar-selected").attr("class", "game-score-bar bar-default");

                                numOfPlayersSelected = 0;
                                numOfGameSelected = 0;

                                $("#playerStatsLeft").empty();
                                $("#playerStatsRight").empty();
                            }

                            //if no circle has been selected
                            if (isCircleSelected == false) {     
                                isCircleSelected = true;                   
                                var oldTooltipBoxTop = $("#tooltipTxtBox").position().top;
                                
                                self.attr("class", "dot starter circle-default circle-selected");

                                $(".player-default").addClass("player-dim");

                                var playerPhotos = $(".player-default");
                                $.each(playerPhotos, function(index, item) {
                                    if (item.dataset.name == d.Name) {
                                        $(this).removeClass("player-dim").addClass("player-selected");
                                    };
                                });

                                var pmColor;                        
                                if(d['+/-'].charAt(0) == "-") {
                                    pmColor = "#e74c3c";
                                }
                                else if(d['+/-'].charAt(0) == "0") {
                                    pmColor = "#f39c12";
                                }
                                else {
                                    pmColor = "#2ecc71";
                                }
                                $("#playerStatsLeft").html("<span class='tooltipHeader' style='color:#ddd'>" + d.Name + "</span> &nbsp <span class='tooltipHeader' style='color:" + pmColor + "'>" + d['+/-'] + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + d.MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + d.FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + d['3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + d['3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + d.FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + d.AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + d.STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + d.BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + d.TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + d.PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> +/-: </span>" + "<span class='tooltip-detail-num'>" + d['+/-'] + "</span>");
                                $.each(nested_starters, function(index, item) {
                                    if (item.key == d.Name) {
                                        $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                                    };
                                });
                            }
                            //if the same circle has been clicked again, then deselect this circle
                            else if (isCircleSelected == true) {  
                                //console.log(self);  
                                if (selectedCircle[0] == self[0]) {
                                    isCircleSelected = false;               
                                    $(".player-default").removeClass("player-dim");
                                    self.attr("class", "dot starter circle-default");

                                    var playerPhotos = $(".player-default");
                                    $.each(playerPhotos, function(index, item) {
                                        if (item.dataset.name == d.Name) {
                                            $(this).removeClass("player-selected");
                                        };
                                    });
                                    $("#playerStatsLeft").empty();
                                    $("#playerStatsRight").empty();
                                }
                                //if select another circle
                                else {
                                    isCircleSelected = true;
                                    $('.circle-selected').attr("class", "dot starter circle-default");
                                    self.attr("class", "dot starter circle-default circle-selected");

                                    $(".player-selected").removeClass("player-selected");
                                    $(".player-default").addClass("player-dim");
                                    var playerPhotos = $(".player-default");
                                    $.each(playerPhotos, function(index, item) {
                                        if (item.dataset.name == d.Name) {
                                            $(this).removeClass("player-dim").addClass("player-selected");
                                        };
                                    });

                                    var pmColor;                        
                                    if(d['+/-'].charAt(0) == "-") {
                                        pmColor = "#e74c3c";
                                    }
                                    else if(d['+/-'].charAt(0) == "0") {
                                        pmColor = "#f39c12";
                                    }
                                    else {
                                        pmColor = "#2ecc71";
                                    }
                                    $("#playerStatsLeft").html("<span class='tooltipHeader' style='color:#ddd'>" + d.Name + "</span> &nbsp <span class='tooltipHeader' style='color:" + pmColor + "'>" + d['+/-'] + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + "<span class='tooltip-detail-num'>" + d.MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + d.FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + d['3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + d['3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + d.FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + d.AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + d.STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + d.BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + d.TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + d.PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> +/-: </span>" + "<span class='tooltip-detail-num'>" + d['+/-'] + "</span>");
                                    $.each(nested_starters, function(index, item) {
                                        if (item.key == d.Name) {
                                            $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                                        };
                                    });
                                }
                            }
                            selectedCircle = self;
                        })
                        .transition()
                        .duration(500);

                var reserveItem = scatterPlot.selectAll(".reserve")
                        .data(reserves)
                    .enter().append("g");
                    
                var reserveCircle = reserveItem.append("circle")
                    .attr("class", "dot reserve circle-default")
                    .attr("r", 6)
                    .attr("fill", function(d) {
                        if (getColorSelectionOption() == "StarterReserve") {
                            return starterReserveColorTable[1];
                        }
                        else if (getColorSelectionOption() == "PlusMinus") {
                            return changeColorScheme(d);
                        }
                        else if (getColorSelectionOption() == "PlayerPosition") {
                            switch(d["Position"]) {
                                case "G":
                                    return playerPositionColorTable[0];
                                    break;
                                case "F":
                                    return playerPositionColorTable[1];
                                    break;
                                case "C":
                                    return playerPositionColorTable[2];
                                    break;
                                case "":
                                    return playerPositionColorTable[3];
                                    break;
                                default:
                                    return "#f00";
                            }
                            // var posColor;
                            // $.each(playersPos.players, function(index, item) {
                            //     if (item.name == d.Name) {     
                            //         switch (item.positions[0]) {
                            //             case "Point guard":
                            //                 posColor = playerPositionColorTable[0];
                            //                 break;
                            //             case "Shooting guard":
                            //                 posColor = playerPositionColorTable[1];
                            //                 break;
                            //             case "Small forward":
                            //                 posColor = playerPositionColorTable[2];
                            //                 break;
                            //             case "Power forward":
                            //                 posColor = playerPositionColorTable[3];
                            //                 break;
                            //             case "Center":
                            //                 posColor = playerPositionColorTable[4];
                            //                 break;
                            //             default:
                            //                 posColor = "#f00";
                            //         }
                            //     }
                            // })
                            // return posColor;
                        }
                        else if (getColorSelectionOption() == "WinLoss") {
                                // console.log(d);
                                switch(d["Win/Loss"]) {
                                    case "W":
                                        return winLossColorTable[0];
                                        break;
                                    case "L":
                                        return winLossColorTable[1];
                                        break;
                                }
                            }
                    })
                    .attr("cx", function(d) {
                        if (getXSelectedOption() == "MP") {
                            return d3.round(calcMinutesPlayed(d, "x") + (15 * (Math.random()-0.5)));
                        }
                        else {
                            return d3.round(xScale(d[getXSelectedOption()]) + (15 * (Math.random()-0.5)));
                        }
                    })
                    .attr("cy", function(d) { 
                        if (getYSelectedOption() == "MP") {
                            return d3.round(calcMinutesPlayed(d, "y") + (15 * (Math.random()-0.5)));
                        }
                        else {
                            return d3.round(yScale(d[getYSelectedOption()]) + (15 * (Math.random()-0.5)));
                        }
                    })
                    .on("mouseover", function(d) {
                        if (isCircleSelected == false) {
                            $(".player-default").addClass("player-dim");

                            var playerPhotos = $(".player-default");
                            $.each(playerPhotos, function(index, item) {
                                if (item.dataset.name == d.Name) {
                                    $(this).removeClass("player-dim").addClass("player-selected");
                                    
                                };
                            });

                            var pmColor;                        
                            if(d['+/-'].charAt(0) == "-") {
                                pmColor = "#e74c3c";
                            }
                            else if(d['+/-'].charAt(0) == "0") {
                                pmColor = "#f39c12";
                            }
                            else {
                                pmColor = "#2ecc71";
                            }
                            
                            $("#playerStatsLeft").html("<span class='tooltipHeader' style='color:#ddd'>" + d.Name + "</span> &nbsp <span class='tooltipHeader' style='color:" + pmColor + "'>" + d['+/-'] + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + d.MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + d.FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + d['3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + d['3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + d.FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + d.AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + d.STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + d.BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + d.TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + d.PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> +/-: </span>" + "<span class='tooltip-detail-num'>" + d['+/-'] + "</span>");
                            $.each(nested_starters, function(index, item) {
                                if (item.key == d.Name) {
                                    $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                                };
                            });
                        }
                    })             
                    .on("mouseout", function(d) {
                        if (isCircleSelected == false) {
                            $(".player-default").removeClass("player-dim");

                            var playerPhotos = $(".player-default");
                            $.each(playerPhotos, function(index, item) {
                                if (item.dataset.name == d.Name) {
                                    $(this).removeClass("player-selected");
                                };
                            });
                            $("#playerStatsLeft").empty();
                            $("#playerStatsRight").empty();
                        }
                    })
                    .on("click", function(d) {
                        if (isCircleSelected == false) {     
                            isCircleSelected = true;                   
                            var oldTooltipBoxTop = $("#tooltipTxtBox").position().top;
                            $(this).attr("class", "dot starter circle-default circle-selected");

                            $(".player-default").addClass("player-dim");

                            var playerPhotos = $(".player-default");
                            $.each(playerPhotos, function(index, item) {
                                if (item.dataset.name == d.Name) {
                                    $(this).removeClass("player-dim").addClass("player-selected");
                                   
                                };
                            });

                            var pmColor;                        
                            if(d['+/-'].charAt(0) == "-") {
                                pmColor = "#e74c3c";
                            }
                            else if(d['+/-'].charAt(0) == "0") {
                                pmColor = "#f39c12";
                            }
                            else {
                                pmColor = "#2ecc71";
                            }
                            $("#playerStatsLeft").html("<span class='tooltipHeader' style='color:#ddd'>" + d.Name + "</span> &nbsp <span class='tooltipHeader' style='color:" + pmColor + "'>" + d['+/-'] + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + d.MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + d.FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + d['3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + d['3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + d.FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + d.AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + d.STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + d.BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + d.TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + d.PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> +/-: </span>" + "<span class='tooltip-detail-num'>" + d['+/-'] + "</span>");
                            $.each(nested_starters, function(index, item) {
                                if (item.key == d.Name) {
                                    $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                                };
                            });
                        }
                        else if (isCircleSelected == true) {    
                            if (selectedCircle[0] == $(this)[0]) {
                                isCircleSelected = false;               
                                $(".player-default").removeClass("player-dim");
                                $(this).attr("class", "dot starter circle-default");

                                var playerPhotos = $(".player-default");
                                $.each(playerPhotos, function(index, item) {
                                    if (item.dataset.name == d.Name) {
                                        $(this).removeClass("player-selected");
                                    };
                                });
                                $("#playerStatsLeft").empty();
                                $("#playerStatsRight").empty();
                            }
                            else {
                                isCircleSelected = true;
                                $('.circle-selected').attr("class", "dot starter circle-default");
                                $(this).attr("class", "dot starter circle-default circle-selected");

                                $(".player-selected").removeClass("player-selected");
                                $(".player-default").addClass("player-dim");
                                var playerPhotos = $(".player-default");
                                $.each(playerPhotos, function(index, item) {
                                    if (item.dataset.name == d.Name) {
                                        $(this).removeClass("player-dim").addClass("player-selected");
                                    };
                                });

                                var pmColor;                        
                                if(d['+/-'].charAt(0) == "-") {
                                    pmColor = "#e74c3c";
                                }
                                else if(d['+/-'].charAt(0) == "0") {
                                    pmColor = "#f39c12";
                                }
                                else {
                                    pmColor = "#2ecc71";
                                }
                                $("#playerStatsLeft").html("<span class='tooltipHeader' style='color:#ddd'>" + d.Name + "</span> &nbsp <span class='tooltipHeader' style='color:" + pmColor + "'>" + d['+/-'] + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + d.MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + d.FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + d['3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + d['3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + d.FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + d.FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(d['FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + d.TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + d.AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + d.STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + d.BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + d.TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + d.PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + d.PTS + "</span> <br/> <span class='tooltip-detail-title'> +/-: </span>" + "<span class='tooltip-detail-num'>" + d['+/-'] + "</span>");
                                $.each(nested_starters, function(index, item) {
                                    if (item.key == d.Name) {
                                        $("#playerStatsRight").html("<span class='tooltipHeader' style='color:#ddd'>" + "Seasonal Average" + "</span> <hr size='1' style='margin: 3px 0px 6px 0px'>" + "<span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span> <br/> <span class='tooltip-detail-title'> Minutes Played: </span>" + item.values.avg_MP + "</span> <br/> <span class='tooltip-detail-title'> Field Goals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FG + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FGA + "</span> <br/> <span class='tooltip-detail-title'> Field Goal Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FG%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> 3 Points: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3P'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values['avg_3PA'] + "</span> <br/> <span class='tooltip-detail-title'> 3 Point Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_3P%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Free Throws: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FT + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Attempts: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_FTA + "</span> <br/> <span class='tooltip-detail-title'> Free Throw Percentage: </span>" + "<span class='tooltip-detail-num'>" + d3.round(item.values['avg_FT%']*100, 2) + "%</span> <br/> <span class='tooltip-detail-title'> Offensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_ORB + "</span> <br/> <span class='tooltip-detail-title'> Defensive Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_DRB + "</span> <br/> <span class='tooltip-detail-title'> Total Rebounds: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TRB + "</span> <br/> <span class='tooltip-detail-title'> Assists: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_AST + "</span> <br/> <span class='tooltip-detail-title'> Steals: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_STL + "</span> <br/> <span class='tooltip-detail-title'> Blockss: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_BLK + "</span> <br/> <span class='tooltip-detail-title'> Turnovers: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_TOV + "</span> <br/> <span class='tooltip-detail-title'> Personal Fouls: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PF + "</span> <br/> <span class='tooltip-detail-title'> Points: </span>" + "<span class='tooltip-detail-num'>" + item.values.avg_PTS + "</span>");
                                    };
                                });

                            }
                        }

                        selectedCircle = $(this);
                    }); 

                }); //load data     
            });    //load data
        }); // load data

        //draw legends for circles
        var scatterPlotLegend = scatterPlot.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(0," + (height+40) + ")");
        
        var legendOffset = 80;
        scatterPlotLegend.selectAll(".legend-circle-winloss")
                .data(["Win", "Loss"])
            .enter().append("circle")
                .attr("class", "legend-circle-winloss")
                .attr("r", 6)
                .attr("fill", function(d, i) { return winLossColorTable[i]; })
                .attr("transform", function(d, i) { return "translate(" + (width - legendOffset * (i+1)) + ", 0)"; })

        scatterPlotLegend.selectAll(".legend-text-winloss")
                .data(winLossColorTable)
            .enter().append("text")
                .attr("class", "legend-text-winloss")
                .attr("r", 6)
                .attr("dx", "1em")
                    .attr("dy", "0.4em")
                    .attr("fill", "#888")
                    .attr("transform", function(d, i) { return "translate(" + (width - legendOffset * (i+1)) + ", 0)"; })
                    .text(function(d, i) {
                        switch (i) {
                            case 0:
                                return "Win";
                                break;
                            case 1:
                                return "Loss";
                                break;
                        }
                    });

        legendOffset = 100;
        if (getColorSelectionOption() == "PlusMinus") {
            scatterPlotLegend.selectAll(".legend-circle")
                    .data(plusMinusColorTable)
                .enter().append("circle")
                    .attr("class", "legend-circle")
                    .attr("r", 6)
                    .attr("fill", function(d, i) { return plusMinusColorTable[i]; })
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; });

            scatterPlotLegend.selectAll(".legend-text")
                    .data(plusMinusColorTable)
                .enter().append("text")
                    .attr("class", "legend-text")
                    .attr("dx", "1em")
                    .attr("dy", "0.4em")
                    .attr("fill", "#888")
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; })
                    .text(function(d, i) {
                        switch (i) {
                            case 0:
                                return "Plus";
                                break;
                            case 1:
                                return "Minus";
                                break;
                            case 2:
                                return "Zero";
                                break;
                        }
                    });
        }
        else if (getColorSelectionOption() == "StarterReserve") {
            scatterPlotLegend.selectAll(".legend-circle")
                    .data(starterReserveColorTable)
                .enter().append("circle")
                    .attr("class", "legend-circle")
                    .attr("r", 6)
                    .attr("fill", function(d, i) { return starterReserveColorTable[i]; })
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; });

            scatterPlotLegend.selectAll(".legend-text")
                    .data(plusMinusColorTable)
                .enter().append("text")
                    .attr("class", "legend-text")
                    .attr("dx", "1em")
                    .attr("dy", "0.4em")
                    .attr("fill", "#888")
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; })
                    .text(function(d, i) {
                        switch (i) {
                            case 0:
                                return "Starter";
                                break;
                            case 1:
                                return "Reserve";
                                break;
                        }
                    });
        }
        else if (getColorSelectionOption() == "PlayerPosition") {
            legendOffset = 100;
            scatterPlotLegend.selectAll(".legend-circle")
                    .data(playerPositionColorTable)
                .enter().append("circle")
                    .attr("class", "legend-circle")
                    .attr("r", 6)
                    .attr("fill", function(d, i) { return playerPositionColorTable[i]; })
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; });

            scatterPlotLegend.selectAll(".legend-text")
                    .data(playerPositionColorTable)
                .enter().append("text")
                    .attr("class", "legend-text")
                    .attr("dx", "1em")
                    .attr("dy", "0.4em")
                    .attr("fill", "#888")
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; })
                    .text(function(d, i) {
                        switch (i) {
                            case 0:
                                return "Guard";
                                break;
                            case 1:
                                return "Forward";
                                break;
                            case 2:
                                return "Center";
                                break;
                            case 3:
                                return "Reserve";
                                break;
                        }
                    });
        }
        else if (getColorSelectionOption() == "WinLoss") {
            scatterPlotLegend.selectAll(".legend-circle")
                    .data(winLossColorTable)
                .enter().append("circle")
                    .attr("class", "legend-circle")
                    .attr("r", 6)
                    .attr("fill", function(d, i) { return winLossColorTable[i]; })
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; });

            scatterPlotLegend.selectAll(".legend-text")
                    .data(playerPositionColorTable)
                .enter().append("text")
                    .attr("class", "legend-text")
                    .attr("dx", "1em")
                    .attr("dy", "0.4em")
                    .attr("fill", "#888")
                    .attr("transform", function(d, i) { return "translate(" + (legendOffset * i) + ", 0)"; })
                    .text(function(d, i) {
                        switch (i) {
                            case 0:
                                return "Win";
                                break;
                            case 1:
                                return "Loss";
                                break;
                        }
                    });
        }


        //create svg canvas for bar chart
        var gameStatsBarChart = d3.select("#gameStatsBarChartVis").append("svg")
                .attr("id", "gameScoreBarChartSVG")
                .attr("width", width + margin.left + margin.right)
                .attr("height", gameScoreBarHeight + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        gameStatsBarChart.call(gameBarTooltip);

        var barYScale = d3.scale.linear()
            .range([gameScoreBarHeight, 0]);
        
        var barYAxis = d3.svg.axis()
            .ticks(8)
            .scale(barYScale)
            .orient("left");

        // scatterPlot.append("g")
        //                 .attr("class", "y axis")
        //                 .call(yAxis)
        //             .append("text")
        //                 .attr("class", "label")
        //                 .attr("transform", "rotate(-90)")
        //                 .attr("y", 6)
        //                 .attr("dy", ".71em")
        //                 .style("text-anchor", "end")
        //                 .text(getYSelectedOption());

        //team bar chart
        d3.csv(teamStatsDataPath, function(seletedTeamStats) {
            // console.log(seletedTeamStats);
            $.each(seletedTeamStats, function(index, item) {
                // console.log(item.Date);
                switch (item.WinLoss) {
                    case "W":
                        teamWinDatesArray.push(item.Date);
                        break;
                    case "L":
                        teamLossDatesArray.push(item.Date);
                        break;
                }
            });

            var gameScoreMax = d3.max(seletedTeamStats, function(d) { return (+d.TmScore); });
            gameScoreBarY.domain([0, gameScoreMax]);

            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            // console.log(gameScoreMax);
            barYScale.domain([0, gameScoreMax]);

            gameStatsBarChart.append("g")
                        .attr("class", "y axis")
                        .call(barYAxis)
                    .append("text")
                        .attr("class", "label barChart-axis-label")
                        //.attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dx", "0.5em")
                        .attr("dy", "-0.5em")
                        .style("text-anchor", "start")
                        .text("Team Score");

            var scoreBarChart = gameStatsBarChart.selectAll("game-score-bar")
                    .data(seletedTeamStats)
                .enter().append("rect")
                    .attr("class", "game-score-bar bar-default")
                    //.style({"fill":"#159594"})
                    .attr("fill", function(d) {
                        switch (d.WinLoss) {
                            case "W":
                                //return "#4575b4";
                                return winLossColorTable[0];
                                //return "#02488D";
                                break;
                            case "L":
                                //return "#f46d43";
                                return winLossColorTable[1];
                                //return "#E27321";
                                break;
                        }
                    })
                    .attr("width", gameScoreBarWidth)
                    .attr("height", function(d, i) {
                        return gameScoreBarHeight-gameScoreBarY(+d.TmScore);
                    })
                    .attr("x", function(d, i) { return (i+1) * (gameScoreBarWidth+3); })
                    .attr("y", function(d, i) { 
                        //console.log(d);
                        return gameScoreBarY(+d.TmScore); })
                    // mouse over a game bar
                    .on("mouseover", function(d) {
                        //console.log(d);
                        if (d['WinLoss'] == "W") {
                            gameBarTooltip.html("<span class='tooltipHeader'>" + d['Date'] + "</span></br>" + "<span class='tooltip-row-name'>Win / Loss: </span><span class='tooltip-win'>Win" + "</span></br>" + "<span class='tooltip-row-name'>Team Score: </span><span class='tooltip-win'>" + d.TmScore + "</span></br>" + "<span class='tooltip-row-name'>Opponent: </span><span class='tooltip-opponent'>" + d['Opponent'] + "</span></br>" + "<span class='tooltip-row-name'>Opponent Score: </span><span class='tooltip-loss'>" + d.OppScore + "</span>");
                        }
                        else if (d['WinLoss'] == "L") {
                            gameBarTooltip.html("<span class='tooltipHeader'>" + d['Date'] + "</span></br>" + "<span class='tooltip-row-name'>Win / Loss: </span><span class='tooltip-loss'>Loss" + "</span></br>" + "<span class='tooltip-row-name'>Team Score: </span><span class='tooltip-loss'>" + d.TmScore + "</span></br>" + "<span class='tooltip-row-name'>Opponent: </span><span class='tooltip-opponent'>" + d['Opponent'] + "</span></br>" + "<span class='tooltip-row-name'>Opponent Score: </span><span class='tooltip-win'>" + d.OppScore + "</span>");
                            // gameBarTooltip.html("<span class='tooltipHeader'>" + d['Date'] + "</span></br>" + "<span class='tooltip-row-name'>Win / Loss: </span><span class='tooltip-loss'>Loss" + "</span></br>" + "<span class='tooltip-row-name'>Opponent: </span><span class='tooltip-opponent'>" + d['Opponent'] + "</span>");
                        }
                        gameBarTooltip.show();
                    })
                    .on("mouseout", function(d) {
                        gameBarTooltip.hide();
                    })
                    // click on an individual bar for a game
                    .on("click", function(d) {
                        // console.log(isWinLossSelected);
                        if (isWinLossSelected != 0) {
                            d3.selectAll(".bar-selected").attr("class", "game-score-bar bar-default");
                            $("#btnWin").attr("class", "winlossBtn-default");
                            $("#btnLoss").attr("class", "winlossBtn-default");
                            d3.selectAll(".starter").classed("circle-highlighted", false);
                            d3.selectAll(".reserve").classed("circle-highlighted", false);
                            d3.selectAll(".starter").classed("circle-dim", false);
                            d3.selectAll(".reserve").classed("circle-dim", false);
                            isWinLossSelected = 0;
                            isCircleSelected == false;
                            numOfPlayersSelected = 0;
                            numOfGameSelected = 0;
                        }

                        //console.log(d.Date);
                        var clickedGame = d.Date;
                        //console.log($(this)[0].classList);

                        // if no player img got selected, then just draw highlight circles of players who played in this game 
                        if (numOfPlayersSelected == 0 && isCircleSelected == false) {
                            // if the bar you clicked on has not been selected
                            if (!$(this)[0].classList.contains("bar-selected")) {
                                numOfGameSelected++;
                                $(this).attr("class", "game-score-bar bar-default bar-selected");
                                d3.selectAll(".starter").filter(function(d) {return d.Date == clickedGame})
                                    .classed("circle-highlighted", true);
                                d3.selectAll(".reserve").filter(function(d) {return d.Date == clickedGame})
                                    .classed("circle-highlighted", true);
                                d3.selectAll(".starter").filter(function(d) {
                                    return (d.Date != clickedGame); })
                                    .classed("circle-dim", true);
                                d3.selectAll(".reserve").filter(function(d) {
                                    return (d.Date != clickedGame); })
                                    .classed("circle-dim", true);

                                var onCourtPlayerNames = [];
                                //get players list for that game
                                var highlightedPlayerStats = d3.selectAll(".circle-highlighted").data();
                                //console.log(highlightedPlayerStats);
                                
                                $.each(highlightedPlayerStats, function(index, item) {
                                    onCourtPlayerNames.push(item.Name);
                                })
                                //console.log(onCourtPlayerNames);

                                //highlight and dim player profile images
                                $(".player-default").addClass("player-dim");
                                var playerPhotos = $(".player-default");

                                $.each(playerPhotos, function(index, item) {
                                    var self = $(this);
                                    //console.log(item.dataset.name);
                                    $.each(onCourtPlayerNames, function(i, name) {
                                        // console.log(name);
                                        if (item.dataset.name == name) {
                                            // console.log("found player!");
                                            // console.log(self);
                                            self.removeClass("player-dim").addClass("player-selected");
                                        }
                                    });                                
                                });
                            }
                            // if the same bar has been select, then deselect
                            else if ($(this)[0].classList.contains("bar-selected")) {
                                numOfGameSelected--;
                                $(this).attr("class", "game-score-bar bar-default");
                                // if still some games were selected
                                if (numOfGameSelected != 0) {                            
                                    d3.selectAll(".starter").filter(function(d) {return d.Date == clickedGame})
                                        .classed("circle-highlighted", false);
                                    d3.selectAll(".reserve").filter(function(d) {return d.Date == clickedGame})
                                        .classed("circle-highlighted", false);

                                    var playerPhotos = $(".player-default");
                                    $.each(playerPhotos, function(index, item) {
                                        $(this).removeClass("player-dim");
                                        $(this).removeClass("player-selected");
                                    });

                                    var onCourtPlayerNames = [];
                                    var highlightedPlayerStats = d3.selectAll(".circle-highlighted").data();
                                    //console.log(highlightedPlayerStats);
                                    $.each(highlightedPlayerStats, function(index, item) {
                                        onCourtPlayerNames.push(item.Name);
                                    })
                                    //console.log(onCourtPlayerNames);

                                    //highlight and dim player profile images
                                    $(".player-default").addClass("player-dim");
                                    playerPhotos = $(".player-default");

                                    $.each(playerPhotos, function(index, item) {
                                        var self = $(this);
                                        //console.log(item.dataset.name);
                                        $.each(onCourtPlayerNames, function(i, name) {
                                            //console.log(name);
                                            if (item.dataset.name == name) {
                                                //console.log("found player!");
                                                //console.log(self);
                                                self.removeClass("player-dim").addClass("player-selected");
                                            }
                                        });                                
                                    });
                                }
                                // if none of the game was selected
                                else {
                                    d3.selectAll(".starter").classed("circle-highlighted", false);
                                    d3.selectAll(".starter").classed("circle-dim", false);
                                    d3.selectAll(".reserve").classed("circle-highlighted", false);
                                    d3.selectAll(".reserve").classed("circle-dim", false);

                                    var playerPhotos = $(".player-default");
                                    $.each(playerPhotos, function(index, item) {
                                        $(this).removeClass("player-dim");
                                        $(this).removeClass("player-selected");
                                    });
                                }
                            }
                        }
                        // if a player img was selected, then deselect every circle to set every circle to default state
                        else if (numOfPlayersSelected > 0 || isCircleSelected == true) {
                            //console.log(isCircleSelected);
                            d3.selectAll(".starter").classed("circle-highlighted", false);
                            d3.selectAll(".starter").classed("circle-dim", false);
                            d3.selectAll(".starter").classed("circle-selected", false);
                            d3.selectAll(".reserve").classed("circle-highlighted", false);
                            d3.selectAll(".reserve").classed("circle-dim", false);
                            d3.selectAll(".reserve").classed("circle-selected", false);
                            d3.selectAll(".game-score-bar").classed("bar-selected", false);
                            $(".img-thumbnail-selected").removeClass("img-thumbnail-selected");
                            $(".player-default").removeClass("player-dim");
                            $(".player-default").removeClass("player-selected");

                            numOfPlayersSelected = 0;
                            isCircleSelected = false;
                            numOfGameSelected = 1;
                            $(this).attr("class", "game-score-bar bar-default bar-selected");
                            d3.selectAll(".starter").filter(function(d) {return d.Date == clickedGame})
                                .classed("circle-highlighted", true);
                            d3.selectAll(".reserve").filter(function(d) {return d.Date == clickedGame})
                                .classed("circle-highlighted", true);
                            d3.selectAll(".starter").filter(function(d) {
                                return (d.Date != clickedGame); })
                                .classed("circle-dim", true);
                            d3.selectAll(".reserve").filter(function(d) {
                                return (d.Date != clickedGame); })
                                .classed("circle-dim", true);

                            $("#playerStatsLeft").empty();
                            $("#playerStatsRight").empty();

                            var onCourtPlayerNames = [];
                            var highlightedPlayerStats = d3.selectAll(".circle-highlighted").data();
                            //console.log(highlightedPlayerStats);
                            $.each(highlightedPlayerStats, function(index, item) {
                                onCourtPlayerNames.push(item.Name);
                            })
                            //console.log(onCourtPlayerNames);

                            //highlight and dim player profile images
                            $(".player-default").addClass("player-dim");
                            var playerPhotos = $(".player-default");

                            $.each(playerPhotos, function(index, item) {
                                var self = $(this);
                                //console.log(item.dataset.name);
                                $.each(onCourtPlayerNames, function(i, name) {
                                    //console.log(name);
                                    if (item.dataset.name == name) {
                                        //console.log("found player!");
                                        //console.log(self);
                                        self.removeClass("player-dim").addClass("player-selected");
                                    }
                                });                                
                            });
                        }
                    });
        
            //console.log(seletedTeamStats);
            var teamWinLossRollup = d3.nest()
                .key(function(d) { return d.WinLoss; })
                .rollup(function(leaves) { return leaves.length; })
                .entries(seletedTeamStats);
            //console.log(teamWinLossRollup);

            var winLossBtnTxt = ["Win", "Loss", "Clear"];
            gameStatsBarChart.selectAll(".winlossBtn-default")
                    .data(winLossBtnTxt)
                .enter().append("rect")
                    .attr("class", "winlossBtn-default")
                    .attr("id", function(d, i) { return "btn" + d; })
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("width", 56)
                    .attr("height", 30)
                    .attr("fill", function(d, i) {
                        return winLossColorTable[i];
                    })
                    .attr("transform", function(d, i) {
                        return "translate(" + (width-36) + ", " + (i*40-20) + ")";
                    })
                    .on("click", function(d, i) {
                        // if Clear Btn got clicked
                        if (i == 2) {
                            $("#btnWin").attr("class", "winlossBtn-default");                        
                            $("#btnLoss").attr("class", "winlossBtn-default");
                            $("#btnClear").attr("class", "winlossBtn-default");
                            isWinLossSelected = 0;

                            d3.selectAll(".starter").classed("circle-highlighted", false);
                            d3.selectAll(".starter").classed("circle-dim", false);
                            d3.selectAll(".starter").classed("circle-selected", false);
                            d3.selectAll(".reserve").classed("circle-highlighted", false);
                            d3.selectAll(".reserve").classed("circle-dim", false);
                            d3.selectAll(".reserve").classed("circle-selected", false);
                            $(".img-thumbnail-selected").removeClass("img-thumbnail-selected");
                            $(".player-default").removeClass("player-dim");
                            $(".player-default").removeClass("player-selected");
                            d3.selectAll(".bar-selected").attr("class", "game-score-bar bar-default");

                            numOfPlayersSelected = 0;
                            isCircleSelected = false;
                            numOfGameSelected = 0;
                            
                            $("#playerStatsLeft").empty();
                            $("#playerStatsRight").empty();
                        }
                        // if clicking on Win or Loss buttons
                        else {
                            var clickedBtn = "#btn" + d;
                            var unclickedBtn = "#btn" + winLossBtnTxt[1-i];
                            //console.log($(clickedBtn));
                            //select win/loss all
                            if (!$(clickedBtn)[0].classList.contains("winlossBtn-selected")) {
                                $(clickedBtn).attr("class", "winlossBtn-default winlossBtn-selected");
                                $(unclickedBtn).attr("class", "winlossBtn-default");
                                $("#btnClear").attr("class", "winlossBtn-default");
                                
                                if (i == 0) {
                                    isWinLossSelected = 1;
                                }
                                else if(i == 1) {
                                    isWinLossSelected = 2;
                                }


                                d3.selectAll(".starter").classed("circle-highlighted", false);
                                d3.selectAll(".starter").classed("circle-dim", false);
                                d3.selectAll(".starter").classed("circle-selected", false);
                                d3.selectAll(".reserve").classed("circle-highlighted", false);
                                d3.selectAll(".reserve").classed("circle-dim", false);
                                d3.selectAll(".reserve").classed("circle-selected", false);
                                $(".img-thumbnail-selected").removeClass("img-thumbnail-selected");
                                $(".player-default").removeClass("player-dim");
                                $(".player-default").removeClass("player-selected");
                                d3.selectAll(".bar-selected").attr("class", "game-score-bar bar-default");

                                numOfPlayersSelected = 0;
                                isCircleSelected = false;
                                numOfGameSelected = teamWinLossRollup[i].values;
                                // console.log(numOfGameSelected + " games selected");

                                var selectedWinLoss = d.charAt(0);
                                // console.log(selectedWinLoss);
                                d3.selectAll(".starter").filter(function(d) { return d["Win/Loss"] == selectedWinLoss; })
                                    .classed("circle-highlighted", true);
                                d3.selectAll(".reserve").filter(function(d) { return d["Win/Loss"] == selectedWinLoss; })
                                    .classed("circle-highlighted", true);
                                d3.selectAll(".starter").filter(function(d) { return d["Win/Loss"] != selectedWinLoss; })
                                    .classed("circle-dim", true);
                                d3.selectAll(".reserve").filter(function(d) { return d["Win/Loss"] != selectedWinLoss; })
                                    .classed("circle-dim", true);

                                d3.selectAll(".game-score-bar").filter(function(d) {
                                    //console.log(d);
                                    return d.WinLoss == selectedWinLoss; 
                                }).classed("bar-selected", true);

                                $("#playerStatsLeft").empty();
                                $("#playerStatsRight").empty();
                            }
                            //deselect Win/loss all
                            else {
                                $(clickedBtn).attr("class", "winlossBtn-default");                        
                                $(unclickedBtn).attr("class", "winlossBtn-default");
                                $("#btnClear").attr("class", "winlossBtn-default");
                                isWinLossSelected = 0;

                                d3.selectAll(".starter").classed("circle-highlighted", false);
                                d3.selectAll(".starter").classed("circle-dim", false);
                                d3.selectAll(".starter").classed("circle-selected", false);
                                d3.selectAll(".reserve").classed("circle-highlighted", false);
                                d3.selectAll(".reserve").classed("circle-dim", false);
                                d3.selectAll(".reserve").classed("circle-selected", false);
                                $(".img-thumbnail-selected").removeClass("img-thumbnail-selected");
                                $(".player-default").removeClass("player-dim");
                                $(".player-default").removeClass("player-selected");
                                d3.selectAll(".bar-selected").attr("class", "game-score-bar bar-default");

                                numOfPlayersSelected = 0;
                                isCircleSelected = false;
                                numOfGameSelected = 0;
                                
                                $("#playerStatsLeft").empty();
                                $("#playerStatsRight").empty();
                            }
                        }
                    })

            gameStatsBarChart.selectAll(".winlossBtnTxt")
                    .data(winLossBtnTxt)
                .enter().append("text")
                    .attr("class", "winlossBtnTxt")
                    .attr("dx", "2em")
                    .attr("dy", "1.35em")
                    .attr("fill", "#bbb")
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d, i) {
                        return "translate(" + (width-36) + ", " + (i*40-20) + ")";
                    })
                    .text(function(d) { return d; })
                    .on("mouseover", function(d, i) {
                    })
                    // click on All Win or All Loss Btn
                    .on("click", function(d, i) {
                        // if clicking on Clear Button
                        if (i == 2) {
                            $("#btnWin").attr("class", "winlossBtn-default");                        
                            $("#btnLoss").attr("class", "winlossBtn-default");
                            $("#btnClear").attr("class", "winlossBtn-default");
                            isWinLossSelected = 0;

                            d3.selectAll(".starter").classed("circle-highlighted", false);
                            d3.selectAll(".starter").classed("circle-dim", false);
                            d3.selectAll(".starter").classed("circle-selected", false);
                            d3.selectAll(".reserve").classed("circle-highlighted", false);
                            d3.selectAll(".reserve").classed("circle-dim", false);
                            d3.selectAll(".reserve").classed("circle-selected", false);
                            $(".img-thumbnail-selected").removeClass("img-thumbnail-selected");
                            $(".player-default").removeClass("player-dim");
                            $(".player-default").removeClass("player-selected");
                            d3.selectAll(".bar-selected").attr("class", "game-score-bar bar-default");

                            numOfPlayersSelected = 0;
                            isCircleSelected = false;
                            numOfGameSelected = 0;
                            
                            $("#playerStatsLeft").empty();
                            $("#playerStatsRight").empty();
                        }
                        // if clicking on Win or Loss buttons
                        else {
                            var clickedBtn = "#btn" + d;
                            var unclickedBtn = "#btn" + winLossBtnTxt[1-i];
                            //console.log($(clickedBtn));
                            if (!$(clickedBtn)[0].classList.contains("winlossBtn-selected")) {
                                $(clickedBtn).attr("class", "winlossBtn-default winlossBtn-selected");
                                $(unclickedBtn).attr("class", "winlossBtn-default");
                                $("#btnClear").attr("class", "winlossBtn-default");
                                
                                if (i == 0) {
                                    isWinLossSelected == 1;
                                }
                                else if(i == 1) {
                                    isWinLossSelected == 2;
                                }

                                d3.selectAll(".starter").classed("circle-highlighted", false);
                                d3.selectAll(".starter").classed("circle-dim", false);
                                d3.selectAll(".starter").classed("circle-selected", false);
                                d3.selectAll(".reserve").classed("circle-highlighted", false);
                                d3.selectAll(".reserve").classed("circle-dim", false);
                                d3.selectAll(".reserve").classed("circle-selected", false);
                                $(".img-thumbnail-selected").removeClass("img-thumbnail-selected");
                                $(".player-default").removeClass("player-dim");
                                $(".player-default").removeClass("player-selected");
                                d3.selectAll(".bar-selected").attr("class", "game-score-bar bar-default");

                                numOfPlayersSelected = 0;
                                isCircleSelected = false;
                                numOfGameSelected = teamWinLossRollup[i].values;
                                // console.log(numOfGameSelected + " games selected");

                                var selectedWinLoss = d.charAt(0);
                                // console.log(selectedWinLoss);
                                d3.selectAll(".starter").filter(function(d) { return d["Win/Loss"] == selectedWinLoss; })
                                    .classed("circle-highlighted", true);
                                d3.selectAll(".reserve").filter(function(d) { return d["Win/Loss"] == selectedWinLoss; })
                                    .classed("circle-highlighted", true);
                                d3.selectAll(".starter").filter(function(d) { return d["Win/Loss"] != selectedWinLoss; })
                                    .classed("circle-dim", true);
                                d3.selectAll(".reserve").filter(function(d) { return d["Win/Loss"] != selectedWinLoss; })
                                    .classed("circle-dim", true);

                                d3.selectAll(".game-score-bar").filter(function(d) {
                                    //console.log(d);
                                    return d.WinLoss == selectedWinLoss; 
                                }).classed("bar-selected", true);

                                $("#playerStatsLeft").empty();
                                $("#playerStatsRight").empty();
                            }
                            else {
                                $(clickedBtn).attr("class", "winlossBtn-default");                        
                                $(unclickedBtn).attr("class", "winlossBtn-default");
                                $("#btnClear").attr("class", "winlossBtn-default");
                                isWinLossSelected = 0;

                                d3.selectAll(".starter").classed("circle-highlighted", false);
                                d3.selectAll(".starter").classed("circle-dim", false);
                                d3.selectAll(".starter").classed("circle-selected", false);
                                d3.selectAll(".reserve").classed("circle-highlighted", false);
                                d3.selectAll(".reserve").classed("circle-dim", false);
                                d3.selectAll(".reserve").classed("circle-selected", false);
                                $(".img-thumbnail-selected").removeClass("img-thumbnail-selected");
                                $(".player-default").removeClass("player-dim");
                                $(".player-default").removeClass("player-selected");
                                d3.selectAll(".bar-selected").attr("class", "game-score-bar bar-default");

                                numOfPlayersSelected = 0;
                                isCircleSelected = false;
                                numOfGameSelected = 0;
                                
                                $("#playerStatsLeft").empty();
                                $("#playerStatsRight").empty();
                            }
                        }
                    });
        });
    }


}// end of update function

function changeColorScheme(item) {
    if (getColorSelectionOption() == "PlusMinus") {
        if (+item['+/-'] > 0) {
            //return "#3374DC";
            return plusMinusColorTable[0];
        }
        else if(item['+/-'] < 0) {
            //return "#F26823";
            return plusMinusColorTable[1];
        }
        else if(item['+/-'] == 0) {
            //return "#C9F013";
            return plusMinusColorTable[2];
        }
    }
}


function setAllTeamXScale(teams) {
    var xMax;

    if (getXSelectedOption() == "MP") {

        var teamsMP = teams.map(function(d) { 
            //console.log(d["MP"]);
            mp = d[getXSelectedOption()].split(":");
            //console.log(mp[0]);
            return +mp[0]; 
        })
        //console.log(teamsMP);
        xMax = d3.max(teamsMP);
        console.log(xMax);

        xScale.domain([0, xMax]);
    }
    else {
        xMax = d3.max(teams.map(function(d) {
            return +d[getXSelectedOption()];
        }));
        xScale.domain([0, xMax]);
    }
}


function setAllTeamYScale(teams) {
    var yMax;

    if (getYSelectedOption() == "MP") {

        var teamsMP = teams.map(function(d) { 
            //console.log(d["MP"]);
            mp = d[getYSelectedOption()].split(":");
            //console.log(mp[0]);
            return +mp[0]; 
        })
        //console.log(teamsMP);
        yMax = d3.max(teamsMP);
        console.log(yMax);

        yScale.domain([0, yMax]);
    }
    else {
        yMax = d3.max(teams.map(function(d) {
            return +d[getYSelectedOption()];
        }));
        yScale.domain([0, yMax]);
    }
}


function setXScale(starters, reserves) {
    var starterMax4X, reserveMax4X, xMax;
    if (getXSelectedOption() == "MP") {

        var starterMP = starters.map(function(d) { 
            return timeFormat.parse(d[getXSelectedOption()]); 
        })

        starterMax4X = d3.max(starterMP);
        reserveMax4X = d3.max(reserves.map(function(d) { 
            return timeFormat.parse(d[getXSelectedOption()]); 
        }));
        xMax = starterMax4X > reserveMax4X ? starterMax4X : reserveMax4X;
        
        var m = +xMax.getMinutes();
        var s = +xMax.getSeconds();
        if (s > 30) {
            m++;
        }
        xScale.domain([0, m]);
    }
    else {
        starterMax4X = d3.max(starters.map(function(d) {
            return +d[getXSelectedOption()];
        }));
        reserveMax4X = d3.max(reserves.map(function(d) {
            return +d[getXSelectedOption()];
        }))
        xMax = starterMax4X > reserveMax4X ? starterMax4X : reserveMax4X;
        xScale.domain([0, xMax]);
    }
}


function setYScale(starters, reserves) {
    var starterMax4Y, reserveMax4Y, yMax;
    if (getYSelectedOption() == "MP") {

        var starterMP = starters.map(function(d) { 
            return timeFormat.parse(d[getYSelectedOption()]); 
        })

        starterMax4Y = d3.max(starterMP);

        reserveMax4Y = d3.max(reserves.map(function(d) { 
            return timeFormat.parse(d[getYSelectedOption()]); 
        }));
        yMax = starterMax4Y > reserveMax4Y ? starterMax4Y : reserveMax4Y;
        
        var m = +yMax.getMinutes();
        var s = +yMax.getSeconds();
        if (s > 30) {
            m++;
        }
        yScale.domain([0, m]);
    }
    else {
        starterMax4Y = d3.max(starters.map(function(d) {
            return +d[getYSelectedOption()];
        }));
        reserveMax4Y = d3.max(reserves.map(function(d) {
            return +d[getYSelectedOption()];
        }))
        yMax = starterMax4Y > reserveMax4Y ? starterMax4Y : reserveMax4Y;
        yScale.domain([0, yMax]);
    }
}

function roundMinutesPlayed(duration) {
    if(duration != null) {
        var temp = timeFormat.parse(duration);
        var mp = +temp.getMinutes();
        var sp = +temp.getSeconds();
        if(sp > 30) {
            mp++;
        }
        return mp;
    }
}

//calculating minutes played for each player
function calcMinutesPlayed(item, axis) {
    console.log(item.MP);
    if(item != null) {
        var temp = timeFormat.parse(item.MP);
        var mp = +temp.getMinutes();
        var sp = +temp.getSeconds();
        if(sp > 30) {
            mp++;
        }
        if (axis == "x") {
            return xScale(mp); 
        }
        else if(axis == "y") {
            return yScale(mp);
        }
    }
} 

//calculating minutes played for each team
function calcTeamMinutesPlayed(item, axis) {
    //console.log(d.MP);
    if(item != null) {
        tmp = item['MP'].split(":");
        var teamMP = tmp[0];

        if (axis == "x") {
            return xScale(teamMP); 
        }
        else if(axis == "y") {
            return yScale(teamMP);
        }
    }
} 


// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getTeamSelectedOption(){
    var node = d3.select('#teamDropdown').node();
    var i = node.selectedIndex;
    return node[i].value;
}

function getXSelectedOption(){
    var node = d3.select('#xdropdown').node();
    var i = node.selectedIndex;
    return node[i].value;
}

// Returns the selected option in the X-axis dropdown. 
function getYSelectedOption(){
    var node = d3.select('#ydropdown').node();
    var i = node.selectedIndex;
    return node[i].value;
}

function getColorSelectionOption() {
    var node = d3.select('#colorDropdown').node();
    var i = node.selectedIndex;
    return node[i].value;
}

function test(dropdown) {
    var selIndex = dropdown.selectedIndex;
    var selValue = dropdown.options[selIndex].value;
}