use xdata;

var agg = db.nbastats.aggregate(
    [
        {
            $group: {
                _id: {
                    player_name: "$player_name",
		    team: "$team",
		    mascot: "$mascot",
                    season: "$season"
                },
                fgm: {$sum: "$fgm"},
                fga: {$sum: "$fga"}, 
                fg3m: {$sum: "$fg3m"},
                fg3a: {$sum: "$fg3a"}, 
                ftm: {$sum: "$ftm"}, 
                fta: {$sum: "$fta"}, 
                oreb: {$sum: "$oreb"}, 
                dreb: {$sum: "$dreb"}, 
                reb: {$sum: "$reb"}, 
                ast: {$sum: "$ast"}, 
                stl: {$sum: "$stl"}, 
                blk: {$sum: "$blk"}, 
                tovr: {$sum: "$tovr"}, 
                pf: {$sum: "$pf"}, 
                pts: {$sum: "$pts"}, 
                plus_minus: {$sum: "$plus_minus"}
            }
        },
        {
            $project: {
                fgm: 1,
                fga: 1, 
                fg3m: 1,
                fg3a: 1, 
                ftm: 1, 
                fta: 1, 
                oreb: 1, 
                dreb: 1, 
                reb: 1, 
                ast: 1, 
                stl: 1, 
                blk: 1, 
                tovr: 1, 
                pf: 1, 
                pts: 1, 
                plus_minus: 1,
                player: "$_id.player_name",
                team: {$concat: ["$_id.team", " ", "$_id.mascot"]},
                fgp: {$cond: [{$eq: ["$fga", 0]}, 0, {$divide: ["$fgm", "$fga"]}]},
                ftp: {$cond: [{$eq: ["$fta", 0]}, 0, {$divide: ["$ftm", "$fta"]}]},
                fg3p: {$cond: [{$eq: ["$fg3a", 0]}, 0, {$divide: ["$fg3m", "$fg3a"]}]}
            }
        }
    ]
);

if (db.nbastats.aggregated) {
    db.nbastats.aggregated.drop();
}

db.nbastats.aggregated.insert(agg.result);

if (db.nbastats.aggregated2013) {
    db.nbastats.aggregated2013.drop();
}

db.nbastats.aggregated.find({"_id.season": 2013}).sort({pts: -1}).forEach(function (d) { db.nbastats.aggregated2013.insert(d); });

