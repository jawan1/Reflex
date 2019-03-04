var View = /** @class */ (function () {
    function View() {
    }
    View.prototype.drawBoard = function (size) {
        var board = document.getElementById("board");
        var content = "";
        var length = Math.sqrt(size);
        for (var i = 0; i < size; i++) {
            content = content + '<div id="s' + i + '" class="square"></div>';
            if ((i + 1) % length == 0) {
                content = content + '<div style="clear:both;"></div>';
            }
        }
        content = content + '<div style="clear:both;"></div>';
        board.innerHTML = content;
    };
    View.prototype.changeLife = function (life) {
        document.getElementById("life").innerHTML = life;
    };
    View.prototype.changeScore = function (score) {
        document.getElementById("score").innerHTML = score;
    };
    View.prototype.changeTime = function (time) {
        document.getElementById("timeValue").innerHTML = time;
    };
    View.prototype.lightSquare = function (id, color) {
        document.getElementById(id).style.background = color;
    };
    return View;
}());
var Controller = /** @class */ (function () {
    function Controller() {
        this.sizeBoard = 25;
        this.view = new View();
        this.model = new Model(this.view, this.sizeBoard);
        this.view.drawBoard(this.sizeBoard);
    }
    Controller.prototype.clickStart = function () {
        document.getElementById("start").disabled = true;
        document.getElementById("reset").disabled = false;
        this.model.incrementTime();
    };
    Controller.prototype.clickReset = function () {
        this.model.resetGame();
    };
    return Controller;
}());
var Model = /** @class */ (function () {
    function Model(view, sizeBoard) {
        this.view = view;
        this.sizeBoard = sizeBoard;
        this.life = 3;
        this.score = 0;
    }
    Model.prototype.checkEnd = function (time) {
        if (time == 60000) {
            alert("KONIEC!!!");
            clearInterval(this.refreshIntervalId);
        }
    };
    Model.prototype.incrementTime = function () {
        var _this = this;
        var time = 1000;
        this.timeToClick = 1000;
        this.refreshIntervalId = setInterval(function () {
            _this.view.changeTime(time / 1000);
            if (_this.timeToClick % 2000 == 0) {
                if (_this.timeToClick == 2000) {
                    _this.addClick();
                    _this.random = Math.floor(Math.random() * (_this.sizeBoard));
                    _this.view.lightSquare("s" + _this.random, "#009900");
                }
                else {
                    _this.life -= 1;
                    _this.view.changeLife(_this.life);
                    _this.view.lightSquare("s" + _this.random, "white");
                    alert("Straciłeś życie!");
                    if (_this.life == 0) {
                        alert("Przegrałeś!");
                        _this.resetGame();
                    }
                    else {
                        _this.random = Math.floor(Math.random() * (_this.sizeBoard));
                        _this.view.lightSquare("s" + _this.random, "#009900");
                    }
                }
            }
            time = time + 1000;
            _this.timeToClick = _this.timeToClick + 1000;
            _this.checkEnd(time);
        }, 1000);
    };
    Model.prototype.addClick = function () {
        var _this = this;
        var _loop_1 = function (i) {
            var id = "s" + i;
            var board = document.getElementById(id);
            board.onclick = function () { return _this.checkClick(id); };
        };
        for (var i = 0; i < this.sizeBoard; i++) {
            _loop_1(i);
        }
    };
    Model.prototype.removeClick = function () {
        for (var i = 0; i < this.sizeBoard; i++) {
            var id = "s" + i;
            var board = document.getElementById(id);
            board.onclick = null;
        }
    };
    Model.prototype.checkClick = function (id) {
        this.removeClick();
        if ("s" + this.random == id) {
            this.score += 1;
            this.view.changeScore(this.score);
        }
        else {
            this.life -= 1;
            this.view.changeLife(this.life);
            alert("Straciłeś życie!");
            if (this.life == 0) {
                alert("Przegrałeś!");
                this.resetGame();
            }
        }
        this.view.lightSquare("s" + this.random, "white");
        this.timeToClick = 1000;
    };
    Model.prototype.resetGame = function () {
        clearInterval(this.refreshIntervalId);
        document.getElementById("start").disabled = false;
        document.getElementById("reset").disabled = true;
        this.life = 3;
        this.score = 0;
        this.view.changeLife(this.life);
        this.view.changeTime(0);
        this.view.changeScore(this.score);
        this.view.drawBoard(this.sizeBoard);
    };
    return Model;
}());
var c = new Controller();
document.getElementById("start").onclick = function () { c.clickStart(); };
document.getElementById("reset").onclick = function () { c.clickReset(); };
