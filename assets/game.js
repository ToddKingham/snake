Game = {};
(function(e) {
    var t = {
        multiplier: 0,
        gameTime: 0,
        timer: ""
    };
    var n = {
        controller: function(e, n) {
            switch (e) {
                case "ate":
                    $("score").innerHTML = t.multiplier * n;
                    break;
                case "ended":
                    $("again").style.display = "inline-block";
                    $("msg").style.display = "block";
                    clearInterval(t.timer);
                    break
            }
        },
        startGame: function(r) {
            var i = $target(r);
            if (i.nodeName === "BUTTON") {
                $("buttons").style.display = "none";
                e.start(i.id);
                t.multiplier = {
                    slow: 1,
                    med: 2,
                    fast: 3
                }[i.id];
                t.gameTime = new Date;
                t.timer = setInterval(function() {
                    n.setGameTime()
                }, 1e3)
            }
        },
        resetGame: function(t) {
            $("again").style.display = "none";
            $("buttons").style.display = "inline-block";
            $("msg").style.display = "none";
            $("score").innerHTML = 0;
            $("mins").innerHTML = 0;
            $("seconds").innerHTML = "00";
            e.reset()
        },
        setGameTime: function() {
            var e = parseInt((new Date - t.gameTime) / 1e3);
            var n = ("0" + e % 60).slice(-2);
            var r = parseInt(e / 60);
            $("mins").innerHTML = r;
            $("seconds").innerHTML = n
        }
    };
    $listen("buttons", "click", n.startGame);
    $listen("again", "click", n.resetGame);
    // e.init({
    //     container: $("field"),
    //     size: [20, 25],
    //     color: "red",
    //     callback: n.controller
    // })
}).apply(Game, [SNAKE_ENGINE]);