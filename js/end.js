

meteorSpace.state5 = function(){ // here 'play' is a state in this game

} ;

let menuButton , restartButton, saveButton, button1Text, button2Text, button3Text ;


meteorSpace.state5.prototype = {
    create: function(){
        game.stage.backgroundColor = '	#000000' ;
        menuButton = game.add.button(centerX-100, centerY, 'menu', gotoStart, this) ;
        menuButton.anchor.set(0.5,0.5) ;
        menuButton.scale.set(1.2) ;
        restartButton = game.add.button(centerX, centerY, 'restart', restartGame, this) ;
        restartButton.anchor.set(0.5, 0.5) ;
  
        button1Text = game.add.text(centerX-135, centerY + 40, 'StartScreen', { font: '10pt arial', fill: '#FFE800' } ) ;
        button2Text = game.add.text(centerX-40, centerY + 40, 'Restart Game', { font: '10pt arial', fill: '#FFE800' } ) ;
        
        
        menuButton.x = centerX - 50 ;
        restartButton.x = centerX + 50 ;
        button1Text.x = centerX - 85 ;
        button2Text.x = centerX + 10 ;
        
        alertText =  game.add.text(centerX, centerY-50, 'Your Score is: '+ score, { font: '12pt consolad', fill: '#fff' } ) ;
        alertText.anchor.set(0.5,0.5) ;
        
        console.log('state4') ;
        
    } ,
    update: function(){}
} ;

function gotoStart(){
    score = 0 ;
    game.state.start('state3') ;
}

function restartGame(){
    score = 0 ;
    game.state.start('state4') ;
}


