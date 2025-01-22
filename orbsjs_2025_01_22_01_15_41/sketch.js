// Array to hold the nodes
let nodes = [];
let textBox;
let metadataTags = ["Taksim", "Deleuze"];
let metadataCounts = {};
let keywordsOnCanvas = [];
let selectedNode = null;


function setup() {
  createCanvas(800, 600);

  // Initialise metadata counts for keywords
  for (let tag of metadataTags) {
    metadataCounts[tag] = 0;
  }

  // Generate some initial nodes
  for (let i = 0; i < 10; i++) {
    nodes.push(new Node(random(width), random(height)));
  }

  // Create a textarea (hidden by default)
  textBox = createElement('textarea', '');
  textBox.position(10, height + 10); // Start off-screen
  textBox.size(200, 50); // Size of the textarea
  textBox.hide(); // Hide it until needed
}

function draw() {
  background(20); // Dark background for glowing effect

  // Display and update each node
  for (let node of nodes) {
    node.update();
    node.display();
  }

  // Display keywords in the corner
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  for (let i = 0; i < keywordsOnCanvas.length; i++) {
    text(keywordsOnCanvas[i], 10, 10 + i * 20);
  }
}

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 30;
    this.glowIntensity = random(100, 255); // Initial glow
    this.tags = []; // Tags for metadata
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

    // Display metadata tags
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    for (let i = 0; i < this.tags.length; i++) {
      text(this.tags[i], this.x, this.y + (i + 1) * 15);
    }
  }
}

function mousePressed() {
  // Check if clicking a node
  for (let node of nodes) {
    if (dist(mouseX, mouseY, node.x, node.y) < node.radius) {
      selectedNode = node;

      // Position and show the textarea
      textBox.position(mouseX, mouseY + 20);
      textBox.show();
      textBox.value(''); // Clear previous input
      textBox.elt.focus(); // Focus on the textarea
      return;
    }
  }
}
function keyPressed() {
  if (keyCode === ENTER && textBox.elt.style.display !== "none") {
    // Get the text from the input field when Enter is pressed
    let input = textBox.value();
    processInput(input); // Process the entered text for metadata tags
    textBox.hide(); // Hide the textbox
    selectedNode = null; // Deselect the node
  }
}

function processInput(inputText) {
  let words = inputText.trim().split(/\s+/); // Split the text by spaces or newlines

  // Check each word against metadata tags
  for (let word of words) {
    word = word.toLowerCase(); // Case-insensitive comparison
    for (let tag of metadataTags) {
      if (word === tag.toLowerCase()) {
        metadataCounts[tag]++;

        console.log(`Keyword "${tag}" entered. Count: ${metadataCounts[tag]}`);

        // If the count reaches 3 and it's not already on the canvas
        if (metadataCounts[tag] === 3 && !keywordsOnCanvas.includes(tag)) {
          keywordsOnCanvas.push(tag); // Add the keyword to the canvas
          console.log(`Keyword "${tag}" added to canvas.`);
        }
      }
    }
  }
}

