
meteorspace.state3 = function(){} ;

var title, subtitle, p2s, bgmusic, clicksound, flicker, playButton, musicButton, highScoreDisplay, musicOn, arrow, arrowTween;

meteorspace.state3.prototype = {
   create: function(){
      this.score
      game.add.image(0,0, 'spacebg') ;
      musicOn = (game.sound.volume) ? true : false ;
      
      arrow = game.add.sprite(0,0, 'arrow') ;
      arrow.anchor.setTo(0.5) ;
      arrow.scale.setTo(0.8) ;
      arrow.visible = false ;
      arrow.animations.add('selector') ;
      arrow.animations.play('selector', 20, true) ;
      
      clicksound = game.add.audio('click', 1, false) ;
      
      title = game.add.text(centerX, -100, 'METEOR SMASH', {font: '80px minecraft', fill: '#fff'}) ;
      title.anchor.setTo(0.5) ;
      title.addColor('#c20', 6) ;
      title.setShadow(0, 10,'#000', 10) ;
      game.add.tween(title).to({y : centerY -80}, 2000,Phaser.Easing.Bounce.Out, true,0, 0,false) ;
      
      subtitle = game.add.text(centerX,centerY, 'A SPACE ARCADE GAME', {font: '50px webpixelbitmap', fill: '#0bf'}) ;
      subtitle.anchor.setTo(0.5) ;
      subtitle.setShadow(0,10, '#000', 5) ;
      subtitle.alpha = 0 ;
      var subtitleTween  = game.add.tween(subtitle).to({alpha: 1}, 4000, Phaser.Easing.Exponential.In, true, 0, 0, false) ;
      
      
      p2s = game.add.text(centerX,centerY+170, 'PRESS ANY KEY TO START', {font: '45px webpixelbitmap', fill: '#fff'}) ;
      p2s.anchor.setTo(0.5) ;
      p2s.alpha = 0 ;
      
      flicker = game.add.tween(p2s).to({alpha: 1}, 1000, Phaser.Easing.Sinusoidal.InOut, true,4000, -1) ;
      flicker.yoyo(true,1500) ;
      subtitleTween.onComplete.add(bothTweensCompleted, this) ;  
      bgmusic = game.add.audio('menumusic',0.5,true);
      bgmusic.play() ;
   }
}

function bothTweensCompleted(){
   game.input.keyboard.onPressCallback = function(e){
      clicksound.play() ;
      this.game.input.keyboard.onPressCallback = null ;
      this.game.add.tween(title).to({y: centerY-100}, 2000,Phaser.Easing.Linear.In, true, 0, 0, false) ;
      this.game.add.tween(subtitle).to({y: centerY-25}, 2000,Phaser.Easing.Linear.In, true, 0, 0, false) ;
      this.game.tweens.remove(flicker) ;
      p2s.kill() ;
      this.game.input.keyboard.onPressCallback = null ;
      createMenu() 
   }  
}

function createMenu(){
   playButton = game.add.text(centerX, centerY+60, 'PLAY', {font: '40px arcade', fill: '#fff'}) ;
   playButton.anchor.setTo(0.5) ;
   playButton.alpha = 0 ;
   
   playButton.events.onInputOver.add(hover,this) ;
   playButton.events.onInputOut.add(out,this) ;
   playButton.events.onInputUp.add(playClick, this) ;
   playButton.fill = 'rgb(255,190,50)'
   
   game.add.tween(playButton).to({alpha: 1}, 2000, Phaser.Easing.Linear.In, true, 2000, 0, false) ;
   
   musicButton = game.add.text(centerX, centerY+120, `MUSIC : ${(musicOn)? 'ON' : 'OFF'}`, {font: '40px arcade', fill: '#fff'}) ;
   musicButton.anchor.setTo(0.5) ;
   musicButton.alpha = 0 ;
   musicButton.fill = 'rgb(255,190,50)'
   
   game.add.tween(musicButton).to({alpha: 1}, 2000, Phaser.Easing.Linear.In, true, 3000, 0, false) ;
   musicButton.events.onInputOver.add(hover,this) ;
   musicButton.events.onInputOut.add(out,this) ;
   musicButton.events.onInputUp.add(musicToggle,this) ;
   
   highScoreDisplay = game.add.text(centerX, centerY+180, `HIGH SCORE: ${parseInt(sessionStorage.getItem('highscore'))}`, {font: '40px arcade', fill: '#fff'}) ;
   highScoreDisplay.anchor.setTo(0.5) ;
   highScoreDisplay.alpha = 0 ;
   game.add.tween(highScoreDisplay).to({alpha: 1}, 2000, Phaser.Easing.Linear.In, true, 4000, 0, false) ;
   
   game.time.events.add(6000, function(){
      playButton.inputEnabled = true ;
      musicButton.inputEnabled = true ;
   },this) ;
}

function hover(button){
   button.fill = 'rgb(234, 255, 0)' ;
   button.setShadow(0,5, '#000', 10) ;
   arrow.visible = true ;
   if(button.text === 'PLAY'){
      arrow.x = button.x - button.width + 20 ;
   }
   else{
      arrow.x = button.x - button.width + 50 ;
   }
   arrow.y = button.y ;
}

function out(button){
   button.fill = 'rgb(255,190,50)' ;
   button.setShadow(0,0, 'rgba(0,0,0,0)', 0) ;
   arrow.visible = false ;
}

function playClick(){
   bgmusic.stop() ;
   game.state.start('state4') ;
}

function musicToggle(button){
   clicksound.play() ;
   if(game.sound.volume){
      game.sound.volume = 0 ;
      button.text = 'MUSIC : Off' ;
   }
   else{
      game.sound.volume = 1 ;
      button.text = 'MUSIC : On' ;
   }
}

