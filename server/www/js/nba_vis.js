var bar_height = 30
var width = 700

var active_season, active_team


// var svg = d3.select("#canvas").append("svg")

var seasons = d3.select("#seasons")
  .style('width',width)
var buttons = d3.select("#buttons")
  .style('width',width) //div
var games = d3.select("#games") //div
  .style('height',bar_height*2)
  .style('width',width)
var notebook = d3.select("#notebook")
  .style('width',width)


var game_y_scale = d3.scale.linear()
  .range([bar_height,0,bar_height])
  .domain([-45,0,45])
var game_x_scale = d3.scale.ordinal()
  .rangeBands([0,width])


var game_icons


d3.json('http://localhost:8000/seasons',function(data){
  var season_buttons = seasons.selectAll('div.season-button')
    .data(data)

  season_buttons.enter().append('div')
    .classed('season-button',true)
    .text(function(d){return d.season})
    .attr('id',function(d){return "season-"+d.season})
    .on('click',select_season)

  select_season(data[0])

})

var select_season = function(d){
  active_season = d.season
  seasons.selectAll('.active')
    .classed('active',false)
  seasons.select('#season-'+d.season).classed('active',true)
  load_team(active_team,active_season)
}

d3.json('http://localhost:8000/teams',function(data){
  var team_buttons = buttons.selectAll('div.team-button')
      .data(data)

  team_buttons.enter().append('div')
    .classed("team-button",true)
    .attr('x',function(d,i){return i*10})
    .text(function(d){return d.abbr})
    .on('click',select_team)
    .attr("id",function(d){return d.abbr})
})

var select_team = function(d){
  active_team = d.abbr
  buttons.selectAll('.active')
    .classed('active',false)
  buttons.select('#'+d.abbr).classed('active',true)
  load_team(active_team,active_season)
}

var load_team = function(abbr,season){
  
  d3.json('http://localhost:8000/team_scores/'+abbr+'/'+active_season,function(data){

    game_x_scale.domain(_.range(data.length))

    game_icons = games.selectAll('div.game-icon')
      .data(data,function(d){return d.gameid})

    game_icons.enter().append('div')
      .classed('game-icon',true)

    game_icons
      .style('width',game_x_scale.rangeBand())
      .style('background-color',function(d){return d.diff>0?'green':'red'})
      .style('height',function(d){return game_y_scale(d.diff)})
      .style('left',function(d,i){return game_x_scale(i)})
      .style('bottom',function(d){return d.diff>0?bar_height:(bar_height-game_y_scale(d.diff))})
      .on('mouseover',function(d){
        d3.select('#'+d.opp)
          .style('background-color','lightsteelblue')
      })
      .on('mouseout',function(d){
        d3.select('#'+d.opp)
          .style('background-color',null)
      })
      .on('click',load_notebook)
      .attr('title',function(d){return d.diff})

    game_icons.exit().remove()
  })
}


var load_notebook = function(d){
  var id = d.gameid
  d3.text('http://localhost:8000/notebook/'+id,function(data){
    notebook.html(data)
  })
}



