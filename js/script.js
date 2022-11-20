


// useful to have them as global variables
var canvas, ctx, w, h;
var mousePos;

// an empty array!
var balls = [];
var initialNumberOfBalls;
var globalSpeedMultiplier = 0.1;
var colorToEat = '#FFD700';
var wrongBallsEaten = goodBallsEaten = 0;
var numberOfGoodBalls;
let level = 1;
let nbVies = 3;
let score = 0;
let gameState = 'Starting';

var player = {
    x: 10,
    y: 10,
    width: 30,
    height: 30,
    color: 'yellow',
    radians: 0.75,
    openRate: 0.06,
    rotation: 0,
    temp_x: this.x,
    temp_y: this.y,
}

var obstacle1 = {
    x: 30,
    y: 50,
    width: 150,
    height: 500,
}

var obstacle2 = {
    x: 420,
    y: 50,
    width: 150,
    height: 200,
}

var obstacle3 = {
    x: 420,
    y: 350,
    width: 150,
    height: 200,
}

var theme = new Audio('../sfx/Theme.mp3')
var eat = new Audio('../sfx/eat.mp3')
var hit = new Audio('../sfx/hit.mp3')
var game_over  = new Audio('../sfx/gameover.mp3')

/*class Projectile{
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}*/

window.onload = function init() {
    // called AFTER the page has been loaded
    canvas = document.querySelector("#myCanvas");

    // often useful
    w = canvas.width;
    h = canvas.height;

    // important, we will draw with this object
    ctx = canvas.getContext('2d');

    // start game with 10 balls, balls to eat = red balls
   
    startGame(level);

    // add a mousemove event listener to the canvas
    canvas.addEventListener('mousemove', mouseMoved);
    window.addEventListener('keydown', traiteToucheEnfoncee);
   /* window.addEventListener('click', (event) => {
        const projectile = new Projectile(event.clientX,event.clientY,20,'red',null);
        projectile.draw();
        console.log(event.clientX)
    });*/
   

    // ready to go !
    
    mainLoop();
};


function traiteToucheEnfoncee(evt) {
    console.log(evt.key);
    if (evt.key === ' ') {
        if (gameState === 'Game Over' || gameState === 'Starting') {
            gameState = 'PLAYING';
            theme.currentTime = 0;
            level = 1;
            score = 0;
            nbVies = 3;
            globalSpeedMultiplier = 0.1;
            startGame(level);
        }
    }
}

function startGame(level) {
    let nb = level + 1;
    theme.play();
    do {
        balls = createBalls(nb);
        initialNumberOfBalls = nb;
        numberOfGoodBalls = countNumberOfGoodBalls(balls, colorToEat);
    } while (numberOfGoodBalls === 0);

    wrongBallsEaten = goodBallsEaten = 0;
}

function startGame_balls(num) {
    let nb = num;
    theme.play();
    do {
        balls = createBalls(nb);
        initialNumberOfBalls = nb;
        numberOfGoodBalls = countNumberOfGoodBalls(balls, colorToEat);
    } while (numberOfGoodBalls === 0);

    wrongBallsEaten = goodBallsEaten = 0;
}

function countNumberOfGoodBalls(balls, colorToEat) {
    var nb = 0;

    balls.forEach(function (b) {
        if (b.color === colorToEat)
            nb++;
    });

    return nb;
}

function changeNbBalls(nb) {
    startGame(nb);
}

function changeColorToEat(color) {
    colorToEat = color;
}

function changePlayerColor(color) {
    player.color = color;
}

function changeBallSpeed(coef) {
    globalSpeedMultiplier = coef;
}

function mouseMoved(evt) {
    mousePos = getMousePos(canvas, evt);
}

function getMousePos(canvas, evt) {
    // necessary work in the canvas coordinate system
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

 
function movePlayerWithMouse() {
    if (mousePos !== undefined && !circRectsOverlap(obstacle1.x+100,obstacle1.y+100,
        obstacle1.width, obstacle1.height,
        mousePos.x, mousePos.y, player.width)&&!circRectsOverlap(obstacle2.x+100,obstacle2.y+100,
            obstacle2.width, obstacle2.height,
            mousePos.x, mousePos.y, player.width)&&!circRectsOverlap(obstacle3.x+100,obstacle3.y+100,
                obstacle3.width, obstacle3.height,
                mousePos.x, mousePos.y, player.width)) {
        if (player.x < mousePos.x){
            player.rotation = 0;
            player.temp_x = 0;
            player.temp_y = 0;
            
        }else if (player.x > mousePos.x){
            player.rotation = Math.PI;
            player.temp_x = mousePos.x;
            player.temp_y = mousePos.y;
        }
         if (player.y < mousePos.y){
            player.rotation = Math.PI / 2;
            player.temp_x = mousePos.x;
            player.temp_y = mousePos.y;
        }else if (player.y > mousePos.y){
            player.rotation = Math.PI * 1.5  ;
            player.temp_x = mousePos.x;
            player.temp_y = mousePos.y;
        }

        if (player.x < mousePos.x && player.y < mousePos.y){
            player.rotation = Math.PI / 4;
            player.temp_x = mousePos.x;
            player.temp_y = mousePos.y;
        }
        if (player.x > mousePos.x && player.y < mousePos.y){
            player.rotation = Math.PI * 0.7;
            player.temp_x = mousePos.x;
            player.temp_y = mousePos.y;
        }
        if (player.x > mousePos.x && player.y > mousePos.y){
            player.rotation = Math.PI * -0.7;
            player.temp_x = mousePos.x;
            player.temp_y = mousePos.y;
        }
        if (player.x < mousePos.x && player.y > mousePos.y){
            player.rotation = Math.PI / -4;
            player.temp_x = mousePos.x;
            player.temp_y = mousePos.y;
        }
        player.x = mousePos.x;
        player.y = mousePos.y;
        

        }
}

function mainLoop() {
    // 1 - clear the canvas
    ctx.clearRect(0, 0, w, h);

    if (gameState === 'PLAYING') {
        // draw the ball and the player
        drawFilledRectangle(player);
        drawAllBalls(balls);
        drawInfosTextuelles(balls);
        drawFilledObstacle(obstacle1,obstacle2,obstacle3);

        // animate the ball that is bouncing all over the walls
        moveAllBalls(balls);

        movePlayerWithMouse();
        if (player.radians < 0 || player.radians > 0.75){
            player.openRate = -player.openRate;
        }
        player.radians += player.openRate;
    } else if(gameState === 'Game Over') {
        ctx.fillStyle = "#FFFFFF"; 
        ctx.font = "100px Arial";
        ctx.fillText("Game Over!" , 120, 350+Math.random()*30);
        ctx.font = "50px Arial";
        ctx.fillText("Your score was : "+score , 200, 430);
        ctx.font = "50px Arial";
        ctx.fillText("Press <SPACE> to start again" , 80, 500);

    }else {
        ctx.fillStyle = "#FFFFFF"; 
        ctx.font = "50px Arial";
        ctx.fillText("Press <SPACE> to start " , 120, 250);
    }
    // ask the browser to call mainloop in 1/60 of  for a new animation frame
    requestAnimationFrame(mainLoop);
} 

// Collisions between rectangle and circle
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
    var testX = cx;
    var testY = cy;
    if (testX < x0) testX = x0;
    if (testX > (x0 + w0)) testX = (x0 + w0);
    if (testY < y0) testY = y0;
    if (testY > (y0 + h0)) testY = (y0 + h0);
    return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
}

function createBalls(n) {
    // empty array
    var ballArray = [];

    // create n balls
    for (var i = 0; i < n; i++) {
        var b = {
            x: w / 2,
            y: h / 2,
            radius: 5 + 30 * Math.random(), // between 5 and 35
            speedX: -5 + 10 * Math.random(), // between -5 and + 5
            speedY: -5 + 10 * Math.random(), // between -5 and + 5
            color: getARandomColor(),
        }
        // add ball b to the array

        ballArray.push(b);
    }
    // returns the array full of randomly created balls
    return ballArray;
}

function getARandomColor() {
    var colors = ['red', 'blue', 'cyan', 'purple', 'pink', 'green', "#FFD700"];
    // a value between 0 and color.length-1
    // Math.round = rounded value
    // Math.random() a value between 0 and 1
    var colorIndex = Math.round((colors.length - 1) * Math.random());
    var c = colors[colorIndex];

    // return the random color
    return c;
}


function drawInfosTextuelles(balls) {
    ctx.save();
    ctx.font = "20px Arial";

    if (nbVies <= 0) {
        // on a perdu
        gameState = 'Game Over';
        theme.pause();
        game_over.play();
    } else if (goodBallsEaten === numberOfGoodBalls) {
        // On a gagné, on a mangé toutes les bonnes balles
        ctx.fillText("You Win! Final score : " + (initialNumberOfBalls - wrongBallsEaten),
            20, 30);
        // on change de niveau
        passerAuNiveauSuivant();
    } else {
        // On est en train de jouer....
        ctx.fillStyle = "#FFFFFF"; 
        ctx.fillText("Present elements: " + balls.length, 10, 30);
        ctx.fillText("Pellets eaten: " + goodBallsEaten, 10, 50);
        ctx.fillText("Ghosts touched: " + wrongBallsEaten, 10, 70);
        ctx.fillText("Level: " + level, 700, 30);
        ctx.fillText("Lives: " + nbVies, 700, 50);
        ctx.fillText("Score: " + score, 700, 70);
    }
    ctx.restore();
}

function passerAuNiveauSuivant() {
    level++;
    globalSpeedMultiplier += 0.2;
    startGame(level);
}

function drawAllBalls(ballArray) {
    ballArray.forEach(function (b) {
        drawFilledCircle(b);
    });
}

function moveAllBalls(ballArray) {
    // iterate on all balls in array
    balls.forEach(function (b, index) {
        // b is the current ball in the array
        if (index === 0) {
            b.radius += 0.1;
            if (b.radius > 40) {
                b.radius = 5;
            }
            b.x += (b.speedX * globalSpeedMultiplier);
            b.y += (b.speedY * globalSpeedMultiplier);
        } else {
            b.x += (b.speedX * globalSpeedMultiplier);
            b.y += (b.speedY * globalSpeedMultiplier);
        }

        testCollisionBallWithWalls(b);

        testCollisionWithPlayer(b, index);
    });
}

function testCollisionWithPlayer(b, index) {
    if (circRectsOverlap(player.x, player.y,
        player.width, player.height,
        b.x, b.y, b.radius)) {
        // we remove the element located at index
        // from the balls array
        // splice: first parameter = starting index
        //         second parameter = number of elements to remove
        if (b.color === colorToEat) {
            // Yes, we remove it and increment the score
            goodBallsEaten += 1;
            score += 10;
            eat.play();
        } else {
            wrongBallsEaten += 1;
            nbVies = nbVies - 1;
            //bad sound effect
            hit.volume = 0.9
            hit.play();
        }

        balls.splice(index, 1);

    }
}

function testCollisionBallWithWalls(b) {
    // COLLISION WITH VERTICAL WALLS ?
    if ((b.x + b.radius) > w) {
        // the ball hit the right wall
        // change horizontal direction
        b.speedX = -b.speedX;

        // put the ball at the collision point
        b.x = w - b.radius;
    } else if ((b.x - b.radius) < 0) {
        // the ball hit the left wall
        // change horizontal direction
        b.speedX = -b.speedX;

        // put the ball at the collision point
        b.x = b.radius;
    }

    // COLLISIONS WTH HORIZONTAL WALLS ?
    // Not in the else as the ball can touch both
    // vertical and horizontal walls in corners
    if ((b.y + b.radius) > h) {
        // the ball hit the right wall
        // change horizontal direction
        b.speedY = -b.speedY;

        // put the ball at the collision point
        b.y = h - b.radius;
    } else if ((b.y - b.radius) < 0) {
        // the ball hit the left wall
        // change horizontal direction
        b.speedY = -b.speedY;

        // put the ball at the collision point
        b.Y = b.radius;
    }
}

function drawFilledRectangle(r) {
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();

    // translate the coordinate system, draw relative to it
    ctx.translate(r.x, r.y);
    ctx.rotate(r.rotation);
    if (r.rotation !== 0)
    ctx.translate(-r.x, -r.y);


    ctx.fillStyle = r.color;
    // (0, 0) is the top left corner of the monster.
    ctx.beginPath();
    ctx.arc(r.temp_x, r.temp_y, r.width, r.radians , Math.PI* 2 - r.radians );
    ctx.lineTo(r.temp_x, r.temp_y);
    ctx.fill(); 
    ctx.closePath();

  
        

    // GOOD practice: restore the context
    ctx.restore();
}

function drawFilledObstacle(ob1,ob2,ob3) {
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();
    
    ctx.translate(100, 100);

    ctx.beginPath();
    ctx.fillStyle = 'rgba(15,10,222,0.5)';
    ctx.rect(ob1.x, ob1.y, ob1.width, ob1.height);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(15,10,222,0.5)';
    ctx.rect(ob2.x, ob2.y, ob2.width, ob2.height);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(15,10,222,0.5)';
    ctx.rect(ob3.x, ob3.y, ob3.width, ob3.height);
    ctx.stroke();
    ctx.fill();


    ctx.restore();
}

function drawFilledCircle(c) {
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();

    // translate the coordinate system, draw relative to it
    ctx.translate(c.x, c.y);
    if(c.color == colorToEat){
        ctx.fillStyle = c.color;
        // (0, 0) is the top left corner of the monster.
        ctx.beginPath();
        ctx.arc(0, 0, c.radius, 0, 2 * Math.PI);
        ctx.fill();
    
    }else {
        drawEnemies(c.radius, c.color)
    }

    // GOOD practice: restore the context
    ctx.restore();
}

function drawEnemies(radius, color) {
    //used guidance from a talented github individual to make the ghosts look nice :)
    let bottom_fold = 4;
    let top_radius = radius * 0.8;
    let fold_radius = top_radius / bottom_fold;
    ctx.save();
    ctx.strokeStyle = "white";
    ctx.fillStyle = color;
    ctx.lineWidth = radius * 0.05;


    ctx.beginPath();
    for (i = 0; i < bottom_fold; i++) {
        ctx.arc(
            (2 * fold_radius * (bottom_fold - i)) - top_radius - fold_radius,
            radius - fold_radius,
            fold_radius, 0, Math.PI
        );
    }
    ctx.lineTo(-top_radius, radius - fold_radius);
    ctx.arc(0, top_radius - radius, top_radius, Math.PI, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(-top_radius / 2.5, -top_radius / 2, top_radius / 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(top_radius / 3.5, -top_radius / 2, top_radius / 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(-top_radius / 2, -top_radius / 2.2, top_radius / 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(top_radius / 4, -top_radius / 2.2, top_radius / 8, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
}

/*function drawProjectile(p){
    ctx.save();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI * 2, false);
    ctx.fillStyle = p.color;
    ctx.fill();
}*/