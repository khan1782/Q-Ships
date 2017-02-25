function Ufo() = {
  this.move = function(width, height) { 
    this.x += dx;
    this.y += dy;
    if (this.x > width) {
      this.x = x - width;
    } else if (this.x < 0) {
      this.x = x + width;
    }
    if (this.y > height) {
      this.y = y - height;
    } else if (this.y < 0) {
      this.y = y + height;
    }
  }
}
