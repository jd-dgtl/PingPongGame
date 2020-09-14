const canvas = document.getElementById("pong");

const ctx = canvas.getContext('2d');

//sounds


// Ball

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 5, 
    color: "white"
}

//User and computer paddles
const user = {
    x: 0,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "white",
    score: 0
}

const com = {
    x: canvas.width - 10,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: 'white',
    score: 0
}

//net
const net = {
    x: canvas.width/2 - 2/2,
    y: 0,
    width: 2,
    height: 10,
    color: 'white'
}

//draw rect will draw the paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

//draw arc will draw the ball
function drawArc(x, y, r,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}

//user's mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;

}

 // reset ball when user or com scores
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 5;
} 

// draw net
function drawNet(){
    for(let i =0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text,x,y){
    ctx.fillStyle = "#fff";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

//collision detection
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}
//update position, move, score

function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    let computerLevel = 0.1;
    //AI for computer player
    com.y += (ball.y - (com.y + com.height/2))*computerLevel;

    //when ball hits the top or bottom walls
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }

    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    if(collision(ball,player)){
        let collidePoint = ball.y - (player.y + player.height/2);
        collidePoint = collidePoint/(player.height/2);

        let angleRad = collidePoint * Math.PI/4;

        //direction of the ball when it's hit
        let direction = (ball.x < canvas.width/2) ? 1 : -1;

        //change velocity X and Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.cos(angleRad);

        //increase speed everytime ball is hit
        ball.speed += 0.3;
    }

    //update score
    if(ball.x - ball.radius < 0){
        //com scores
        com.score++;
        resetBall();
    } else if(ball.x + ball.radius > canvas.width){
        //user scores
        user.score++;
        resetBall();
    }
    }

//render does the drawing
function render (){
    //clear canvas
    drawRect(0,0, canvas.width, canvas.height, "#000");

    //draw net
    drawNet();

    //user score
    drawText(user.score, canvas.width/4, canvas.height/5, "black");
  
    //COM score
    drawText(com.score, 3*canvas.width/4, canvas.height/5, "black");
  
    // draw user and com paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //draw ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game(){
    update();
    render();
}

let framePerSecond = 50;

let loop = setInterval
    (game, 1000/framePerSecond);
