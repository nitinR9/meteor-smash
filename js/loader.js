
meteorspace.state2 = function(){
   this.ready = false ;
} ;

meteorspace.state2.prototype = {
   preload: function(){
      
      game.load.audio('menumusic', 'assets/audio/Brave Pilots (Menu Screen).mp3') ;
      game.load.audio('backmusic', 'assets/audio/background music.mp3') ;
      game.load.audio('explodesoundsm', 'assets/audio/smallexplosion.mp3') ;
      game.load.audio('explodesoundmed', 'assets/audio/mediumexplosion.mp3') ;
      game.load.audio('explodesoundlg', 'assets/audio/largeexplosion.mp3') ;
      game.load.audio('click', 'assets/audio/entersound.mp3') ;
      game.load.audio('firesound', 'assets/audio/laser1.mp3') ;
      game.load.audio('deathraysound', 'assets/audio/Laser_Cannon.mp3') ;
      game.load.audio('levelsound','assets/audio/level1.ogg') ;
      game.load.audio('emptylaser', 'assets/audio/DryGunFire.mp3') ;
      game.load.audio('recharge', 'assets/audio/rechargesound.mp3') ;
      game.load.audio('healsound', 'assets/audio/life_pickup.mp3') ;
      game.load.audio('laserabsorb', 'assets/audio/bulletabsorb.mp3') ;
      game.load.audio('powerupsound', 'assets/audio/powerUp2.mp3') ;
      game.load.audio('powerdownsound', 'assets/audio/powerUp3.mp3') ;
      game.load.audio('gameover', 'assets/audio/Defeated (Game Over Tune).mp3') ;
      game.load.audio('redalert', 'assets/audio/tas_red_alert.mp3') ;

      
      
      game.load.image('spacebg', 'assets/img/other/background/space.jpg') ;
      game.load.image('gamebg', 'assets/img/other/background/gamebg.jpg') ;
      game.load.image('player', 'assets/img/other/player/spaceship.png') ;
      game.load.image('smmeteor', 'assets/img/meteors/meteorsmall.png') ;
      game.load.image('collidebar', 'assets/img/other/textures/collidebar.png') ;
      game.load.spritesheet('lasers', 'assets/img/weapons/beamscropped.png', 92.5, 48) ;
      game.load.spritesheet('power', 'assets/img/weapons/gatherpower.png', 64,64) ;
      game.load.spritesheet('weaponselect', 'assets/img/scoreboard/weaponspritesheet.png',64,64) ;
      game.load.image('skeleton', 'assets/img/scoreboard/scoreboard.png') ;
      game.load.spritesheet('overloadlvl', 'assets/img/scoreboard/overloadlevelsheet.png',86,19) ;
      game.load.spritesheet('corehp', 'assets/img/scoreboard/corepowersheet.png',134,24) ;
      game.load.spritesheet('playerhp', 'assets/img/scoreboard/healthspritesheet.png',192,29) ;
      game.load.spritesheet('deathray', 'assets/img/weapons/texture_laser.png',100,590) ;

      game.load.spritesheet('arrow', 'assets/img/other/textures/selectarrow.png', 32,32) ;
      game.load.spritesheet('starter', 'assets/img/other/textures/321start.png', 64,64) ;
      game.load.spritesheet('medmeteor', 'assets/img/meteors/meteormedium.png', 128,128) ;
      game.load.spritesheet('lgmeteor', 'assets/img/meteors/meteorlarge.png', 256,256) ;
      game.load.spritesheet('smallexploder', 'assets/img/meteors/meteor64x64sheet.png', 64,64) ;
      game.load.spritesheet('mediumexploder', 'assets/img/meteors/meteor128x128sheet.png', 128,128) ;
      game.load.spritesheet('largeexploder', 'assets/img/meteors/meteor256x256sheet.png', 256,256) ;
      game.load.spritesheet('power_cores','assets/img/other/player/poweupball.png',21,21) ;
      game.load.spritesheet('explosion2', 'assets/img/other/textures/explosion_sheet.png',32,30) ;


      // gui icons
      game.load.image('resume', 'assets/img/buttons/white_play.png') ;
      game.load.image('menu', 'assets/img/buttons/white_home.png') ;
      game.load.image('restart', 'assets/img/buttons/white_restart.png') ;
      game.load.image('musicon', 'assets/img/buttons/white_musicOn.png') ;
      game.load.image('musicoff', 'assets/img/buttons/white_musicOff.png') ;
      game.load.image('options', 'assets/img/buttons/white_config.png') ;
      game.load.image('pause', 'assets/img/buttons/white_pause.png') ;
      
      game.load.onLoadStart.add(()=>{
         var frame = game.add.image(centerX,centerY,'frame') ;
         frame.anchor.setTo(0.5) ;
         var text = game.add.text(centerX-frame.width/2,centerY-frame.height-5,'LOADING',{font: 'webpixelbitmap', fontSize: 25, fill: 'white'}) ;
         text.addColor('orange', 4) ;
      },this) ;
      game.load.onLoadComplete.add(this.loadComplete, this) ;
      var loader = game.add.sprite(centerX,centerY,'loadbar') ;
      loader.x -= loader.width/2 ;
      loader.y -= loader.height/2 ;
      game.load.setPreloadSprite(loader)
   },
   loadComplete: function(){
      this.ready = true ;
   },
   update: function(){
      if(this.ready && game.cache.isSoundDecoded('menumusic') && game.cache.isSoundDecoded('explodesoundsm') && game.cache.isSoundDecoded('explodesoundlg') && game.cache.isSoundDecoded('explodesoundmed') && game.cache.isSoundDecoded('firesound') && game.cache.isSoundDecoded('deathraysound') && game.cache.isSoundDecoded('backmusic') && game.cache.isSoundDecoded('emptylaser') && game.cache.isSoundDecoded('recharge') && game.cache.isSoundDecoded('healsound') && game.cache.isSoundDecoded('laserabsorb') && game.cache.isSoundDecoded('powerupsound') && game.cache.isSoundDecoded('powerdownsound') && game.cache.isSoundDecoded('redalert')){
         game.time.events.add(Phaser.Timer.SECOND, function(){
            game.state.start('state3') ;
         },this) ;
      }
   }
}