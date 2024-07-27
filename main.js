import './style.css'
import Phaser, { Physics } from 'phaser'

const gameStartDiv = document.querySelector("#gameStartDiv")
const gameStartBtn = document.querySelector("#gameStartBtn")
const gameEndDiv = document.querySelector("#gameEndDiv")
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan")
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan")



const sizes = {
  width: 500,
  height: 500,
}
const speedDown = 300
// Set the config file of the game

//Main stage of the game 
class GameScene extends Phaser.Scene {
  constructor() {
    // Inicia la escena del juego
    super('scene-game')
    //Variable para el jugador principal
    this.player
    //Añade controles para el jugador
    this.cursor
    //Velocidad del jugador
    this.playerSpeed = speedDown + 50
    this.target
    this.point = 0
    this.textScore
    this.textTime
    this.timeEvent
    this.remainTime
    this.coinMusic
    this.bgMusic
    this.emmitter
  }
  preload() {
    this.load.image("bg", "/assets/bg.png")
    this.load.image("basket", "/assets/basket.png")
    this.load.image("apple", "/assets/apple.png")
    this.load.image("money","/assets/money.png")
    this.load.audio("coin","/assets/coin.mp3")
    this.load.audio("bgMusic","/assets/bgMusic.mp3")
  

  }
  create() {
    this.scene.pause("scene-game")
    this.coinMusic = this.sound.add("coin")
    this.bgMusic = this.sound.add("bgMusic")
    this.bgMusic.play()

    this.add.image(0, 0, "bg").setOrigin(0, 0)
    this.player = this.physics.add.image(0, sizes.width - 100, "basket").setOrigin(0, 0)
    // Evita que el jugador caiga
    this.player.setImmovable(true)
    this.player.body.allowGravity = false
    this.player.setCollideWorldBounds(true)
    // this.player.setSize(80,15).setOffset(10,70)
    //Make use of the hitbox
    this.player.setSize(this.player.width - this.player.width / 4, this.player.height / 6).setOffset(this.player.width / 10, this.player.height - this.player.height / 10)

    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0)
    this.target.setMaxVelocity(0, speedDown)

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)
    this.cursor = this.input.keyboard.createCursorKeys()

    this.textScore = this.add.text(sizes.width - 120, 10, "Score:0", {
      font: "25px Arial",
      fill: "#000000"
    })
    this.textTime = this.add.text(10, 10, "Remaining Time:0", {
      font: "25px Arial",
      fill: "#000000"
    })

    this.timeEvent = this.time.delayedCall(3000, this.gameOver, [], this)
    this.emmitter = this.add.particles(0,0, "money",{
      speed:100,
      gravityY:speedDown - 200,
      scale:0.04,
      duration:100,
      emitting:false

    })
    this.emmitter.startFollow(this.player,this.player.width / 2, this.player.height / 2,true)
  }
  update() {

    this.remainTime = this.timeEvent.getRemainingSeconds()
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainTime).toString()}`)

    if (this.target.y >= sizes.height) {
      this.target.setY(0)
      this.target.setX(this.getRandomX())

    }
    const { left, right } = this.cursor

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setAccelerationX(0)
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 480);
  }
  targetHit() {
    this.emmitter.start()
    this.coinMusic.play()
    this.target.setY(0)
    this.target.setX(this.getRandomX())
    this.point++
    this.textScore.setText(`Score: ${this.point}`)
  }

  gameOver() {
    // console.log("GAME OVER");
    this.sys.game.destroy(true)
    if(this.point >= 10){
      gameEndScoreSpan.textContent = this.point
      gameWinLoseSpan.textContent = " WIN"
    }else{
      gameEndScoreSpan.textContent = this.point
      gameWinLoseSpan.textContent = " LOSE"
    }
    gameEndDiv.style.display ="flex"
  }
}
const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true
    }
  },
  scene: [GameScene]
}

const game = new Phaser.Game(config)

gameStartBtn.addEventListener("click",()=>{
  gameStartDiv.style.display = "none"
  game.scene.resume("scene-game")
})