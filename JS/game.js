// NFB Stands for Not Flappy Bird
var NFB = {

    // Initializing Variables
    Width: 144,
    Height: 256,
    scale: 1,
    offset: {top: 0, left: 0},

    // Rest of variables are set up in init function
    Ratio: null,
    currentWidth: null,
    currentHeight: null,
    canvas: null,
    ctx: null,
    
    // Now the Functions!
    
    init: function() {
        // Something for width and height
        NFB.Ratio = NFB.Width/ NFB.Height;
        // These change for the screen width and height
        NFB.currentWidth = NFB.Width;
        NFB.currentHeight = NFB.Height;
        // The Canvas!
        NFB.canvas = document.getElementsByTagName("canvas")[0];
        // Important for Game Width and Height
        NFB.canvas.width = NFB.Width;
        NFB.canvas.height = NFB.Height;

        NFB.ctx = NFB.canvas.getContext('2d');
        NFB.ctx.imageSmoothingEnabled = false;

        // The webpage needs to know what device it is using, so why not?
        NFB.ua = navigator.userAgent.toLowerCase();
        NFB.android = NFB.ua.indexOf('android') > -1? true : false;
        NFB.ios = (NFB.ua.indexOf('iphone') > -1 || NFB.ua.indexOf('ipad') > -1) ? true: false;
        
        // For Clicks
        window.addEventListener("click", function(e) {
            e.preventDefault();
            NFB.Input.set(e);
        }, false);

        // Now for Touches!
        window.addEventListener("touchstart", function(e) {
            e.preventDefault();

            NFB.Input.set(e.touches[0]);
        }, 0);
        window.addEventListener("touchmove", function(e) {
            e.preventDefault();
            NFB.Input.set(e.touches[0]);
        }, false);
        window.addEventListener("touchend", function(e) {
            e.preventDefault();
        }, false);

        // Now, to Resize!
        NFB.resize(); //!

        Game.Init();
        Game.Update();
    },

    resize: function() {
        NFB.currentHeight = window.innerHeight;
        // resizing stuff Bla Bla Bla
        NFB.currentWidth = NFB.currentHeight * NFB.Ratio;
        
        // For to create extra space
        // Just to hide the address bar easily
        if (NFB.android || NFB.ios) {
            document.body.style.height = (window.innerHeight + 50) + "px";
        }

        // Adding 'px' to the end of variables

        NFB.canvas.style.height = NFB.currentHeight + 'px';
        NFB.canvas.style.width = NFB.currentWidth + 'px';

        NFB.scale = NFB.currentWidth / NFB.Width;
        NFB.offset.top = NFB.canvas.offsetTop;
        NFB.offset.left = NFB.canvas.offsetLeft;

        // Just a small delay...
        window.setTimeout(function() {window.scrollTo(0,1);}, 1);
    },

    Draw: {
        clear: function() {
            NFB.ctx.clearRect(0, 0, NFB.Width, NFB.Height);
        },

        image: function(img, x, y, c) {
            NFB.ctx.drawImage(img, c[0], c[1], c[2], c[3], x, y, c[2], c[3]);
        },

        text: function(string, x, y, col) {
            if (col != null) {
                NFB.ctx.fillStyle = col;
            }

            NFB.ctx.fillText(string, x, y);
        }
    },
}

NFB.Input = {

    x: 0,
    y: 0,
    tapped :false,

    set: function(data) {
        var offsetTop = NFB.canvas.offsetTop,
            offsetLeft = NFB.canvas.offsetLeft;
            scale = NFB.currentWidth / NFB.Width;

        this.x = (data.pageX - NFB.offset.left) / scale;
        this.y = (data.pageY - NFB.offset.top) / NFB. scale;
        this.tapped = true;

        if (Game.Status.room == 0) {
            if (NFB.Input.x >= 15 && NFB.Input.x <= 15 + Game.Objects.PlayButton[2]) {
                if (NFB.Input.y >= NFB.Height - Game.Objects.Ground[3] - Game.Objects.PlayButton[3] && NFB.Input.y <= NFB.Height - Game.Objects.Ground[3]) {
                    alert('Yeah... You can\'t really play the game yet... Just press "OK" to get rid of the pop-up...');
                }
            }

            if (NFB.Input.x >= 75 && NFB.Input.x <= 126) {
                if (NFB.Input.y >= 172 && NFB.Input.y <= 200) {
                    alert("The Settings are in Development");
                }
            }
        }
    }
};

window.addEventListener('load', NFB.init, false);
window.addEventListener('resize', NFB.resize, false);

// That was all Setup!!! Now for the Actual Game!!!

var Game = {
    Status: {
        room: 0,
        score: 0,
        highscore: 0
    },

    Objects: {
        SpriteSheet: new Image(),
        Background: [0, 0, NFB.Width, NFB.Height],
        Logo: [351, 86, 89, 29],
        Ground: [292, 0, 168, 56],
        PlayButton: [354, 118, 52, 29],
        SettingsButton: [414, 118, 52, 29],

        CreditsStuff: [[433, 148, 78, 5], [451, 92, 60, 5]], // The person who made this game, the origonal sprites
        Pipe: [[56, 323, 26, 160], [84, 323, 26, 160]], // Top Pipe, Bottom Pipe
    },

    Pipes: {
        X: NFB.Height / 2 - 30,
    }
}

Game.Objects.SpriteSheet.src = "GFX/Spritesheet.png";

Game.Init = function() {

}

Game.Update = function() {
    NFB.Draw.image(Game.Objects.SpriteSheet, 0, 0, Game.Objects.Background);

    if (Game.Status.room == 0) {
        NFB.Draw.image(Game.Objects.SpriteSheet, NFB.Width / 2 - (Game.Objects.Pipe[0][2] / 2), Game.Pipes.X - 20 - Game.Objects.Pipe[0][3], Game.Objects.Pipe[0]);
        NFB.Draw.image(Game.Objects.SpriteSheet, NFB.Width / 2 - (Game.Objects.Pipe[1][2] / 2), Game.Pipes.X + 20, Game.Objects.Pipe[1]);

        NFB.Draw.image(Game.Objects.SpriteSheet, 0, NFB.Height - Game.Objects.Ground[3], Game.Objects.Ground);
        // I am putting the Ground over the pipes, so that it doesn't look like the pipes are in front of the game

        //--------------------------------------------------------------------------------------------------------------------------------------\\

        // The UI Overlay
        NFB.Draw.image(Game.Objects.SpriteSheet, 30, 40, Game.Objects.Logo);
        NFB.Draw.image(Game.Objects.SpriteSheet, 15, NFB.Height - Game.Objects.Ground[3] - Game.Objects.PlayButton[3], Game.Objects.PlayButton);
        NFB.Draw.image(Game.Objects.SpriteSheet, 75, NFB.Height - Game.Objects.Ground[3] - Game.Objects.SettingsButton[3], Game.Objects.SettingsButton);
        NFB.Draw.image(Game.Objects.SpriteSheet, 34, NFB.Height - 10, Game.Objects.CreditsStuff[0]);
        NFB.Draw.image(Game.Objects.SpriteSheet, 44, NFB.Height - 17, Game.Objects.CreditsStuff[1]);
    }

    setTimeout(Game.Update, 100);
}