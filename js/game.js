const canvas = document.querySelector('#game')
canvas.width = window.innerWidth * 0.3
canvas.height = window.innerHeight * 0.9
const ctx = canvas.getContext('2d')

var image = new Image();
image.src = 'fry_right.svg';

class Game {
    constructor(grawity)    {
        this.grawity = grawity
        this.moveBackground = 0
        this.defaultSpeedOfMoveBackground = 2
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
boxes.push(new Box(20, 200, 80, 15))
boxes.push(new Box(200, 400, 80, 15))


const player = {
    x: 200,
    y: canvas.height,
    width: 25,
    height: 158,
    speed: 10,
    jumping: false,
    jumpStrength: 25,
    jumpStrengthDefault: 25,
    lefting: false,
    leftStrength: 20,
    leftStrengthDefault: 20,
    righting: false,
    rightStrength: 20,
    rightStrengthDefault: 20,
    speedDropping: 4,
    started: false,
    limitOfJumps: 15,
    jumps: 15,
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

                tmp = stage.moveBackground
                stage.moveBackground = canvas.height
                stage.moveBackground -= element.y
                stage.moveBackground -= element.height
                stage.points += stage.moveBackground - tmp
                // stage.bottom = element.y + element.height
                used.push(element.id)
            }
            return true
        }
    }
    return false
}

function updatePlayer() {
    // console.log(grawity)
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
    }
}

function updateStage()  {
    if (stage.moveBackground > 0) {

        tmp = stage.defaultSpeedOfMoveBackground
        if (stage.moveBackground < stage.defaultSpeedOfMoveBackground)  {
            tmp = stage.moveBackground
        }

        console.log(tmp)

        player.y += tmp
        console.log(boxes)
        for(let i = 0; i < boxes.length; i++) {
            boxes[i].y += tmp
        }
        console.log(boxes)

        stage.moveBackground -= stage.defaultSpeedOfMoveBackground
    }
}

function handleKeyDown(event)    {
    if (event.code == 'Space' || event.code == 'ArrowUp')  {
        if (player.jumps > 0)   {
            player.jumping = true
            player.jumpStrength = player.jumpStrengthDefault
            player.started = true
            player.jumps -= 1
        }
    }

    if (event.code == 'ArrowLeft')  {
        player.lefting = true
        player.leftStrength = player.leftStrengthDefault
        image.src = 'fry_left.svg';
    }

    if (event.code == 'ArrowRight')  {
        player.righting = true
        player.rightStrength = player.rightStrengthDefault
        image.src = 'fry_right.svg';
    }
}

function checkGameStatus()  {
    if (player.y + player.height >= canvas.height && player.started)
    {
        stage.gameOver = true
        console.log("GAME OVER")
    }
    
    document.getElementById("points").innerHTML = stage.points
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    updateStage()
    updatePlayer()
    drawPlayer()
    drawBox()
    checkGameStatus()
    setTimeout(gameLoop, 1000 / 60)
}

document.addEventListener('keydown', handleKeyDown) 

gameLoop()