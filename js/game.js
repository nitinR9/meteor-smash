
let spaceship, bullets, cursors, firebutton ,meteor, bulletTime = 0, firingTimer = 0 , bullet,
bulletSpeed, wall, speed=3, gravity, goverText, timer, pausedText, explosionSound, laserSound , dangerSound, play, pause, upcoming, fps ; // initialising global variables


// text variables 
let score = 0 , scoreText, scoreString = 'Score: ' , 
health , healthText, healthString = 'Health: ',
damage, damageText, damageString = 'Damage: ' ,
level, levelText, levelString = 'Level: ' ;


meteorSpace.state4 = function(){ // here 'play' is a state in this game
} ;


meteorSpace.state4.prototype = {
    create: function(){
        
        
        game.physics.startSystem(Phaser.Physics.Arcade) ;  // arcade mode initialised
        console.log('state3') ;
        game.world.setBounds(0,0, 800, 580) ; // set bounds
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL ;
        game.add.sprite( 0, -80, 'background') ; // adding background
        
        //adding sounds
        explosionSound = game.add.audio('expsound') ;
        explosionSound.volume = 0.5 ;
        dangerSound = game.add.audio('danger') ;
        dangerSound.volume = 1.3 ;
        dangerSound.loop = true ;
        
        
        // adding play/pause button
        play = game.add.image(752, 2,'play') ;
        play.scale.set(0.5) ;
        play.visible = false ;
        play.inputEnabled = true ;
        play.events.onInputUp.add(function () {
            // When the play button is pressed, we resume the game
            game.paused = false;
            play.visible = false ;
            pause.visible = true ;
            
        }) ;
        
        pause = game.add.image(752, 2, 'pause') ; 
        pause.scale.set(0.5) ;
        pause.inputEnabled = true ;
        pause.events.onInputUp.add(function () {
            // When the pause button is pressed, we pause the game
            game.paused = true;
            play.visible = true ;
            pause.visible = false ;
            
        }) ;
        
        // adding bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'laser');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true) ;
        
        
        // adding spcaeship
        spaceship = game.add.sprite(centerX, centerY + 240, 'spaceship') ;
        spaceship.anchor.setTo(0.5) ;
        spaceship.scale.setTo(0.5) ;
        
        game.physics.enable(spaceship, Phaser.Physics.ARCADE) ;
        spaceship.body.collideWorldBounds = true ;
        spaceship.body.bounce.set(1, 0);
        
        cursors = game.input.keyboard.createCursorKeys() ;
        firebutton = game.input.keyboard.addKey(Phaser.KeyCode.F) ;
        
        // text 
        score = 0 ;
        scoreText = game.add.text(5,8, scoreString + score ,{ font: '11pt consolas', fill: '#fff' }) ;
        health = 100 ;
        healthText = game.add.text(5,24, healthString + health ,{ font: '11pt consolas', fill: '#fff' }) ;
        damage = 0 ;
        damageText = game.add.text(5,40, damageString + damage + ' %' ,{ font: '11pt consolas', fill: '#fff' }) ;
        level = 'EASY' ;
        levelText = game.add.text(4, 56, levelString + level,{ font: '11pt consolas', fill: '#fff' } ) ;
        
        
        // meteor sprite group
        meteorGroup = game.add.physicsGroup(Phaser.Physics.ARCADE) ;
        meteorGroup.setAll('body.checkWorldBounds', true) ;
        
        
        game.time.events.add(1000, startGame, this);
        
        
        //  An explosion pool
        explosions = game.add.group();
        explosions.createMultiple(30, 'kaboom');
        explosions.forEach(setupBurst, this);
        
        
        // adding wall at the end
        
        wall = game.add.sprite(0,610, 'wall') ;
        wall.enableBody = true ;
        wall.physicsBodyType = Phaser.Physics.ARCADE ;
        game.physics.arcade.enable(wall) ;
        
        
        
    } ,
    update: function(){
        
        
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            if( level == 'NORMAL'){
                speed = 4 ;
            }
            else if( level == 'HARD'){
                speed = 5 ;
            }
            spaceship.x += speed ;
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            if( level == 'NORMAL'){
                speed = 4 ;
            }
            else if( level == 'HARD'){
                speed = 5 ;
            }
            spaceship.x -= speed ;
            
        }
        if(firebutton.isDown){
            fireBullet();
        }
        if(score > 15000 && score < 16000){
            level = 'NORMAL' ;
            levelText.text = levelString + level ;
            timer.delay = 1500 ;
        }
        if(score > 50000 && score < 52000) {
            level = 'HARD' ;
            levelText.text = levelString + level ;
            timer.delay = 500;
        }
        
        if((game.input.keyboard.isDown(Phaser.Keyboard.ENTER) && health <= 0) || (game.input.keyboard.isDown(Phaser.Keyboard.ENTER) && damage >= 100)){
            game.state.start('state5') ;
        }  

        game.physics.arcade.overlap(bullets, meteorGroup, meteorHit, null, this); // BULLETS HITS METEORS
        game.physics.arcade.overlap(wall, meteorGroup, wallHit, null, this) ; // METORS GOES OUT OF BOUNDS
        game.physics.arcade.overlap(meteorGroup, spaceship, meteorHitsSpaceship, null, this); // METEORS HITS SPACESHIP
    },
    render: function()
    {
        game.time.advancedTiming = true;
        
        fps = game.debug.text('FPS: '+ game.time.fps, 5, 84, '#ffff') ; // SHOWS CURRENT FPS OF GAME
        upcoming = game.debug.text('Upcoming meteors: ' + meteorGroup.countLiving(), 5, 96);
    }
} ;

function onpause(){
    this.game.pause = true ;
    pause.visible = false ;
    play.visible = true ;
    console.log('game paused') ;
}

function onplay(){
    this.game.pause = false ;
    play.visible = false ;
    pause.visible = true ;
    console.log('game resumed') ;
}

function startGame(){
    timer = game.time.events.loop(3000, createMeteors, this) ;
}


function meteorHit(b, m){
    b.kill() ;
    m.kill() ;
    score += 200 ;
    scoreText.text = scoreString + score ;
    
    explosionSound.play() ;
    
    //  And create an explosion
    let explosion = explosions.getFirstExists(false);
    explosion.reset(m.body.x, m.body.y);
    explosion.play('kaboom',30, false, true);
}

function wallHit(w, m){
    m.kill() ;
    // damage crement on going upward levels
    if( level == 'EASY'){
        damage += game.rnd.integerInRange(1,4) ;
    }
    else if( level == 'NORMAL'){
        damage += game.rnd.integerInRange(5,8) ;
    }
    else if( level == 'HARD'){
        damage += game.rnd.integerInRange(9,11) ;
    }
    
    damageText.text = damageString + damage + ' %'  ;
    if (damage >= 100)
    {
        dangerSound.stop() ;
        timer.loop = false ;
        spaceship.kill() ;
        goverText1 = game.add.text(centerX, centerY, 'GAME OVER', { font: '20pt arial', fill: '#fff' } ) ;
        goverText1.anchor.set(0.5,0.5) ;
        goverText1.visible = true;
        goverText2 = game.add.text(centerX, centerY + 50, 'Press ENTER to continue..', { font: '10pt arial', fill: '#fff' } ) ;
        goverText2.anchor.set(0.5,0.5) ;
        goverText2.visible = true;
        scoreText.visible = false ;
        healthText.visible = false ;
        damageText.visible = false ;
        levelText.visible = false ;
        pause.visible = false ;
        play.visible = false ;
        bullets.kill() ;
    }
    if( damage > 75 && damage < 100 ){
        if( dangerSound.isPlaying === false)
            dangerSound.play() ;
    }
}

function meteorHitsSpaceship(s, m){
    m.kill() ;
    // health decrement on going upward levels
    if( level == 'EASY'){
        health -= game.rnd.integerInRange(1,4) ;
    }
    else if( level == 'NORMAL'){
        health -= game.rnd.integerInRange(5,8) ;
    }
    else if( level == 'HARD'){
        health -= game.rnd.integerInRange(9,11) ;
    }
    
    healthText.text = healthString + health ;
    
    explosionSound.play() ;
    // play animation for explosion
    let explosion = explosions.getFirstExists(false);
    explosion.reset(spaceship.body.x, spaceship.body.y);
    explosion.play('kaboom', 30, false, true);
    
    if (health <= 0)
    {
        dangerSound.stop() ;
        timer.loop = false ;
        spaceship.kill() ;
        
        goverText1 = game.add.text(centerX, centerY, 'GAME OVER', { font: '20pt arial', fill: '#fff' } ) ;
        goverText1.anchor.set(0.5,0.5) ;
        goverText1.visible = true;
        goverText2 = game.add.text(centerX, centerY + 50, 'Press ENTER to continue..', { font: '10pt arial', fill: '#fff' } ) ;
        goverText2.anchor.set(0.5,0.5) ;
        goverText2.visible = true;
        scoreText.visible = false ;
        healthText.visible = false ;
        damageText.visible = false ;
        levelText.visible = false ;
        pause.visible = false ;
        play.visible = false ;
        bullets.kill() ;
    }
    if( health < 20 && health > 0 ){
        if( dangerSound.isPlaying === false)
            dangerSound.play() ;
    }
}


function setupBurst (meteor) {
    meteor.anchor.x = 0.4;
    meteor.anchor.y = 0.4;
    meteor.animations.add('kaboom');
}


function createMeteors(){
    let x, xpos ;
    if( level == 'EASY'){
        x = game.rnd.integerInRange(3,6) ;
    }
    else if( level == 'NORMAL'){
        x = game.rnd.integerInRange(4,8) ;
    }
    else if( level == 'HARD'){
        x = game.rnd.integerInRange(1, 5) ;
    }
    for( let i=0 ; i<=x ; i++){ 
        if( level == 'EASY'){
            gravity = game.rnd.integerInRange(8,11) ; 
        }
        
        else if( level == 'NORMAL'){
            gravity = game.rnd.integerInRange(6,10) ;
        }
        else if( level == 'HARD'){
            gravity = game.rnd.integerInRange(5, 15) ;
        }
        xpos = Math.random() * 760 ;
        meteor = meteorGroup.create( xpos , -80 , 'meteor') ;
        meteor.body.gravity.set(0, gravity) ;
    }
      
}

function fireBullet () {
    
    if( level == 'EASY'){
        bulletSpeed = 0 ;
    }
    else if( level == 'NORMAL'){
        bulletSpeed = 30 ;
    }
    else if( level == 'HARD'){
        bulletSpeed = 100 ;
    }
    
    //  To avoid them being allowed to fire too fast we set a time limit
    if ((game.time.now + bulletSpeed) > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);
        
        if (bullet)
        {
            //  And fire it
            bullet.reset(spaceship.x, spaceship.y + 8);
            bullet.body.velocity.y = -400;
            // laserSound.play() ;
            bulletTime = game.time.now + 200;
        }
    }
}


function resetBullet (bullet) {
    
    //  Called if the bullet goes out of the screen
    bullet.kill();
    
}

