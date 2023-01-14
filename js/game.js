const canvas = document.querySelector('#game')
canvas.width = 1680 * 0.3
canvas.height = 914 * 0.9
const ctx = canvas.getContext('2d')

var image = new Image();
image.src = 'images/fry_right.svg';

class Game {
    constructor(grawity)    {
        this.grawity = grawity
        this.moveBackground = 0
        this.defaultSpeedOfMoveBackground = 1
        this.bottom = 0
        this.points = 0
        this.gameOver = false
    }
}

stage = new Game(2)

stage.bottom = canvas.height
cnt = 0

class Box {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.id = cnt
        cnt += 1
    }
}

var boxes = []
var used = []
cnt = 0
boxes.push(new Box(120, 600, 80, 8))
generateBox()

const player = {
    x: 200,
    y: canvas.height,
    width: 25,
    height: 158,
    speed: 10,
    jumping: false,
    jumpStrength: 30,
    jumpStrengthDefault: 30,
    lefting: false,
    leftStrength: 17,
    leftStrengthDefault: 17,
    righting: false,
    rightStrength: 17,
    rightStrengthDefault: 17,
    speedDropping: 4,
    started: false,
    limitOfJumps: 3,
    jumps: 3,
    floor: 0,
}

player.y -= player.height
player.x = canvas.width / 2 - player.width / 2

function drawPlayer() {
    ctx.drawImage(image, player.x, player.y);
}

function drawBox()  {
    ctx.fillStyle = "black"
    for (const element of boxes)    {
        ctx.fillRect(element.x, element.y, element.width, element.height)
    }
}

function checkBottomColidateWithBox() {
    for(const element of boxes) {
        var y_error = false
        var x_error = false
        y_bottom = element.y + element.height
        if (player.y < y_bottom && player.y + player.height > y_bottom)   {
            y_error = true
        }
        x_right = element.x + element.width
        if (player.x < x_right && player.x + player.width > element.x)  {
            x_error = true
        }
        if (x_error && y_error) {
            return true
        }
    }
    return false
}

function checkTopColidateWithBox()  {
    for(const element of boxes) {
        var y_error = false
        var x_error = false
        if (player.y < element.y && player.y + player.height > element.y) {
            y_error = true
        }
        x_right = element.x + element.width
        if (player.x < x_right && player.x + player.width > element.x)  {
            x_error = true
        }
        if (x_error && y_error) {
            player.y = element.y - player.height

            player.jumps = player.limitOfJumps

            if (!used.includes(element.id)) {
                generateBox()
                player.floor += 1
                tmp = stage.moveBackground
                stage.moveBackground = canvas.height
                stage.moveBackground -= element.y
                stage.moveBackground -= element.height
                stage.points += stage.moveBackground - tmp
                used.push(element.id)
            }
            return true
        }
    }
    return false
}

function updatePlayer() {
    if (player.y + player.height < canvas.height && !player.jumping && !checkTopColidateWithBox())   {

        player.y = Math.min(player.y += 1.2 * stage.grawity, canvas.height - player.height)
        stage.grawity += 0.2
    } else {
        stage.grawity = 1
    }

    if (player.jumping) {
        player.jumpStrength -= 3

        player.y -= player.jumpStrength
        if (checkBottomColidateWithBox())   {
            player.y += player.jumpStrength
        }

        if (player.jumpStrength <= 0)   {
            player.jumping = false
        }
    }

    if (player.lefting)
    {
        player.leftStrength -= 3

        if (player.x - player.leftStrength >= 0)    {
            player.x -= player.leftStrength
            if (checkBottomColidateWithBox(player.x, player.y))   {
                player.x += player.leftStrength
            }
        }

        if (player.leftStrength <= 0)   {
            player.lefting = false
        }

        image.src = 'images/fry_left.svg';
    }

    if (player.righting)
    {
        player.rightStrength -= 3

        if ((player.x + player.width) + player.rightStrength <= canvas.width)    {
            player.x += player.rightStrength
            if (checkBottomColidateWithBox(player.x, player.y))   {
                player.x -= player.rightStrength
            }
        }
        if (player.rightStrength <= 0)   {
            player.righting = false
        }

        image.src = 'images/fry_right.svg';
    }
}

function updateStage()  {
    if (stage.moveBackground > 0) {

        tmp = stage.defaultSpeedOfMoveBackground
        if (stage.moveBackground < stage.defaultSpeedOfMoveBackground)  {
            tmp = stage.moveBackground
        }

        player.y += tmp
        for(let i = 0; i < boxes.length; i++) {
            boxes[i].y += tmp
        }

        stage.moveBackground -= stage.defaultSpeedOfMoveBackground
    }
}

function moveUp()   {
    if (player.jumps > 0)   {
        player.jumping = true
        player.jumpStrength = player.jumpStrengthDefault
        player.started = true
        player.jumps -= 1
    }
}

function moveLeft() {
    player.lefting = true
    player.leftStrength = player.leftStrengthDefault
}

function moveRight()    {
    player.righting = true
    player.rightStrength = player.rightStrengthDefault
}

function handleKeyDown(event)    {
    if (event.code == 'Space' || event.code == 'ArrowUp')  moveUp()
    if (event.code == 'ArrowLeft')  moveLeft()
    if (event.code == 'ArrowRight')  moveRight()
}

function generateBox()  {
    last = boxes[boxes.length - 1]
    lastX = last.x + last.height / 2
    tmp = Math.floor(Math.random() * 10)

    if (tmp % 2 == 0)   {
        newX = lastX + (Math.floor(Math.random() * 100) + 50)
    } else  {
        newX = lastX - (Math.floor(Math.random() * 100) + 50)
    }

    while (newX < 0)   {
        tmp = Math.floor(Math.random() * 10)

        if (tmp % 2 == 0)   {
            newX = lastX + (Math.floor(Math.random() * 100) + 50)
        } else  {
            newX = lastX - (Math.floor(Math.random() * 100) + 50)
        }
    }

    tmpWidth = 80 * (Math.random() * (1.2 - 0.9) + 0.9)
    while (newX + tmpWidth > canvas.width)   {
        tmp = Math.floor(Math.random() * 10)

        if (tmp % 2 == 0)   {
            newX = lastX + (Math.floor(Math.random() * 100) + 50)
        } else  {
            newX = lastX - (Math.floor(Math.random() * 100) + 50)
        }
    }

    boxes.push(new Box(newX, last.y - 210 * (Math.random() * (1.2 - 0.9) + 0.9), tmpWidth, 8))
}

function checkGameStatus()  {

    if (stage.points > 1000)    {
        stage.defaultSpeedOfMoveBackground = 2
    }
    if (stage.points > 6000)    {
        stage.defaultSpeedOfMoveBackground = 3
    }
    if (stage.points > 11000)   {
        stage.defaultSpeedOfMoveBackground = 4
    }

    if (player.y + player.height >= canvas.height && player.started)
    {
        stage.gameOver = true
        document.getElementById("status").innerHTML = "GAME OVER"
        document.getElementById("goScore").innerHTML = parseInt(stage.points)
        document.getElementById("goFloor").innerHTML = player.floor
        document.getElementById("gameOver").style.display = "block"
        document.getElementById("box").style.filter = "blur(6px)"
        document.getElementById("pad").style.filter = "blur(6px)"
    }

    if (!stage.gameOver)    {
        document.getElementById("points").innerHTML = parseInt(stage.points)
        document.getElementById("jumps").innerHTML = parseInt(player.jumps)
        document.getElementById("speed").innerHTML = parseInt(stage.defaultSpeedOfMoveBackground)
    }
}

generateBox()

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    updateStage()
    updatePlayer()
    drawPlayer()
    drawBox()
    checkGameStatus()
    if (!stage.gameOver)    {
        setTimeout(gameLoop, 1000 / 60)
    }
    if (stage.gameOver) {
        document.addEventListener('keydown', function(event) {
            if (event.code == 'Space' || event.code == 'Enter') {
                window.location.reload();
            }
        });  
    }
}

document.addEventListener('keydown', handleKeyDown) 
document.getElementById("topButton").addEventListener("click", moveUp)
document.getElementById("leftButton").addEventListener("click", moveLeft)
document.getElementById("rightButton").addEventListener("click", moveRight)

gameLoop()