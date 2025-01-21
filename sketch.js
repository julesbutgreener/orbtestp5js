// Array to hold the nodes
let nodes = [];
let popupActive = false;
let popupX = 0, popupY = 0;
let popupOptions = ["Search Vector Database", "Drag and Drop Files", "Create Your Own"];
let selectedNode = null;

function setup() {
  createCanvas(800, 600);
  
  // Generate some initial nodes
  for (let i = 0; i < 10; i++) {
    nodes.push(new Node(random(width), random(height)));
  }
}

function draw() {
  background(20); // Dark background for glowing effect
  
  // Display and update each node
  for (let node of nodes) {
    node.update();
    node.display();
  }
  
  // Draw popup menu if active
  if (popupActive) {
    drawPopupMenu();
  }
}

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 30;
    this.glowIntensity = random(100, 255); // Initial glow
  }

  update() {
    // Make the node "pulse" by changing its glow intensity
    this.glowIntensity = 150 + 50 * sin(frameCount * 0.05);
    
    // Allow dragging nodes
    if (mouseIsPressed && dist(mouseX, mouseY, this.x, this.y) < this.radius) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }

  display() {
    // Draw the glowing node
    noStroke();
    fill(255, 150, 0, this.glowIntensity); // Orange glow
    ellipse(this.x, this.y, this.radius * 2);
    
    // Draw the central solid circle
    fill(255, 200, 50);
    ellipse(this.x, this.y, this.radius);
  }
}

function mousePressed() {
  // Create a new node on click (if not interacting with popup)
  if (!popupActive) {
    nodes.push(new Node(mouseX, mouseY));
  } else {
    popupActive = false; // Close popup if clicking elsewhere
  }
}

function doubleClicked() {
  // Check if double-clicked on a node
  for (let node of nodes) {
    if (dist(mouseX, mouseY, node.x, node.y) < node.radius) {
      popupActive = true;
      popupX = mouseX;
      popupY = mouseY;
      selectedNode = node;
      return;
    }
  }
  popupActive = false; // Close popup if not double-clicking a node
}

function drawPopupMenu() {
  fill(50);
  stroke(255);
  rect(popupX, popupY, 180, popupOptions.length * 30 + 10, 5);
  
  // Draw each option
  for (let i = 0; i < popupOptions.length; i++) {
    fill(200);
    textAlign(LEFT, CENTER);
    textSize(14);
    text(popupOptions[i], popupX + 10, popupY + i * 30 + 20);
  }
}

function mouseReleased() {
  // Check if clicking an option in the popup menu
  if (popupActive) {
    for (let i = 0; i < popupOptions.length; i++) {
      let optionX = popupX;
      let optionY = popupY + i * 30;
      if (mouseX > optionX && mouseX < optionX + 180 && mouseY > optionY && mouseY < optionY + 30) {
        executePopupAction(i);
        popupActive = false;
        return;
      }
    }
  }
}

function executePopupAction(optionIndex) {
  switch (optionIndex) {
    case 0:
      console.log("Search Vector Database selected for node:", selectedNode);
      break;
    case 1:
      console.log("Drag and Drop Files selected for node:", selectedNode);
      break;
    case 2:
      console.log("Create Your Own selected for node:", selectedNode);
      break;
  }
}

