var db, dbref;
var dog, dogImage1, dogImage2;
var FoodStock, foodS;
var fedTime,lastFed;
var feed,addFood;
var foodObj;

function preload()
{
  //loading Images of the dog
  dogImage1 = loadImage("images/dogImg.png");
  dogImage2 = loadImage("images/dogImg1.png");
}


function setup() {
  createCanvas(1000, 500);
  
  //connecting to database and creating an instance
  db = firebase.database();
  dbref = db.ref;

  foodObj = new Food();

  //reading value of "Food"
  FoodStock = db.ref("Food")
  FoodStock.on("value", readStock);

  //creating sprite for dog and adding image
  dog = createSprite(width/2+200, height/2+50, 20, 20);
  dog.addImage(dogImage1)
  dog.scale = 0.2;

  feed=createButton("Feed the Dog");
  feed.position(width/2+100, 50);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(width/2+200,50);
  addFood.mousePressed(addFoods);

}


function draw() {  
  background(46, 139, 87);

  foodObj.display();
  fedTime=db.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(20);
  textFont("Garamond")
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 750,35);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",750,35);
   }else{
     text("Last Feed : "+ lastFed + " AM", 750,35);
   }
 
   drawSprites();
}


function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function writeStock(a){
  //decreasing value of food
  if(a<=0 ){
    a = 0
  }
  else{
    a = a-1;
  }

  //updating value of food in the database
  db.ref("/").update({Food : a})
}


function feedDog(){
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  db.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
  dog.addImage(dogImage2);
}


//function to add food in stock
function addFoods(){
  foodS++;
  db.ref('/').update({
    Food:foodS
  })
}

