var meteorspace = {} ;
meteorspace.state1 = function(){} ;
var highScore = 0 ;
var loadimg, progressbar, percentage, loadcontainer, centerX, centerY ;
meteorspace.state1.prototype = {
   preload: function(){
      game.load.image('loadbar', 'assets/img/other/textures/loadingbar.png') ;
      game.load.image('frame', 'assets/img/other/textures/loadbaroutline.png') ;
   },
   create: function(){
      centerX = game.world.centerX ;
      centerY = game.world.centerY ;
      game.time.advancedTiming = true ;
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL ;
      game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL ;
      game.time.events.add(Phaser.Timer.SECOND * 5,this.changestate,this) ;
      game.stage.disableVisibilityChange = true ;
      sessionStorage.setItem('score', '0') ;
      sessionStorage.setItem('highscore', '0') ;
   },
   changestate: function(){
      game.state.start('state2') ;
   }
}
