
var mems = [];
var rels = [];
let scl = 50;
let dx = 5;
var selected;
var birthday = new Date(1995, 11, 17);
var fontSize = 10;
function setup() {
  var cnv = createCanvas(1080, 780);
  var x = 0; // 400
  var y = 0; //50
  cnv.position(x, y);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  mems.push(new Member(100,200))
  mems[0].addPhoto("person1.jpeg");
  mems[0].addName("Barbra");
  mems[0].addBirthDate(birthday);
  
  
  mems.push(new Member(300,350))
  mems.push(new Member(300,550))
  mems.push(new Member(100,550))
  // rels.push(new Relation(mems[0], mems[1]))
  rels.push(new Relation(mems[0], mems[3]))
  rels.push(new Relation(mems[1], mems[2]))
}

function draw() {
  background(155);
  strokeCap(SQUARE);
  for(var i = 0; i < rels.length; i++){
    rels[i].show();
  }

  for(var i = 0; i < mems.length; i++){
    mems[i].show();
  }


  
}


function mousePressed() {
  for(var i = 0; i < mems.length; i++){
    if(mouseX > mems[i].x && mouseX < mems[i].x + mems[i].w && mouseY > mems[i].y && mouseY < mems[i].y + mems[i].h){
      console.log("mem " + i + " selected");
      selected = mems[i];
    }
  }
  for(var i = 0; i < rels.length; i++){
    if(
      mouseX > rels[i].mem1.x + rels[i].xOff - dx &&
      mouseX < rels[i].mem1.x + rels[i].xOff + dx &&
      mouseY > rels[i].mem1.y && mouseY < rels[i].mem2.y ||
      mouseY > rels[i].mem1.y + rels[i].yOff - dx &&
      mouseY < rels[i].mem1.y + rels[i].yOff + dx &&
      mouseX > rels[i].mem1.x && mouseX < rels[i].mem2.x
    ){
      console.log(mouseX,mouseY);
      console.log("rels " + i + " selected");
      selected = rels[i];
    }
  }
}
function mouseReleased() {
  selected = null;
}
function mouseDragged(){
  if(selected != null){
    if(selected.constructor.name == "Member"){
      selected.setPos(
        floor(mouseX / scl) * scl,
        floor(mouseY / scl) * scl
      );
    }
    if(selected.constructor.name == "Relation"){
      selected.setOff(
        floor(mouseX / scl) * scl - selected.mem1.x,
        floor(mouseY / scl) * scl - selected.mem1.y
      );
    }
  }

}

class Member{
  constructor(x, y){
    this.setPos(x,y);
    this.w = 150;
    this.h = 250;
    this.r = 10
    this.move = false;
    this.photo = loadImage("person0.jpeg");
  }
  
  addPhoto(path){
    this.photo = loadImage(path);
  }
  addName(name){
    this.name = name;
  }
  addBirthDate(birthdate){
    this.birthDate = birthdate;
  }

  show(){
    if(this == selected){
      stroke(0,0,255);
      strokeWeight(2);
    }else{
      noStroke();
    }
    rect(this.x,this.y, this.w, this. h, this.r);
    image(this.photo, this.x ,this.y - 50, 100,100);
    if(this.name){
      text(this.name, this.x,this.y + scl)
    }if(this.birthDate){
      text(parseDate(this.birthDate), this.x,this.y + scl + fontSize);
    }
  }

  setPos(x,y){
    this.x = x;
    this.y = y;
  }

}

class Relation{

  constructor(mem1, mem2){
    this.mem1 = mem1;
    this.mem2 = mem2;
    this.xOff =  0;
    this.yOff = 0;
    this.midOff = 0;
  }
  setOff(x, y){
    this.xOff = x;
    this.yOff = y;
  }
  show(){
    stroke(0);
    strokeWeight(20);
    strokeCap(ROUND);
    var x1 = this.mem1.x;
    var x2 = this.mem2.x;
    var y1 = this.mem1.y;
    var y2 = this.mem2.y;
    var xLen = abs(x1 - x2)
    var yLen = abs(y1 - y2)
    if(x1 == x2){
      if(this.xOff == 0){
        line(x1, y1,x2, y2);
      }
      else if(this.xOff != 0){
        //console.log("here");
        line( x1, y1, x1 + this.xOff, y1 );
        line( x1 + this.xOff, y1, x2 + this.xOff, y2 );
        line( x2 + this.xOff, y2, x2, y2 );
      }
            
    }
    else if(y1 == y2){
      if(this.yOff == 0){
        line( x1, y1,x2, y2);
      }
      else if(this.yOff != 0){
        //console.log("here");
        line( x1, y1, x1, y1 + this.yOff );
        line( x1, y1 + this.yOff, x2, y2 + this.yOff );
        line( x2, y2 + this.yOff, x2, y2 );
      }
    }
    
    else if(xLen > yLen){
      var midX = x1/ 2 + x2 / 2;
      line(x1, y1 , midX, y1);
      line(midX, y1, midX, y2);
      line(midX, y2, x2, y2); 
      
    }else{
      var midY = y1/ 2 + y2 / 2;
      line(x1, y1 , x1, midY);
      line(x1, midY, x2, midY);
      line(x2, midY, x2, y2);
    }
  }
}

function parseDate(date){
  //check js date reference for function info
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
  return (date.getMonth() + 1)+"/"+date.getDate()+"/"+date.getFullYear()
}
