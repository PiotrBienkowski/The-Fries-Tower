const canvas = document.querySelector('#game')
canvas.width = window.innerWidth * 0.8
canvas.height = window.innerHeight * 0.8
const ctx = canvas.getContext('2d')

class Box {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}

var boxes = []

boxes.push(new Box(20, 200, 60, 20))
boxes.push(new Box(200, 400, 60, 20))

const player = {
    x: 200,
    y: canvas.height,
    width: 20,
    height: 50,
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
}

player.y -= player.height
player.x = canvas.width / 2 - player.width / 2

grawity = 2

function drawPlayer() {
    ctx.fillStyle = "blue"
    ctx.fillRect(player.x, player.y, player.width, player.height)
}

function drawBox()  {
    ctx.fillStyle = "red"
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
            return true
        }
    }
    return false
}

function updatePlayer() {
    // console.log(grawity)
    if (player.y + player.height < canvas.height && !player.jumping && !checkTopColidateWithBox())   {

        player.y = Math.min(player.y += 1.2 * grawity, canvas.height - player.height)
        grawity += 0.2
    } else {
        grawity = 1
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

function handleKeyDown(event)    {
    if (event.code == 'Space' || event.code == 'ArrowUp')  {
        player.jumping = true
        player.jumpStrength = player.jumpStrengthDefault
    }

    if (event.code == 'ArrowLeft')  {
        player.lefting = true
        player.leftStrength = player.leftStrengthDefault
    }

    if (event.code == 'ArrowRight')  {
        player.righting = true
        player.rightStrength = player.rightStrengthDefault
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    updatePlayer()
    drawPlayer()
    drawBox()
    setTimeout(gameLoop, 1000 / 60)
}

document.addEventListener('keydown', handleKeyDown) 

gameLoop()