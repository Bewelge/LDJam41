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
var width, height;
var jumped = false;
var gameW = 10;
var maxBricks=5;
var gameH = 15;
var images = {

};
var player = {
    lives: 3,
    weapL: null,
    weapR: null,
    pos: {
        x: 0,
        y: 0,
    }
};
function equipWeapon(side,weap) {
    if (side=="left") {
        player.weapL = new weapon(weaponPresets[weap])
    } else if(side == "right") {
        player.weapR= new weapon(weaponPresets[weap])
    }
}
var weaponPresets={
    handGun: {
        img: "handGun",
        bullet: "munition",
        dmg: 5,
        kickBack: 5,
        dims: {
            w:0.6,
            h:0.4,
        },
        holdOffset: {
            w:0.2,
            h:0,
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
        dmg: 10,
        kickBack: 5,
        dims: {
            w:1.3,
            h:0.42
        },
        holdOffset: {
            w:0.25,
            h:0,
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
        dmg: 50,
        kickBack: 1,
        dims: {
            w:0.6,
            h:0.4
        },
        holdOffset: {
            w:0.25,
            h:0,
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
            w:1.3,
            h:0.42
        },
        holdOffset: {
            w:0.25,
            h:0,
        },
        offset: {
            x: 60,
            y: -10,
        },
        tick: 100,
        ammo: 100,
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



function restart() {
    solidBricks = [];
    for (let j = 0; j < gameH; j++) {
        solidBricks.push([]);
        for (let i = 0; i < gameW; i++) {
            solidBricks[j].push([false,0,0]);
        }
    }
    roundTime = 0;

    $("#killMessage").css({
        "font-size": "100px",
        height: "100%",
        opacity: 1
    });

    paused = false;
    player.pos.x = width / 2;
    player.pos.y = groundY;
    dead = false;
    Points = 0;
    /*bgAudio.playBackRate = 0.7;*/
    $("#gameOver").css("display", "none");
    $("#pauseButton").css("display", "block");
    $("#HUD").css("display", "block");
    $("#mainMenu").css("display", "none");


}

function start() {

    dead = true;
    if (window.localStorage.getItem(("highScore"))) {
        highscore = window.localStorage.getItem("highScore");
    }
    if (!window.localStorage.getItem("playedBefore")) {
        //$("#firstTime").css("display", "block");
        try {

            window.localStorage.setItem("playedBefore", true);
        } catch (e) {
            console.error(e);
        }
    }

    width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth / 1;
    height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
    width = Math.floor(width);
    height = Math.floor(height);
    $("body").css("width", width);
    $("body").css("height", height);
    hlfSize = Math.floor(Math.min(width, height) / 2);
    qrtSize = Math.floor(hlfSize / 2);
    tileSize = Math.floor(height / gameH); //Math.sqrt(width * height) / 50;
    /*gameH = Math.floor(height / tileSize);*/
    gameW = Math.floor(width/2/tileSize);
    groundY = Math.floor((gameH - 1) * tileSize);
    player.pos.y = groundY;
    for (let j = 0; j < gameH; j++) {
        solidBricks.push([]);
        for (let i = 0; i < gameW; i++) {
            solidBricks[j].push([false,0,0]);
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
    $('#mainMenu').fadeIn();
    $('#HUD').fadeIn();

    equipWeapon("right","handGun");

    tick();

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



function tick(restart) {
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

        step();

        if (moved) {
            moved = false;
        }
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
var falling=0;
function movePlayer() {
    walking = false;
   

   if (!onGround && !jumped) {
        falling=Math.max(1,falling*1.05);
        let groundTile = getGroundTile();
        let htOffGround = tileSize * groundTile - player.pos.y;

        if (htOffGround>tileSize*0.05) {
            movePlayerY((tileSize  + downClicked * tileSize)/4 *(Math.max(1,falling)*tileSize) / 50);
        } else {
            onGround = true;
            falling=0;
            player.pos.y = tileSize * groundTile;
        }
        
    } else if (jumped > 0) {
        jumped--;
        movePlayerY(-0.005 * tileSize * jumped)
        /*player.pos.y-=0.01*tileSize*jumped;*/
    }
     if (upClicked && onGround) {
        jumped = 40;
        onGround = false;
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
    onGround=false;
}

function movePlayerX(am) {
    let curYTile = Math.floor(player.pos.y / tileSize);
    let curXTile = Math.floor(player.pos.x / tileSize);
    let nextTile;
    if (am>0) {
        nextTile = Math.floor((player.pos.x + am + tileSize*0.25) / tileSize);
    } else if (am<0) {
        nextTile = Math.floor((player.pos.x + am - tileSize*0.25) / tileSize);
    }
    if (nextTile<0 || nextTile > gameW-1) {
        return;
    }
    if (curXTile != nextTile) {
        if (!solidBricks[curYTile][nextTile][0]) {
            player.pos.x += am;
        }
    } else {
        player.pos.x += am;
    }
}

function movePlayerY(am) {

    let curYTile = Math.floor(player.pos.y / tileSize);
    let curXTile = Math.floor(player.pos.x / tileSize);
    let newTile = Math.floor((player.pos.y+am)/tileSize);
    if (newTile<0 || newTile > gameH-1) {
        return;
    }
    if (am > 0) {
        let groundTile = getGroundTile();
        let nextTile = Math.floor((player.pos.y + am) / tileSize);
        if (groundTile == nextTile+1) {
            player.pos.y = groundTile * tileSize;
            console.log("bla");
            onGround=true;
            falling=0;
        } else {
            player.pos.y += am;
        }

    } else if (am < 0) {
        let topTile = getTopTile();
        let nextTile = Math.floor((player.pos.y + am) / tileSize);
        if (topTile == nextTile+1) {
            player.pos.y = topTile * tileSize;
            jumped=0;
        } else {
            player.pos.y += am;
        }
    }

}

function getGroundTile() {
    let curYTile = Math.floor(player.pos.y / tileSize);
    let curXTile = Math.floor(player.pos.x / tileSize);

    while (!solidBricks[curYTile][curXTile][0] ) {
        curYTile++;
        if (curYTile>gameH-1) {
            return gameH-1;
        }
    }
    
        return curYTile-1;

    
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
        return curYTile+1;

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
    if (htOffGround > tileSize * 0.1 && jumped <= 0 && falling>0) {
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
    let rnd = Math.random() * (kickBackL + kickBackR)/10-Math.random() * (kickBackL + kickBackR)/10;
    ctx.drawImage(images.playerBody, rnd + player.pos.x - tileSize * 0.375, rnd + player.pos.y - tileSize * 0.75, rnd+tileSize * 0.75, rnd+tileSize * 0.75);
}

function drawHead() {
    let rnd = 0;
    if (walking) {
        rnd = Math.random() * 1 - Math.random() * 1;
    }
    rnd += Math.random() * (kickBackL + kickBackR)/10-Math.random() * (kickBackL + kickBackR)/10;
    let htOffGround = groundY - player.pos.y;
    let offGroundMod = 0;
    if (htOffGround > 0 && jumped <= 0 && falling>0) {
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
    ctx.rotate(Math.random() * kickBackR *Math.PI/ 200 - Math.random() * kickBackL *Math.PI/ 200);


    ctx.drawImage(images.playerHead, rnd - tileSize * 0.5, rnd - tileSize * 1.5 + jumpMod - offGroundMod, tileSize * 1, tileSize * 1);
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
        let ang = angle(mouseX,mouseY,player.pos.x+tileSize*0.3,player.pos.y-tileSize*0.3);
        /*let ang = player.dir;*/
        let pos = getHandPosR()
        x1 = pos.x-Math.cos(ang)*tileSize*player.weapR.holdOffset.w;//player.pos.x + tileSize * 0.3 - Math.cos(ang - Math.PI * 0.5) * (tileSize * 0.5 - kickBackR * tileSize * 0.02);
        y1 = pos.y-Math.sin(ang)*tileSize*player.weapR.holdOffset.w;//player.pos.y - tileSize * 0.3 - Math.sin(ang - Math.PI * 0.5) * (tileSize * 0.5 - kickBackR * tileSize * 0.02);
        if (kickBackR > 0) {
            kickBackR = (kickBackR * 0.5);
            if (kickBackR < 0.05) {
                kickBackR = 0;
            }
        }
        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(ang - Math.PI*1);
        ctx.drawImage(images[player.weapR.img], -tileSize * player.weapR.dims.w/2, -tileSize * player.weapR.dims.h/2, tileSize * player.weapR.dims.w, tileSize * player.weapR.dims.h);
        ctx.restore();
        /*ctx.drawImage(images[player.weapR.img],-tileSize*0.25,0,tileSize*0.5,tileSize*0.5);*/
        /*ctx.*/
    }
    if (player.weapL != null) {
        let ang = angle(mouseX,mouseY,player.pos.x-tileSize*0.3,player.pos.y-tileSize*0.3);
        /*let ang = player.dir;*/
        let pos = getHandPosL()
        x1 = pos.x-Math.cos(ang)*tileSize*player.weapL.holdOffset.w;//player.pos.x - tileSize * 0.3 - Math.cos(ang - Math.PI * 0.5) * (tileSize * 0.5 - kickBackL * tileSize * 0.02);
        y1 = pos.y-Math.sin(ang)*tileSize*player.weapL.holdOffset.w;//player.pos.y - tileSize * 0.3 - Math.sin(ang - Math.PI * 0.5) * (tileSize * 0.5 - kickBackL * tileSize * 0.02);
        if (kickBackL > 0) {
            kickBackL = (kickBackL * 0.5);
            if (kickBackL < 0.05) {
                kickBackL = 0;
            }
        }
        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(ang );
        ctx.drawImage(images[player.weapL.img + "L"], -tileSize * player.weapL.dims.w/2, -tileSize * player.weapL.dims.h/2, tileSize * player.weapL.dims.w, tileSize * player.weapL.dims.h);
        ctx.restore();
    }
}
var solidBricks = [];
function getHandPosL() {
    let ang = angle(mouseX,mouseY,player.pos.x-tileSize*0.3,player.pos.y-tileSize*0.3);
    return {
        x:player.pos.x - tileSize * 0.3 - Math.cos(ang ) * (tileSize * 0.5 - kickBackL * tileSize * 0.02),
        y:player.pos.y - tileSize * 0.3 - Math.sin(ang ) * (tileSize * 0.5 - kickBackL * tileSize * 0.02)
    }
    
}
function getHandPosR() {
    let ang = angle(mouseX,mouseY,player.pos.x+tileSize*0.3,player.pos.y-tileSize*0.3);
    return {
        x:player.pos.x + tileSize * 0.3 - Math.cos(ang ) * (tileSize * 0.5 - kickBackR * tileSize * 0.02),
        y:player.pos.y - tileSize * 0.3 - Math.sin(ang ) * (tileSize * 0.5 - kickBackR * tileSize * 0.02)
    }
    
}
function spawnBrick() {
    

    let rnd = Math.random();
    let tiles = [];
    /*for (let i = 0;i<gameW;i++) {
        tiles.push([i,0]);
    }
    rnd=2*/
    let dimX,dimY;
    if (rnd < 0.2) {
        tiles.push([0, 0]);
        tiles.push([0, 1]);
        tiles.push([1, 0]);
        tiles.push([1, 1]);
        dimX=2;
        dimY=2;

    } else if (rnd < 0.4) {
        tiles.push([0, 0]);
        tiles.push([0, 1]);
        tiles.push([0, 2]);
        tiles.push([0, 3]);
        dimX=1;
        dimY=4;

    } else if (rnd < 0.6) {
        tiles.push([0, 0]);
        tiles.push([1, 0]);
        tiles.push([1, 1]);
        tiles.push([1, 2]);
        dimX=2;
        dimY=3;

    } else if (rnd < 0.8) {
        tiles.push([0, 0]);
        tiles.push([1, 0]);
        tiles.push([2, 0]);
        tiles.push([1, 1]);
        dimX=3;
        dimY=2;

    } else if (rnd < 1) {
        tiles.push([0, 0]);
        tiles.push([1, 0]);
        tiles.push([1, 1]);
        dimX=2;
        dimY=2;

    }
    let rndCol = Math.floor(Math.random() * (gameW-dimX));
    let br = new brick(tiles, rndCol * tileSize, -dimY * tileSize, rndCol, 10+Math.pow(1.1,difficulty),dimX,dimY);
    bricks.push(br);
}
var difficulty=0;
function moveBricks() {
    let linesToCheck = [];
    let linesToDel = [];
    loop1:
        for (let br = bricks.length - 1; br >= 0; br--) {
            let newY = bricks[br].pos.y + 0.2 + 0.001*difficulty;
            loop2:
                for (let tile in bricks[br].tiles) {
                    let curRow = Math.floor(newY / tileSize) + 1 + bricks[br].tiles[tile][1];
                    let x = bricks[br].x + bricks[br].tiles[tile][0];
                    if (curRow >= 1 && x >= 0 && x <= gameW-1) {
                        if (curRow >= gameH - 1) {
                            curRow -= bricks[br].tiles[tile][1];
                            x = bricks[br].x;
                            for (let key in bricks[br].tiles) {
                                try {
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][0] = true;
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][1] = bricks[br].tiles[key][2]*5;
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][2] = bricks[br].tiles[key][3]*5;
                                    addUnique(linesToCheck, curRow + bricks[br].tiles[key][1]);
                                } catch (e) {
                                    /*console.log(curRow,x,bricks[br].tiles[key])*/
                                }
                            }
                            bricks.splice(br, 1)
                            continue loop1;
                        } else if (solidBricks[curRow+1][x][0] == true) {
                            if (curRow < 0) {
                                console.log("gameOver");
                            }
                            curRow = Math.floor(newY / tileSize);
                            x = bricks[br].x;
                            curRow+=1;
                            //get origin pos again

                            for (let key in bricks[br].tiles) {
                                try {
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][0] = true;
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][1] = bricks[br].tiles[key][2]*5;
                                    solidBricks[curRow + bricks[br].tiles[key][1]][x + bricks[br].tiles[key][0]][2] = bricks[br].tiles[key][3]*5;
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
                                
                                if (player.pos.y < curY+tileSize && curY < player.pos.y) {
                                    bricks[br].tiles.splice(tile)
                                    console.log("you  hit it!");
                                    continue loop2;

                                }    
                            }
                            if (player.pos.y - tileSize*1.5 < curY+tileSize && curY < player.pos.y - tileSize*1.5) {
                                bricks[br].tiles.splice(tile)
                                console.log("you got hit");
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
var bricks = [];
var brick = function(tiles, x, y, col, health,dimX,dimY) {
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
function spawnCoin(x,y,am) {
    let tX = width*3/4;
    let tY = height*1.5/5+Math.random()*tileSize*0.5-Math.random()*tileSize;
    let dis = Distance(tX,tY,x,y);
    let ang = angle(tX,tY,x,y);
    coins.push([x,y,dis,ang,am,100])
}
var coins=[];
var moneyGains=[];
var money = 0;
var score = 0;
var updateMoney=false;
function increaseMoney(am) {
    if (!isNaN(am)) {
        money+=am;
        updateMoney=true;

    }
}
function addMoneyGain(x,y,am) {
    moneyGains.push([x+(Math.random()-Math.random())*tileSize*0.3,y+(Math.random()-Math.random())*tileSize*0.3,am,50]);
}
function drawMoneyGains() {
    for (let key = moneyGains.length-1;key>=0;key--) {
        moneyGains[key][3]--;
        if (moneyGains[key][3]<=0) {
            moneyGains.splice(key,1);
        } else {
            let c = moneyGains[key];
            let rat = Math.min(1,c[3]/50);
            ctx.fillStyle="rgba(255,255,0,"+rat+")";
            ctx.font= tileSize/1.5+"px Arial yellow";
            ctx.fillText("$"+c[2],c[0],c[1]+rat*tileSize);
            
        }
    }
}
function drawCoins() {
    
    for (let key=coins.length-1;key>=0;key--) {
        coins[key][5]--;
        if (coins[key][5]<=0) {
            addMoneyGain(
                coins[key][0]-Math.cos(coins[key][3])*coins[key][2]-tileSize/2,
                coins[key][1]-Math.sin(coins[key][3])*coins[key][2],
                coins[key][4])
            increaseMoney(coins[key][4]);
            coins.splice(key,1);
        } else {
            let c = coins[key];
            /*ctx.fillRect(c[0]-5,c[1]-5,10,10);*/
            let rat = 1-Math.min(1,c[5]/100);
            let rat2 = Math.sin(c[5]/2);
            ctx.drawImage(images.coin,
                0,
                0,
                images.coin.width,
                images.coin.height,
                c[0]-Math.cos(c[3])*rat*c[2]*rat-c[3]*tileSize*0.2-c[3]*tileSize*0.4*rat*rat2/2,
                c[1]-Math.sin(c[3])*rat*c[2]*rat-c[3]*tileSize*0.2,
                c[3]*tileSize*0.4*rat*rat2,
                c[3]*tileSize*0.4*rat);
            
        }
    }
    if(updateMoney){
        document.getElementById("money").innerHTML ="Money</br>$"+money;
        updateMoney=false;
    }
}
function drawBricks() {
    for (let key in bricks) {
        drawOneBrick(bricks[key]);
    }
    for (let key in solidBricks) {
        for (let kai in solidBricks[key]) {
            if (solidBricks[key][kai][0] == true) {
                ctx.fillStyle = "rgba(150,0,0,"+Math.min(solidBricks[key][kai][1]/solidBricks[key][kai][2] * 0.3 +0.3,1)+")";
                ctx.drawImage(images.brick, kai * tileSize, (key - 1) * tileSize, tileSize, tileSize);
                ctx.fillRect(kai * tileSize, (key - 1) * tileSize, tileSize, tileSize);
            }
        }
    }
}

function drawOneBrick(br) {

    for (let i in br.tiles) {
        ctx.globalAlpha = Math.min(1,br.tiles[i][2] / br.maxHealth * 0.5+0.5);
        ctx.drawImage(images.brick, br.pos.x + br.tiles[i][0] * tileSize, br.pos.y + br.tiles[i][1] * tileSize, tileSize, tileSize);
        /*ctx.fillRect(br.pos.x+br.tiles[i][0]*tileSize,br.pos.y+br.tiles[i][1]*tileSize,tileSize,tileSize)*/
    }
    ctx.globalAlpha = 1;
}

function drawCrossHair() {
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(255,250,250,0.4)";
    ctx.beginPath();
    ctx.moveTo(mouseX - tileSize * 0.8, mouseY);
    ctx.lineTo(mouseX + tileSize * 0.8, mouseY);
    ctx.moveTo(mouseX, mouseY - tileSize * 0.8);
    ctx.lineTo(mouseX, mouseY + tileSize * 0.8);
    ctx.moveTo(mouseX, mouseY);
    ctx.arc(mouseX, mouseY, tileSize, 0, Math.PI * 2, 0);
    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255,0,0,0.9)";
    ctx.beginPath();
    ctx.moveTo(mouseX - tileSize * 0.8, mouseY);
    ctx.lineTo(mouseX + tileSize * 0.8, mouseY);
    ctx.moveTo(mouseX, mouseY - tileSize * 0.8);
    ctx.lineTo(mouseX, mouseY + tileSize * 0.8);
    ctx.moveTo(mouseX, mouseY);
    ctx.arc(mouseX, mouseY, tileSize*0.6, 0, Math.PI * 2, 0);
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
    drawPlayer();
    drawCrossHair();
    drawBullets();
    drawExplosions();
    drawBlood();
    drawParticles();
    drawCoins();
    drawMoneyGains();
    drawAmmo();


    /*let pos = getHandPosL();
    let pos2 = getHandPosR();
    ctx.fillRect(pos.x-2,pos.y-2,4,4);
    ctx.fillRect(pos2.x-2,pos2.y-2,4,4);*/

}
function drawAmmo() {
    if (player.weapR) {
        ctx.fillStyle = "white";
        ctx.fillRect(width*0.5*0.75,height*0.9,width*0.5*0.2,height*0.08);
        ctx.fillStyle = "black";
        let tx = player.weapR.ammo;
        if(player.weapR.img == "handGun") {
            tx = "∞";
        }
        let wd = ctx.measureText(tx).width;
        ctx.fillText(tx,width*0.5*0.85-wd/2,height*0.95);
    }
    if (player.weapL) {

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



function drawPlayerTrail() {
    if (player.path.length == 0) {
        return
    }
    ctxBG.strokeStyle = "rgba(255,255,255,0.2)";
    ctxBG.lineWidth = "17";
    ctxBG.fillStyle = "rgba(255,255,255,0.4)";
    let curX = player.x;
    let curY = player.y;

    if (player.path.length > 1) {


        ctxBG.beginPath();
        //ctxBG.shadowBlur=15;
        //ctxBG.shadowColor="rgba(0,0,250,1)";
        //ctxBG.shadowOffsetY=15;
        //ctxBG.shadowOffsetX=15;
        ctxBG.moveTo(curX, curY);
        ctxBG.lineTo(
            curX + Math.cos(player.dir) * 8,
            curY + Math.sin(player.dir) * 8);

        for (let key = player.path.length - 1; key > 1; key--) {
            player.path[key][4] += 0.05;
            ctxBG.strokeStyle = "rgba(255,255,255," + player.path[key][2] / 2500 + ")";
            let cx = (player.path[key][0] + Math.cos(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]) + player.path[key - 1][0] + Math.cos(player.path[key - 1][3] - Math.PI * 0.5) * 10 * (player.path[key][4])) / 2;

            let cy = (player.path[key][1] + Math.sin(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]) + player.path[key - 1][1] + Math.sin(player.path[key - 1][3] - Math.PI * 0.5) * 10 * (player.path[key][4])) / 2;

            ctxBG.quadraticCurveTo(
                player.path[key][0] + Math.cos(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]),
                player.path[key][1] + Math.sin(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]),
                cx, cy);
            ctxBG.stroke();
        }

        ctxBG.strokeStyle = "rgba(255,255,255," + player.path[0][2] / 2500 + ")";

        ctxBG.quadraticCurveTo(
            player.path[1][0] + Math.cos(player.path[1][3] - Math.PI * 0.5) * 10 * (player.path[1][4]),
            player.path[1][1] + Math.sin(player.path[1][3] - Math.PI * 0.5) * 10 * (player.path[1][4]),
            player.path[0][0] + Math.cos(player.path[0][3] - Math.PI * 0.5) * 10 * (player.path[0][4]),
            player.path[0][1] + Math.sin(player.path[0][3] - Math.PI * 0.5) * 10 * (player.path[0][4]));

        ctxBG.stroke();



        ctxBG.beginPath();
        //ctxBG.shadowBlur=15;
        //ctxBG.shadowColor="rgba(0,0,250,1)";
        //ctxBG.shadowOffsetY=15;
        //ctxBG.shadowOffsetX=15;
        ctxBG.moveTo(curX, curY);
        ctxBG.lineTo(
            curX + Math.cos(player.dir) * 8,
            curY + Math.sin(player.dir) * 8);

        for (let key = player.path.length - 1; key > 1; key--) {
            player.path[key][4] += 0.05;
            ctxBG.strokeStyle = "rgba(255,255,255," + player.path[key][2] / 2500 + ")";
            let cx = (player.path[key][0] + Math.cos(player.path[key][3] + Math.PI * 0.5) * 10 * (player.path[key][4]) + player.path[key - 1][0] + Math.cos(player.path[key - 1][3] + Math.PI * 0.5) * 10 * (player.path[key][4])) / 2;

            let cy = (player.path[key][1] + Math.sin(player.path[key][3] + Math.PI * 0.5) * 10 * (player.path[key][4]) + player.path[key - 1][1] + Math.sin(player.path[key - 1][3] + Math.PI * 0.5) * 10 * (player.path[key][4])) / 2;

            ctxBG.quadraticCurveTo(
                player.path[key][0] + Math.cos(player.path[key][3] + Math.PI * 0.5) * 10 * (player.path[key][4]),
                player.path[key][1] + Math.sin(player.path[key][3] + Math.PI * 0.5) * 10 * (player.path[key][4]),
                cx, cy);
            ctxBG.stroke();
        }

        ctxBG.strokeStyle = "rgba(255,255,255," + player.path[0][2] / 2500 + ")";

        ctxBG.quadraticCurveTo(
            player.path[1][0] + Math.cos(player.path[1][3] + Math.PI * 0.5) * 10 * (player.path[1][4]),
            player.path[1][1] + Math.sin(player.path[1][3] + Math.PI * 0.5) * 10 * (player.path[1][4]),
            player.path[0][0] + Math.cos(player.path[0][3] + Math.PI * 0.5) * 10 * (player.path[0][4]),
            player.path[0][1] + Math.sin(player.path[0][3] + Math.PI * 0.5) * 10 * (player.path[0][4]));

        ctxBG.stroke();


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
function spawn() {
    if (bricks.length<maxBricks) {
        spawnTicker+=1;//Math.pow(1.1,difficulty);
        if (spawnTicker>=spawnTick) {
            let am = Math.floor(spawnTicker/spawnTick)
            spawnTicker-=am*spawnTick;
            spawnBrick();
            difficulty++;
        }
    }
}
function step() {
    movePlayer();
    moveBricks();
    moveBullets();
    spawn();
    if (mousedown) {
        shootTicker++;
        if (shootTicker >= player.weapR.tick) {
            let am = Math.floor(shootTicker / player.weapR.tick);
            shootTicker -= am * player.weapR.tick;
            for (let i = 0; i < am; i++) {
                kickBackR = player.weapR.kickBack;
                if (player.weapR.bullet == "munition") {
                    spawnBullet("right", mouseX, mouseY, player.weapR.dmg);
                    if (player.weapR.img != "handGun") {
                        player.weapR.ammo-=1;
                    }
                } else if (player.weapR.bullet == "laser") {
                    if(!bulletsLaserR) {
                        spawnBulletLaser("right",mouseX,mouseY,player.weapR.dmg);

                    }
                }
            }
        }
        if (player.weapL) {
            shootTicker2++;
            if (shootTicker2 >= player.weapL.tick) {
                let am = Math.floor(shootTicker2 / player.weapL.tick);
                shootTicker2 -= am * player.weapL.tick;
                for (let i = 0; i < am; i++) {
                    kickBackL = player.weapL.kickBack;
                    if (player.weapL.bullet == "munition") {
                        spawnBullet("left", mouseX, mouseY, player.weapL.dmg);
                        player.weapL.ammo-=1;
                    } else if (player.weapL.bullet == "laser") {
                        if(!bulletsLaserL) {
                            spawnBulletLaser("left",mouseX,mouseY,player.weapL.dmg);
                         
                        }
                    }
                }
            }

        }

    } else {
        if (bulletsLaserL || bulletsLaserR) {
            bulletsLaserR=null;
            bulletsLaserL=null;
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
            /*}*/
            ctx.beginPath();
            ctx.arc(particleSplatters[key][0], particleSplatters[key][1], siz, 0, Math.PI * 2, 0);
            ctx.fill();



        }
    }
}
var explosions=[];
function addExplosion(x,y,size) {
    if (explosions.length>100) {
        explosions.splice(0,1);
    }
    explosions.push([x,y,size,15]);
}
function drawExplosions() {
    for (let key=explosions.length-1;key>=0;key--) {
        explosions[key][3]--;
        if (explosions[key][3]<=0) {
            explosions.splice(key,1);
        } else {
            let rat = 1.01-explosions[key][3]/15;
            let r1 = explosions[key][2]*(0.5 - ((explosions[key][3]%5)-5)/10);
            let r2 = explosions[key][2];

            ctx.fillStyle="rgba(255,255,255,0.4)";
            ctx.beginPath();
            
            ctx.ellipse(
                explosions[key][0],
                explosions[key][1],
                rat*r1*(1+Math.random()*0.4-Math.random()*0.4),
                rat*r2*(1+Math.random()*0.4-Math.random()*0.4),
                explosions[key][3]*Math.PI*0.1%Math.PI,
                0,Math.PI*2);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle="rgba(255,255,0,0.4)";
            ctx.beginPath();
            
            ctx.ellipse(
                explosions[key][0],
                explosions[key][1],
                rat*0.8*r1*(1+Math.random()*0.4-Math.random()*0.4),
                rat*0.8*r2*(1+Math.random()*0.4-Math.random()*0.4),
                Math.PI*0.2+explosions[key][3]*Math.PI*0.1%Math.PI,
                0,Math.PI*2);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle="rgba(255,0,0,0.4)";
            ctx.beginPath();
            
            ctx.ellipse(
                explosions[key][0],
                explosions[key][1],
                rat*0.6*r1*(1+Math.random()*0.4-Math.random()*0.4),
                rat*0.6*r2*(1+Math.random()*0.4-Math.random()*0.4),
               Math.PI*0.4+explosions[key][3]*Math.PI*0.1%Math.PI,
                0,Math.PI*2);
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
    $("#scoreFinal").html(Points);
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
var bulletsLaserL=null;
var bulletsLaserR=null;
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
        let ang = angle(mouseX, mouseY, pos.x,pos.y);
        xOff = player.weapR.offset.x/images[player.weapR.img].width * tileSize * player.weapR.dims.w;
        yOff = player.weapR.offset.y/images[player.weapR.img].height * tileSize * player.weapR.dims.h;
        x1 = pos.x - Math.cos(ang)*xOff - Math.cos(ang+Math.PI*0.5)*yOff;
        y1 = pos.y - Math.sin(ang)*xOff - Math.sin(ang+Math.PI*0.5)*yOff;
    } else if (side == "left") {
        let pos = getHandPosL();
        let ang = angle(mouseX, mouseY, pos.x , pos.y);
        xOff = (images[player.weapL.img].width-player.weapL.offset.x)/images[player.weapL.img].width * tileSize * player.weapR.dims.w;
        yOff = -(player.weapL.offset.y)/images[player.weapL.img].height * tileSize * player.weapR.dims.h;
        x1 = pos.x - Math.cos(ang)*xOff - Math.cos(ang+Math.PI*0.5)*yOff;
        y1 = pos.y - Math.sin(ang)*xOff - Math.sin(ang+Math.PI*0.5)*yOff;
        /*x1 = player.pos.x - tileSize * 0.25 - Math.cos(ang) * tileSize * 0.25;
        y1 = player.pos.y - tileSize * 0.3 - Math.sin(ang) * tileSize * 0.5;*/
    }
    ///function particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a) {
    
    particleSplatter(x1, y1, Math.random()*Math.PI*2, 15, 0.5, 5, 5, Math.random()*Math.PI*2, 250, 250, 250, 0.5)
    //now get ang between start and end pos of bullet
    let ang = angle(x1, y1, mouseX, mouseY);
    bullets.push([x1, y1, ang, dmg])
}
function spawnBulletLaser(side, x, y, dmg) {
    bulletTickR=0;
    bulletTickL=0;
    let x1, y1;
    //first get startPos of bullet
    if (side == "right") {
        
        let pos = getHandPosR();
        let ang = angle(mouseX, mouseY, pos.x,pos.y);
        xOff = player.weapR.offset.x/images[player.weapR.img].width * tileSize * player.weapR.dims.w;
        yOff = player.weapR.offset.y/images[player.weapR.img].height * tileSize * player.weapR.dims.h;
        x1 = pos.x - Math.cos(ang)*xOff - Math.cos(ang+Math.PI*0.5)*yOff;
        y1 = pos.y - Math.sin(ang)*xOff - Math.sin(ang+Math.PI*0.5)*yOff;

        ang = angle(x1, y1, mouseX, mouseY);
        let dis = 
        bulletsLaserR=[x1, y1, ang, dmg, x1+Math.cos(ang)*width*height, y1+Math.sin(ang)*width*height];
    } else if (side == "left") {
        let pos = getHandPosL();
        let ang = angle(mouseX, mouseY, pos.x , pos.y);
        xOff = (images[player.weapL.img].width-player.weapL.offset.x)/images[player.weapL.img].width * tileSize * player.weapL.dims.w;
        yOff = -(player.weapL.offset.y)/images[player.weapL.img].height * tileSize * player.weapL.dims.h;
        x1 = pos.x - Math.cos(ang)*xOff - Math.cos(ang+Math.PI*0.5)*yOff;
        y1 = pos.y - Math.sin(ang)*xOff - Math.sin(ang+Math.PI*0.5)*yOff;
        /*x1 = player.pos.x - tileSize * 0.25 - Math.cos(ang) * tileSize * 0.25;
        y1 = player.pos.y - tileSize * 0.3 - Math.sin(ang) * tileSize * 0.5;*/
        ang = angle(x1, y1, mouseX, mouseY);
        bulletsLaserL=[x1, y1, ang, dmg, x1+Math.cos(ang)*width*height, y1+Math.sin(ang)*width*height];
    }
    ///function particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a) {
    
    //particleSplatter(x1, y1, Math.random()*Math.PI*2, 15, 0.5, 5, 5, Math.random()*Math.PI*2, 250, 250, 250, 0.5)
    //now get ang between start and end pos of bullet
}
function getRectEdge(mouseX,mouseY,x2,y2,rx,ry,rw,rh) {
    var slope = (y2 - mouseY) / (x2 - mouseX);
    var hsw = slope * rw / 2;
    var hsh = ( rh / 2 ) / slope;
    var hh = rh / 2;
    var hw = rw / 2;
    var TOPLEFT = {x: rx - hw, y: ry + hh};
    var BOTTOMLEFT = {x: rx - hw, y: ry - hh};
    var BOTTOMRIGHT = {x: rx + hw, y: ry - hh};
    var TOPRIGHT = {x: rx + hw, y: ry + hh};
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
    if ( -hw <= hsh && hsh <= hw) {
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
function swap(arr,a,b) {
    let tmp = arr[a];
    arr[a] = arr[b];
    arr[b] = tmp;
}
function BresenhamLine(x0,y0,x1,y1) {
    
    let result = [];

    let steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    if (steep) {
        swap(result, x0,  y0);
        swap(result, x1,  y1);
    }
    if (x0 > x1) {
        swap(result,x0,x1);
        swap(result,y0,y1);
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

function damageTile(tile,dmg) {

}
function dropWeapon(side) {
    if (side == "left") {
        player.weapL=null;
    } else if (side == "right") {
        equipWeapon("right","handGun")
    }
}
function moveBullets() {
    loop1: 
    for (let key = bullets.length - 1; key >= 0; key--) {
        let b = bullets[key];
        b[0] += 8 * Math.cos(b[2]);
        b[1] += 8 * Math.sin(b[2]);

        if (b[0] < 0 || b[0]>gameW*tileSize) {
            bullets.splice(key,1);
            continue;
        }
        if (b[1] < 0 || b[1]>gameH*tileSize) {
            bullets.splice(key,1);
            continue;
        }

        for (let i = 0;i<solidBricks.length ; i++) {
                for (let j = 0;j<solidBricks[i].length;j++){
                    if (solidBricks[i][j][0]==true) {
                        let tx = j*tileSize;
                        let ty = i*tileSize-tileSize;

                        if (bullets[key][0] > tx && bullets[key][0] < tx + tileSize) {
                            if (bullets[key][1] > ty && bullets[key][1] < ty + tileSize) {
                                solidBricks[i][j][1] -= bullets[key][3];
                                addExplosion(bullets[key][0], bullets[key][1], tileSize*0.5);
                                
                                particleSplatter(bullets[key][0], bullets[key][1], Math.random()*Math.PI*2, 15, 0.5, 5, 5, Math.random()*Math.PI*2, 250, 250, 250, 0.5)
                                bullets.splice(key, 1);
                                console.log("coll");
                                if (solidBricks[i][j][1] <= 0) {
                                    console.log("killed");
                                    solidBricks[i][j][1]=0;
                                    solidBricks[i][j][0]=false;
                                }
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
                            bricks[i].tiles[j][2] -= bullets[key][3];
                            
                            particleSplatter(bullets[key][0], bullets[key][1], Math.random()*Math.PI*2, 15, 0.5, 5, 5, Math.random()*Math.PI*2, 250, 250, 250, 0.5)
                            addExplosion(bullets[key][0], bullets[key][1], 10);
                            

                            if (bricks[i].tiles[j][2] <= 0) {
                                console.log("killed");
                                if (Math.random()>0) {
                                    spawnCoin(
                                        bricks[i].pos.x+bricks[i].tiles[j][0]*tileSize+tileSize/2,
                                        bricks[i].pos.y+bricks[i].tiles[j][1]*tileSize+tileSize/2,100);
                                }
                                bricks[i].tiles.splice(j, 1);
                                /*addExplosion(tx, ty, 10);*/
                                //bloodSplatter(bricks[i].pos.x, bricks[i].pos.y, bullets[key][2], 50, 10, 50, 10, bullets[key][2]);

                                if (bricks[i].tiles.length <= 0) {
                                    bricks.splice(i, 1);

                                }

                            }
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
        let ang = angle(mouseX, mouseY, pos.x,pos.y);
        xOff = (images[player.weapR.img].width-player.weapR.offset.x)/images[player.weapR.img].width * tileSize * player.weapR.dims.w;
        yOff = player.weapR.offset.y/images[player.weapR.img].height * tileSize * player.weapR.dims.h;
        let x = pos.x - Math.cos(ang)*xOff - Math.cos(ang+Math.PI*0.5)*yOff;
        let y = pos.y - Math.sin(ang)*xOff - Math.sin(ang+Math.PI*0.5)*yOff;
        bulletsLaserR[0] = x;
        bulletsLaserR[1] = y;
        ang = angle(x,y,mouseX,mouseY);        
        bulletsLaserR[2] = ang;
        bulletsLaserR[4]=x1+Math.cos(ang)*width*height;
        bulletsLaserR[5]= y1+Math.sin(ang)*width*height;

        let lowDis = 99990;
        let hitX=bulletsLaserR[4];
        let hitY=bulletsLaserR[5];
        /*let line = BresenhamLine(x,y,bulletsLaserR[4],bulletsLaserR[5])*/
        /*console.log(line);*/
        for (let i = 0;i<width*height && x < gameW*tileSize && x > 0 && y>0 && y<gameH*tileSize;i+=Math.min(Math.max(tileSize*0.05,1),10)) {
            x+=Math.cos(bulletsLaserR[2])*i;
            y+=Math.sin(bulletsLaserR[2])*i;
            for (let key =bricks.length-1;key>=0;key--) {
                for(let j = bricks[key].tiles.length-1;j>=0;j--) {
                    let x2 = bricks[key].pos.x + bricks[key].tiles[j][0]*tileSize;
                    let y2 = bricks[key].pos.y + bricks[key].tiles[j][1]*tileSize;
                    if (x2 < x && x2+tileSize>x) {
                    
                        if (y2 < y && y2 +tileSize > y) {
                            
                            let dis = Distance(x,y,x2,y2);
                            if(dis<lowDis) {
                                bricks[key].tiles[j][2] -= bulletsLaserR[3];
                                bulletsLaserR[4] = x + Math.cos(ang)*(dis);
                                bulletsLaserR[5] = y+tileSize + Math.sin(ang)*(dis);
                                lowDis=dis;
                                particleSplatter(bulletsLaserR[4], bulletsLaserR[5], bulletsLaserR[2]-Math.PI*0.5, 8, 2+Math.random()*2, 15, 2, Math.random()*Math.PI*2, 250, 0, 0, 0.5)
                                if (bricks[key].tiles[j][2] <= 0) {
                                    console.log("killed");
                                    if (Math.random()>0) {
                                        spawnCoin(
                                            bricks[key].pos.x+bricks[key].tiles[j][0]*tileSize+tileSize/2,
                                            bricks[key].pos.y+bricks[key].tiles[j][1]*tileSize+tileSize/2,100);
                                    }
                                    bricks[key].tiles.splice(j, 1);
                                    /*addExplosion(tx, ty, 10);*/
                                    //bloodSplatter(bricks[i].pos.x, bricks[i].pos.y, bullets[key][2], 50, 10, 50, 10, bullets[key][2]);

                                    if (bricks[key].tiles.length <= 0) {
                                        bricks.splice(key, 1);

                                    }

                                }
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
            for (let key = 0;key<solidBricks.length ; key++) {
                for (let j = 0;j<solidBricks[key].length;j++){
                    if (solidBricks[key][j][0]==true) {
                        let x2 = j*tileSize;
                        let y2 = key*tileSize-tileSize;

                        if (x > x2 && x < x2 + tileSize) {
                            if (y > y2 && y < y2 + tileSize) {
                                 let dis = Distance(x,y,x2,y2);
                                if(dis<lowDis) {
                                    solidBricks[key][j][1] -= bulletsLaserR[3];
                                    bulletsLaserR[4] = x + Math.cos(ang)*(dis);
                                    bulletsLaserR[5] = y+tileSize + Math.sin(ang)*(dis);
                                    lowDis=dis;
                                    
                                    particleSplatter(bulletsLaserR[4], bulletsLaserR[5], bulletsLaserR[2]-Math.PI*0.5, 8, 2+Math.random()*2, 15, 2, Math.random()*Math.PI*2, 250, 0, 0, 0.5)
                                    
                                    console.log("coll");
                                    if (solidBricks[key][j][1] <= 0) {
                                        console.log("killed");
                                        solidBricks[key][j][1]=0;
                                        solidBricks[key][j][0]=false;
                                    }
                                }
                                
                                
                            }
                        }
                        
                    }
                } 

                    
            }

        };
    
        player.weapR.ammo-=1;
        if(player.weapR.ammo<=0) {
            dropWeapon("right");
            return;
        }
    }
    if (bulletsLaserL && player.weapL) {

        //getInterceptPoint()
        let pos = getHandPosL();
        let ang = angle(mouseX, mouseY, pos.x,pos.y);
        xOff = (images[player.weapL.img].width-player.weapL.offset.x)/images[player.weapL.img].width * tileSize * player.weapL.dims.w;
        yOff = -player.weapL.offset.y/images[player.weapL.img].height * tileSize * player.weapL.dims.h;
        let x = pos.x - Math.cos(ang)*xOff - Math.cos(ang+Math.PI*0.5)*yOff;
        let y = pos.y - Math.sin(ang)*xOff - Math.sin(ang+Math.PI*0.5)*yOff;
        bulletsLaserL[0] = x;
        bulletsLaserL[1] = y;
        ang = angle(x,y,mouseX,mouseY);        
        bulletsLaserL[2] = ang;
        bulletsLaserL[4]=x1+Math.cos(ang)*width*height;
        bulletsLaserL[5]= y1+Math.sin(ang)*width*height;

        let lowDis = 99990;
        let hitX=bulletsLaserL[4];
        let hitY=bulletsLaserL[5];
        /*let line = BresenhamLine(x,y,bulletsLaserR[4],bulletsLaserR[5])*/
        /*console.log(line);*/
        for (let i = 0;i<width*height && x < gameW*tileSize && x > 0 && y>0 && y<gameH*tileSize;i+=Math.min(Math.max(tileSize*0.05,1),10)) {
            x+=Math.cos(bulletsLaserL[2])*i;
            y+=Math.sin(bulletsLaserL[2])*i;
            for (let key =bricks.length-1;key>=0;key--) {
                for(let j = bricks[key].tiles.length-1;j>=0;j--) {
                    let x2 = bricks[key].pos.x + bricks[key].tiles[j][0]*tileSize;
                    let y2 = bricks[key].pos.y + bricks[key].tiles[j][1]*tileSize;
                    if (x2 < x && x2+tileSize>x) {
                    
                        if (y2 < y && y2 +tileSize > y) {
                            bricks[key].tiles[j][2] -= bulletsLaserL[3];
                            
                            let dis = Distance(x,y,x2,y2);
                            if(dis<lowDis) {
                                bulletsLaserL[4] = x + Math.cos(ang)*(dis);
                                bulletsLaserL[5] = y+tileSize + Math.sin(ang)*(dis);
                                lowDis=dis;
                                
                            }


                            //addExplosion(bulletsLaserL[4]+Math.random()*tileSize*0.2-Math.random()*tileSize*0.2, bulletsLaserL[5]+Math.random()*tileSize*0.2-Math.random()*tileSize*0.2, 3+Math.random()*10);
                            // particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a)
                             particleSplatter(bulletsLaserL[4], bulletsLaserL[5], bulletsLaserL[2]-Math.PI*0.5, 8, 2+Math.random()*2, 15, 2, Math.random()*Math.PI*2, 250, 0, 0, 0.5)

                            if (bricks[key].tiles[j][2] <= 0) {
                                console.log("killed");
                                if (Math.random()>0) {
                                    spawnCoin(
                                        bricks[key].pos.x+bricks[key].tiles[j][0]*tileSize+tileSize/2,
                                        bricks[key].pos.y+bricks[key].tiles[j][1]*tileSize+tileSize/2,100);
                                }
                                bricks[key].tiles.splice(j, 1);
                                /*addExplosion(tx, ty, 10);*/
                                //bloodSplatter(bricks[i].pos.x, bricks[i].pos.y, bullets[key][2], 50, 10, 50, 10, bullets[key][2]);

                                if (bricks[key].tiles.length <= 0) {
                                    bricks.splice(key, 1);

                                }

                            }

                        
                           
                        }
                    }
                    /*let intersect = getRectEdge(mouseX,mouseY,x,y,x2,y2,tileSize,tileSize);
                    if (intersect) {
                        console.log(intersect);    
                        
                    }*/
                }
                
            }
               for (let key = 0;key<solidBricks.length ; key++) {
                for (let j = 0;j<solidBricks[key].length;j++){
                    if (solidBricks[key][j][0]==true) {
                        let x2 = j*tileSize;
                        let y2 = key*tileSize-tileSize;

                        if (x > x2 && x < x2 + tileSize) {
                            if (y > y2 && y < y2 + tileSize) {
                                 let dis = Distance(x,y,x2,y2);
                                if(dis<lowDis) {
                                    solidBricks[key][j][1] -= bulletsLaserL[3];
                                    bulletsLaserL[4] = x + Math.cos(ang)*(dis);
                                    bulletsLaserL[5] = y+tileSize + Math.sin(ang)*(dis);
                                    lowDis=dis;
                                    
                                    particleSplatter(bulletsLaserL[4], bulletsLaserL[5], bulletsLaserL[2]-Math.PI*0.5, 8, 2+Math.random()*2, 15, 2, Math.random()*Math.PI*2, 250, 0, 0, 0.5)
                                    
                                    console.log("coll");
                                    if (solidBricks[key][j][1] <= 0) {
                                        console.log("killed");
                                        solidBricks[key][j][1]=0;
                                        solidBricks[key][j][0]=false;
                                    }
                                }
                                
                                
                            }
                        }
                        
                    }
                } 

                    
            }
        };
        player.weapL.ammo-=1;
        if(player.weapL.ammo<=0) {
            dropWeapon("left");
            return;
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
var bulletTickR=0;
var bulletTickRGB=false;
var bulletTickL=0;
var bulletTickLGB=false;
function drawBullets() {
    for (let key in bullets) {
        let b = bullets[key];
        ctx.beginPath();
        for (let i = 0;i<15;i++) {
            ctx.fillStyle="rgba(255,255,255,0.05)";
            ctx.arc(b[0]-Math.cos(b[2])*(2*i+1),b[1]-Math.sin(b[2])*(2*i+1),tileSize*0.05125,0,Math.PI+2,0);
            ctx.fill();
            
        }

        ctx.closePath();
        ctx.drawImage(images.bullet, b[0] - tileSize * 0.015, b[1] - tileSize * 0.015, tileSize * 0.125, tileSize * 0.125)
    }
    if (bulletsLaserL) {
        
        bulletTickL= ((bulletTickL+1) % 10);
        ctx.beginPath();
        for (let i = 0;i<5;i++) {
            ctx.strokeStyle="rgba(255,0,0,"+((1+i)/25)+")";
            ctx.lineWidth=Math.max(3,tileSize/100)+4*Math.sin(bulletTickL)+i;
            ctx.moveTo(bulletsLaserL[0],bulletsLaserL[1]);
            ctx.lineTo(bulletsLaserL[4],bulletsLaserL[5]);//tx.lineTo(bulletsLaserL[0]+Math.cos(bulletsLaserL[2])*width*height,bulletsLaserL[1]+Math.sin(bulletsLaserL[2])*width*height);
            ctx.stroke();
        }
        ctx.closePath();
    }
    if (bulletsLaserR) {
        bulletTickR= ((bulletTickR+1) % 10);
        ctx.beginPath();
        for (let i = 0;i<5;i++) {
            ctx.strokeStyle="rgba(255,0,0,"+((1+i)/25)+")";
            ctx.lineWidth=Math.max(3,tileSize/100)+4*Math.sin(bulletTickR)+i;
            ctx.moveTo(bulletsLaserR[0],bulletsLaserR[1]);
            ctx.lineTo(bulletsLaserR[4],bulletsLaserR[5]);//tx.lineTo(bulletsLaserL[0]+Math.cos(bulletsLaserL[2])*width*height,bulletsLaserL[1]+Math.sin(bulletsLaserL[2])*width*height);
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

function createDiv(id, className, w, h, t, l, mL, mT, abs) {
    let tmpDiv = document.createElement("div");
    tmpDiv.style.width = w;
    tmpDiv.style.height = h;
    tmpDiv.style.marginTop = mT;
    tmpDiv.style.marginLeft = mL;
    tmpDiv.id = id;
    tmpDiv.className = className;
    if (abs) {
        tmpDiv.style.position = "absolute";
    }
    return tmpDiv;
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

var upgrades =  {
    reset:function() {
        for (let key in this.list) {
            this.list[key].bought=0;
        }
    },
    list: {
        doubleJump: {
            key:"doubleJump",
            name:"Double Jump",
            price: function() {

            },
            bought:0,
            
        },
        damage: {
            key:"damage",
            name:"Increase Damage",
            price: function() {

            },
            bought:0,
            
        }
    }
}