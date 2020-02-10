
let brainJSON;
let loadBrainFromFile = false;
let fps = 120;
let startLength = 4;
let showChart = true;


//-----------Game & App Size--------------
let gameWidth = 10;
let gameHeight = 10;
let cellSize = 3;

let appWidth;
let appHeight;

let chartHeight = 80;
//----------------------------------



//-------Grid of Snake Games--------
let gameCols = 25;
let gameRows = 15;
let paddings = 2;
let games = [];
//----------------------------------



//------Stats--------
let generation = 0;
let population = 0;
let alive = 0;

let lengthMax = 0;
let scoreMax = 0;
let currentScoreMax = 0;

let averageScore = 0
//----------------------------------



//------Game Style------------------
let gameBackgroundColor = '#222222';
let snakeColor = '#00AA00';
let foodColor = '#0055AA';
let backgroundColor = '#000000';
//----------------------------------



//Array with snakes sorted by scores form low to high
let bestSnake;

// Top 'n' snakes to pick up for next generation
let topCount = 1;

// Instance of best snake ever
let bestSnakeEver;

let mutationRate = 0.45;



let chart;

let runLearn = true;
let pauseLearn = false;

let runButton;
let pauseButton;
let stopButton;
let restartButton;
let longrestartButton;
let saveButton;
let loadButton;
let resetButton;



function setup() {

  let canvas = document.getElementById('canvas-holder');
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  appWidth = width;
  appHeight = height;
  let sketchCanvas = createCanvas(appWidth,appHeight);
  sketchCanvas.parent("canvas-holder");

  runButton = document.getElementById('run-button');
  runButton.addEventListener("click", run);

  pauseButton = document.getElementById('pause-button');
  pauseButton.addEventListener("click", pause);

  stopButton = document.getElementById('stop-button');
  stopButton.addEventListener("click", stopLearn);

  restartButton = document.getElementById('restart-button');
  restartButton.addEventListener("click",restart);

  longrestartButton = document.getElementById('long-restart-button');
  longrestartButton.addEventListener("click",restart);

  saveButton = document.getElementById('save-button');
  saveButton.addEventListener("click", saveBrain);

  resetButton = document.getElementById('reset-button');
  resetButton.addEventListener("click", resetBrain);


  //loadButton = document.getElementById('file-upload');
  //loadButton.addEventListener("onchange", loadBrain, this);

  //document.getElementById('field-w').addEventListener("input", onInputChange);

  inputs = document.getElementsByTagName('input');

  for(var i = 0; i < inputs.length; i++) {
    if(inputs[i].type!=="file"){
    inputs[i].addEventListener('input', onInputChange);
  }
  }


  runButton.parentElement.style.display = "none";
  resetButton.style.display = "none";
  longrestartButton.style.display = "none";


  frameRate(fps);

  init();
  windowResized();

}

function init(){
  //Initiallize stats
  gameCols = Number(document.getElementById('matrix-w').value);
  gameRows = Number(document.getElementById('matrix-h').value);
  gameWidth = Number(document.getElementById('field-w').value);
  gameHeight = Number(document.getElementById('field-h').value);
  cellSize = Number(document.getElementById('cell-size').value);

  fps = Number(document.getElementById('fps').value);

  startLength = Number(document.getElementById('start-length').value);
  mutationRate = Number(document.getElementById('mutation').value)/100;
  let chartResolution = Number(document.getElementById('chart-resolution').value);


  frameRate(fps)

  population = gameCols*gameRows;
  alive = population;
  lengthMax = startLength;
  scoreMax = 0;
  currentScoreMax = 0;
  generation = 0;
  averageScore = 0;

  bestSnakeEver = null;
  bestSnake = null;





  //Calculate app size
  if(!showChart){
    chartHeight=0
  }

  //appWidth = paddings+paddings*gameCols+gameCols*cellSize*gameWidth;
  //appHeight = paddings+paddings*gameRows+gameRows*cellSize*gameHeight+65+chartHeight;
  //createCanvas(appWidth, appHeight);

  //Create first generation
  createGeneration();

  //create Chart
  if(showChart){
    chart = new Chart(0, appHeight, appWidth, chartHeight, []);
    chart.resolution = chartResolution;
  }


}

function windowResized() {
  let canvas = document.getElementById('canvas-holder');
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  appWidth = width;
  appHeight = height;

  resizeCanvas(width, height);
  clear();
  redrawData();
  chart.y = appHeight;
  chart.update();

}


function draw() {
if(!pauseLearn){
  clear();
}


if(runLearn){





  //Update all games
  for(let i =0;i<gameCols;i++){
     for(let j =0;j<gameRows;j++){
       games[i][j].update();
     }
  }


  noStroke();
  fill("#131313");
  rect(0, appHeight-chartHeight-72, appWidth, appHeight+72);

  redrawData();

  //Update data
  updateData();

  if(showChart){
    chart.update();
   // chart.resolution = generation;
  }

}

}




function run(){
//  alert('run');
if(pauseLearn==false){
  if(runLearn==false){
  init();
}
}
  runLearn = true;
  pauseLearn = false
  runButton.parentElement.style.display = "none";
  pauseButton.parentElement.style.display = "block";
  stopButton.parentElement.style.display = "block";
  restartButton.parentElement.style.display = "block";
  longrestartButton.style.display = "none";

  longrestartButton.innerHTML = "Restart";
  longrestartButton.addEventListener('click', restart);

  runButton.classList.remove("primary");
  runButton.classList.add("secondary");
  loop();
}


function stopLearn(){
  runLearn = false;
  pauseLearn = false;
  if(pauseLearn){
    loop();
  }
  noLoop();
  clear();
  runButton.parentElement.style.display = "block";
  runButton.parentElement.children[1].innerHTML = "Start";

  longrestartButton.innerHTML = "Start";
  longrestartButton.addEventListener('click', run);

  pauseButton.parentElement.style.display = "none";
  stopButton.parentElement.style.display = "none";
  restartButton.parentElement.style.display = "none";
  runButton.classList.add("primary");
  runButton.classList.remove("secondary");
}

function pause(){
  runLearn = false;
  pauseLearn = true;
  noLoop();
  runButton.parentElement.style.display = "block";
  runButton.parentElement.children[1].innerHTML = "Resume";
  pauseButton.parentElement.style.display = "none";
  runButton.classList.add("primary");
  runButton.classList.remove("secondary");
}

function restart(){
//  alert('run');

  init();

  runLearn = true;
  pauseLearn = false
  loop();
  runButton.parentElement.style.display = "none";
  pauseButton.parentElement.style.display = "block";
  stopButton.parentElement.style.display = "block";
  restartButton.parentElement.style.display = "block";
  longrestartButton.style.display = "none";
}

function saveBrain(){
  saveJSON(bestSnakeEver.brain, 'Snake-'+bestSnakeEver.score+'.json');
}

function resetBrain(){
  stopLearn();
  brainJSON = null;
  if(runLearn){
    restart();
  }
  resetButton.style.display = "none";
}


function loadBrain(input) {
  console.log("1");
  let file = input.files[0];

  document.getElementById("file-upload").value = "";
  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {

    stopLearn();
    resetButton.style.display = "flex";

    //console.log(reader.result);
    brainJSON = reader.result;

    restart();





  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}

function onInputChange(){

  let hasError = false;
  inputs = document.getElementsByTagName('input');
  longrestartButton.style.display = "none";

  for(var i = 0; i < inputs.length; i++) {
    if(inputs[i].type!=="file"){
      inputs[i].classList.remove("invalid");
      if(Number(inputs[i].value) <1){
        inputs[i].classList.add("invalid");
        hasError = true;
      }
    }
  }

  let matrixW = Number(document.getElementById('matrix-w').value);
  let matrixH = Number(document.getElementById('matrix-h').value);
  let fieldW = Number(document.getElementById('field-w').value);
  let fieldH = Number(document.getElementById('field-h').value);
  let cSize = Number(document.getElementById('cell-size').value);

  let fpsValue = Number(document.getElementById('fps').value);

  let sLength = Number(document.getElementById('start-length').value);
  let mRate = Number(document.getElementById('mutation').value)/100;
  let cResolution = Number(document.getElementById('chart-resolution').value);



  if(fieldW<=sLength){
    document.getElementById('field-w').classList.add("invalid");
    hasError = true;
  }

  if(fieldH<=sLength){
    document.getElementById('field-h').classList.add("invalid");
    hasError = true;
  }




  if(!hasError){
    longrestartButton.style.display = "flex";
  }


}





function createGeneration(){

  generation +=1;


  for(let i =0;i<gameCols;i++){
    games[i] = [];
    for(let j =0;j<gameRows;j++){
      let w = paddings+paddings*(gameCols)+(gameCols)*cellSize*gameWidth;
      let h = paddings+paddings*(gameRows)+(gameRows)*cellSize*gameHeight;
      let x = ((appWidth/2)+paddings+paddings*i+i*cellSize*gameWidth)-(w/2);
      let y = (((appHeight-chartHeight-72)/2)+paddings+paddings*j+j*cellSize*gameHeight)-(h/2);


      // If not first generation
      if(bestSnake){

        let rand = bestSnake.length-1-Math.floor(Math.random()*topCount);
        let snake = bestSnake[rand];

        //create new snake game
        games[i][j] = new Game(x,y,gameWidth,gameHeight,cellSize,startLength,snake.brain);
        games[i][j].mutate(mutationRate);
      }
      else{

        //Load brain from JSON for first generation
        if(brainJSON){
          let snakeBrain = NeuralNetwork.deserialize(brainJSON);
          games[i][j] = new Game(x,y,gameWidth,gameHeight,cellSize,startLength,snakeBrain);

        }

        //Or create snake with default brain
        else{
          games[i][j] = new Game(x,y,gameWidth,gameHeight,cellSize,startLength);
        }

      }

      //Set style
      games[i][j].backgroundColor = gameBackgroundColor;
      games[i][j].snakeColor = snakeColor;
      games[i][j].foodColor = foodColor;
      games[i][j].startLength = startLength;
    }
  }
}





function updateData(){

  alive = 0;
  currentScoreMax = 0;

  bestSnake = [];

  let sumScore = 0;

  for(let i =0;i<gameCols;i++){
     for(let j =0;j<gameRows;j++){

      //How many are alive
       if(games[i][j].alive){
         alive+=1;
       }

       //Best snake ever?
       if(games[i][j].alive==false){
         if(games[i][j].score>=scoreMax){
           scoreMax = games[i][j].score;
           bestSnakeEver = games[i][j];
         }
         if(games[i][j].score>=currentScoreMax){
            currentScoreMax = games[i][j].score;
         }

         sumScore += games[i][j].score;
       }

       //Best length
       if(games[i][j].snakeLength>lengthMax){
         lengthMax = games[i][j].snakeLength;
       }

       //Fill array with all snakes to sort next
       bestSnake.push(games[i][j]);
     }
  }



  if(alive==0){
    // Sort snakes by score from low to high
    bestSnake.sort(function(a, b){
      return a.score-b.score
    })

    averageScore = Math.round(sumScore/(gameCols*gameRows));

    if(showChart){
      chart.data.push(averageScore);
    }

    averageScore = 0;

    //Create new generation
    createGeneration();

    //redrawData();

  }

}

function redrawData(){
  //document.title = "Snake AI - "+generation+" generation";

  // Stats Field

  fill('#ffffff');
  textFont('Roboto',21);
  text(generation, 16, appHeight-34-chartHeight);

  fill('#666666');
  textFont('Roboto',11);
  text('generation', 16, appHeight-18-chartHeight);


  fill('#ffffff');
  textFont('Roboto',21);
  text(alive+' of '+population, 112, appHeight-34-chartHeight);

  fill('#666666');
  textFont('Roboto',11);
  text('alive', 112, appHeight-18-chartHeight);

  fill('#ffffff');
  textFont('Roboto',21);
  text(lengthMax, appWidth-300, appHeight-34-chartHeight);

  fill('#666666');
  textFont('Roboto',11);
  text('max length', appWidth-300, appHeight-18-chartHeight);

  fill('#ffffff');
  textFont('Roboto',21);
  text(currentScoreMax, appWidth-200, appHeight-34-chartHeight);

  fill('#666666');
  textFont('Roboto',11);
  text('current score', appWidth-200, appHeight-18-chartHeight);

  fill('#ffffff');
  textFont('Roboto',21);
  text(scoreMax, appWidth-90, appHeight-34-chartHeight);

  fill('#666666');
  textFont('Roboto',11);
  text('highest score', appWidth-90, appHeight-18-chartHeight);


}
