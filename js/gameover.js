meteorspace.state5 = function(){} ;

var goversound ;

meteorspace.state5.prototype = {
   create: function(){
      console.log('state5') ;
      
      sounds[11].stop() ;
      // resetting values
      config.currentLevel  = 1 ;
      config.corepower = 40 ;
      config.overloadLevel = 0.00 ;
      m_group = [] ;
      em_group = [] ;
      spinVelocity = 0 ;
      m_cores = [] ;
      explosions = [] ;
      sounds = [] ;
      config.deathRayFireState = false ;
      config.lightFireState = false ;
      config.lvlChanged = false ;
      config.fireOnce = true ;

      
      var score = parseInt(sessionStorage.getItem('score')) ;
      
      if(score > parseInt(sessionStorage.getItem('highscore')) ){
         sessionStorage.setItem('highscore', `${score}`) ;
      }
      
      var gover = game.add.text(centerX,centerY-150,'Game over', {font: 'minecraft', fontSize: 70, fill: 'white'}) ;
      gover.anchor.setTo(0.5) ;
      gover.setShadow(0,2,'#ff0',15) ;
      goversound = game.add.sound('gameover',1,true) ;
      goversound.play() ;
      
      var scoreText = game.add.text(centerX,centerY-50,`Your Score is ${score}`, {font: 'webpixelbitmap', fontSize: 50,fill: 'red'}) ;
      scoreText.anchor.setTo(0.5) ;
      scoreText.setShadow(0,0,'#fff', 5);
      scoreText.alpha = 0 ;
      game.add.tween(scoreText).to({alpha: 1}, 1000, Phaser.Easing.Quadratic.InOut,true,0,-1,true) ;
      
      var restart, mainmenu ;
      
      restart = game.add.button(centerX-50,centerY+50,'restart',this.restartGame,this) ;
      restart.anchor.setTo(0.5) ;
      restart.scale.setTo(0.7) ;
      
      mainmenu = game.add.button(centerX+50,centerY+50,'menu',this.gotoMainMenu,this) ;
      
      mainmenu.anchor.setTo(0.5) ;
      mainmenu.scale.setTo(0.7) ;
      
      game.add.text(centerX-50,centerY+110,'Restart',{font: 'webpixelbitmap', fontSize:25,fill: 'white'}).anchor.setTo(0.5) ;
      game.add.text(centerX+50,centerY+110,'Main Menu',{font: 'webpixelbitmap', fontSize:25,fill: 'white'}).anchor.setTo(0.5) ;
      
   },
   restartGame: function(){
      game.state.start('state4') ;
      goversound.stop() ;
   },
   gotoMainMenu: function(){
      game.state.start('state3') ;
      goversound.stop() ;
   }
}