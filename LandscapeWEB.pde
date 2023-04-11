int cols, rows;
int scl = 20;
int w = 1200;
int h = 1000;
float [][] terrain;
float flying;
PShader blur;

  void setup() {

  size(1800, 1000, P3D);
  flying = 0;
  cols = w/scl;
  rows = h/scl;
  terrain = new float [cols][rows];

  
}

void draw() {
  background(255);
  //stroke(120,100,255);
   stroke(255,255,255,50);
    stroke(0,0,0,255);
   strokeWeight(2);
  noFill();

flying -= 0.005;

float yoff = flying;
  for (int y = 0; y < rows; y++) {
    float xoff = 0;
    for (int x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff,yoff),0,1,-75,75);
      xoff += 0.1;  
  }
  yoff += 0.1;
  }


  translate(width/2, height/2);
  rotateX(PI/3);
  translate(-w/2, -h/2);
  for (int y = 0; y < rows -1; y++) {

    beginShape(TRIANGLE_STRIP);
    for (int x = 0; x < cols; x++) {
      vertex(x*scl, y*scl, terrain[x][y]);
      vertex(x*scl, (y+1)*scl,terrain[x][y+1]);

      //rect(x*scl,y*scl,scl,scl);
    }
    endShape();
  }
  //filter(blur);
}
