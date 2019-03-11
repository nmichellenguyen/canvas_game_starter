/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
// canvas.width = 512;
// canvas.height = 480;
let tx = window.innerWidth - 10;
let ty = window.innerHeight - 20;
canvas.width = tx;
canvas.height = ty;
document.body.appendChild(canvas);


/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = Math.round(Math.random() * 650);
let monsterY = Math.round(Math.random() * 500);

let monsterDirection = 1;
let monsterCaught = 0;
let gameOver = false;

let startTime = Date.now();
let SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
let restart;

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let images = ["images/hero1.png", "images/hero2.png", "images/hero3.png", "images/hero4.png", "images/hero5.png"];


function loadImages() {
    bgImage = new Image();
    bgImage.onload = function() {
        // show the background image
        bgReady = true;
    };
    bgImage.src = "images/background.png";

    heroImage = new Image();
    heroImage.onload = function() {
        // show the hero image
        heroReady = true;
    };
    heroImage.src = "images/hero.png";

    monsterImage = new Image();
    monsterImage.onload = function() {
        // show the monster image
        monsterReady = true;
    };
    monsterImage.src = "images/monster.png";

}

// function onclick() {
//     startTime = Date.now()
//     SECONDS_PER_ROUND = 30;
//     elapsedTime = 0;
//     
// }
/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};

function setupKeyboardListeners() {
    // Check for keys pressed where key represents the keycode captured
    // For now, do not worry too much about what's happening here. 
    addEventListener("keydown", function(key) {
        keysDown[key.keyCode] = true;
    }, false);

    addEventListener("keyup", function(key) {
        delete keysDown[key.keyCode];
    }, false);

    // addEventListener("click", function(onclick) {
    //     startTime = Date.now()
    //     SECONDS_PER_ROUND = 30;
    //     elapsedTime = 0;
    //     monsterX = Math.round(Math.random() * 650);
    //     monsterY = Math.round(Math.random() * 500);
    // })
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function() {
    if (gameOver) {
        return;
    }
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);

    if (38 in keysDown) { // Player is holding up key
        heroY -= 10;
    }
    if (40 in keysDown) { // Player is holding down key
        heroY += 10;
    }
    if (37 in keysDown) { // Player is holding left key
        heroX -= 10;
    }
    if (39 in keysDown) { // Player is holding right key
        heroX += 10;
    }

    if (heroX < 0) {
        heroX = canvas.width - 32;
    }

    if (heroY < 0) {
        heroY = canvas.height - 32;
    }

    monsterX += 10 * monsterDirection;
    if (monsterX > canvas.width - 32) {
        monsterDirection = -monsterDirection;
        monsterY = Math.floor(Math.random() * canvas.height)
    }
    if (monsterX < 0) {
        monsterDirection = -monsterDirection;
        monsterY = Math.floor(Math.random() * canvas.height)
    }



    // Check if player and monster collided. Our images
    // are about 32 pixels big.
    if (
        heroX <= (monsterX + 32) &&
        monsterX <= (heroX + 32) &&
        heroY <= (monsterY + 32) &&
        monsterY <= (heroY + 32)
    ) {
        // Pick a new location for the monster.
        // Note: Change this to place the monster at a new, random location.
        monsterX = Math.floor(Math.random() * canvas.width);
        monsterY = Math.floor(Math.random() * canvas.height);
        monsterCaught = monsterCaught + 1;
        heroImage.src = images[Math.floor(Math.random() * images.length)];
    }
    if (monsterCaught === 20 || (SECONDS_PER_ROUND - elapsedTime) < 0) {
        gameOver = true;
    }


};

/**
 * This function, render, runs as often as possible.
 */
let render = function() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, heroX, heroY);
    }
    if (monsterReady) {
        ctx.drawImage(monsterImage, monsterX, monsterY);
    }

    if (gameOver) {
        if (monsterCaught === 1) {
            ctx.font = "30px Arial";
            ctx.fillStyle = "red";
            ctx.fillText(`Monster(s) caught: ${monsterCaught}`, canvas.width * 0.05, canvas.height * 0.9 - 50);
            ctx.fillText(`Congrats! You've caught them all`, canvas.width * 0.05, canvas.height * 0.9);
        }
        if ((SECONDS_PER_ROUND - elapsedTime) < 0) {
            ctx.font = "30px Arial";
            ctx.fillStyle = "red";
            ctx.fillText(`Monster(s) caught: ${monsterCaught}`, canvas.width * 0.05, canvas.height * 0.9 - 50);
            ctx.fillText(`Oops! Time's up! :)`, canvas.width * 0.05, canvas.height * 0.9);
        }
    } else {
        ctx.font = "30px Arial";
        ctx.fillStyle = "green";
        ctx.fillText(`Monster(s) caught: ${monsterCaught}`, canvas.width * 0.05, canvas.height * 0.1);
        ctx.fillText(`Remaining: ${SECONDS_PER_ROUND - elapsedTime}s`, canvas.width * 0.05, canvas.height * 0.05)
    }


}


/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
let main = function() {
    update();
    render();
    // Request to do this again ASAP. This is a special method
    // for web browsers. 
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
let w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();