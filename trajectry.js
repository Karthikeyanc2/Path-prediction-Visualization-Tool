let v = 0;
let theta = 0;
let timestep = 0.05;

function setup() {
  ca = createCanvas(windowWidth, windowHeight);
  ca.position(0, 0)
  ca.style("z-index: -1");
  textSize(20);
  noStroke();
  fill(255);
  acceleration = createSlider(0, 200, 100);
  acceleration.position(20, 20);
  steeringangle = createSlider(-60, 60, 0);
  steeringangle.position(20, 50);
  headingangle = createSlider(0, 180, 90);
  headingangle.position(20, 80);
  initialvelocity = createSlider(0, 500, 250);
  initialvelocity.position(20, 110);
  calculation_time = createSlider(0, 50, 25);
  calculation_time.position(20, 140);
  vehicle = new Vehicle(0, 0, steeringangle.value() * PI / 180, headingangle.value() * PI / 180, acceleration.value(), initialvelocity.value())
  trajectry = new Trajectry(calculation_time.value() / 10)
  acceleration.input(update_traj);
  steeringangle.input(update_traj);
  headingangle.input(update_traj);
  initialvelocity.input(update_traj);
  calculation_time.input(update_traj);
  trajectry.construct(vehicle, calculation_time.value() / 10);
}

function draw() {
  background(0);
  noStroke();
  text('Acceleration    : ' + str(acceleration.value() / 100) + ' g', acceleration.x * 2 + acceleration.width, acceleration.y + 18);
  text('Steeringangle  : ' + str(steeringangle.value()) + ' degrees', steeringangle.x * 2 + steeringangle.width, steeringangle.y + 18);
  text('Headingangle  : ' + str(headingangle.value()) + ' degrees', headingangle.x * 2 + headingangle.width, headingangle.y + 18);
  text('Inditial Velocity: ' + str(initialvelocity.value() / 10) + ' km/hr', initialvelocity.x * 2 + initialvelocity.width, initialvelocity.y + 18);
  text('Calculation time : ' + str(calculation_time.value() / 10) + ' s', calculation_time.x * 2 + calculation_time.width, calculation_time.y + 18);
  vehicle.update(steeringangle.value() * PI / 180, headingangle.value() * PI / 180, acceleration.value(), initialvelocity.value());
  trajectry.show();
  vehicle.show();
}

class Trajectry {
  constructor(calc_time) {
    this.x_points = [];
    this.y_points = [];
    this.calc_time = calc_time;
  }
  construct(vehicle, calc_time) {
    this.x_points = [0];
    this.y_points = [0];
    this.calc_time = calc_time;
    v = vehicle.vel;
    theta = vehicle.heading;
    for (let t = 0; t <= this.calc_time; t += timestep) {
      v += vehicle.acc * timestep;
      this.x_points.push(this.x_points[this.x_points.length - 1] + v * timestep * cos(theta + vehicle.steering));
      this.y_points.push(this.y_points[this.y_points.length - 1] + v * timestep * sin(theta + vehicle.steering));
      theta += timestep * v * sin(vehicle.steering) / vehicle.length
    }
  }
  show() {
    translate(windowWidth / 2, windowHeight / 2);
    scale(1, -1)
    fill(255)
    stroke(255)
    for (let i = 0; i < this.x_points.length; i++) {
      line(-this.x_points[i], this.y_points[i], -this.x_points[i + 1], this.y_points[i + 1])
      point(-this.x_points[i], this.y_points[i])
    }
  }
}

class Vehicle {
  constructor(x, y, steering, heading, acc, vel) {
    this.x = x;
    this.y = y;
    this.heading = heading;
    this.steering = steering;
    this.vel = vel;
    this.acc = acc;
    this.length = 100;
  }
  update(steering, heading, acc, vel) {
    this.heading = heading;
    this.steering = steering;
    this.acc = acc;
    this.vel = vel;
  }
  show() {
    //translate(windowWidth / 2, windowHeight / 2);
    //scale(1, -1);
    noStroke();
    translate(this.x, this.y);
    rotate(-this.heading + PI);
    fill(255)
    rect(-this.length, -5, this.length, 10)
    fill(255, 0, 0)
    rect(-this.length - 25, -7.5, 50, 15)
    rotate(-this.steering);
    rect(-25, -7.5, 50, 15)
    fill(255)

  }
}

function update_traj() {
  trajectry.construct(vehicle, calculation_time.value() / 10);
}