meteorspace.state4 = function(){
   this.score = 0 ;
} ;

var config = {
   currentLevel: 1,
   levels: ['EASY', 'HARD', 'INSANE'],
   lvlChanged: false,
   lvlChangeTime: 60000,
   powerups: ['H_HEALTH', 'H_CORE', 'COOL_OVERLOAD','N_CORE'],
   m_name: ['smmeteor','medmeteor', 'lgmeteor'],
   em_name: ['smallexploder','mediumexploder','largeexploder'],
   currentWeapon: 1,
   corepower: 40,
   overloadLevel: 0.00,
   lightFireState: false,
   deathRayFireState: false,
   fireOnce: true,
   showTweenTime: 4000,
   weaponslot: [
      {
         name: 'Laser',
         weapon: undefined 
      },
      {
         name: 'LightRay',
         weapon: undefined
      },
      {
         name: 'DeathRay',
         weapon: undefined
      }
   ]
}

var guibuttons = {} ;

var textinfo = {} ;

var sounds = [] ;

var spaceship, collidebar ,power, weapon, leftKey, rightKey, upKey, downKey, pauseKey , fireKey, mysprite,text, obj, bulletTime = 0, gatherpower , scoreboard, playerhp, corehp, earthhp, num_m_array=[], num_em_array=[], lvltext,xpos, gravity,f_meteor, m_group = [], em_group = [], spinVelocity = 0, boost, m_cores = [], explosions = [], customKillSignal, count=0, fps, rect, pause,resume, pauseText, scoreText, meteorLoop;

meteorspace.state4.prototype = {
   create: function(){

      sessionStorage.setItem('score', '0') ;
      this.score = 0 ;
      

      var s,m,l,exp_s,exp_m, exp_l ;
      game.time.advancedTiming = true; 
      game.input.enabled = false ;
      game.physics.startSystem(Phaser.Physics.ARCADE) ;
      game.add.image(0,0,'gamebg') ;
      
      //player      
      spaceship = game.add.sprite(centerX, centerY+250, 'player') ;
      game.physics.enable(spaceship, Phaser.Physics.ARCADE) ;
      spaceship.anchor.setTo(0.5) ;
      spaceship.scale.setTo(0.6) ;
      spaceship.health = 100
      spaceship.maxHealth = 100 ;
      spaceship.events.onKilled.add((m)=>{
         sounds[0].stop() ;
         game.time.events.remove(meteorLoop) ;
         sessionStorage.setItem('score', `${this.score}`) ;
         game.state.start('state5') ;
      },this) ;      
      
      //3..2...1..go!
      
      mysprite = game.add.sprite(centerX,centerY,'starter') ;
      mysprite.anchor.setTo(0.5,0.5) ;
      mysprite.scale.setTo(1.2) ;
      var timerAnimation = mysprite.animations.add('myanim', null, 1) ;
      timerAnimation.onComplete.add(this.timerStop,this) ;
      timerAnimation.play('myanim', false, true) ;
      // timerSound = game.add.audio('timer', 1, true) ;
      
      
      
      // weapon 1
      config.weaponslot[0].weapon = game.add.weapon(15, 'lasers',0) ;
      config.weaponslot[0].weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS ;
      config.weaponslot[0].weapon.bulletSpeed = 600 ;
      config.weaponslot[0].weapon.fireRate = 100 ;
      config.weaponslot[0].weapon.bulletSpeedVariance = 200 ;
      config.weaponslot[0].weapon.trackSprite(spaceship,0,-40,false) ;
      config.weaponslot[0].weapon.bullets.setAll('scale.x', 0.5);
      config.weaponslot[0].weapon.bullets.setAll('scale.y', 0.5);
      config.weaponslot[0].weapon.onFire.add(this.playFireSound) ;
      
      // weapon 2
      config.weaponslot[1].weapon = game.add.weapon(10,'lasers', 1) ;
      config.weaponslot[1].weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS ;
      config.weaponslot[1].weapon.bulletSpeed = 500 ;
      config.weaponslot[1].weapon.fireRate = 130 ;
      config.weaponslot[1].weapon.bulletSpeedVariance = 100 ;
      config.weaponslot[1].weapon.trackSprite(spaceship,0,-40,false) ;
      config.weaponslot[1].weapon.bullets.setAll('scale.x', 0.5);
      config.weaponslot[1].weapon.bullets.setAll('scale.y', 0.5);
      config.weaponslot[1].weapon.onFire.add(this.playFireSound) ;

      
      power = game.add.sprite(spaceship.x, spaceship.y-50,'power',0) ;
      game.physics.enable(power, Phaser.Physics.ARCADE) ;
      power.scale.setTo(0.5) ;
      power.anchor.setTo(0.5) ;
      power.body.enable = false ;
      gatherpower = power.animations.add('fluctuation', [0,1,2,3,4,5,6,6], 14, true) ;
      power.alpha = 0 ;


      var s0,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11 ;

      s0 = game.add.audio('levelsound', 1,true) ;
      s1 = game.add.audio('firesound', 0.3,false) ;  
      s2 = game.add.audio('emptylaser', 0.3,false) ;
      s3 = game.add.audio('recharge', 0.5,false) ;
      s4 = game.add.audio('deathraysound',0.7,false) ;
      s4.onPlay.add(()=>{
         s4._sound.playbackRate.value = 0.7 ; 
      },this) ;

      s5 = game.add.audio('explodesoundsm', 0.4, false) ;
      s6 = game.add.audio('explodesoundmed', 0.4, false) ;
      s7 = game.add.audio('explodesoundlg', 0.4, false) ;
      s8 = game.add.audio('laserabsorb', 0.3, false) ;
      s9 = game.add.audio('powerupsound',1,false) ;
      s10 = game.add.audio('powerdownsound', 1,false) ;
      s11 = game.add.audio('redalert', 0.6, true) ;

      sounds.push(s0,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11) ;
      
      
      // weapon 3
      
      config.weaponslot[2].weapon = game.add.sprite(spaceship.x, spaceship.y+8,'deathray', 0) ;
      game.physics.enable(config.weaponslot[2].weapon, Phaser.Physics.ARCADE) ;
      config.weaponslot[2].weapon.anchor.setTo(0.45,1) ;
      config.weaponslot[2].weapon.scale.setTo(0.9);
      config.weaponslot[2].weapon.animations.add('ray', [0,1,2,3,4,5,6,7,8,9,10,11], 12,true) ;
      config.weaponslot[2].weapon.play('ray') ;
      config.weaponslot[2].weapon.alpha = 0 ;
      config.weaponslot[2].weapon.body.enable = false ;
      
      spaceship.bringToTop(); 
      
      var e1,e2 ;

      // simple meteors explosion group

      // e1 = game.add.group() ;
      // e1.createMultiple(5,'explosion1') ;
      // e1.callAll('animations.add', 'animations', 'kaboom1', [0,1,2,3,4,5,6]) ;
      // e1.forEach((sprite)=> {
      //    sprite.anchor.x = -1
      // },this) ;

      e2 = game.add.group() ;
      e2.createMultiple(40,'explosion2') ;
      e2.callAll('animations.add', 'animations', 'kaboom2',[0,1,2,3,4,5,6]) ;
      e2.forEach((sprite)=> {
         sprite.anchor.x = 0.5 ;
         sprite.anchor.y = 0.5 ;
      },this) ;

      explosions.push(e2) ;


      // kill signal

      customKillSignal = new Phaser.Signal() ;
      customKillSignal.add(this.onMeteorKill, this) ;
      

      // pools of meteors
      s = game.add.physicsGroup(Phaser.Physics.ARCADE) ;
      s.scale.setTo(0.9) ;
      s.createMultiple(25, 'smmeteor', 0) ;
      s.forEach((meteor) => {
         meteor.health = 100 ;
      },this) ;

      // s.setAll('body.checkWorldBounds', true) ;
      
      m = game.add.physicsGroup(Phaser.Physics.ARCADE) ;
      m.scale.setTo(0.7) ;
      m.createMultiple(25, 'medmeteor', 0) ;
      m.forEach((meteor) => {
         meteor.health = 100 ;
         meteor.animations.add('absorb1', [0,1,2], 10, false) ;
         meteor.animations.getAnimation('absorb1').onComplete.add((m)=> {
            m.frame = 0 ;
         },this) ;
      },this) ;
      
      
      // s.setAll('body.checkWorldBounds', true) ;
      
      l = game.add.physicsGroup(Phaser.Physics.ARCADE) ;
      l.scale.setTo(0.5) ;
      l.createMultiple(25, 'lgmeteor', 0) ;
      l.forEach((meteor) => {
         meteor.health = 100 ;
         meteor.animations.add('absorb2', [0,1,2], 10, false) ;
      },this) ;

      m_group.push(s,m,l) ;
      
      
      //pool of exploding metoers
      
      exp_s = game.add.group() ;
      exp_s.physicsBodyType = Phaser.Physics.ARCADE ;
      exp_s.enableBody = true ;
      exp_s.scale.setTo(0.9) ;
      exp_s.createMultiple(25, 'smallexploder', 0) ;
      exp_s.callAll('animations.add', 'animations','blink1', [0,1,2], 11,true) ;
      exp_s.callAll('animations.play', 'animations','blink1') ;
      exp_s.forEach((meteor) => {
         meteor.health = 100 ;
      },this) ;

      exp_m = game.add.group() ;
      exp_m.physicsBodyType = Phaser.Physics.ARCADE ;
      exp_m.enableBody = true ;
      exp_m.scale.setTo(0.7) ;
      exp_m.createMultiple(25, 'mediumexploder', 0) ;
      exp_m.callAll('animations.add', 'animations','blink2', [0,1,2], 9,true) ;
      exp_m.callAll('animations.play', 'animations','blink2') ;
      exp_m.forEach((meteor) => {
         meteor.health = 100 ;
      },this) ;
      
      exp_l = game.add.group() ;
      exp_l.physicsBodyType = Phaser.Physics.ARCADE ;
      exp_l.enableBody = true ;
      exp_l.scale.setTo(0.5) ;
      exp_l.createMultiple(25, 'largeexploder', 0) ;
      exp_l.callAll('animations.add', 'animations','blink3', [0,1,2],7,true) ;
      exp_l.callAll('animations.play', 'animations','blink3') ;
      exp_l.forEach((meteor) => {
         meteor.health = 100 ;
      },this) ;

      em_group.push(exp_s,exp_m,exp_l) ;


      // powerups

      var p1, p2,p3,p4,p5 ;
      
      p1 = game.add.group() ; // heal spaceship
      p1.physicsBodyType = Phaser.Physics.ARCADE ;
      p1.enableBody = true ;
      p1.name = 'core1' ;
      p1.createMultiple(1,'power_cores', 0) ;
      p1.forEach(function(p){
         p.checkWorldBounds = true ;
         p.outOfBoundsKill = true ;
      },this) ;
      
      p2 = game.add.group() ; // revive corepower
      p2.physicsBodyType = Phaser.Physics.ARCADE ;
      p2.enableBody = true ;
      p2.name = 'core2' ;
      p2.createMultiple(2,'power_cores', 1) ;
      p2.forEach(function(p){
         p.checkWorldBounds = true ;
         p.outOfBoundsKill = true ;
      },this) ;
      
      p3 = game.add.group() ; // reduce overload level
      p3.physicsBodyType = Phaser.Physics.ARCADE ;
      p3.enableBody = true ;
      p3.name = 'core3' ;
      p3.createMultiple(3,'power_cores',2) ;
      p3.forEach(function(p){
         p.checkWorldBounds = true ;
         p.outOfBoundsKill = true ;
      },this) ;

      p4 = game.add.group() ; // damage spacesip
      p4.physicsBodyType = Phaser.Physics.ARCADE ;
      p4.enableBody = true ;
      p4.name = 'core4' ;
      p4.createMultiple(6,'power_cores', 3) ;
      p4.callAll('animations.add', 'animations', 'damageball1', [3,4], 5,true) ;
      p4.callAll('animations.play', 'animations', 'damageball1') ;
      p4.forEach(function(p){
         p.checkWorldBounds = true ;
         p.outOfBoundsKill = true ;
      },this) ;

      p5 = game.add.group() ; // increase overload
      p5.physicsBodyType = Phaser.Physics.ARCADE ;
      p5.enableBody = true ;
      p5.name = 'core5' ;
      p5.createMultiple(6,'power_cores', 5) ;
      p5.callAll('animations.add', 'animations', 'damageball2', [5,6], 5,true) ;
      p5.callAll('animations.play', 'animations', 'damageball2') ;
      p5.forEach(function(p){
         p.checkWorldBounds = true ;
         p.outOfBoundsKill = true ;
      },this) ;
      
      m_cores.push(p1,p2,p3,p4,p5) ;
      
      // powebar sprites

      game.add.sprite(64,0,'playerhp',4).alpha = 0.4 ;
      playerhp = game.add.sprite(64,0,'playerhp',0) ;

      
      game.add.image(64,24,'corehp',1).alpha = 0.4 ;
      corehp = game.add.image(64,24,'corehp', 0) ;

      
      weapondisplay = game.add.image(0,0,'weaponselect',config.currentWeapon-1) ;
      
      game.add.image(64,43,'overloadlvl', 1).alpha = 0.4 ;
      earthhp = game.add.image(64,43,'overloadlvl',0) ;
      // earthhp.scale.setTo(0.5) ;
      
      scoreboard = game.add.image(0,0,'skeleton') ;
      scoreboard.scale.setTo(1) ;

      
      this.updateScoreStats() ;
      
      // gui menu
      
      textinfo.weaponName = game.add.text(0,85,config.weaponslot[config.currentWeapon-1].name,{fill: "white", fontSize: "10pt"}) ;
      textinfo.healthText = game.add.text(164,4,'',{fill: "white", fontSize: 25, font: "webpixelbitmap"}) ;
      textinfo.healthText.setShadow(0,2,'#000',5) ;
      textinfo.healthText.anchor.setTo(0.5,0) ;

      textinfo.coreText = game.add.text(131,26,'',{fill: "white", fontSize: 22, font: "webpixelbitmap"}) ;
      textinfo.coreText.setShadow(0,2,'#000',5) ;
      textinfo.coreText.anchor.setTo(0.5,0) ;

      textinfo.damageText = game.add.text(110,46,'',{fill: "white", fontSize: 16, font: "webpixelbitmap"}) ;
      textinfo.damageText.setShadow(0,2,'#000',5) ;
      textinfo.damageText.anchor.setTo(0.5,0) ;

      collidebar = game.add.sprite(0,750,'collidebar') ;
      game.physics.arcade.enable(collidebar) ;

      scoreText = game.add.text(0,65,'',{fill: 'white', fontSize: 30, font: "webpixelbitmap"}) ;

      // play & pause button

      pause = game.add.button(game.width-40,30,'pause', this.onClick, this) ;
      pause.anchor.setTo(0.5) ;
      pause.scale.setTo(0.3) ;

      pauseText = game.add.text(centerX,centerY-100,'GAME PAUSED',{fill: "red", fontSize: 60, font: "minecraft"}) ;
      pauseText.setShadow(0,5,'#000',5) ;
      pauseText.anchor.setTo(0.5) ;
      pauseText.alpha = 0 ;
      pauseText.bringToTop() ;
      

      resume = game.add.button(game.width-40,30,'resume', this.onClick, this) ;
      resume.anchor.setTo(0.5) ;
      resume.scale.setTo(0.3) ;
      resume.alpha = 0 ;

      // keyboard keys
      leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT) ;
      rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT) ;
      fireKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR) ;
      
      upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP) ;
      downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN) ;
      pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P) ;
   },
   update: function(){
      weapondisplay.frame = config.currentWeapon-1 ;
      textinfo.weaponName.text = config.weaponslot[config.currentWeapon-1].name ;
      textinfo.healthText.text = parseInt(spaceship.health)+ 'HP' ;
      textinfo.coreText.text = parseInt(config.corepower) + '%' ;
      textinfo.damageText.text = config.overloadLevel.toFixed(2) + '%';
      config.weaponslot[2].weapon.x = power.x = spaceship.x ;
      scoreText.text = `Score: ${this.score}` ;

      // if(fireKey.isDown && config.currentWeapon == 2){
      //    config.lightFireState = true ;
      // }
      // else{
      //    config.lightFireState = false ;
      // }
      
      if(fireKey.isUp && config.currentWeapon !== 3){
         config.lightFireState = false ;
      }


      this.healthbarUpdate() ;
      
      this.updateScoreStats() ;
 
      this.updateCoreOverloadBar() ;

      boost = config.currentLevel === 2 ? 100 : 0 ;
      boost = config.currentLevel === 3 ? 200 : 0 ;


      // not required

      // if(game.input.keyboard.addKey(Phaser.Keyboard.C).isDown){
      //    config.corepower++ ;
      //    if(!sounds[3].isPlaying){
      //       sounds[3].play() ;
      //    }
      // }
      // if(game.input.keyboard.addKey(Phaser.Keyboard.D).isDown){
      //    // spaceship.damage(1) ;
      //    spaceship.damage(1) ;
      // }
      // if(game.input.keyboard.addKey(Phaser.Keyboard.H).isDown){
      //    spaceship.heal(1) ;
      // }


      if(config.currentLevel === 1){
         config.weaponslot[0].weapon.fireRate = 160 ;
         config.weaponslot[1].weapon.fireRate = 180 ;
      }
      else if(config.currentLevel === 2){
         config.weaponslot[0].weapon.fireRate = 130 ;
         config.weaponslot[1].weapon.fireRate = 150 ; 
      }
      else{
         config.weaponslot[0].weapon.fireRate = 90 ;
         config.weaponslot[1].weapon.fireRate = 110 ;
      }
      

      if(spaceship.health < 25 || config.overloadLevel > 80){
         if(!sounds[11].isPlaying){
            sounds[11].play() ;
         }
      }
      else if(spaceship.health > 25 && config.overloadLevel < 80 && sounds[11].isPlaying){
         sounds[11].stop() ;
      }
      
      if(pauseKey.justDown){
         this.onClick() ;
      }

      if(fireKey.isDown && config.currentWeapon === 1 && spaceship.exists){
         config.weaponslot[0].weapon.fire() ;
         config.lightFireState = true ;
      }
      else if(fireKey.isDown && config.currentWeapon === 2 && spaceship.exists){
         if(config.corepower && config.overloadLevel < 80 ){
            config.weaponslot[1].weapon.fire() ;
            config.lightFireState = true
         }
         else if( (config.corepower === 0 && fireKey.downDuration(180)) || config.overloadLevel > 80){
            sounds[2].play() ;
         }
      }
      else if(fireKey.justDown && config.currentWeapon === 3 && config.corepower !== 0 && config.fireOnce && config.overloadLevel < 80 && spaceship.exists){
         config.deathRayFireState = true ;
         config.fireOnce = false ;
         power.body.enable = true;
         power.alpha = 1 ;
         gatherpower.play() ; // gather power animation
         sounds[4].play() ;
         // this.corepower = 0 ;  // to make system for drastcally decreasing core power
         game.time.events.add(Phaser.Timer.SECOND,this.fireUltimateWeapon, this) ;
      }
      else if(fireKey.isDown && fireKey.downDuration(1) && !config.deathRayFireState){
         // if(config.corepower === 0 && fireKey.isDown && fireKey.downDuration(1)){
         //    sounds.emptygun.play() ;
         // }
         // else{
         //    sounds.emptygun.play() ;
         // }
         if(config.corepower === 0){
            console.log('cannot shoot as corepower is 0') ;
            sounds[2].play() ;
         }
         else{
            console.log('cannot shoot now as overload is above 80%') ;
            sounds[2].play() ;
         }
      }
      if(upKey.justDown){
         if( config.currentWeapon === 3 && !config.deathRayFireState){
            config.currentWeapon = 1 ;
         }
         else{
            if(!config.deathRayFireState){   // if weapon3 is in it's firestate then don't change the weapon
               config.currentWeapon++ ;
            }
         }
      }
      if(downKey.justDown){
         if( config.currentWeapon === 1 ){
            config.currentWeapon = 3
         }
         else{
            if(!config.deathRayFireState){    // if weapon3 is in it's firestate then don't change the weapon
            config.currentWeapon-- ;
         }
      }
         console.log(config.currentWeapon)
      }
      if(leftKey.isDown){
         config.weaponslot[2].weapon.body.velocity.x = power.body.velocity.x  = spaceship.body.velocity.x = -400 - boost ;  // adjusting the velocities

         if(spaceship.x < 0){
            config.weaponslot[2].weapon.x = power.x = spaceship.x = width ;
         }
      }
      else if(rightKey.isDown){
         config.weaponslot[2].weapon.body.velocity.x = power.body.velocity.x = spaceship.body.velocity.x = 400 + boost; // adjusting the velocities
         if(spaceship.x > width){
            config.weaponslot[2].weapon.x = power.x = spaceship.x = 0 ;
         }
      }
      else{
         config.weaponslot[2].weapon.body.velocity.x = power.body.velocity.x = spaceship.body.velocity.x = 0 ;   // adjusting the velocities
      }

      game.physics.arcade.overlap(collidebar,m_group,this.barHitsMeteor,null,this) ;
      game.physics.arcade.overlap(collidebar,em_group,this.barHitsMeteor,null,this) ;

      // bullets colliding with meteors

      game.physics.arcade.overlap(config.weaponslot[0].weapon.bullets,m_group,this.bulletHitsMeteor1,null,this) ;
      game.physics.arcade.overlap(config.weaponslot[1].weapon.bullets,m_group,this.bulletHitsMeteor2,null,this) ;
      game.physics.arcade.overlap(config.weaponslot[2].weapon,m_group,this.bulletHitsMeteor3,null,this) ;


      game.physics.arcade.overlap(config.weaponslot[0].weapon.bullets,em_group,this.bulletHitsExplodingMeteor1,null,this) ;
      game.physics.arcade.overlap(config.weaponslot[1].weapon.bullets,em_group,this.bulletHitsExplodingMeteor2,null,this) ;
      game.physics.arcade.overlap(config.weaponslot[2].weapon,em_group,this.bulletHitsExplodingMeteor3,null,this) ;

      game.physics.arcade.overlap(m_group,spaceship,this.meteorHitSpaceship,null,this) ;
      game.physics.arcade.overlap(em_group,spaceship,this.meteorHitSpaceship,null,this) ;

      
      game.physics.arcade.overlap(m_cores,spaceship,this.powerupsHitSpaceship,null,this)

      // game.physics.arcade.overlap()
   },
   render: function(){
      // if(config.currentWeapon !== 3){
      //    config.weaponslot[config.currentWeapon-1].weapon.debug() ;
      // }
      // game.debug.text(`${config.corepower}, ${config.fireOnce}, ${config.deathRayFireState}`, 100,100,'#fff','consolas') ;
      game.debug.text(`FPS: ${game.time.fps}`, 0,115,'#fff','arial') ;
      // game.debug.text(`living explosions: ${explosions[1].countLiving()}`, 500,500)
      // game.debug.text('Upcoming meteors: ' + this.weaponslot[1].weapon.countLiving(), 5, 96);
      // for(i in m_group){
      //    game.debug.text('living: ' + m_group[i].countLiving(), 500,20+ i*20) ;
      // }
      // for(i in em_group){
      //    game.debug.text('em living: ' + em_group[i].countLiving(), 500,100+ i*20) ;
      // }
      fps = game.time.fps ;

      // for( i in m_cores){
      //    game.debug.text(`living powerups ${i+1} `+ m_cores[i].countLiving(), 200,200+ i*50) ;
      // }
   },
   barHitsMeteor: function(wall, meteor){
      meteor.kill() ;
   },
   bulletHitsMeteor1: function(bullet,meteor){
      bullet.kill() ;
      // meteor.kill() ;
      this.bullettoMeteorDamageHandler(meteor,bullet) ;

      if(meteor.health <= 0){
         customKillSignal.dispatch(meteor,bullet) ;      
         this.scoreIncrement(meteor.key) ;
         this.createPowerUps(meteor) ;
      }
      else{
         sounds[8].play() ;
         if(meteor.key === 'medmeteor'){
            meteor.play('absorb1') ;
         }
         else if(meteor.key === 'lgmeteor'){
            meteor.play('absorb2') ;
         }
      }
   },
   bulletHitsMeteor2: function(bullet,meteor){
      bullet.kill() ;
      // meteor.kill() ;
      this.bullettoMeteorDamageHandler(meteor,bullet) ;
      
      if(meteor.health <= 0){
         this.scoreIncrement(meteor.key) ;
         customKillSignal.dispatch(meteor,bullet) ;      
         this.createPowerUps(meteor) ;
      }
      else{
         sounds[8].play() ;
         if(meteor.key === 'medmeteor'){
            meteor.play('absorb1') ;
         }
         else if(meteor.key === 'lgmeteor'){
            meteor.play('absorb2') ;
         }
      }
   },
   bulletHitsMeteor3: function(bullet,meteor){
      // meteor.kill() ;
      this.bullettoMeteorDamageHandler(meteor,bullet) ;
      
      if(meteor.health <= 0){
         this.scoreIncrement(meteor.key) ;
         customKillSignal.dispatch(meteor,bullet) ;     
         this.createPowerUps(meteor) ;
      }
   },
   bulletHitsExplodingMeteor1: function(bullet,meteor){
      bullet.kill() ;
      // meteor.kill() ;
      this.bullettoMeteorDamageHandler(meteor,bullet) ;
      
      if(meteor.health <= 0){
         this.scoreIncrement(meteor.key) ;
         customKillSignal.dispatch(meteor,bullet) ;   
         this.createPowerUps(meteor) ;
      }
      else{
         sounds[8].play() ;
      }
   },
   bulletHitsExplodingMeteor2: function(bullet,meteor){
      bullet.kill() ;
      // meteor.kill() ;
      this.bullettoMeteorDamageHandler(meteor,bullet) ;
      
      if(meteor.health <= 0){
         this.scoreIncrement(meteor.key) ;
         customKillSignal.dispatch(meteor,bullet) ;    
         this.createPowerUps(meteor) ;
      }
      else{
         sounds[8].play() ;
      }
   },
   bulletHitsExplodingMeteor3: function(bullet,meteor){
      // meteor.kill() ;
      this.bullettoMeteorDamageHandler(meteor,bullet) ;
      
      if(meteor.health <= 0){
         this.scoreIncrement(meteor.key) ;
         customKillSignal.dispatch(meteor,bullet) ;    
         this.createPowerUps(meteor) ;
      }
   },
   onMeteorKill: function(meteor){
      let exp = explosions[0].getFirstExists(false) ;
      let x = meteor.body.x+meteor.width/2, y = meteor.body.y+meteor.height/2 ;
      let meteorType = meteor.key ;

      if (exp){
         exp.reset(x,y) ;
      }

      switch(meteorType){
         case 'smmeteor' : 
         case 'smallexploder' : {
            exp.scale.setTo(1.4) ;
            sounds[5].play() ;
            break ;
         }
         case 'medmeteor' : 
         case 'mediumexploder' : {
            exp.scale.setTo(1.8) ;
            sounds[6].play() ;
            break ;
         }
         case 'lgmeteor' : 
         case 'largeexploder' : {
            exp.scale.setTo(2.2) ;
            sounds[7].play() ;
            break ;
         }
      }

      exp.play('kaboom2',25,false,true) ;
   },
   bullettoMeteorDamageHandler: function(m,b){
      let type ; // identify bullet type
      if(b.key === 'lasers'){
         if(config.currentWeapon == 1){
            type = 'lasers1' ;
         }
         else{
            type = 'lasers2' ;
         }
      }
      else{
         type = b.key ;
      }

      switch(m.key){
         case 'smmeteor' :
         case 'smallexploder' : {
            if(type){
               m.damage(m.maxHealth/fps) ;
            }
            break ;
         }
         case 'medmeteor' : {
            if( type === 'lasers1'){
               m.damage(m.maxHealth/(fps*2)) ;
            }
            else if(type === 'lasers2' || type === 'deathray'){
               m.damage(m.maxHealth/fps) ;
            }
            break ;
         }
         case 'mediumexploder' : {
            if(type){
               m.damage(m.maxHealth/fps) ;
            }
            break ;
         }
         case 'lgmeteor' : {
            if( type === 'lasers1'){
               m.damage(m.maxHealth/(fps*4)) ;
            }
            else if(type === 'lasers2'){
               m.damage(m.maxHealth/(fps*2))
            }
            else if(type === 'deathray'){
               m.damage(m.maxHealth/fps) ;
            }
            break ;
         }
         case 'largeexploder' : {
            if( type === 'lasers1'){
               m.damage(m.maxHealth/(fps*2)) ;
            }
            else if(type === 'lasers2' || type === 'deathray'){
               m.damage(m.maxHealth/fps) ;
            }
            break ;
         }
      }
   },
   createPowerUps: function(m){
      let probab = game.rnd.integerInRange(0,100) ;
      let xpos = m.body.x+m.width/2, ypos = m.body.y+m.height/2 ;
      let powerup, gravity = game.rnd.integerInRange(100,200) ;
      
      if(config.currentLevel !== 1){
         if(config.m_name.indexOf(m.key) > -1){
            if(probab > 90){
               if(probab < 94){
                  powerup = m_cores[2].getFirstExists(false) ;
               }
               else if(probab > 94 && probab < 98){
                  powerup = m_cores[1].getFirstExists(false) ;
               }
               else{
                  powerup = m_cores[0].getFirstExists(false) ; 
               }
            }
            if(powerup){
               powerup.reset(xpos,ypos) ;
               powerup.body.velocity.set(0,gravity) ;
               powerup.anchor.setTo(0.5) ;
            }
         }
         else if(config.em_name.indexOf(m.key) > -1){
            probab = game.rnd.integerInRange(0,1) ;
            let create = game.rnd.integerInRange(0,10) ;
            if(create > 8){
               if(probab){
                  powerup = m_cores[3].getFirstExists(false) ;
               }
               else{
                  powerup = m_cores[4].getFirstExists(false) ;
               }
            }
            if(powerup){
               powerup.reset(xpos,ypos) ;
               powerup.body.velocity.set(0,gravity) ;
               powerup.anchor.setTo(0.5) ;
            }
         }
      }
      
      // if(!powerup){
         
      // }
   },
   meteorHitSpaceship: function(spaceship,meteor){
      meteor.kill() ;
      customKillSignal.dispatch(meteor) ;
      switch(meteor.key){
         case 'smmeteor' : {
            spaceship.damage(1) ;
            break ;
         }
         case 'smallexploder' : {
            spaceship.damage(1.5) ;
            break ;
         }
         case 'medmeteor' : {
            spaceship.damage(2) ;
            break ;
         }
         case 'mediumexploder' : {
            spaceship.damage(2.5) ;
            break ;
         }
         case 'lgmeteor' : {
            spaceship.damage(3) ;
            break ;
         }
         case 'largeexploder' : {
            spaceship.damage(3.5) ;
            break ;
         }
      }
   },
   powerupsHitSpaceship: function(player,powerup){
      powerup.kill() ;
      var powerupType = powerup.parent.name ;
      var level = config.currentLevel ;
      switch(powerupType){
         case 'core1' : {
            if(level === 2){
               player.heal(5) ;
            }
            else if(level === 3){
               player.heal(8) ;
            }
            sounds[9].play() ;
            break ;
         }
         case 'core2' : {
            if(level === 2){
               config.corepower += 15 ;
            }
            else if(level === 3){
               config.corepower += 30 ;
            }
            sounds[3].play() ;
            break ;
         }
         case 'core3' : {
            if(level === 2){
               config.overloadLevel -= 10 ;
            }
            else if(level === 3){
               config.overloadLevel -= 20 ;
            }
            sounds[9].play() ;
            break ;
         }
         case 'core4' : {
            if(level === 2){
               spaceship.damage(8) ;
            }
            else if(level === 3){
               spaceship.damage(15) ;
            }
            sounds[10].play() ;
            break ;
         }
         case 'core5' : {
            if(level === 2){
               config.overloadLevel += 5 ;
            }
            else if(level === 3){
               config.overloadLevel += 10 ;
            }
            sounds[10].play() ;
            break ;
         }
      }
   },
   healthbarUpdate: function(){
      if(spaceship.health <= 100 && spaceship.health > 75){
         playerhp.frame = 0 ;
      }
      else if(spaceship.health < 75 && spaceship.health > 50){
         playerhp.frame = 1 ;
      }
      else if(spaceship.health < 50 && spaceship.health > 25){
         playerhp.frame = 2 ;
      }
      else if(spaceship.health < 25 && spaceship.health >=0){
         playerhp.frame = 3 ;
      }
   },
   updateCoreOverloadBar: function(){
      if(config.corepower >= 100){
         config.corepower = 100
      }
      else if(config.corepower <= 0){
         config.corepower = 0 ;
      }
      if(config.overloadLevel >= 100){
         config.overloadLevel = 100 ;
      }
      else if(config.overloadLevel <= 0){
         config.overloadLevel = 0 ;
      }
   },
   coolDown: function(){
      config.overloadLevel -= 0.005 ;
   },
   updateScoreStats: function(){
      if(config.overloadLevel >= 100){
         spaceship.damage(1/60) ;
      }

      if(!config.deathRayFireState && !config.lightFireState){
         this.coolDown();
      }
      playerhp.width = spaceship.health * 0.01 * 192 ;
      corehp.width = config.corepower * 0.01 * 134 ;
      earthhp.width = config.overloadLevel * 0.01 * 86 ;
   },
   fireUltimateWeapon: function(){  // firing weapon 3
      console.log('fire started') ;
      power.alpha = 0 ;
      power.body.enable = false ;
      config.weaponslot[2].weapon.alpha = 1 ;
      config.weaponslot[2].weapon.body.enable = true ;
      
      game.time.events.add(Phaser.Timer.SECOND * (config.corepower / 10 ), this.closeUltimateWeapon, this) ;
      this.decreaseCorePowerIndicator() ;
   },
   closeUltimateWeapon: function(){  // close ultimate weapon when corepower drains out
      console.log('weapon closed');
      config.deathRayFireState = false ;
      config.weaponslot[2].weapon.alpha = 0 ;
      config.weaponslot[2].weapon.body.enable = false ;
      config.fireOnce = true ;
   },
   decreaseCorePowerIndicator: function(){
      game.time.events.repeat(1000,config.corepower/ 10,() => {
         config.corepower -=10 ;
         config.overloadLevel += 7 ;
      }, this) ;
   },
   showLevel: function(){
      lvltext = game.add.text(width/2, (height/2)-100,`DIFFICULTY: ${config.levels[config.currentLevel-1]}`,{fill: "white", font: "minecraft", fontSize: 40}) ;
      lvltext.anchor.setTo(0.5) ;
      lvltext.addColor('red', 12) ;
      lvltext.setShadow(0,5,'#000',10) ;
      lvltext.alpha = 0 ;
      var tween1 = game.add.tween(lvltext) ;
      // tween1.to({alpha:1}, 2000, Phaser.Easing.Quadratic.In,true,2000,0,false) ;
      // tween1.onComplete.add(function(){
      //    var tween2 = game.add.tween(lvltext) ;
      //    tween2.to({alpha: 0},2000,Phaser.Easing.Quadratic.Out,true,3000,0,false) ;
      //    tween2.onComplete.add(()=> {
      //       config.lvlChanged = false ;
      //    },this)
      // },this) ;
      
      tween1.to({alpha: 1,y: height/2},3000, Phaser.Easing.Exponential.InOut,true,0,0,true) ;
      tween1.onComplete.add(()=> {
         config.lvlChanged = false ;
      }, this) ;
      tween1.onStart.add(()=> {
         if(config.currentLevel > 1){
            sounds[0]._sound.playbackRate.value += 0.25 ;
         }
      },this)
   },
   playFireSound: function(){
      sounds[1].play() ;  // sound when weapon 1 or 2 fires
      if(config.currentWeapon === 2){
         config.corepower -= 0.2 ;
         config.overloadLevel += 0.5 ;
      }
      else{
         config.overloadLevel += 0.05 ;
      }
   },
   timerStop: function(){
      game.input.enabled = true ;
      sounds[0].play() ;
      this.startGame() ;
   },
   startGame: function(){
      this.showLevel() ; 
      console.log('Game Started') ;
      game.time.events.add(2000,this.initMeteors, this) ;
      game.time.events.repeat(config.lvlChangeTime,2,()=> {
         config.currentLevel++ ;
         config.lvlChanged = true ;
         this.showLevel() ;
      },this) ;
   },
   initMeteors: function(){
      if(config.lvlChanged){
         this.showLevel() ;
      }
      meteorLoop = game.time.events.loop(1500,this.createMeteors, this) ;
   },
   createMeteors: function(){
      if(config.currentLevel === 1){
         num_m_array = [4,2,1] ;
         num_em_array = [0,0,0] ;
      }
      else if(config.currentLevel === 2){
         num_m_array = [4,2,1] ;
         num_em_array = [2,2,0] ;
      }
      else if(config.currentLevel === 3){
         num_m_array = [5,2,2] ;
         num_em_array = [4,2,1] ;
      }

      if(!config.lvlChanged){

         if(config.currentLevel === 1){
            gravity = 0 ;
         }
         else if(config.currentLevel === 2){
            gravity = 1 ;
         }
         else{
            gravity = 3 ;
         }

         for(i=0;i<3;i++){
            for(j=0;j<num_m_array[i];j++){
               this.setMeteors(j,config.m_name[j]) ;
            }
            for(k=0;k<num_em_array[i];k++){
               this.setMeteors(k,config.em_name[k]) ;
            }
         }
         
      }
   },
   setMeteors: function(index, sprite_alias){
      if(game.rnd.integerInRange(0,1)){
         spinVelocity = game.rnd.integerInRange(-50,-10) ;
      }
      else{
         spinVelocity = game.rnd.integerInRange(10,50) ;
      }
      // exploding meteors
      if(j === 0){
         gravity += game.rnd.integerInRange(6,9) ;
      }
      else if( j === 1){
         gravity += game.rnd.integerInRange(3,5) ;
      }
      else if( j === 2 ){
         gravity += game.rnd.integerInRange(2,4) ;
      }

      if(index === 0){
         // xpos = game.rnd.integerInRange(50, width-20) ;
         xpos = 50 + game.rnd.integerInRange(0,width) ;
      }
      else if(index === 1){
         xpos = 100 + game.rnd.integerInRange(0, width) ;
         // xpos = Math.random() * ( width - 50 ) || 200 ;
      }
      else{
         xpos = 200 + game.rnd.integerInRange(0, width) ;
         // xpos = Math.random() * ( width - 100 ) || 400 ;
      }
      
      if(config.m_name.indexOf(sprite_alias) > -1){
         f_meteor = m_group[index].getFirstExists(false) ;
         if(f_meteor){
            f_meteor.frame = 0 ;
         }
      }
      else if(config.em_name.indexOf(sprite_alias) > -1){
         f_meteor = em_group[index].getFirstExists(false) ;
      }
      if(f_meteor){
         f_meteor.reset(xpos,-150) ;
         f_meteor.body.gravity.set(0,gravity) ;
         f_meteor.anchor.setTo(0.5) ;
         f_meteor.body.angularVelocity = spinVelocity ;
      }
   },
   onClick: function(){
      if(!game.paused){
         console.log('game is paused') ;
         pause.alpha = 0 ;
         resume.alpha = 1 ;
         game.paused = true ;
         pauseText.alpha = 1 ;
      }      
      else{
         console.log('game resumed') ;
         pause.alpha = 1 ;
         resume.alpha = 0 ;
         game.paused = false ;
         pauseText.alpha = 0 ;
      }
   },
   scoreIncrement: function(meteorType){
      switch(meteorType){
         case 'smmeteor' : {
            this.score += 30 ;
            break ;
         }
         case 'smallexploder' : {
            this.score += 20 ;
            break ;
         }
         case 'medmeteor' : {
            this.score += 50 ;
            break ;
         }
         case 'mediumexploder' : {
            this.score += 40 ;
            break ;
         }
         case 'lgmeteor' : {
            this.score += 100 ;
            break ;
         }
         case 'largeexploder' : {
            this.score += 80 ;
            break ;
         }
      }
   }
}
