/* @pjs preload="MEPNG-INV.png */
PImage kerk;
float t = 0;
void setup(){
  size(535,600);
  kerk = loadImage("MEPNG-INV.png");
  kerk.resize(456,684);
}

void draw(){
  
  background(#ffffff);
  
  float tiles =  noise(map(t, 0,1, 0,200))* 225;
  float tileSize =width/tiles; 
     t = t + 0.000007;
  
  fill(0);
  noStroke();
  
  for(int x = 0; x < tiles; x++){
    for(int y = 0; y < tiles; y++){
    color c = kerk.get(int(x * tileSize),int(y * tileSize));
    float b = map(brightness(c), 0,255,0,1);
    
    pushMatrix();
    translate(x * tileSize, y * tileSize);
    ellipse(0,0,tileSize*b,tileSize*b);
    popMatrix();
   }
  }
}
