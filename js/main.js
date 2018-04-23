var mainCanvas = null;
var ctx = null;
var bgCanvas = null;
var ctxBG = null;
var hlfSize = 0;
var qrtSize = 0;
var paused = false;
var lastTick = 0;
var ticker = 0;
var doneTicks = 0;
var tickSpeed = 10;
var onGround = true;
var groundY = 0;
var audioMuted = false;
var musicMuted = false;
var symbolSpriteSheet;
var right = 0;
var width, height;
var jumped = false;
var gameW = 10;
var maxBricks = 5;
var gameH = 15;
var rightW = 0;
var images = {

};
var player = {
    lives: 3,
    weapL: null,
    weapR: null,
    path: [],
    pos: {
        x: 0,
        y: 0,
    }
};

function equipWeapon(side, weap) {
    if (side == "left") {
        player.weapL = new weapon(weaponPresets[weap])
    } else if (side == "right") {
        player.weapR = new weapon(weaponPresets[weap])
    }
}
var weaponPresets = {
    handGun: {
        img: "handGun",
        bullet: "munition",
        dmg: 2,
        kickBack: 5,
        priority: 0,
        dims: {
            w: 0.6,
            h: 0.4,
        },
        holdOffset: {
            w: 0.2,
            h: 0,
        },
        offset: {
            x: 20,
            y: -10,
        },
        tick: 50,
        ammo: 100,
    },
    machineGun: {
        img: "machineGun",
        bullet: "munition",
        dmg: 4,
        priority: 1,
        kickBack: 5,
        dims: {
            w: 1.3,
            h: 0.42
        },
        holdOffset: {
            w: 0.25,
            h: 0,
        },
        offset: {
            x: 60,
            y: -10,
        },
        tick: 20,
        ammo: 100,
    },
    laserGun: {
        img: "laserGun",
        bullet: "laser",
        dmg: 2,
        priority: 2,
        kickBack: 1,
        dims: {
            w: 0.6,
            h: 0.4
        },
        holdOffset: {
            w: 0.25,
            h: 0,
        },
        offset: {
            x: 15,
            y: -8,
        },
        tick: 1,
        ammo: 500,
    },
    rocketGun: {
        img: "rocketGun",
        bullet: "rocket",
        dmg: 150,
        kickBack: 5,
        dims: {
            w: 1.3,
            h: 0.42
        },
        priority: 3,
        holdOffset: {
            w: 0.2,
            h: 0.05,
        },
        offset: {
            x: 60,
            y: -45,
        },
        tick: 250,
        ammo: 4,
    }
}

function weapon(opt) {
    for (let key in opt) {
        this[key] = opt[key]
    }
}

function handGun(opt) {
    let gun = {
        img: "handGun",
        bullet: "munition",
        dmg: 5,
        spd: 1,
        ammo: 100,
    }
    return new weapon(gun);
}

function turnGun(opt) {
    let gun = {
        img: "turnGun.png",
        bullet: "turner",
        dmg: 0,
        spd: 1,
        ammo: "infinite",
    }
    return new weapon(gun);
}

function bullet(type) {
    if (type == "turner") {
        this.onColl = function() {

        }
    } else if (type == "handGun") {
        this.onColl = function() {

        }
    }
}
var startPos = {
    x: 0,
    y: 0,
}
var muted = false;
var highscore = 0;
var newHighscore = false;
var roundTime = 0;
var doneTicks = 0;
var imagesToLoad = 20;
var roundTime = 0;
var drawHitBoxes = false;
var curFontSize = 25;
var curBlue = 255;
var curGreen = 255;
var curRed = 255;
var paused = false;
var particleSplatters = [];
var bloods = [];
var lastPoints = 0;
var pointIncreases = [];
var mouseMovement = false;
var Points = 0;
var dead = false;
var spawnTicker = 0;
var spawnTick = 500;
var tileSize;
var margin;
var moved = false;
var leftClicked = false;
var rightClicked = false;
var upClicked = false;
var downClicked = false;
var mouseX = 0;
var mouseY = 0;


var bgAudio = new Audio("sounds/bgAudio2.mp3");
var quackAudio = new Audio("sounds/quack.mp3");
var quackQuackAudio = new Audio("sounds/quackQuack.mp3");
var eatAudio = new Audio("sounds/eat.mp3");
var snapAudio = new Audio("sounds/snap.mp3");
var burpAudio = new Audio("sounds/Burp.mp3");
var attackAudio = new Audio("sounds/duckAttack.mp3");
var chickEatAudio = new Audio("sounds/chickEat.mp3");
var swallowAudio = new Audio("sounds/swallow.mp3");
var fartAudio = new Audio("sounds/fart.mp3");



$(".muteButton").on("click", function() {
    if ($(this).hasClass("disabled")) {
        $(this).removeClass("disabled");
    } else {
        $(this).addClass("disabled");
    }
})


var restarting = false;

function restart() {

    paused = true;
    damage = 1;
    drops= 1;
    doubleJump = false;
    doubleJumped = false;
    drops = 1;
    difficulty = 0;
    bricks = [];
    score = 0;
    money = 0;
    for (let key in upgrades.list) {
        upgrades.list[key].bought = 0;
    }
    document.getElementById("upgrades").innerHTML = "";
    initWeaponUpgrades();
    solidBricks = [];
    for (let j = 0; j < gameH; j++) {
        solidBricks.push([]);
        for (let i = 0; i < gameW; i++) {
            solidBricks[j].push([false, 0, 0]);
        }
    }
    roundTime = 0;

    $("#killMessage").css({
        "font-size": "100px",
        height: "100%",
        opacity: 1
    });

    paused = false;
    restarting = false;
    groundY = Math.floor((gameH - 1) * tileSize);
    player.pos.x = (width-right) / 2;
    player.pos.y = groundY;
    dead = false;
    /*bgAudio.playBackRate = 0.7;*/
    $("#gameOver").css("display", "none");
    $("#upgrades").fadeIn();
    $("#pauseButton").css("display", "block");
    $("#HUD").css("display", "block");
    $("#mainMenu").css("display", "none");

    tick();

}

// window.addEventListener("resize", function() {
//     width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth / 1;
//     height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
//     width = Math.floor(width);
//     height = Math.floor(height);
//     $("body").css("width", width);
//     $("body").css("height", height);
//     hlfSize = Math.floor(Math.min(width, height) / 2);
//     qrtSize = Math.floor(hlfSize / 2);
//     let newtileSize = Math.floor(height * 0.9 / gameH); //Math.sqrt(width * height) / 50;
//     let scale = newtileSize / tileSize;
//     right = Math.ceil(tileSize * gameW)
//     rightW = Math.floor(width - right);
//     player.pos.x *= scale;
//     player.pos.y *= scale;
//     $("#upgrades").css("left",right);
//     $("#upgrades").css("width",rightW);
//     for (let key in bricks) {
//         bricks.pos.x *= scale;
//         bricks.pos.y *= scale;

//     }
//     /*gameH = Math.floor(height / tileSize);*/
//     gameW = 15; //Math.floor(width/2/tileSize);
//     groundY = Math.floor((gameH - 1) * tileSize);
// })

function start() {
    paused=true;
    initWeaponUpgrades();
    dead = true;
    if (window.localStorage.getItem(("highScore"))) {
        highscore = window.localStorage.getItem("highScore");
    }
    if (!window.localStorage.getItem("playedBefore")) {
        $("#firstTime").css("display", "block");
        try {

            window.localStorage.setItem("playedBefore", true);
        } catch (e) {
            console.error(e);
        }
    }
    $("#mainMenu").fadeOut();
    width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth / 1;
    height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
    width = Math.floor(width);
    height = Math.floor(height);
    $("body").css("width", width);
    $("body").css("height", height);

    hlfSize = Math.floor(Math.min(width, height) / 2);
    qrtSize = Math.floor(hlfSize / 2);
    tileSize = Math.floor(height * 0.9 / gameH); //Math.sqrt(width * height) / 50;
    /*gameH = Math.floor(height / tileSize);*/
    gameW = 15; //Math.floor(width/2/tileSize);
    width = Math.min(width,gameW*tileSize*2)
    right = Math.ceil(gameW * tileSize);
    rightW = Math.floor(width - right);
    groundY = Math.floor((gameH - 1) * tileSize);
    player.pos.y = groundY;
    $("#upgrades").css("left",right);
    $("#upgrades").css("width",rightW);
    for (let j = 0; j < gameH; j++) {
        solidBricks.push([]);
        for (let i = 0; i < gameW; i++) {
            solidBricks[j].push([false, 0, 0]);
        }
    }


    bgCanvas = createCanvas(width,
        height,
        0,
        0,
        "bg",
        "bg",
        0,
        0,
        true);

    $("body").append(bgCanvas);

    document.addEventListener("keydown", keyDownMine);
    document.addEventListener("mousemove", mouseMoveMine);
    document.addEventListener("mousedown", mouseDownMine);
    document.addEventListener("mouseup", mouseUpMine);
    document.addEventListener("keyup", keyUpMine);
    mainCanvas = document.getElementById("undefined");
    bgCanvas = document.getElementById("bg");

    ctx = bgCanvas.getContext("2d");



    $('#loadingScreen').fadeOut();
    $("#upgrades").css("display","none");
    $('#mainMenu').fadeIn();
    $('#HUD').fadeIn();

    equipWeapon("right", "handGun");

    

}
function startClick() {
}
function loadImges() {

    images.heart = new Image();
    images.heart.src = "img/heart3.png";
    images.heart.onload = function() {
        checkReadImages();
    }
    images.brick = new Image();
    images.brick.src = "img/brick.png";
    images.brick.onload = function() {
        checkReadImages();
    }

    images.playerBody = new Image();
    images.playerBody.src = "img/playerBody.png";
    images.playerBody.onload = function() {
        checkReadImages();
    }

    images.playerHead = new Image();
    images.playerHead.src = "img/playerHead.png";
    images.playerHead.onload = function() {
        checkReadImages();
    }

    images.playerLegL = new Image();
    images.playerLegL.src = "img/playerLegL.png";
    images.playerLegL.onload = function() {
        checkReadImages();
    }
    images.playerLegR = new Image();
    images.playerLegR.src = "img/playerLegR.png";
    images.playerLegR.onload = function() {
        checkReadImages();
    }

    images.playerArmR = new Image();
    images.playerArmR.src = "img/playerArmR.png";
    images.playerArmR.onload = function() {
        checkReadImages();
    }
    images.playerArmL = new Image();
    images.playerArmL.src = "img/playerArmL.png";
    images.playerArmL.onload = function() {
        checkReadImages();
    }

    images.handGun = new Image();
    images.handGun.src = "img/handGun.png";
    images.handGun.onload = function() {
        checkReadImages();
    }
    images.rocketGun = new Image();
    images.rocketGun.src = "img/rocketGun.png";
    images.rocketGun.onload = function() {
        checkReadImages();
    }
    images.laserGun = new Image();
    images.laserGun.src = "img/laserGun.png";
    images.laserGun.onload = function() {
        checkReadImages();
    }
    images.machineGun = new Image();
    images.machineGun.src = "img/machineGun.png";
    images.machineGun.onload = function() {
        checkReadImages();
    }
    images.handGunL = new Image();
    images.handGunL.src = "img/handGunL.png";
    images.handGunL.onload = function() {
        checkReadImages();
    }
    images.rocketGunL = new Image();
    images.rocketGunL.src = "img/rocketGunL.png";
    images.rocketGunL.onload = function() {
        checkReadImages();
    }
    images.laserGunL = new Image();
    images.laserGunL.src = "img/laserGunL.png";
    images.laserGunL.onload = function() {
        checkReadImages();
    }
    images.machineGunL = new Image();
    images.machineGunL.src = "img/machineGunL.png";
    images.machineGunL.onload = function() {
        checkReadImages();
    }

    images.bullet = new Image();
    images.bullet.src = "img/bullet.png";
    images.bullet.onload = function() {
        checkReadImages();
    }

    images.rocket = new Image();
    images.rocket.src = "img/rocket.png";
    images.rocket.onload = function() {
        checkReadImages();
    }

    images.laser = new Image();
    images.laser.src = "img/laser.png";
    images.laser.onload = function() {
        checkReadImages();
    }

    images.coin = new Image();
    images.coin.src = "img/coin.png";
    images.coin.onload = function() {
        checkReadImages();
    }

}
loadImges();



function tick() {
    var now = window.performance.now(); // current time in ms

    /*if (restart) {
        $("#mainMenu").css("display", "none");
        $("#gameOver").css("display", "none");
        lastTick = now;
    }*/
    var deltaTime = now - lastTick; // amount of time elapsed since last tick

    lastTick = now;

    if (!dead) {
        roundTime += deltaTime / 1000;

    }
    ticker += deltaTime;


    doneTicks = 0;

    drawGame();
    while (ticker > tickSpeed) {
        ticker -= tickSpeed;
        doneTicks++;
        if (doneTicks > 100) {
            ticker = 0;

        }
        if (!restarting) {
            step();
        }

        if (moved) {
            moved = false;
        }
    }
    if (restarting) {
        restart();
    }

    if (!paused) {
        theLoop = window.requestAnimationFrame(function() {
            tick(false);
        });
    } else {
        theLoop = null;
    }

}
var walking = false;
var falling = 0;
var doubleJump = false;
var doubleJumped = false;
var movedd = false;

function movePlayer() {
    walking = false;
    movedd = false;
    if (!onGround && !jumped) {

        falling = Math.max(0.001, falling * 1.01);
        let groundTile = getGroundTile();
        let htOffGround = tileSize * groundTile - player.pos.y;

        if (htOffGround > tileSize * 0.001) {
            movePlayerY((1 + downClicked) * tileSize * (falling * tileSize));

        } else {
            onGround = true;
            doubleJumped = false;

            falling = 0;
            player.pos.y = tileSize * groundTile;

        }

    } else if (jumped > 0) {

        jumped--;
        movePlayerY(-0.005 * tileSize * jumped)

        /*player.pos.y-=0.01*tileSize*jumped;*/
    }
    if (upClicked && (onGround || (jumped < 4 && doubleJump && !doubleJumped))) {
        if (!onGround) {
            doubleJumped = true;
            jumped = 40;

        } else {
            jumped = 40;

            onGround = false;

        }
        addJumpEffect(player.pos.x, player.pos.y);
    }
    if (leftClicked) {
        movePlayerX(-0.12 * tileSize)

        //player.pos.x -= 0.12 * tileSize;
        if (onGround) {
            walking = true;
        }

    } else if (rightClicked) {
        movePlayerX(+0.12 * tileSize)

        //player.pos.x += 0.12 * tileSize;
        if (onGround) {
            walking = true;
        }

    }
    onGround = false;
    player.dir = angle(mouseX, mouseY, player.pos.x, player.pos.y) + Math.PI * 0.5;
    if (movedd) {
        addPlayerTrail();
    }
}

function movePlayerX(am) {
    let curYTile = Math.floor(player.pos.y / tileSize);
    let curXTile = Math.floor(player.pos.x / tileSize);
    let nextTile;
    if (am > 0) {
        nextTile = Math.floor((player.pos.x + am + tileSize * 0.25) / tileSize);
    } else if (am < 0) {
        nextTile = Math.floor((player.pos.x + am - tileSize * 0.25) / tileSize);
    }
    if (nextTile < 0 || nextTile > gameW - 1) {
        return;
    }
    let bool = true;
    loop1:
        for (let i = 0; i < bricks.length; i++) {
            for (let j = 0; j < bricks[i].tiles.length; j++) {
                let curYTile2 = Math.floor((bricks[i].pos.y + tileSize * bricks[i].tiles[j][1]) / tileSize);

                if (curYTile == curYTile2) {

                    let curXTile2 = Math.floor((bricks[i].pos.x + tileSize * bricks[i].tiles[j][0]) / tileSize);
                    if (nextTile == curXTile2) {

                        bool = false;
                        break loop1;
                    }
                }
            }
        }
    if (curXTile != nextTile) {
        if (bool && !solidBricks[curYTile][nextTile][0]) {
            movedd = true;
            player.pos.x += am;
        }
    } else {
        movedd = true;
        player.pos.x += am;
    }
}

function movePlayerY(am) {

    let curYTile = Math.floor(player.pos.y / tileSize);
    let curXTile = Math.floor(player.pos.x / tileSize);
    let newTile = Math.floor((player.pos.y + am) / tileSize);
    if (newTile < 0 || newTile > gameH - 1) {
        return;
    }
    if (am > 0) {
        let groundTile = getGroundTile();
        let nextTile = Math.floor((player.pos.y + am) / tileSize);
        /*if (groundTile == nextTile+1) {*/
        if (groundTile * tileSize < player.pos.y + am) {
            movedd = true;
            player.pos.y = groundTile * tileSize;
            
            onGround = true;
            falling = 0;
            doubleJumped = false;
            /*}*/
        } else {
            movedd = true;
            player.pos.y += am;
        }

    } else if (am < 0) {
        let topTile = getTopTile();
        let nextTile = Math.floor((player.pos.y + am) / tileSize);
        if (topTile == nextTile + 1) {
            movedd = true;
            player.pos.y = topTile * tileSize;
            jumped = 0;
        } else {
            movedd = true;
            player.pos.y += am;
        }
    }

}

function getGroundTile() {
    let curYTile = Math.max(0,Math.floor(player.pos.y / tileSize));
    let curXTile = Math.max(0,Math.floor(player.pos.x / tileSize));
    try {

        while (!solidBricks[curYTile][curXTile][0]) {
            curYTile++;
            if (curYTile > gameH - 1) {
                return gameH - 1;
            }
        }


        return curYTile - 1;
    } catch (e) {
        console.log(e);
        console.log("no time for errors");
    }


}

function getGroundTileX(x) {
    let curYTile = Math.floor(player.pos.y / tileSize);
    let curXTile = x
    while (!solidBricks[curYTile][curXTile][0]) {
        curYTile++;
        if (curYTile > gameH - 1) {
            return gameH - 1;
        }
    }


    return curYTile - 1;


}

function getTopTile() {
    let curYTile = Math.floor(player.pos.y / tileSize);
    let curXTile = Math.floor(player.pos.x / tileSize);

    while (!solidBricks[curYTile][curXTile][0] && curYTile > 0) {
        curYTile--;
    }
    if (curYTile == 0) {
        return 1;
    } else {
        return curYTile + 1;

    }
}
var hit = 0;
var jumpEffects = [];

function addJumpEffect(x, y) {
    jumpEffects.push([x, y, 20])
}

function drawJumpEffects() {
    for (let key = jumpEffects.length - 1; key >= 0; key--) {
        jumpEffects[key][2]--;
        if (jumpEffects[key][2] <= 0) {
            jumpEffects.splice(key, 1);
        } else {
            let c = jumpEffects[key];
            let rat = Math.min(1, c[2] / 20);
            ctx.fillStyle = "rgba(255,255,255," + rat + ")";
            ctx.strokeStyle = "rgba(0,0,0,0)";
            ctx.beginPath();
            ctx.ellipse(c[0], c[1], tileSize * (1 - rat), tileSize * 0.2 * (1 - rat), 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();


        }
    }
}

function drawPlayer() {
    let l = width * 0.3;

    drawLegs();
    drawBody();
    drawHead();
    drawArms();
    drawWeapons();
}

function drawLegs() {
    let rnd = 0;
    if (walking) {
        rnd = Math.random() * 2 - Math.random() * 2;
    }
    let htOffGround = groundY - player.pos.y;
    let offGroundMod = 0;
    if (htOffGround > tileSize * 0.1 && jumped <= 0 && falling > 0) {
        offGroundMod = tileSize * 0.5 * (falling / tileSize * 2.5);
    }
    let jumpMod = 0;
    if (jumped > 0) {
        jumpMod = tileSize / 400 * jumped
    }
    ctx.drawImage(images.playerLegL, rnd + player.pos.x - tileSize * 0.125 - tileSize * 0.15, rnd + player.pos.y - tileSize * 0.125 + jumpMod - offGroundMod, tileSize * 0.25, tileSize * 0.25);
    ctx.drawImage(images.playerLegR, rnd + player.pos.x - tileSize * 0.125 + tileSize * 0.15, rnd + player.pos.y - tileSize * 0.125 + jumpMod - offGroundMod, tileSize * 0.25, tileSize * 0.25);
}

function drawBody() {

    let rnd = Math.random() * (kickBackL + kickBackR) / 10 - Math.random() * (kickBackL + kickBackR) / 10;
    ctx.drawImage(images.playerBody, rnd + player.pos.x - tileSize * 0.375, rnd + player.pos.y - tileSize * 0.75, rnd + tileSize * 0.75, rnd + tileSize * 0.75);
}

function drawHead() {
    let hitMod = 1;
    if (hit > 0) {
        hit--;
        hitMod = 1 - hit / 20;
    }
    let rnd = 0;
    if (walking) {
        rnd = Math.random() * 1 - Math.random() * 1;
    }
    /*  if(downClicked) {
          ctx.lineWidth=tileSize*0.5;
          ctx.strokeStyle="rgb(255,255,255,0.05)";
          ctx.beginPath();
          for (let i = 1;i<5;i++) {
              ctx.moveTo(player.pos.x,player.pos.y-tileSize*1.5);
              ctx.lineTo(player.pos.x,player.pos.y-tileSize*1.5-tileSize*(i)*(falling*1000 - 1));
              ctx.stroke();
              
          }
          ctx.closePath();
      }*/
    rnd += Math.random() * (kickBackL + kickBackR) / 10 - Math.random() * (kickBackL + kickBackR) / 10;
    let htOffGround = groundY - player.pos.y;
    let offGroundMod = 0;
    if (htOffGround > 0 && jumped <= 0 && falling > 0) {
        offGroundMod = Math.min(tileSize * 0.025, (falling * 2));
    }
    let jumpMod = 0;
    if (jumped > 0) {
        jumpMod = tileSize / 200 * jumped
    }
    ctx.save();
    if (rnd) {
        ctx.rotate(Math.random() * 0.002 - Math.random() * 0.002);

    }
    ctx.translate(player.pos.x, player.pos.y);
    ctx.rotate(rightClicked * 0.2 - leftClicked * 0.2);
    ctx.rotate(Math.random() * kickBackR * Math.PI / 200 - Math.random() * kickBackL * Math.PI / 200);
    ctx.globalAlpha = 1- invincible%2/2;

    ctx.drawImage(images.playerHead,
        rnd - tileSize * 0.5 + 5 * hit % 2,
        rnd - tileSize * 1.5 + jumpMod - offGroundMod - (tileSize * 150 * downClicked * falling) + tileSize * (1 - hitMod), tileSize * 1, tileSize * (1 + 150 * downClicked * falling) * hitMod);
    ctx.restore();

}

function drawArms() {
    let x1 = player.pos.x - tileSize * 0.3;
    let x2 = player.pos.x + tileSize * 0.3;
    /*let ang1 = angle(x1,player.pos.y-tileSize*0.125,mouseX,mouseY) - Math.PI*0.5;
    let ang2 = angle(x2,player.pos.y-tileSize*0.125,mouseX,mouseY) - Math.PI*0.5;*/
    let ang1 = player.dir;
    let ang2 = player.dir;
    ctx.save();
    ctx.translate(x1, player.pos.y - 0.3 * tileSize);
    ctx.rotate(ang1);
    ctx.drawImage(images.playerArmL, -tileSize * 0.125, 0, tileSize * 0.25, tileSize * 0.5);

    ctx.restore();

    ctx.save();
    ctx.translate(x2, player.pos.y - 0.3 * tileSize);
    ctx.rotate(ang2);
    ctx.drawImage(images.playerArmR, -tileSize * 0.125, 0, tileSize * 0.25, tileSize * 0.5);
    ctx.restore();
}
var kickBackL = 0;
var kickBackR = 0;

function drawWeapons() {
    if (player.weapR != null) {
        let ang = angle(mouseX, mouseY, player.pos.x + tileSize * 0.3, player.pos.y - tileSize * 0.3);
        /*let ang = player.dir;*/
        let pos = getHandPosR()
        x1 = pos.x - Math.cos(ang) * tileSize * player.weapR.holdOffset.w; //player.pos.x + tileSize * 0.3 - Math.cos(ang - Math.PI * 0.5) * (tileSize * 0.5 - kickBackR * tileSize * 0.02);
        y1 = pos.y - Math.sin(ang) * tileSize * player.weapR.holdOffset.w; //player.pos.y - tileSize * 0.3 - Math.sin(ang - Math.PI * 0.5) * (tileSize * 0.5 - kickBackR * tileSize * 0.02);
        if (kickBackR > 0) {
            kickBackR = (kickBackR * 0.5);
            if (kickBackR < 0.05) {
                kickBackR = 0;
            }
        }
        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(ang - Math.PI * 1);
        ctx.drawImage(images[player.weapR.img], -tileSize * player.weapR.dims.w / 2, -tileSize * player.weapR.dims.h / 2, tileSize * player.weapR.dims.w, tileSize * player.weapR.dims.h);
        ctx.restore();
        /*ctx.drawImage(images[player.weapR.img],-tileSize*0.25,0,tileSize*0.5,tileSize*0.5);*/
        /*ctx.*/
    }
    if (player.weapL != null) {
        let ang = angle(mouseX, mouseY, player.pos.x - tileSize * 0.3, player.pos.y - tileSize * 0.3);
        /*let ang = player.dir;*/
        let pos = getHandPosL()
        x1 = pos.x - Math.cos(ang) * tileSize * player.weapL.holdOffset.w; //player.pos.x - tileSize * 0.3 - Math.cos(ang - Math.PI * 0.5) * (tileSize * 0.5 - kickBackL * tileSize * 0.02);
        y1 = pos.y - Math.sin(ang) * tileSize * player.weapL.holdOffset.w; //player.pos.y - tileSize * 0.3 - Math.sin(ang - Math.PI * 0.5) * (tileSize * 0.5 - kickBackL * tileSize * 0.02);
        if (kickBackL > 0) {
            kickBackL = (kickBackL * 0.5);
            if (kickBackL < 0.05) {
                kickBackL = 0;
            }
        }
        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(ang);
        ctx.drawImage(images[player.weapL.img + "L"], -tileSize * player.weapL.dims.w / 2, -tileSize * player.weapL.dims.h / 2, tileSize * player.weapL.dims.w, tileSize * player.weapL.dims.h);
        ctx.restore();
    }
}
var solidBricks = [];

function getHandPosL() {
    let ang = angle(mouseX, mouseY, player.pos.x - tileSize * 0.3, player.pos.y - tileSize * 0.3);
    return {
        x: player.pos.x - tileSize * 0.3 - Math.cos(ang) * (tileSize * 0.5 - kickBackL * tileSize * 0.02),
        y: player.pos.y - tileSize * 0.3 - Math.sin(ang) * (tileSize * 0.5 - kickBackL * tileSize * 0.02)
    }

}

function getHandPosR() {
    let ang = angle(mouseX, mouseY, player.pos.x + tileSize * 0.3, player.pos.y - tileSize * 0.3);
    return {
        x: player.pos.x + tileSize * 0.3 - Math.cos(ang) * (tileSize * 0.5 - kickBackR * tileSize * 0.02),
        y: player.pos.y - tileSize * 0.3 - Math.sin(ang) * (tileSize * 0.5 - kickBackR * tileSize * 0.02)
    }

}

function spawnBrick() {


    let rnd = Math.random();
    let tiles = [];
    /*for (let i = 0;i<gameW;i++) {
        tiles.push([i,0]);
    }
    rnd=2*/
    let dimX, dimY;
    if (rnd < 0.2) {
        tiles.push([0, 0]);
        tiles.push([0, 1]);
        tiles.push([1, 0]);
        tiles.push([1, 1]);
        dimX = 2;
        dimY = 2;

    } else if (rnd < 0.4) {
        tiles.push([0, 0]);
        tiles.push([0, 1]);
        tiles.push([0, 2]);
        tiles.push([0, 3]);
        dimX = 1;
        dimY = 4;

    } else if (rnd < 0.6) {
        tiles.push([0, 0]);
        tiles.push([1, 0]);
        tiles.push([1, 1]);
        tiles.push([1, 2]);
        dimX = 2;
        dimY = 3;

    } else if (rnd < 0.8) {
        tiles.push([0, 0]);
        tiles.push([1, 0]);
        tiles.push([2, 0]);
        tiles.push([1, 1]);
        dimX = 3;
        dimY = 2;

    } else if (rnd < 1) {
        tiles.push([0, 0]);
        tiles.push([1, 0]);
        tiles.push([1, 1]);
        dimX = 2;
        dimY = 2;

    }
    let rndCol = Math.floor(Math.random() * (gameW - dimX));
    let br = new brick(tiles, rndCol * tileSize, -dimY * tileSize, rndCol, 10 + Math.pow(1.1, difficulty), dimX, dimY);
    bricks.push(br);
}
var difficulty = 0;

function moveBricks() {
    let linesToCheck = [];
    let linesToDel = [];
    loop1:
        for (let br = bricks.length - 1; br >= 0; br--) {
            let newY = bricks[br].pos.y + 0.2 + 0.01 * difficulty;
            loop2:
                for (let tile in bricks[br].tiles) {
                    let curRow = Math.floor(newY / tileSize) + 1 + bricks[br].tiles[tile][1];
                    let x = bricks[br].x + bricks[br].tiles[tile][0];
                    if ( /*curRow >= 1 &&*/ x >= 0 && x <= gameW - 1) {
                        if (curRow >= gameH - 1) {
                            curRow -= bricks[br].tiles[tile][1];
                            x = bricks[br].x;
                            for (let key in bricks[br].tiles) {

                                try {
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][0] = true;
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][1] = bricks[br].tiles[key][2] * 5;
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][2] = bricks[br].tiles[key][3] * 5;
                                    addUnique(linesToCheck, curRow + bricks[br].tiles[key][1]);
                                } catch (e) {
                                    /*console.log(curRow,x,bricks[br].tiles[key])*/
                                }
                            }
                            bricks.splice(br, 1)
                            continue loop1;
                        } else if (solidBricks[Math.max(0,curRow + 1)][x][0] == true) {
                           
                            curRow = Math.floor(newY / tileSize);
                            x = bricks[br].x;
                            curRow += 1;
                            //get origin pos again

                            for (let key in bricks[br].tiles) {
                                if (bricks[br].pos.y/tileSize + bricks[br].tiles[key][1]<1) {
                                    console.log("GameOver");
                                    gameOver("You have to stop those Blocks before they reach the Top!");
                                }
                                try {
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][0] = true;
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][1] = bricks[br].tiles[key][2] * 5;
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][2] = bricks[br].tiles[key][3] * 5;
                                    addUnique(linesToCheck, curRow + bricks[br].tiles[key][1]);
                                } catch (e) {
                                    /*console.log(curRow,x,bricks[br].tiles[key])*/
                                }
                            }
                            bricks.splice(br, 1)
                            continue loop1;
                        }

                        if (player.pos.x < x * tileSize + tileSize && player.pos.x > x * tileSize) {
                            curY = bricks[br].pos.y + tileSize * bricks[br].tiles[tile][1];
                            if (falling) {

                                if (player.pos.y < curY + tileSize && curY < player.pos.y) {
                                    drop(x*tileSize+tileSize/2,curY+tileSize/2);
                                    bricks[br].tiles.splice(tile)
                                    console.log("you  hit it!");
                                    jumped = 20;
                                    addJumpEffect(player.pos.x, player.pos.y);
                                    continue loop2;

                                }
                            }
                            if (player.pos.y - tileSize * 1.5 < curY + tileSize && curY < player.pos.y - tileSize * 1.5) {
                                bricks[br].tiles.splice(tile);
                                //addHit(player.pos.y,player.pos.x,curY+tileSize)
                                console.log("you got hit");
                                hit = 20;
                                if (invincible==0) {
                                    player.lives--;
                                    if(player.lives<=0) {
                                        player.lives=3;
                                        gameOver("You have to dodge those Blocks!");
                                    }
                                    invincible=25;
                                }
                                continue loop2;

                            }
                        }
                    }
                }
            bricks[br].pos.y = newY;
        }

    for (let key in linesToCheck) {
        let bool = true;
        loop2:
            for (let i = 0; i < gameW; i++) {
                if (!solidBricks[linesToCheck[key]][i][0]) {
                    bool = false;
                }
            }
        if (bool) {
            addLineEffect(linesToCheck[key]);
            increaseScore(Math.pow(2*difficulty));
            linesToDel.push(linesToCheck[key]);
        }
    }
    linesToDel.sort(sizeSort);
    for (let key in linesToDel) {
        for (let i = 0; i < gameW; i++) {
            solidBricks[linesToDel[key]][i][0] = false;
            solidBricks[linesToDel[key]][i][1] = 0;
            solidBricks[linesToDel[key]][i][2] = 0;
        }
        shiftARow(linesToDel[key]);
    }
    if (linesToCheck.length > 0) {

    }
    if (linesToDel.length > 0) {

    }
}
function addLineEffect(line) {
    lineEffects.push([line*tileSize,100]);
}
lineEffects=[];
function drawLineEffects() {
    for (let i = lineEffects.length-1;i>=0;i--) {
        lineEffects[i][1]-=5;
        if(lineEffects[i][1]<=0) {
            lineEffects.splice(i,1);
        }  else {
            let l = lineEffects[i];
            let rat = 1 - lineEffects[i][1]/100;
            ctx.fillStyle="rgba(150,255,255,"+0.5+")";
            ctx.fillRect(-rat*tileSize*0.25,l[0]-rat*tileSize*0.25,gameW*tileSize+rat*tileSize*0.5,tileSize+rat*tileSize*0.5)
            
        }
    }
}
function shiftARow(row) {
    let emptRow = solidBricks[row].slice(0);
    for (let i = row; i >= 1; i--) {
        solidBricks[i] = solidBricks[i - 1];
    }
    solidBricks[0] = emptRow;
}

function moveSolidsDown() {
    for (let i = solidBricks.length - 2; i >= 0; i--) {
        for (let j = 0; j < gameW; j++) {
            if (solidBricks[i][j][0] == true) {
                let y = i + 1;
                while (y <= solidBricks.length - 1 && solidBricks[y][j][0] == false) {
                    solidBricks[y - 1][j] = false;
                    solidBricks[y][j][0] = true;
                    y++;
                }

            }

        }
    }
}

function sizeSort(a, b) {

    return a > b ? 1 : -1;
}
function sizeSort2(a, b) {
    return a[0] > b[0] ? 1 : -1;
}
var bricks = [];
var brick = function(tiles, x, y, col, health, dimX, dimY) {
    this.pos = {};
    this.pos.x = x;
    this.pos.y = y;
    this.dimX = dimX;
    this.dimY = dimY;
    this.x = col;
    this.tiles = tiles;
    health = health || 100;
    this.maxHealth = health;
    for (let key in this.tiles) {
        this.tiles[key].push(health);
        this.tiles[key].push(health);
    }
}

function spawnCoin(x, y, am) {
    let tX = width * 4 / 5;
    let tY = height * 1.5 / 10 + Math.random() * tileSize * 0.5 - Math.random() * tileSize;
    let dis = Distance(tX, tY, x, y);
    let ang = angle(tX, tY, x, y);
    coins.push([x, y, dis, ang, am, 100])
}
var coins = [];
var moneyGains = [];
var scoreGains=[];
var money = 0;
var score = 0;
var updateMoney = false;
var updateScore=false;
function increaseMoney(am) {
    if (!isNaN(am)) {
        money += am;
        updateMoney = true;

    }
}
function increaseScore(am) {
    if(!isNaN(am)) {
        score+=am;
        updateScore=true;
    }
}
function addScoreGain(x, y, am) {
    scoreGains.push([x + (Math.random() - Math.random()) * tileSize * 0.3, y + (Math.random() - Math.random()) * tileSize * 0.3, am, 50]);
}

function drawScoreGains() {
    for (let key = scoreGains.length - 1; key >= 0; key--) {
        scoreGains[key][3]--;
        if (scoreGains[key][3] <= 0) {
            scoreGains.splice(key, 1);
        } else {
            let c = scoreGains[key];
            let rat = Math.min(1, c[3] / 50);
            ctx.fillStyle = "rgba(255,255,0," + rat + ")";
            ctx.font = tileSize / 1.5 + "px Arial yellow";
            ctx.fillText("$" + nFormatter(c[2],0), c[0], c[1] + rat * tileSize);

        }
    }
}
function addMoneyGain(x, y, am) {
    moneyGains.push([x + (Math.random() - Math.random()) * tileSize * 0.3, y + (Math.random() - Math.random()) * tileSize * 0.3, am, 50]);
}

function drawMoneyGains() {
    for (let key = moneyGains.length - 1; key >= 0; key--) {
        moneyGains[key][3]--;
        if (moneyGains[key][3] <= 0) {
            moneyGains.splice(key, 1);
        } else {
            let c = moneyGains[key];
            let rat = Math.min(1, c[3] / 50);
            ctx.fillStyle = "rgba(255,255,0," + rat + ")";
            ctx.font = tileSize / 1.5 + "px Arial yellow";
            ctx.fillText("$" + nFormatter(c[2],0), c[0], c[1] + rat * tileSize);

        }
    }
}

function nFormatter(num, digits) {
    var si = [{
            value: 1E100,
            symbol: "It's Enough"
        }, {
            value: 1E93,
            symbol: "Tg"
        }, {
            value: 1E90,
            symbol: "NVt"
        }, {
            value: 1E87,
            symbol: "OVt"
        }, {
            value: 1E84,
            symbol: "SVt"
        }, {
            value: 1E81,
            symbol: "sVt"
        }, {
            value: 1E78,
            symbol: "QVt"
        }, {
            value: 1E75,
            symbol: "qVt"
        }, {
            value: 1E72,
            symbol: "TVt"
        }, {
            value: 1E69,
            symbol: "DVt"
        }, {
            value: 1E66,
            symbol: "UVt"
        }, {
            value: 1E63,
            symbol: "Vt"
        }, {
            value: 1E60,
            symbol: "ND"
        }, {
            value: 1E57,
            symbol: "OD"
        }, {
            value: 1E54,
            symbol: "SD"
        }, {
            value: 1E51,
            symbol: "sD"
        }, {
            value: 1E48,
            symbol: "QD"
        }, {
            value: 1E45,
            symbol: "qD"
        }, {
            value: 1E42,
            symbol: "TD"
        }, {
            value: 1E39,
            symbol: "DD"
        }, {
            value: 1E36,
            symbol: "UD"
        }, {
            value: 1E33,
            symbol: "D"
        }, {
            value: 1E30,
            symbol: "N"
        }, {
            value: 1E27,
            symbol: "O"
        }, {
            value: 1E24,
            symbol: "S"
        }, {
            value: 1E21,
            symbol: "s"
        }, {
            value: 1E18,
            symbol: "Q"
        }, {
            value: 1E15,
            symbol: "q"
        }, {
            value: 1E12,
            symbol: "T"
        }, {
            value: 1E9,
            symbol: "B"
        }, {
            value: 1E6,
            symbol: "M"
        }, {
            value: 1E3,
            symbol: "k"
        }],
        i;
    if (num < 0) {
        return "-" + nFormatter((-1 * num), digits);
    }
    for (i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            if (i == 0) {
                return "It's Enough...";
            }
            if (!digits) {
                return Math.floor(num / si[i].value) + si[i].symbol
            }
            return Math.floor(Math.pow(10, digits) * num / si[i].value) / Math.pow(10, digits) + si[i].symbol;
            //(num / si[i].value).toFixed(digits).replace(/\.?0+$/, "") + si[i].symbol;
        };
    };
    return num;
}
function drawCoins() {

    for (let key = coins.length - 1; key >= 0; key--) {
        coins[key][5]--;
        if (coins[key][5] <= 0) {
            addMoneyGain(
                coins[key][0] - Math.cos(coins[key][3]) * coins[key][2] - tileSize / 2,
                coins[key][1] - Math.sin(coins[key][3]) * coins[key][2],
                coins[key][4])
            increaseMoney(coins[key][4]);

            coins.splice(key, 1);
        } else {
            let c = coins[key];
            /*ctx.fillRect(c[0]-5,c[1]-5,10,10);*/
            let rat = 1 - Math.min(1, c[5] / 100);
            let rat2 = Math.sin(c[5] / 2);
            ctx.drawImage(images.coin,
                0,
                0,
                images.coin.width,
                images.coin.height,
                c[0] - Math.cos(c[3]) * rat * c[2] * rat - c[3] * tileSize * 0.2 - c[3] * tileSize * 0.4 * rat * rat2 / 2,
                c[1] - Math.sin(c[3]) * rat * c[2] * rat - c[3] * tileSize * 0.2,
                c[3] * tileSize * 0.4 * rat * rat2,
                c[3] * tileSize * 0.4 * rat);

        }
    }
    if (updateMoney) {
        document.getElementById("money").innerHTML = "Money</br>$" + nFormatter(money,2);
        updateMoney = false;
    }
    if (updateScore) {
        document.getElementById("score").innerHTML = "Score</br>$" + nFormatter(score,2);
        updateScore = false;
    }
}

function drawBricks() {
    for (let key in bricks) {
        drawOneBrick(bricks[key]);
    }
    for (let key in solidBricks) {
        for (let kai in solidBricks[key]) {
            if (solidBricks[key][kai][0] == true) {
                ctx.fillStyle = "rgba(150,0,0," + Math.min(solidBricks[key][kai][1] / solidBricks[key][kai][2] * 0.3 + 0.3, 1) + ")";
                ctx.drawImage(images.brick, kai * tileSize, (key - 1) * tileSize, tileSize, tileSize);
                ctx.fillRect(kai * tileSize, (key - 1) * tileSize, tileSize, tileSize);
            }
        }
    }
}

function drawOneBrick(br) {

    for (let i in br.tiles) {
        ctx.globalAlpha = Math.min(1, br.tiles[i][2] / br.maxHealth * 0.5 + 0.5);
        ctx.drawImage(images.brick, br.pos.x + br.tiles[i][0] * tileSize, br.pos.y + br.tiles[i][1] * tileSize, tileSize, tileSize);
        /*ctx.fillRect(br.pos.x+br.tiles[i][0]*tileSize,br.pos.y+br.tiles[i][1]*tileSize,tileSize,tileSize)*/
    }
    ctx.globalAlpha = 1;
}

function drawCrossHair() {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,250,250,0.4)";
    ctx.beginPath();
    ctx.moveTo(mouseX - tileSize * 0.4, mouseY);
    ctx.lineTo(mouseX + tileSize * 0.4, mouseY);
    ctx.moveTo(mouseX, mouseY - tileSize * 0.4);
    ctx.lineTo(mouseX, mouseY + tileSize * 0.4);
    ctx.moveTo(mouseX, mouseY);
    ctx.arc(mouseX, mouseY, tileSize * 0.4, 0, Math.PI * 2, 0);
    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,0,0,0.9)";
    ctx.beginPath();
    ctx.moveTo(mouseX - tileSize * 0.4, mouseY);
    ctx.lineTo(mouseX + tileSize * 0.4, mouseY);
    ctx.moveTo(mouseX, mouseY - tileSize * 0.4);
    ctx.lineTo(mouseX, mouseY + tileSize * 0.4);
    ctx.moveTo(mouseX, mouseY);
    ctx.arc(mouseX, mouseY, tileSize * 0.3, 0, Math.PI * 2, 0);
    ctx.stroke();
    ctx.closePath();
}

function drawGame() {
    ctx.clearRect(0, 0, width, height);
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    /*  ctx.moveTo(0, player.pos.y-1.5*tileSize);
      ctx.lineTo(width, player.pos.y-1.5*tileSize);
      ctx.stroke();

      if (bricks.length>0) {
          ctx.moveTo(0, bricks[0].pos.y+tileSize*bricks[0].dimY);
          ctx.lineTo(width, bricks[0].pos.y+tileSize*bricks[0].dimY);
          ctx.stroke();
      }*/

    drawBricks();
    drawPlayerTrail();
    drawPlayer();
    drawCrossHair();
    drawWeaponsMap();
    drawRockets();
    drawBullets();
    drawExplosions();
    drawLineEffects();
    drawBlood();
    drawParticles();
    drawCoins();
    drawDamages();
    drawMoneyGains();
    drawAmmo();
    drawLives();
    drawJumpEffects();


    /*let pos = getHandPosL();
    let pos2 = getHandPosR();
    ctx.fillRect(pos.x-2,pos.y-2,4,4);
    ctx.fillRect(pos2.x-2,pos2.y-2,4,4);*/

}

function drawRockets() {
    for (let i in rockets) {
        let r = rockets[i];
        ctx.save();
        let sc = images.rocket.width / images.rocket.height;
        let sizW = tileSize *0.8;
        let sizH = sizW / sc;

        ctx.translate(r[0] + sizW / 2, r[1] + sizH / 2);
        ctx.rotate(r[2]);
        ctx.drawImage(images.rocket, -sizW / 2, -sizH / 2, sizW, sizH);
        ctx.restore();
    }
}

function drawLives() {
    for (let i = 0; i < player.lives; i++) {
        ctx.drawImage(images.heart, right + rightW / 4 * i, 10, tileSize, tileSize);
    }
}

function drawAmmo() {
    ctx.font= "20px Arial white";
    if (player.weapR) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(width * 0.5 * 0.75, height * 0.9, width * 0.5 * 0.2, height * 0.08);
        ctx.fillStyle = "black";
        let tx = player.weapR.ammo;
        if (player.weapR.img == "handGun") {
            tx = "∞";
        }
        let wd = ctx.measureText(tx).width;
        let sc = images[player.weapR.img].width/images[player.weapR.img].width;
        ctx.drawImage(images[player.weapR.img],width*0.5*0.85-wd/2-tileSize,height*0.9,tileSize * images[player.weapR.img].width/(sc*50),tileSize*images[player.weapR.img].width/50 )
        ctx.fillText(tx, width * 0.5 * 0.85 - wd / 2, height * 0.95);
    }
    if (player.weapL) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(width * 0.5 * 0.25, height * 0.9, width * 0.5 * 0.2, height * 0.08);
        ctx.fillStyle = "black";
        let tx = player.weapL.ammo;

        let wd = ctx.measureText(tx).width;
        ctx.drawImage(images[player.weapL.img],width*0.5*0.35-wd/2-tileSize,height*0.9,tileSize * images[player.weapL.img].width/(sc*50),tileSize*images[player.weapL.img].width/50 )
        ctx.fillText(tx, width * 0.5 * 0.35 - wd / 2, height * 0.95);
    }
}

function drawMenu() {


}

function pause() {
    if (paused) {
        paused = false;
        lastTick = 0;
        ticker = 0;
        tick(true);
    } else {
        paused = true;

    }
}



function drop(x, y) {
    let rnd1 = Math.random();
    let rnd2 = Math.random();
    increaseScore(nFormatter(difficulty+1));
    if (rnd1 < 0.5) {
        spawnCoin(x, y, 10 * Math.ceil(Math.pow(1.2, difficulty)));
    }
    if (rnd2 < 0.001*drops) {
        dropWeapon(x, y, "laserGun");
    } else if (rnd2 < 0.003*drops) {
        dropWeapon(x, y, "rocketGun");
    } else if (rnd2 < 0.006*drops) {
        dropWeapon(x, y, "machineGun");
    } else if (rnd2 < 0.012*drops) {
        dropWeapon(x, y, "handGun");
    }
}

function dropWeapon(x, y, weap) {
    weaponsMap.push([x, y, weap, Math.random() * Math.PI * 2]);
}
var weaponsMap = [];

function updateWeaponsOnMap() {
    for (let key = weaponsMap.length - 1; key >= 0; key--) {
        let w = weaponsMap[key];
        let xTile = Math.floor(w[0] / tileSize);

        let g = getGroundTileX(xTile) - 1;
        if (g * tileSize > w[1]) {
            w[1] += 0.01 * tileSize;
        } else if (g * tileSize < w[1]) {
            w[1] = g * tileSize;
        }
        let dis = Distance(player.pos.x, player.pos.y - tileSize * 0.75, w[0], w[1]);
        if (dis < tileSize * 1) {
            try {
                if (player.weapL) {
                    if (player.weapR.priority < player.weapL.priority) {
                        if (player.weapR.img == w[2]) {
                            player.weapR.ammo += weaponPresets[w[2]].ammo;
                        } else if (player.weapR.priority < weaponPresets[w[2]].priority) {
                            equipWeapon("right", w[2]);
                        }
                    } else if (player.weapR.priority > player.weapL.priority) {
                        if (player.weapL.img == w[2]) {
                            player.weapL.ammo += weaponPresets[w[2]].ammo;
                        } else if (player.weapL.priority < weaponPresets[w[2]].priority) {
                            equipWeapon("left", w[2]);
                        }
                    } else if (player.weapR.img == player.weapL.img) {
                        if (player.weapL.img == w[2]) {
                            player.weapL.ammo += weaponPresets[w[2]].ammo / 2;
                            player.weapR.ammo += weaponPresets[w[2]].ammo / 2;
                        } else if (player.weapL.priority < weaponPresets[w[2]].priority)
                            equipWeapon("left", w[2]);
                    }

                } else {
                    equipWeapon("left", w[2]);

                }

            } catch (e) {
                console.log(e);
                console.log("catch you later");
            }
            equipWeapon()
            ///function particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a) {
            particleSplatter(w[0], w[1], 0, 15, 5.5, 5, 50, Math.PI * 2, 0, 250, 0, 0.5)
            weaponsMap.splice(key, 1);
        }
    }
}

function drawWeaponsMap() {
    for (let key in weaponsMap) {
        let w = weaponsMap[key];
        let rat = 1 / (images[w[2]].width / images[w[2]].height);
        let siz = Math.cbrt(tileSize * images[w[2]].width * images[w[2]].height);
        let rad = siz * 0.52;
        ctx.fillStyle = "rgba(0,255,0,0.5)";
        ctx.strokeStyle = "rgba(0,255,0,0.5)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(w[0], w[1], rad, 0, Math.PI * 2, 0);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.drawImage(images[w[2]], w[0] - siz / 2, w[1] - siz / 2 * rat, siz, siz * rat);
    }
}

function addPlayerTrail(x, y) {
    if (player.path.length > 50) {
        player.path.splice(0, 1);
    }
    player.path.push([
        player.pos.x + 16 * Math.cos(player.dir) + tileSize * 0.4,
        player.pos.y + 16 * Math.sin(player.dir) - tileSize * 0.75,
        120,
        player.dir,
        0
    ]);
}

function drawPlayerTrail() {
    for (let key = player.path.length - 1; key >= 0; key--) {
        player.path[key][2]--;
        if (player.path[key][2] <= 0) {
            player.path.splice(key, 1);
        }
    }
    if (player.path.length == 0) {
        return
    }

    ctx.lineWidth = tileSize * 0.8;
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    let curX = player.x + tileSize * 0.4;
    let curY = player.y;

    if (player.path.length > 1) {


        ctx.beginPath();
        //ctxBG.shadowBlur=15;
        //ctxBG.shadowColor="rgba(0,0,250,1)";
        //ctxBG.shadowOffsetY=15;
        //ctxBG.shadowOffsetX=15;
        ctx.moveTo(curX, curY);
        ctx.lineTo(
            curX + Math.cos(player.dir) * tileSize * 0.5,
            curY + Math.sin(player.dir) * tileSize * 0.5);

        for (let key = player.path.length - 1; key > 1; key--) {
            let rat = player.path[key][2] / 120
            ctx.strokeStyle = "rgba(255,255,255," + (rat * 0.003) + ")";
            player.path[key][4] += 0.05;
            /*ctx.strokeStyle = "rgba(255,255,255," + player.path[key][2] / 10000 + ")";*/
            let cx = (player.path[key][0] + Math.cos(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]) + player.path[key - 1][0] + Math.cos(player.path[key - 1][3] - Math.PI * 0.5) * 10 * (player.path[key][4])) / 2;

            let cy = (player.path[key][1] + Math.sin(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]) + player.path[key - 1][1] + Math.sin(player.path[key - 1][3] - Math.PI * 0.5) * 10 * (player.path[key][4])) / 2;

            ctx.quadraticCurveTo(
                player.path[key][0] + Math.cos(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]),
                player.path[key][1] + Math.sin(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]),
                cx, cy);
            ctx.stroke();
        }

        /*ctx.strokeStyle = "rgba(255,255,255," + player.path[0][2] / 10000 + ")";*/

        ctx.quadraticCurveTo(
            player.path[1][0] + Math.cos(player.path[0][3] - Math.PI * 0.5) * 10 * (player.path[0][4]),
            player.path[1][1] + Math.sin(player.path[0][3] - Math.PI * 0.5) * 10 * (player.path[0][4]),
            player.path[0][0] + Math.cos(player.path[1][3] - Math.PI * 0.5) * 10 * (player.path[1][4]),
            player.path[0][1] + Math.sin(player.path[1][3] - Math.PI * 0.5) * 10 * (player.path[1][4]));

        ctx.stroke();



    }
}



function drawEnemies() {

}

function collides(obj1, size1, obj2, size2) {
    if (Distance(obj1.x, obj1.y, obj2.x, obj2.y) < (size1 + size2) / 2) {
        return true;
    }
    return false;
}
function consolidate(arr) {
    let lastVal = arr[arr.length-1][0];
    let lastVal1 = arr[arr.length-1][1];
    let tmpArr=[lastVal1];
    for (let i = arr.length-2;i>=0;i--) {
        if (lastVal == arr[i][0]) {
            if (typeof arr[i][1] == "number") {
                arr[i][1] = [arr[i][1],lastVal];
                arr[i][1].sort(sizeSort);
            } else {
                for(let key in tmpArr) {
                    arr[i][1].push(tmpArr[key]);
                    arr[i][1].sort(sizeSort);
                }
            }
            tmpArr.push(arr[i][1])
        } else {
            lastVal = arr[i][0];
            tmpArr= [arr[i][1]];
        }
    }
}
function spawn() {
    if (bricks.length < maxBricks) {
        spawnTicker += 1; //Math.pow(1.1,difficulty);
        if (spawnTicker >= spawnTick) {
            let am = Math.floor(spawnTicker / spawnTick)
            spawnTicker -= am * spawnTick;
            spawnBrick();
            difficulty++;
        }
    }
}
var rockets = [];
function deleteBricks() {
    if (tilesToKill.length) {
        
        tilesToKill.sort(sizeSort2);
        
        removeDuplicates(tilesToKill);
        
        consolidate(tilesToKill);
        
        for (let tile=tilesToKill.length-1;tile>=0;tile--) {

            /*for (let tt = tilesToKill[tile][1].length-1;tt>=0;tt--) {*/
                let t = tilesToKill[tile][1];
                
                try {
                    let x = bricks[tilesToKill[tile][0]].pos.x + bricks[tilesToKill[tile][0]].tiles[t][0] * tileSize + tileSize / 2;
                    let y = bricks[tilesToKill[tile][0]].pos.y + bricks[tilesToKill[tile][0]].tiles[t][1] * tileSize + tileSize / 2;
                    drop(x,y)
                    
                    bricks[tilesToKill[tile][0]].tiles.splice(t, 1);
                    
                    
                }catch(e) {
                    /*console.log(e);*/
                }
                
            }

            for(let key =bricks.length-1;key>=0;key--) {
                if(bricks[key].tiles.length<=0) {
                        bricks.splice(key,1)
                }
            }
            
        /*}*/
        tilesToKill=[];
    }
    
}
function removeDuplicates(arr) {
    let lastval = arr[arr.length-1][0];
    let lastval2 = arr[arr.length-1][1];
    for (let i = arr.length-2;i>=0;i--) {
        if (arr[i][0]==lastval&&arr[i][1]==lastval2) {
            arr.splice(i,1);
            continue;
        }
    }
}
function step() {
    if (restarting) return;
    if(invincible) {
        invincible--;
    }
    movePlayer();
    moveBricks();
    moveBullets();
    moveRockets();
    deleteBricks();
    updateWeaponsOnMap();
    spawn();
    if (mousedown) {
        shootTicker+=fireRate;
        if (shootTicker >= player.weapR.tick) {
            let am = Math.floor(shootTicker / player.weapR.tick);
            shootTicker -= am * player.weapR.tick;
            for (let i = 0; i < am; i++) {
                kickBackR = player.weapR.kickBack;
                if (player.weapR.bullet == "munition") {
                    spawnBullet("right", mouseX, mouseY, player.weapR.dmg);
                    if (player.weapR.img != "handGun") {
                        player.weapR.ammo -= 1;
                    }
                } else if (player.weapR.bullet == "laser") {
                    if (!bulletsLaserR) {
                        spawnBulletLaser("right", mouseX, mouseY, player.weapR.dmg);

                    }
                } else if (player.weapR.bullet == "rocket") {
                    spawnBulletRocket("right", mouseX, mouseY, player.weapR.dmg);
                    player.weapR.ammo -= 1;
                    if(player.weapR.ammo<=0) {
                        discardWeapon("right");
                    }
                }
            }
        }
        if (player.weapL) {
            shootTicker2+=fireRate;
            if (shootTicker2 >= player.weapL.tick) {
                let am = Math.floor(shootTicker2 / player.weapL.tick);
                shootTicker2 -= am * player.weapL.tick;
                for (let i = 0; i < am; i++) {
                    kickBackL = player.weapL.kickBack;
                    if (player.weapL.bullet == "munition") {
                        spawnBullet("left", mouseX, mouseY, player.weapL.dmg);
                        player.weapL.ammo -= 1;
                    } else if (player.weapL.bullet == "laser") {
                        if (!bulletsLaserL) {
                            spawnBulletLaser("left", mouseX, mouseY, player.weapL.dmg);

                        }
                    } else if (player.weapL.bullet == "rocket") {
                        spawnBulletRocket("left", mouseX, mouseY, player.weapL.dmg);
                        player.weapL.ammo -= 1;
                        if(player.weapL.ammo<=0) {
                        discardWeapon("left");
                    }
                    }
                }
            }

        }


    } else {
        if (bulletsLaserL || bulletsLaserR) {
            bulletsLaserR = null;
            bulletsLaserL = null;
        }
    }

}

function findSideToTurn(ang1, ang2) {


    let dif = ang1 - ang2;
    if (dif < 0) {
        dif += Math.PI * 2;
    }
    if (dif > Math.PI) {

        return -1;
    } else {

        return 1;
    }

}

function turnTowards(that, toThat, turnSpeed) {
    let angl = angle(that.x, that.y, toThat.x, toThat.y);
    angl -= Math.PI;
    if (angl < Math.PI * (-1)) {
        angl += Math.PI * 2;
    }
    if (that.dir > Math.PI) {
        that.dir -= Math.PI * 2;
    }
    if (that.dir < -1 * Math.PI) {
        that.dir += Math.PI * 2;
    }

    if (Math.abs(that.dir - angl) > turnSpeed) {
        if (findSideToTurn(angl, that.dir) > 0) {

            that.dir = ((that.dir + turnSpeed));
        } else {

            that.dir = ((that.dir - turnSpeed));
        }

    }
}

function turnTowards2(ang1, angl, turnSpeed) {

    angl -= Math.PI;
    if (angl < Math.PI * (-1)) {
        angl += Math.PI * 2;
    }
    if (ang1 > Math.PI) {
        ang1 -= Math.PI * 2;
    }
    if (ang1 < -1 * Math.PI) {
        ang1 += Math.PI * 2;
    }



    ang1 = ((ang1 + turnSpeed));



    return ang1;
}

function moveTowards(that, toThat, tail, margin, speed, turnSpeed) {
    let playerTailX = toThat.x + tail * Math.cos(toThat.dir);
    let playerTailY = toThat.y + tail * Math.sin(toThat.dir);
    if (Distance(that.x, that.y, toThat.x, toThat.y) > margin) {
        let angl = angle(that.x, that.y, playerTailX, playerTailY);
        angl -= Math.PI;
        if (angl < Math.PI * (-1)) {
            angl += Math.PI * 2;
        }
        if (that.dir > Math.PI) {
            that.dir -= Math.PI * 2;
        }
        if (that.dir < -1 * Math.PI) {
            that.dir += Math.PI * 2;
        }

        if (Math.abs(that.dir - angl) > turnSpeed) {
            if (findSideToTurn(angl, that.dir) > 0) {

                that.dir = ((that.dir + turnSpeed));
            } else {

                that.dir = ((that.dir - turnSpeed));
            }

        }

        that.x += speed * Math.cos(that.dir - Math.PI);
        that.y += speed * Math.sin(that.dir - Math.PI);

        // ducklings[0].growth += 0.02;
    }
}

function contains(that, arr) {
    for (let key in arr) {
        if (that == arr[key]) {
            return true;
        }
    }
    return false;
}


function particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a) {
    if (particleSplatters.length>50) {
        particleSplatters.splice(0,particleSplatters.length-50);
    }
    for (let i = 0; i < amount; i++) {
        particleSplatters.push([x, y,
            dir - angle / 2 + Math.random() * angle / amount * i,
            dur, //dur,
            size * (1 + 1.2 * Math.random()),
            speed * (0.4 + 1.2 * Math.random()),
            r,
            g,
            b,
            a
        ]);
    }
}
var kicked = 0;

function drawParticles()  {
    for (let key in particleSplatters) {
        particleSplatters[key][3]--;
        if (particleSplatters[key][3] <= 0) {
            particleSplatters.splice(key, 1);
        } else {
            particleSplatters[key]
            let siz = particleSplatters[key][4] * 1;
            particleSplatters[key][0] += particleSplatters[key][5] * Math.cos(particleSplatters[key][2]);
            particleSplatters[key][1] += particleSplatters[key][5] * Math.sin(particleSplatters[key][2]);

            ctx.fillStyle = "rgba(" + particleSplatters[key][6] + "," + particleSplatters[key][7] + "," + particleSplatters[key][8] + "," + (particleSplatters[key][9] * particleSplatters[key][3] / 5) + ")";
            ctx.strokeStyle = "rgba(" + Math.floor(particleSplatters[key][6] * (1 + Math.random() * 0.2 - Math.random() * 0.2)) + "," + Math.floor(particleSplatters[key][7] * (1 + Math.random() * 0.2 - Math.random() * 0.2)) + "," + Math.floor(particleSplatters[key][8] * (1 + Math.random() * 0.2 - Math.random() * 0.2)) + "," + (particleSplatters[key][9] * particleSplatters[key][3] / 5) + ")";
            /*}*/
            ctx.beginPath();
            ctx.arc(particleSplatters[key][0], particleSplatters[key][1], siz, 0, Math.PI * 2, 0);
            ctx.fill();



        }
    }
}
var explosions = [];

function addExplosion(x, y, size) {
    if (explosions.length > 100) {
        explosions.splice(0, 1);
    }
    explosions.push([x, y, size, 15]);
}

function drawExplosions() {
    for (let key = explosions.length - 1; key >= 0; key--) {
        explosions[key][3]--;
        if (explosions[key][3] <= 0) {
            explosions.splice(key, 1);
        } else {
            let rat = 1.01 - explosions[key][3] / 15;
            let r1 = explosions[key][2] * (0.5 - ((explosions[key][3] % 5) - 5) / 10);
            let r2 = explosions[key][2] * (1.5 - explosions[key][3] / 15);

            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.beginPath();

            ctx.ellipse(
                explosions[key][0],
                explosions[key][1],
                rat * r1 * (1 + Math.random() * 0.4 - Math.random() * 0.4),
                rat * r2 * (1 + Math.random() * 0.4 - Math.random() * 0.4),
                Math.random() * Math.PI * 0.3 + explosions[key][3] * Math.PI * 0.1 % Math.PI,
                0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = "rgba(255,255,0,0.4)";
            ctx.beginPath();

            ctx.ellipse(
                explosions[key][0],
                explosions[key][1],
                rat * 0.8 * r1 * (1 + Math.random() * 0.4 - Math.random() * 0.4),
                rat * 0.8 * r2 * (1 + Math.random() * 0.4 - Math.random() * 0.4),
                Math.random() * Math.PI * 0.3 + Math.PI * 0.2 * (explosions[key][3] % 2) * Math.PI * 0.1 % Math.PI,
                0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = "rgba(255,0,0,0.4)";
            ctx.beginPath();

            ctx.ellipse(
                explosions[key][0],
                explosions[key][1],
                rat * 0.6 * r1 * (1 + Math.random() * 0.4 - Math.random() * 0.4),
                rat * 0.6 * r2 * (1 + Math.random() * 0.4 - Math.random() * 0.4),
                Math.random() * Math.PI * 0.3 + Math.PI * 0.4 * (explosions[key][3] % 3) * Math.PI * 0.1 % Math.PI,
                0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }
}

function bloodSplatter(x, y, dir, dur, size, speed, amount, angle) {
    for (let i = 0; i < amount * 2; i++) {
        bloods.push([x, y,
            dir - angle / 2 + Math.random() * angle / (amount * 2) * i,
            Math.ceil(Math.random() * 20), //dur,
            size * (1 + 0.8 * Math.random()),
            speed * (0.4 + 1.2 * Math.random())
        ]);
    }
}

function drawBlood()  {
    for (let key in bloods) {
        bloods[key][3]--;
        if (bloods[key][3] <= 0) {
            bloods.splice(key, 1);
        } else {
            bloods[key]
            let siz = bloods[key][4] * 128;
            bloods[key][0] += bloods[key][5] * Math.cos(bloods[key][2]);
            bloods[key][1] += bloods[key][5] * Math.sin(bloods[key][2]);
            //bloods[key][2]+=0.1;
            ctx.save();
            ctx.translate(bloods[key][0], bloods[key][1]);
            ctx.rotate(bloods[key][2]);
            /*if (bloods[key][3]<10) {*/
            ctx.globalAlpha = bloods[key][3] / 3;
            /*}*/
            ctx.drawImage(images.coin, 0, 0, 128, 128, 0 - siz / 4, 0 - siz / 4, siz / 2, siz / 2);
            ctx.restore();
            ctx.globalAlpha = 1;

        }
    }
}



function increasePoints(am, mult) {
    Points += am + Math.ceil(am * mult);
    pointIncreases.push(["+" + (am + am * mult), player.x, player.y, 100, 15]);
    pointIncreases.push(["(" + am + " * " + (1 + mult) + " = " + (am + (am * mult)) + ")", player.x, player.y + 20, 100, 13]);

}

function drawPointIncreases() {
    for (let key = pointIncreases.length - 1; key >= 0; key--) {
        pointIncreases[key][3]--;
        if (pointIncreases[key][3] < 0) {
            pointIncreases.splice(key, 1);
        } else {
            pointIncreases[key][2]--;
            ctxBG.fillStyle = "rgba(255,255,255," + pointIncreases[key][3] / 100 + ")";
            ctxBG.font = pointIncreases[key][4] + "px 'Ranchers', cursive";
            ctxBG.fillText(pointIncreases[key][0], pointIncreases[key][1], pointIncreases[key][2]);
        }
    }
}



function gameOver(msg) {
    dead = true;


    paused=true;
    if (Points > highscore) {
        highscore = Points;
        try {
            window.localStorage.setItem("highScore", highscore);
        } catch (e) {
            console.error(e);
        }
        $("#highscore").html(highscore);
        $(".newHighscore").css("display", "inline-block");
    } else {
        $(".newHighscore").css("display", "none");
        $("#highscore").html(highscore);
    }
    $("#mainMenu").css("display", "none");
    $("#HUD").css("display", "none");
    $("#killMessage").html(msg);
    $("#scoreFinal").html(score);
    $("#scoreCreated").html(0);
    $("#gameOver").css("display", "block");
    $("#pauseButton").css("display", "none");

    $("#killMessage").animate({
        "font-size": 20,
        height: "0%",
        opacity: 0,
    }, 2500);
}



function roundRect(ctx, x, y, width, height, radius, fill, stroke, fs, ss, lw) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.fillStyle = fs;
    ctx.strokeStyle = ss;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
    ctx.closePath();

}


function mouseMoveMine(e) {

    e.preventDefault();
    let mxTemp = e.clientX;
    let myTemp = e.clientY;
    mouseX = mxTemp;
    mouseY = myTemp;
    player.dir = angle(mouseX, mouseY, player.pos.x, player.pos.y) + Math.PI * 0.5;
    if (Distance(mxTemp, myTemp, mouseX, mouseY) > 5) {



    }
}
var shootTicker = 0;
var shootTicker2 = 0;
var mousedown = false;

function mouseDownMine(e) {
    mousedown = true;

}

function mouseUpMine(e) {
    mousedown = false;
    shootTicker++;

}
var bullets = [];
var bulletsLaserL = null;
var bulletsLaserR = null;
/*   let x1 = player.pos.x - tileSize*0.3;
    let x2 = player.pos.x + tileSize*0.3;
    let ang1 = angle(x1,player.pos.y-tileSize*0.125,mouseX,mouseY) - Math.PI*0.5;
    let ang2 = angle(x2,player.pos.y-tileSize*0.125,mouseX,mouseY) - Math.PI*0.5;
    ctx.save();
    ctx.translate(x1,player.pos.y-0.3*tileSize);
    ctx.rotate(ang1);
    ctx.drawImage(images.playerArmL,-tileSize*0.125,0,tileSize*0.25,tileSize*0.5);
    
    ctx.restore();*/
function spawnBullet(side, x, y, dmg) {

    let x1, y1;
    //first get startPos of bullet
    if (side == "right") {

        let pos = getHandPosR();
        let ang = angle(mouseX, mouseY, pos.x, pos.y);
        xOff = player.weapR.offset.x / images[player.weapR.img].width * tileSize * player.weapR.dims.w;
        yOff = player.weapR.offset.y / images[player.weapR.img].height * tileSize * player.weapR.dims.h;
        x1 = pos.x - Math.cos(ang) * xOff - Math.cos(ang + Math.PI * 0.5) * yOff;
        y1 = pos.y - Math.sin(ang) * xOff - Math.sin(ang + Math.PI * 0.5) * yOff;
    } else if (side == "left") {
        let pos = getHandPosL();
        let ang = angle(mouseX, mouseY, pos.x, pos.y);
        xOff = (images[player.weapL.img].width - player.weapL.offset.x) / images[player.weapL.img].width * tileSize * player.weapR.dims.w;
        yOff = -(player.weapL.offset.y) / images[player.weapL.img].height * tileSize * player.weapR.dims.h;
        x1 = pos.x - Math.cos(ang) * xOff - Math.cos(ang + Math.PI * 0.5) * yOff;
        y1 = pos.y - Math.sin(ang) * xOff - Math.sin(ang + Math.PI * 0.5) * yOff;
        /*x1 = player.pos.x - tileSize * 0.25 - Math.cos(ang) * tileSize * 0.25;
        y1 = player.pos.y - tileSize * 0.3 - Math.sin(ang) * tileSize * 0.5;*/
    }
    ///function particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a) {

    particleSplatter(x1, y1, player.dir + Math.PI * 0.5, 15, 1.5, 5, 5, Math.PI * 0.4, 250, 250, 250, 0.5)
    //now get ang between start and end pos of bullet
    let ang = angle(x1, y1, mouseX, mouseY);
    bullets.push([x1, y1, ang, dmg])
}

function spawnBulletLaser(side, x, y, dmg) {
    bulletTickR = 0;
    bulletTickL = 0;
    let x1, y1;
    //first get startPos of bullet
    if (side == "right") {

        let pos = getHandPosR();
        let ang = angle(mouseX, mouseY, pos.x, pos.y);
        xOff = player.weapR.offset.x / images[player.weapR.img].width * tileSize * player.weapR.dims.w;
        yOff = player.weapR.offset.y / images[player.weapR.img].height * tileSize * player.weapR.dims.h;
        x1 = pos.x - Math.cos(ang) * xOff - Math.cos(ang + Math.PI * 0.5) * yOff;
        y1 = pos.y - Math.sin(ang) * xOff - Math.sin(ang + Math.PI * 0.5) * yOff;

        ang = angle(x1, y1, mouseX, mouseY);

        bulletsLaserR = [x1, y1, ang, dmg, x1 + Math.cos(ang) * width * height, y1 + Math.sin(ang) * width * height];
    } else if (side == "left") {
        let pos = getHandPosL();
        let ang = angle(mouseX, mouseY, pos.x, pos.y);
        xOff = (images[player.weapL.img].width - player.weapL.offset.x) / images[player.weapL.img].width * tileSize * player.weapL.dims.w;
        yOff = -(player.weapL.offset.y) / images[player.weapL.img].height * tileSize * player.weapL.dims.h;
        x1 = pos.x - Math.cos(ang) * xOff - Math.cos(ang + Math.PI * 0.5) * yOff;
        y1 = pos.y - Math.sin(ang) * xOff - Math.sin(ang + Math.PI * 0.5) * yOff;
        /*x1 = player.pos.x - tileSize * 0.25 - Math.cos(ang) * tileSize * 0.25;
        y1 = player.pos.y - tileSize * 0.3 - Math.sin(ang) * tileSize * 0.5;*/
        ang = angle(x1, y1, mouseX, mouseY);
        bulletsLaserL = [x1, y1, ang, dmg, x1 + Math.cos(ang) * width * height, y1 + Math.sin(ang) * width * height];
    }
    ///function particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a) {

    //particleSplatter(x1, y1, Math.random()*Math.PI*2, 15, 0.5, 5, 5, Math.random()*Math.PI*2, 250, 250, 250, 0.5)
    //now get ang between start and end pos of bullet
}

function spawnBulletRocket(side, x, y, dmg) {


    let x1, y1;
    //first get startPos of bullet
    if (side == "right") {

        let pos = getHandPosR();
        let ang = angle(mouseX, mouseY, pos.x, pos.y);
        xOff = player.weapR.offset.x / images[player.weapR.img].width * tileSize * player.weapR.dims.w;
        yOff = player.weapR.offset.y / images[player.weapR.img].height * tileSize * player.weapR.dims.h;
        x1 = pos.x - Math.cos(ang) * xOff - Math.cos(ang + Math.PI * 0.5) * yOff;
        y1 = pos.y - Math.sin(ang) * xOff - Math.sin(ang + Math.PI * 0.5) * yOff;

        ang = angle(x1, y1, mouseX, mouseY);


    } else if (side == "left") {
        let pos = getHandPosL();
        let ang = angle(mouseX, mouseY, pos.x, pos.y);
        xOff = (images[player.weapL.img].width - player.weapL.offset.x) / images[player.weapL.img].width * tileSize * player.weapL.dims.w;
        yOff = -(player.weapL.offset.y) / images[player.weapL.img].height * tileSize * player.weapL.dims.h;
        x1 = pos.x - Math.cos(ang) * xOff - Math.cos(ang + Math.PI * 0.5) * yOff;
        y1 = pos.y - Math.sin(ang) * xOff - Math.sin(ang + Math.PI * 0.5) * yOff;
        /*x1 = player.pos.x - tileSize * 0.25 - Math.cos(ang) * tileSize * 0.25;
        y1 = player.pos.y - tileSize * 0.3 - Math.sin(ang) * tileSize * 0.5;*/
        ang = angle(x1, y1, mouseX, mouseY);

    }
    //particleSplatter(x1, y1, player.dir+Math.PI*0.5, 15, 1.5, 5, 5, Math.PI*0.4, 250, 250, 250, 0.5)
    //now get ang between start and end pos of bullet
    let ang = angle(x1, y1, mouseX, mouseY);
    rockets.push([x1, y1, ang, dmg, null, null])
    ///function particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a) {

    //particleSplatter(x1, y1, Math.random()*Math.PI*2, 15, 0.5, 5, 5, Math.random()*Math.PI*2, 250, 250, 250, 0.5)
    //now get ang between start and end pos of bullet
}

function getRectEdge(mouseX, mouseY, x2, y2, rx, ry, rw, rh) {
    var slope = (y2 - mouseY) / (x2 - mouseX);
    var hsw = slope * rw / 2;
    var hsh = (rh / 2) / slope;
    var hh = rh / 2;
    var hw = rw / 2;
    var TOPLEFT = {
        x: rx - hw,
        y: ry + hh
    };
    var BOTTOMLEFT = {
        x: rx - hw,
        y: ry - hh
    };
    var BOTTOMRIGHT = {
        x: rx + hw,
        y: ry - hh
    };
    var TOPRIGHT = {
        x: rx + hw,
        y: ry + hh
    };
    if (-hh <= hsw && hsw <= hh) {
        // line intersects
        if (rx < mouseX) {
            //right edge;
            return [TOPRIGHT, BOTTOMRIGHT];
        } else if (rx > mouseX) {
            //left edge
            return [TOPLEFT, BOTTOMLEFT];
        }
    }
    if (-hw <= hsh && hsh <= hw) {
        if (ry < mouseY) {
            //top edge
            return [TOPLEFT, TOPRIGHT];
        } else if (ry > mouseY) {
            // bottom edge
            return [BOTTOMLEFT, BOTTOMRIGHT];
        }
    }
    return false
};

function swap(arr, a, b) {
    let tmp = arr[a];
    arr[a] = arr[b];
    arr[b] = tmp;
}

function BresenhamLine(x0, y0, x1, y1) {

    let result = [];

    let steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    if (steep) {
        swap(result, x0, y0);
        swap(result, x1, y1);
    }
    if (x0 > x1) {
        swap(result, x0, x1);
        swap(result, y0, y1);
    }

    let deltax = x1 - x0;
    let deltay = Math.abs(y1 - y0);
    let error = 0;
    let ystep;
    let y = y0;
    if (y0 < y1) {
        ystep = 1;
    } else {
        ystep = -1;
    }
    for (let x = x0; x <= x1; x++) {
        if (steep) {
            result.push([y, x]);
        } else {
            result.push([x, y]);
        }
        error += deltay;
        if (2 * error >= deltax) {
            y += ystep;
            error -= deltax;
        }
    }

    return result;
}
/*function besLine(x0, y0, x1, y1)
     let deltax = x1 - x0;
     let deltay = y1 - y0;
     let deltaerr = Math.abs(deltay / deltax);
     let error = 0.0;
     let y = y0;
     let ps = [];
     for (x =x0;x<=x1;x++) {
         ps.push(x,y);
         error = error + deltaerr;
         while (error >= 0.5) {
             y = y + Math.sign(deltay) * 1
             error = error - 1.0;
         } 
        
     }*/



function discardWeapon(side) {
    if (side == "left") {
        player.weapL = null;
    } else if (side == "right") {
        equipWeapon("right", "handGun")
    }
}

function moveRockets() {
    loop1:
    for (let key = rockets.length - 1; key >= 0; key--) {
        let r = rockets[key];


        let lowDis = 99999;
        
            for (let i in bricks) {
                let b = bricks[i];
                for (let j in b.tiles) {
                    let t = b.tiles[j];
                    let dis = Distance(
                        b.pos.x + t[0] * tileSize + tileSize / 2,
                        b.pos.y + t[1] * tileSize + tileSize / 2, r[0], r[1]);
                    if (dis < lowDis) {
                        lowDis = dis;
                        r[4] = [i, j];
                        r[5] = "moving";

                    }
                }
            }
        
            
            
            for (let i in solidBricks) {
                for (let j in solidBricks[i]) {
                    if (solidBricks[i][j][0]) {
                        let dis = Distance(j * tileSize + tileSize / 2, i * tileSize + tileSize / 2, r[0], r[1]);
                        if (dis < lowDis) {
                            lowDis = dis;
                            r[4] = [j, i];
                            r[5] = "solid";
                        }
                    }
                }
            }
        

        if (r[4]==null) {
            r[2] += Math.PI * 0.01;
            r[0] += Math.cos(r[2]) * tileSize / 10;
            r[1] += Math.sin(r[2]) * tileSize / 10;
        } else {
            try {
                let ang;
                let dis;
            if (r[5] == "solid") {
                ang = angle(r[0], r[1],
                    r[4][0] * tileSize + tileSize / 2,
                    r[4][1] * tileSize + tileSize / 2);
                dis = Distance(r[0], r[1],
                    r[4][0] * tileSize + tileSize / 2,
                    r[4][1] * tileSize + tileSize / 2);
                let side = findSideToTurn(ang, r[2]);
                r[2] += Math.PI * 0.01 * side;
                r[0] += Math.cos(r[2]) * tileSize / 10;
                r[1] += Math.sin(r[2]) * tileSize / 10;
            } else if (r[5] == "moving") {
                ang = angle(r[0], r[1],
                    bricks[r[4][0]].pos.x + tileSize * bricks[r[4][0]].tiles[r[4][1]][0] + tileSize / 2,
                    bricks[r[4][0]].pos.y + tileSize * bricks[r[4][0]].tiles[r[4][1]][1] + tileSize / 2);
                dis = Distance(r[0], r[1],
                    bricks[r[4][0]].pos.x + tileSize * bricks[r[4][0]].tiles[r[4][1]][0] + tileSize / 2,
                    bricks[r[4][0]].pos.y + tileSize * bricks[r[4][0]].tiles[r[4][1]][1] + tileSize / 2);
                let side = findSideToTurn(ang, r[2]);
                r[2] += Math.PI * 0.01 * side;
                r[0] += Math.cos(r[2]) * tileSize / 10;
                r[1] += Math.sin(r[2]) * tileSize / 10;
            }
            if (dis < tileSize / 1.5) {
                addExplosion(r[0], r[1], 50);
                for (let i in solidBricks) {
                    for (let j in solidBricks[i]) {
                        let dis2 = Distance(r[0], r[1],
                            j * tileSize + tileSize / 2,
                            i * tileSize + tileSize / 2);
                        if (dis2 < tileSize*2) {
                            damageSolidTile(i, j, damage * weaponPresets.rocketGun.dmg)
                        }
                    }
                }

                for (let i=bricks.length-1;i>=0;i--) {
                    let b = bricks[i];
                    for (let j = b.tiles.length-1;j>=0;j--) {
                        let dis2 = Distance(b.pos.x+b.tiles[j][0]*tileSize+tileSize/2,b.pos.y+b.tiles[j][1]*tileSize+tileSize/2,r[0],r[1])
                        if(dis2 < tileSize*2) {
                            damageTile(i,j,damage*weaponPresets.rocketGun.dmg)
                        }
                    }
                }
                rockets.splice(key, 1);
                continue loop1;
            }
        } catch(e)
 { 
}            
        }

    }
}
var invincible=0;
var tilesToKill=[];
var bricksToKill=[];
function damageTile(i, j, dmg) {
let x = bricks[i].pos.x + bricks[i].tiles[j][0] * tileSize + tileSize / 2;
let y = bricks[i].pos.y + bricks[i].tiles[j][1] * tileSize + tileSize / 2;
    bricks[i].tiles[j][2] -= dmg;
    addDamage(x, y, dmg)
    if (bricks[i].tiles[j][2] <= 0) {
        tilesToKill.push([i,j]);


        if (bricks[i].tiles.length <= 0) {
            bricks.splice(i, 1);

        }

    }

}

function damageSolidTile(i, j, dmg) {
    solidBricks[i][j][1] -= dmg;
    addDamage(tileSize * j + tileSize * Math.random(), tileSize * i + tileSize * Math.random(), dmg);
    if (solidBricks[i][j][1] <= 0) {
        particleSplatter(j * tileSize + tileSize / 2, i * tileSize + tileSize / 2, player.dir + Math.PI * 0.5, 35, 5.5, 5, 5, Math.PI * 2, 150, 150, 150, 0.3)
        
        solidBricks[i][j][1] = 0;
        solidBricks[i][j][0] = false;
    }
}

function moveBullets() {
    loop1: for (let key = bullets.length - 1; key >= 0; key--) {
        let b = bullets[key];
        b[0] += 8 * Math.cos(b[2]);
        b[1] += 8 * Math.sin(b[2]);

        if (b[0] < 0 || b[0] > gameW * tileSize) {
            bullets.splice(key, 1);
            continue;
        }
        if (b[1] < 0 || b[1] > gameH * tileSize) {
            bullets.splice(key, 1);
            continue;
        }

        for (let i = 0; i < solidBricks.length; i++) {
            for (let j = 0; j < solidBricks[i].length; j++) {
                if (solidBricks[i][j][0] == true) {
                    let tx = j * tileSize;
                    let ty = i * tileSize - tileSize;

                    if (bullets[key][0] > tx && bullets[key][0] < tx + tileSize) {
                        if (bullets[key][1] > ty && bullets[key][1] < ty + tileSize) {
                            damageSolidTile(i, j, damage * bullets[key][3]);

                            addExplosion(bullets[key][0], bullets[key][1], Math.random() * tileSize * 0.4 + tileSize * 0.1);
                            // particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a)
                            particleSplatter(bullets[key][0], bullets[key][1], -bullets[key][2], 10 + Math.random() * 10, Math.random() * 0.5 + 1, 3 + Math.random() * 10, Math.random() * 5 + 5, Math.PI * 0.5, 250, 150 + Math.floor(Math.random() * 100), Math.floor(Math.random() * 0), 0.5)

                            bullets.splice(key, 1);

                            continue loop1;
                        }
                    }

                }
            }


        }

        for (let i = bricks.length - 1; i >= 0; i--) {
            for (let j = bricks[i].tiles.length - 1; j >= 0; j--) {

                let tx = bricks[i].pos.x + bricks[i].tiles[j][0] * tileSize;
                let ty = bricks[i].pos.y + bricks[i].tiles[j][1] * tileSize;

                if (bullets[key][0] > tx && bullets[key][0] < tx + tileSize) {
                    if (bullets[key][1] > ty && bullets[key][1] < ty + tileSize) {
                        damageTile(i, j, bullets[key][3] * damage);
                        
                        

                        particleSplatter(bullets[key][0], bullets[key][1], -bullets[key][2], 10 + Math.random() * 10, Math.random() * 0.5 + 1, 3 + Math.random() * 10, Math.random() * 5 + 5, 0.5 * Math.PI, 250, 150 + Math.floor(Math.random() * 100), Math.floor(Math.random() * 0), 0.5)
                        

                       
                        bullets.splice(key, 1);
                        console.log("coll");
                        continue loop1;
                    }
                }
            }
        }
    }

    if (bulletsLaserR && player.weapR) {
        //getInterceptPoint()

        let pos = getHandPosR();
        let ang = angle(mouseX, mouseY, pos.x, pos.y);
        xOff = (images[player.weapR.img].width - player.weapR.offset.x) / images[player.weapR.img].width * tileSize * player.weapR.dims.w;
        yOff = player.weapR.offset.y / images[player.weapR.img].height * tileSize * player.weapR.dims.h;
        let x = pos.x - Math.cos(ang) * xOff - Math.cos(ang + Math.PI * 0.5) * yOff;
        let y = pos.y - Math.sin(ang) * xOff - Math.sin(ang + Math.PI * 0.5) * yOff;
        bulletsLaserR[0] = x;
        bulletsLaserR[1] = y;
        ang = angle(x, y, mouseX, mouseY);
        bulletsLaserR[2] = ang;
        bulletsLaserR[4] = x1 + Math.cos(ang) * width * height;
        bulletsLaserR[5] = y1 + Math.sin(ang) * width * height;

        let lowDis = 99990;
        let hitX = bulletsLaserR[4];
        let hitY = bulletsLaserR[5];
        /*let line = BresenhamLine(x,y,bulletsLaserR[4],bulletsLaserR[5])*/
        /*console.log(line);*/
        for (let i = 0; i < width * height && x < gameW * tileSize && x > 0 && y > 0 && y < gameH * tileSize; i += Math.min(Math.max(tileSize * 0.05, 1), 10)) {
            x += Math.cos(bulletsLaserR[2]) * i;
            y += Math.sin(bulletsLaserR[2]) * i;
            for (let key = bricks.length - 1; key >= 0; key--) {
                for (let j = bricks[key].tiles.length - 1; j >= 0; j--) {
                    let x2 = bricks[key].pos.x + bricks[key].tiles[j][0] * tileSize;
                    let y2 = bricks[key].pos.y + bricks[key].tiles[j][1] * tileSize;
                    if (x2 < x && x2 + tileSize > x) {

                        if (y2 < y && y2 + tileSize > y) {

                            let dis = Distance(x, y, x2, y2);
                            if (dis < lowDis) {
                                damageTile(key, j, bulletsLaserR[3] * damage);

                                bulletsLaserR[4] = x + Math.cos(ang) * (dis);
                                bulletsLaserR[5] = y + tileSize + Math.sin(ang) * (dis);
                                lowDis = dis;
                                particleSplatter(bulletsLaserR[4], bulletsLaserR[5], bulletsLaserR[2] - Math.PI * 0.5, 8, 2 + Math.random() * 2, 15, 2, Math.random() * Math.PI * 2, 250, 0, 0, 0.5)

                            }


                            //addExplosion(bulletsLaserR[4]+Math.random()*tileSize*0.2-Math.random()*tileSize*0.2, bulletsLaserR[5]+Math.random()*tileSize*0.2-Math.random()*tileSize*0.2, 3+Math.random()*10);
                            // particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a)



                        }
                    }
                    /*let intersect = getRectEdge(mouseX,mouseY,x,y,x2,y2,tileSize,tileSize);
                    if (intersect) {
                        console.log(intersect);    
                        
                    }*/
                }

            }
            for (let key = 0; key < solidBricks.length; key++) {
                for (let j = 0; j < solidBricks[key].length; j++) {
                    if (solidBricks[key][j][0] == true) {
                        let x2 = j * tileSize;
                        let y2 = key * tileSize - tileSize;

                        if (x > x2 && x < x2 + tileSize) {
                            if (y > y2 && y < y2 + tileSize) {
                                let dis = Distance(x, y, x2, y2);
                                if (dis < lowDis) {
                                    damageSolidTile(key, j, damage * bulletsLaserR[3]);
                                    bulletsLaserR[4] = x + Math.cos(ang) * (dis);
                                    bulletsLaserR[5] = y + tileSize + Math.sin(ang) * (dis);

                                    lowDis = dis;


                                    particleSplatter(bulletsLaserR[4], bulletsLaserR[5], bulletsLaserR[2] - Math.PI * 0.5, 8, 2 + Math.random() * 2, 15, 2, Math.random() * Math.PI * 2, 250, 0, 0, 0.5)


                                }


                            }
                        }

                    }
                }


            }

        };

        player.weapR.ammo -= 1;
        if (player.weapR.ammo <= 0) {
            discardWeapon("right");
            return;
        }
    } else {
        bulletsLaserR = null;
    }
    if (bulletsLaserL && player.weapL) {

        //getInterceptPoint()
        let pos = getHandPosL();
        let ang = angle(mouseX, mouseY, pos.x, pos.y);
        xOff = (images[player.weapL.img].width - player.weapL.offset.x) / images[player.weapL.img].width * tileSize * player.weapL.dims.w;
        yOff = -player.weapL.offset.y / images[player.weapL.img].height * tileSize * player.weapL.dims.h;
        let x = pos.x - Math.cos(ang) * xOff - Math.cos(ang + Math.PI * 0.5) * yOff;
        let y = pos.y - Math.sin(ang) * xOff - Math.sin(ang + Math.PI * 0.5) * yOff;
        bulletsLaserL[0] = x;
        bulletsLaserL[1] = y;
        ang = angle(x, y, mouseX, mouseY);
        bulletsLaserL[2] = ang;
        bulletsLaserL[4] = x1 + Math.cos(ang) * width * height;
        bulletsLaserL[5] = y1 + Math.sin(ang) * width * height;

        let lowDis = 99990;
        let hitX = bulletsLaserL[4];
        let hitY = bulletsLaserL[5];
        /*let line = BresenhamLine(x,y,bulletsLaserR[4],bulletsLaserR[5])*/
        /*console.log(line);*/
        for (let i = 0; i < width * height && x < gameW * tileSize && x > 0 && y > 0 && y < gameH * tileSize; i += Math.min(Math.max(tileSize * 0.05, 1), 10)) {
            x += Math.cos(bulletsLaserL[2]) * i;
            y += Math.sin(bulletsLaserL[2]) * i;
            for (let key = bricks.length - 1; key >= 0; key--) {
                for (let j = bricks[key].tiles.length - 1; j >= 0; j--) {
                    let x2 = bricks[key].pos.x + bricks[key].tiles[j][0] * tileSize;
                    let y2 = bricks[key].pos.y + bricks[key].tiles[j][1] * tileSize;
                    if (x2 < x && x2 + tileSize > x) {

                        if (y2 < y && y2 + tileSize > y) {
                            damageTile(key, j, bulletsLaserL[3] * damage);
                            

                            let dis = Distance(x, y, x2, y2);
                            if (dis < lowDis) {
                                bulletsLaserL[4] = x + Math.cos(ang) * (dis);
                                bulletsLaserL[5] = y + tileSize + Math.sin(ang) * (dis);
                                lowDis = dis;

                            }


                            //addExplosion(bulletsLaserL[4]+Math.random()*tileSize*0.2-Math.random()*tileSize*0.2, bulletsLaserL[5]+Math.random()*tileSize*0.2-Math.random()*tileSize*0.2, 3+Math.random()*10);
                            // particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a)
                            particleSplatter(bulletsLaserL[4], bulletsLaserL[5], bulletsLaserL[2] - Math.PI * 0.5, 8, 2 + Math.random() * 2, 15, 2, Math.random() * Math.PI * 2, 250, 0, 0, 0.5)


                        }
                    }
                    /*let intersect = getRectEdge(mouseX,mouseY,x,y,x2,y2,tileSize,tileSize);
                    if (intersect) {
                        console.log(intersect);    
                        
                    }*/
                }

            }
            for (let key = 0; key < solidBricks.length; key++) {
                for (let j = 0; j < solidBricks[key].length; j++) {
                    if (solidBricks[key][j][0] == true) {
                        let x2 = j * tileSize;
                        let y2 = key * tileSize - tileSize;

                        if (x > x2 && x < x2 + tileSize) {
                            if (y > y2 && y < y2 + tileSize) {
                                let dis = Distance(x, y, x2, y2);
                                if (dis < lowDis) {
                                    damageSolidTile(key, j, damage * bulletsLaserL[3]);

                                    bulletsLaserL[4] = x + Math.cos(ang) * (dis);
                                    bulletsLaserL[5] = y + tileSize + Math.sin(ang) * (dis);
                                    lowDis = dis;

                                    particleSplatter(bulletsLaserL[4], bulletsLaserL[5], bulletsLaserL[2] - Math.PI * 0.5, 8, 2 + Math.random() * 2, 15, 2, Math.random() * Math.PI * 2, 250, 0, 0, 0.5)


                                }


                            }
                        }

                    }
                }


            }
        };
        player.weapL.ammo -= 1;
        if (player.weapL.ammo <= 0) {
            discardWeapon("left");
            return;
        }
    } else {
        bulletsLaserL = null;
    }
}
var damages = [];

function addDamage(x, y, am) {
    let rnd = Math.random();
    while (damages.length > 50) {
        damages.splice(0, 1)
    }
    damages.push([x, y, am, Math.random() * Math.PI * 2, Math.ceil(rnd * 50), Math.ceil(rnd * 50)])
}

function drawDamages() {
    for (let key = damages.length - 1; key >= 0; key--) {
        damages[key][4]--;
        if (damages[key][4] <= 0) {
            damages.splice(key, 1);
        } else {
            let d = damages[key];
            damages[key][0] += Math.cos(d[3]) * 5 * (1 - d[4] / d[5]);
            damages[key][1] += Math.cos(d[3]) * 5 * (1 - d[4] / d[5]);
            ctx.font = 10 + 10 * Math.ceil(d[4] / d[5]) + "px Arial black";
            ctx.fillStyle = "rgba(255,255,255," + d[4] / d[5] + ")";
            ctx.fillText(d[2], d[0], d[1]);
        }
    }
}

function collidesBB(bullet, brick) {
    for (let i = 0; i < brick.tiles.length; i++) {
        let tx = brick.pos.x + brick.tiles[i][0] * tileSize;
        let ty = brick.pos.y + brick.tiles[i][1] * tileSize;
        if (bullet[0] > tx && bullet[0] < tx + tileSize) {
            if (bullet[1] > ty && bullet[1 < ty + tileSize]) {
                return true;
            }
        }
    }
}
var bulletTickR = 0;
var bulletTickRGB = false;
var bulletTickL = 0;
var bulletTickLGB = false;

function drawBullets() {
    for (let key in bullets) {
        let b = bullets[key];
        ctx.beginPath();
        for (let i = 0; i < 15; i++) {
            ctx.fillStyle = "rgba(255,255,255,0.05)";
            ctx.strokeStyle = "rgba(255,255,255,0.04)";
            ctx.lineWidth = 0.5 + Math.random();;
            ctx.arc(b[0] - Math.cos(b[2]) * (2 * i + 1), b[1] - Math.sin(b[2]) * (2 * i + 1), tileSize * 0.05125, 0, Math.PI + 2, 0);
            ctx.fill();

        }

        ctx.closePath();
        ctx.drawImage(images.bullet, b[0] - tileSize * 0.015, b[1] - tileSize * 0.015, tileSize * 0.125, tileSize * 0.125)
    }
    if (bulletsLaserL && player.weapL && player.weapL.img == "laserGun") {

        bulletTickL = ((bulletTickL + 1) % 10);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = "rgba(255,0,0," + ((1 + i) / 25) + ")";
            ctx.lineWidth = Math.max(3, tileSize / 100) + 4 * Math.sin(bulletTickL) + i;
            ctx.moveTo(bulletsLaserL[0], bulletsLaserL[1]);
            ctx.lineTo(bulletsLaserL[4], bulletsLaserL[5]); //tx.lineTo(bulletsLaserL[0]+Math.cos(bulletsLaserL[2])*width*height,bulletsLaserL[1]+Math.sin(bulletsLaserL[2])*width*height);
            ctx.stroke();
        }
        ctx.closePath();
    }
    if (bulletsLaserR && player.weapR && player.weapR.img == "laserGun") {
        bulletTickR = ((bulletTickR + 1) % 10);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = "rgba(255,0,0," + ((1 + i) / 25) + ")";
            ctx.lineWidth = Math.max(3, tileSize / 100) + 4 * Math.sin(bulletTickR) + i;
            ctx.moveTo(bulletsLaserR[0], bulletsLaserR[1]);
            ctx.lineTo(bulletsLaserR[4], bulletsLaserR[5]); //tx.lineTo(bulletsLaserL[0]+Math.cos(bulletsLaserL[2])*width*height,bulletsLaserL[1]+Math.sin(bulletsLaserL[2])*width*height);
            ctx.stroke();
        }
        ctx.closePath();
    }
}

function keyDownMine(e) {
    if (e.key != "Meta" && e.key != "r") {
        e.preventDefault();
    }
    if ((e.key == "ArrowDown" || e.key == "s") && !moved) {

        downClicked = true;
        moved = true;
    } else if ((e.key == "ArrowUp" || e.key == "w") && !moved) {

        upClicked = true;
        moved = true;
    } else if ((e.key == "ArrowLeft" || e.key == "a") && !moved) {

        leftClicked = true;
        moved = true;
    } else if ((e.key == "ArrowRight" || e.key == "d") && !moved) {

        rightClicked = true;
        moved = true;
    } else if (e.key == " ") {

    }
}

function keyUpMine(e) {
    if (e.key == "ArrowDown" || e.key == "s") {
        // console.log("down");
        downClicked = false;

    } else if (e.key == "ArrowUp" || e.key == "w") {
        //console.log("up");
        upClicked = false;

    } else if (e.key == "ArrowLeft" || e.key == "a") {
        //console.log("left");
        leftClicked = false;

    } else if (e.key == "ArrowRight" || e.key == "d") {
        //console.log("right");
        rightClicked = false;

    }
}



function count(that, arr) {
    let am = 0;
    for (let key in arr) {
        if (that == arr[key]) {
            am++;
        }
    }
    return am;
}

function countUntil(that, arr, key) {
    let am = 0;
    for (let kei = 0; kei < key; kei++) {
        if (that == arr[kei]) {
            am++;
        }
    }
    return am;
}

function countFrom(that, arr, key) {
    let am = 0;
    for (let kei = key + 1; kei < arr.length; kei++) {
        if (that == arr[kei]) {
            am++;
        }
    }
    return am;
}

function createDiv(id, classNames, styles, props, attributes) {
    let div = document.createElement("div");
    div.id = id;
    div.className = classNames;
    for (let key in styles) {
        div.style[key] = styles[key];
    }
    for (let key in props) {
        div[key] = props[key];
    }
    for (let key in attributes) {
        div.setAttribute(key, attributes[key]);
    }
    return div;
}

function createCanvas(w, h, mL, mT, id, className, L, T, abs) {

    let tmpCnv = document.createElement("canvas");
    tmpCnv.id = id;
    tmpCnv.className = className;
    tmpCnv.width = w;
    tmpCnv.height = h;
    tmpCnv.style.marginTop = mT + "px";
    tmpCnv.style.marginLeft = mL + "px";
    if (abs) {
        tmpCnv.style.position = "absolute";
    }
    return tmpCnv;
}
var dummyContext = document.createElement("canvas");

function hslToRgbString(h, s, l, a) {
    // a = a || 1;
    a = Math.floor(a * 100) / 100;
    dummyContext.fillStyle = 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ' )';
    //str = (String) dummyContext.fillStyle;
    return dummyContext.fillStyle;
}
var shapeMons = 5;

function getColor(n, a) {


    let h = n * 5 + Math.floor((n * 5) / shapeMons) * 55 + Math.floor(n * 5 / 100) * 30;
    let s = 3 * 50 + n * 5 - Math.floor(n * 5 / 5); //Math.floor(n/10);
    let l = 65 - n * 5 * 5 + Math.floor(n * 5 / 5) * 25; //Math.floor(n/10);
    return hslToRgbString(h, s, l, a);

}

function Distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function angle(p1x, p1y, p2x, p2y) {

    return Math.atan2(p2y - p1y, p2x - p1x);

}

function showInstructions() {
    $('#instructions').css('display', 'block');
}

function showChangelog() {
    $('#changelog').css('display', 'block');
}

function hideInstructions() {
    $('#instructions').css('display', 'none');
}

function hideChangelog() {
    $('#changelog').css('display', 'none');
}

function hideFirstTime() {
    $('#firstTime').css('display', 'none');
}

function showCredits() {
    $('#credits').css('display', 'block');
}

function hideCredits() {
    $('#credits').css('display', 'none');
}

function mainMenu() {
    $("#mainMenu").css("display", "block");
    $("#pauseButton").css("display", "none");
    $("#gameOver").css("display", "none");
}

function muteMusic() {
    /*

        if (musicMuted) {
            musicMuted = false;
            bgAudio.play();
        } else {
            musicMuted = true;
            bgAudio.pause();
            bgAudio.currentTime = 0;
        }

    */
}

function muteAudio() {
    if (audioMuted) {
        audioMuted = false;
    } else {
        audioMuted = true;
    }
}


function oneSpriteItem(name, x, y, w, h) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function makeJSONLine(oneSprite) {
    let str = '"';
    str += oneSprite.name;
    str += '":';
    str += "            ";
    str += "{";
    str += '"' + "x" + '":' + oneSprite.x + ',';
    str += '"' + "y" + '":' + oneSprite.y + ',';
    str += '"' + "w" + '":' + oneSprite.w + ',';
    str += '"' + "h" + '":' + oneSprite.h + '}';
    return str;
}

function makeJSONFile(arr) {
    let str = "{";
    for (let key = 0; key < arr.length; key++) {
        if (key != 0) {
            str += ",";
        }
        str += makeJSONLine(new oneSpriteItem(
            arr[key].getAttribute("name"),
            arr[key].getAttribute("x"),
            arr[key].getAttribute("y"),
            arr[key].getAttribute("width"),
            arr[key].getAttribute("height")
        ));
    }
    str += "}";
    return str;
}

function addUnique(arr, val) {
    for (let key in arr) {
        if (arr[key] == val) {
            return;
        }
    }
    arr.push(val);
}

function assignSymbolSpriteSheetImages(e) {
    for (let key in e) {
        images[key] = e[key];
    }
    checkReadImages();
}

function checkReadImages() {
    imagesToLoad--;
    if (!imagesToLoad) {

        start();

    }
}
var weaponList = {
    handGun: {
        damage: 15,
        fireRate: 50,
        ammo: 25,
        frequency: 0.1,
    },
    machineGun: {
        damage: 10,
        fireRate: 5,
        ammo: 150,
        frequency: 0,
    },
    laserGun: {
        damage: 10,
        fireRate: 50,
        ammo: 250,
        frequency: 0,
    },
    rocketGun: {
        damage: 100,
        fireRate: 150,
        ammo: 5,
        frequency: 0,
    },
}

function initWeaponUpgrades() {
    for (let key in upgrades.list) {
        let div = createDiv(key, "upgrade", {}, {

        })
        div.addEventListener("click", function() {

            upgrades.buy(key);
        })
        let tit = createDiv(key + "title", "upgradeTitle", {

        }, {
            innerHTML: upgrades.list[key].name,
        })
        let pr = createDiv(key + "price", "upgradePrice", {

        }, {
            innerHTML: "$" + nFormatter(upgrades.list[key].price(),2),
        })
        div.appendChild(tit);
        div.appendChild(pr);
        document.getElementById("upgrades").appendChild(div)
    }
}
/*var weapUps = {
    handGun: {
        damage: {

        }
        fireRate:
        ammo:
        frequency: 
    }
}*/
function canAfford(key) {
    if (money >= upgrades.list[key].price()) {
        return true
    }
    return false;
}
var upgrades = {
    reset: function() {
        for (let key in this.list) {
            this.list[key].bought = 0;
        }
    },
    buy: function(that) {
        let pr = upgrades.list[that].price();
        if (pr <= money && upgrades.list[that].bought < upgrades.list[that].max) {
            money -= pr;
            updateMoney = true;
            upgrades.list[that].effect();
            upgrades.list[that].bought++;
            $("#"+that+"price").html("$" + nFormatter(upgrades.list[that].price(),2))
            if (upgrades.list[that].bought >= upgrades.list[that].max) {
                $("#" + that).remove();

            }
        } else {
            console.log("cant afford")
        }
    },
    list: {
        doubleJump: {
            key: "doubleJump",
            name: "Double Jump",
            price: function() {
                return 500;
            },
            effect: function() {
                doubleJump = true
            },
            max: 1,
            bought: 0,

        },
        doubleDmg: {
            key: "doubleDmg",
            name: "Damage x2",
            price: function() {
                return 20 * Math.pow(1 + this.bought, 2);
            },
            effect: function() {
                damage += Math.max(1, damage);

            },
            max: 100,
            bought: 0,

        },
        fireRate: {
            key: "fireRate",
            name: "Increase Fire-Rate",
            price: function() {
                return 50 * Math.pow(1 + this.bought, 4);
            },
            effect: function() {
                fireRate*=2;

            },
            max: 10,
            bought: 0,

        },
        moreDrops: {
            key: "moreDrops",
            name: "More Drops!",
            price: function() {
                return 500 * Math.pow(2*(1 + this.bought), 2);
            },
            effect: function() {
               drops*=2;

            },
            max: 100,
            bought: 0,

        },



    }
}
var damage = 1;
var drops=1;
var fireRate=1;