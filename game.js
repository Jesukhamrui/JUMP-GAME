var can= document.getElementById("can").getContext("2d");
var surface = document.getElementById("surface");
var Rpb = document.getElementById("Replay");

frameCount=0;
var WIDTH = 1000;
var HEIGHT = 500;
var player;
var EnemyList = {};
var click = 0;
var enabled = true;
var GameOver = false;
var Score =0;
var PlayGame = false;

var Img= {};
Img.player = new Image();
Img.player.src = "IMG/player.png";
Img.chicken = new Image();
Img.chicken.src = "IMG/chicken.png";
Img.dog = new Image();
Img.dog.src = "IMG/dog.png";
Img.cat = new Image();
Img.cat.src = "IMG/cat.png";
Img.pig = new Image();
Img.pig.src = "IMG/pig.png";

Jump= new Audio("Audio/Jump.mp3");
Run= new Audio("Audio/running.mp3");
song= new Audio("Audio/song.mp3");
No= new Audio("Audio/No.mp3");



function pause(){
	surface.style.animationPlayState = "paused";
} 

function play(){
	surface.style.animationPlayState = "running";
	song.play();
	song.loop=true;
	song.volume = 0.1;
} 

function PlayG(){
   var button = document.getElementById("Playbutton");
   button.remove(); 
   
   
   play();
   PlayGame = true;
}

function ReplayButtonH(){
  Rpb.style.visibility = "hidden";
  Rpb.disabled = true;
}


function ReplayButton(){
  Rpb.style.visibility = "visible";
  Rpb.disabled = false;
}

CreatePlayer = function (){
  player = {
    x:100,
	y:430,
	width:80,
	height:120,
	type:"player",
	img: Img.player,
	MoveCount: 0,
  };
}

Enemy= function(id,spdX) {
  var enemy={
	x:950,
	y:460,
	spdX:spdX,
	width:40,
	height:50,
	id:id,
	type:"Enemy",
	img: Img.chicken,
	MoveCount: 0,
	};
EnemyList[id] = enemy;
}


collidesornot = function(entity1,entity2){
     if (entity2.x > 70 && entity2.x < 130 && entity1.y >= 415 ){
	    return true;
	 }
}



UpdateEntity = function(entity){
   
   if (entity.type=="Enemy"){
      entity.x -=entity.spdX;
   
      if (entity.x < 0){
	    change(entity);
        entity.x = 950;
		Score++;
      }
	  
	  if (frameCount%150==0){
	    entity.spdX+=2;
	  }
	  
	  entity.MoveCount +=0.3;
	  Display(entity);
   }
   
   
   
   if (entity.type == "player"){
   
   if (click == 1){
   
        player.y += 0;
		click = 2;
		
	}else if (frameCount%1==0 && click==2) {
	    player.y -= 70;
		click = 3;
	
	}else if (frameCount%2==0 && click==3) {
		click = 4;
		
	}else if (frameCount%3==0 && click==4) {
	    player.y += 0;
		click = 5;
		
	}else if (frameCount%5==0 && click==5) {
	    player.y +=70;
		click = 0;
		enabled = true;
	}
	
	entity.MoveCount +=0.5;
	Display(entity);

   }
    
}

Display = function(entity){
   can.save();
   var x =entity.x-entity.width/2;
   var y =entity.y-entity.height/2;
   
   var frameWidth = entity.img.width/4;
   var frameHeight = entity.img.height;
   
   var walkingmod = Math.floor(entity.MoveCount)%4;
 
   can.drawImage(entity.img,
	    walkingmod*frameWidth,0*frameHeight,frameWidth, frameHeight,
		x,y, entity.width,entity.height
	);
	
   can.restore();
}


Movement= function(){   
   if (enabled==true && screen.width < 1200){
      click = 1;
	  enabled = false;
	  Jump.play();
	}
}

document.onkeydown = function(event){
	
   if (event.keyCode ===32){
	if (enabled==true && screen.width > 1200){
      click = 1;
	  enabled = false;
	  Jump.play();
	}
   }
}

document.onclick = function(mouse) {  
   
   if (enabled==true && screen.width > 1200){
      click = 1;
	  enabled = false;
	  Jump.play();
	}
}

Replay = function(){
  GameOver = false;
  
  for (var i in EnemyList){
	delete(EnemyList[i]);
   }
   
   ReplayButtonH();
   restart();
	
}

update= function(){
     
	 if (PlayGame == false){
	    pause();
		Display(player);
	    return; 
	 }
	 
	 if (GameOver == true){

		pause();
		ReplayButton();
		can.fillStyle = "red";
		can.font = "100px 'Stylish', sans-serif";
		can.fillText("GAME OVER",240,200);
		return;
	}
	
    can.clearRect(0,0,WIDTH,HEIGHT);
	frameCount++;
	

	UpdateEntity(player);
	
	for (var i in EnemyList) {
       UpdateEntity(EnemyList[i]);
	   
	   var isColliding = collidesornot(player,EnemyList[i]);
	   
	   if (isColliding){
	      GameOver = true;
		  No.play();
	   }
	      
	} 
	can.font = "50px 'Stylish', sans-serif";
    can.fillStyle = "white";
	can.fillText("Score: "+Score,420,50);
}


randomlyGenerateEnemy = function(){
    var id= Math.random();
	var spdX = 30;
	Enemy(id,spdX);
}

change = function(entity){
    var ChangeNum = Math.floor(Math.random()*5);

	if (ChangeNum == 0){
	   entity.img = Img.dog;
	
	}else if (ChangeNum == 1){
	   entity.img = Img.cat;
	
	}else if (ChangeNum == 2){
	   entity.img = Img.chicken
	
	}else if (ChangeNum == 3){
	   entity.img = Img.pig;
	}
}

restart = function(){
  play();
  Score = 0;
  randomlyGenerateEnemy();
  frameCount =0;
}

ReplayButtonH();
randomlyGenerateEnemy();
CreatePlayer();
setInterval(update,40);
