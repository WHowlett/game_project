let scene1 = { // A scene showing the begining of the game, require to hit space bar to start
  key: 'scene1',
  active: true,
  preload: preintro,
  create: createintro,
  update: updateintro
}

let scene2 = {
  //Level 1 of 5 - other leverls will be added later
  key: 'scene2',
  active: false,
  preload: mypreload1,
  create: mycreate1,
  update: myupdate1,
}

let scene3 = { //Completed game --Gameover will be design at later time//
  key: 'scene3',
  active: false,
  preload: preend,
  create: createend,
  update: updateend
}

let scene4 = {
  key: 'scene4',
  active: false,
  preload: preover,
  create: createover,
  update: updateover
}

let config = {
  width: 1000,
  height: 800,
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 250 },
      debug: false
    }
  },
  scene: [scene1, scene2, scene3, scene4],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

let mygame = new Phaser.Game( config );

let spacebar;
var bunny;
var bird;
var platform;
var banana;
var score = 0;
var scoreText;
var death;




//Begining Scene
function preintro() {
  this.load.image('intro', 'asset/intobackground.jpg');
};
function createintro() {
  this.add.image(500, 400, "intro");

  let titletext = this.add.text( 275, 275, ['Bunny Survival Game'], 
    { 
      fontFamily: '"Press Start 2P",cursive', 
      fontSize: '55px',
      color: '#fff',
      align: 'center',
      strokeThickness: 2
    } 
  ); 
  titletext.setOrigin(0.5,0.5);
  // set up title screen
  let helptext = this.add.text( 500, 550, ['Press spacebar to start.', ''], 
    { 
      fontFamily: '"Press Start 2P",cursive', 
      fontSize: '24px',
      color: '#f00',
      align: 'center',
      strokeThickness: 5
    } 
  ); 
  helptext.setOrigin(0.5,0.5);
 
  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
};
function scene1Transition(that) {
  that.scene.start('scene2');
};
function updateintro () {
   if (spacebar.isDown) {
    scene1Transition(this);
  }
};


//Level 1
function mypreload1 () {
  this.load.image('grassland', 'asset/grassland.jpg');
  this.load.image('ground', 'asset/ground.png');
  this.load.image('fruit', 'asset/logo1.png');
  this.load.image('hunter', 'asset/bird.png');
  this.load.spritesheet('brownbunny', 
        'asset/bunny-hop-spritesheet.png',
        { frameWidth: 48, frameHeight: 32 }
    );
};
function mycreate1() {
  this.add.image(500, 400, 'grassland');

  platforms = this.physics.add.staticGroup();

  platforms.create(490, 825, 'ground').setScale(4).refreshBody();
  platforms.create(500, 400, 'ground');
  platforms.create(750, 600, 'ground');
  platforms.create(750, 200, 'ground');
  platforms.create(250, 250, 'ground');
  platforms.create(100, 550, 'ground');

  bunny = this.physics.add.sprite(250, 600, 'brownbunny');

  bunny.setBounce(0.2);
  bunny.setCollideWorldBounds(true);
  //Bunny movement
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('brownbunny', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'turn',
    frames: [ { key: 'brownbunny', frame: 4 } ],
    frameRate: 20
});

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('brownbunny', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
});

  this.physics.add.collider(bunny, platforms);

  cursors = this.input.keyboard.createCursorKeys();

banana = this.physics.add.group({
    key: 'fruit',
    repeat: 13,
    setXY: { x: 17, y: 0, stepX: 70 }
});

banana.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});
this.physics.add.collider(banana, platforms);

this.physics.add.overlap(bunny, banana, collectFruit, null, this);

scoreText = this.add.text(750, 16, 'score: 0', { fontSize: '38px', fill: '#000', strokeThickness: 5 });

bird = this.physics.add.group();

this.physics.add.collider(bird, platforms);

this.physics.add.collider(bunny, bird, hitBunny, null, this);

  function hitBunny (bunny, bird)
{
  this.physics.pause();
  //console.log('game over');
  this.scene.start('scene4');
}
  

function collectFruit (bunny, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (banana.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        banana.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (bunny.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var birds = bird.create(x, 16, 'hunter');
        birds.setBounce(1);
        birds.setCollideWorldBounds(true);
        birds.setVelocity(Phaser.Math.Between(-200, 200), 20);
        birds.allowGravity = false;

    }
  if (score === 500){
    this.scene.start('scene3');
  }
}
  
  
};

function myupdate1() {
  if (cursors.left.isDown)
{
    bunny.setVelocityX(-160);

    bunny.anims.play('left', true);
}
else if (cursors.right.isDown)
{
    bunny.setVelocityX(160);

    bunny.anims.play('right', true);
}
else
{
    bunny.setVelocityX(0);

    bunny.anims.play('turn');
}

if (cursors.up.isDown && bunny.body.touching.down)
{
    bunny.setVelocityY(-330);
}




  
};

//Winner Scene
function preend() {
  this.load.image('winner', 'asset/Winner-Scene.jpg');
};
function createend() {
  this.add.image(500, 400, 'winner');
    
  
  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
};
function sceneTransition(that) {
  that.scene.start('scene1');
};

function updateend() {
  if (spacebar.isDown) {
    sceneTransition(this);
  }
}


function preover() {
  this.load.image('over', 'asset/gameover.jpg');
};
function createover() {
  this.add.image(500, 400, 'over');
  console.log('game scene');
  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
};
function updateover() {
   if (spacebar.isDown) {
    sceneTransition(this);
  }
};