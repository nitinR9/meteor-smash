let meteorSpace = {} ;
meteorSpace.state1 = function(){ // here 'play' is a state in this game

} ;

let centerX = 800/2, centerY = 580/2 , percent;

meteorSpace.state1.prototype = {
   create: function(){
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL ;
      game.stage.disableVisibilityChange = true ;
      game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL ;
      game.time.events.add(Phaser.Timer.SECOND * 2,changestate,this) ;
   }
} ;

function changestate(){
   game.state.start('state2') ;
}