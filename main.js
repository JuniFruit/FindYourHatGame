// Importing prompt and styles

const styles = require('./terminalCSS.js');
const prompt = require('prompt-sync')({sigint: true});
const fs = require('fs');

const nickNames = ['Contestant', 'Legendary', 'World-famous', 'Hat-finder', 'Game-lover', 'Maze-solver', 'Unbeatable', 'Cyber-athlete', 'Gamer', 'Godlike']

const verbs = ['holds streak of', 'is at', 'has solved', 'has found a hat in', 'has won', 'has shined in', 'has been lucky'];



const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';


// Helper functions

const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}


const removeFromArr = (arr, el) => {
    for (let i=arr.length -1; i>=0; i--) {
        if (arr[i] === el) {
            arr.splice(i,1);
        }
    }
}

// Counts the heuristics, used in A* algorithm

const heuristics = (current, endPoint) => {
  
    let d = Math.abs(current.vert - endPoint.vert) + Math.abs(current.hor - endPoint.hor);
    
    return d;
}
// retrieves data from a file 

let data;



try {
     data = JSON.parse(fs.readFileSync('dataFile.json'));
} catch (e) {
    console.log(`Couldn't retrieve the data. ${e}`)
}



// sends results to a file

const appendData = (stats) => {

    if (stats !== undefined) {

        data.unshift(stats);
    }
    
    fs.writeFile('dataFile.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.log(err)
        } 
    })
}


// Stores information about a player

class Player {
    constructor(name, difficulty) {
        this.name = name;
        this.winsInRow = 0;
        this.difficulty = difficulty;
    }
// Resets winstreak if a player loses
    resetWin() {
        this.winsInRow = 0;
    }
// Increments victories if a player succeeds
    addWin() {
        this.winsInRow += 1;
    }
// Checks previous results, if current streak is bigger, it updates the streak in data base Array as well as the difficulty
    checkPrevResults() {
        let playerName = this.name;
        let wins = this.winsInRow;
        
        for(let i=0; i<data.length;i++) {
            if (data[i].name === playerName) {
                if (data[i].winsInRow < wins) {

                    data[i].winsInRow = wins;
                    data[i].difficulty = this.difficulty;
                    data.unshift(data[i]);
                    data.splice(i + 1, 1);
                    
                   
                } 
            }
        }
    }
// Checks if player already exists in data base
    isPlayerInDB() {
  
        for(let i=0; i<data.length; i++) {
            
            if (data[i].name === this.name) {
                return true;
            } 
        }
    }

    printLeaderBoard() {
        console.log('                                        ')
        console.log('10 recent players:');
        console.log('                                        ');

        for(let i=0; i<10; i++) {
            let rndNickName = randomNum(0, nickNames.length);
            let rndVerb = randomNum(0, verbs.length)
            console.log(`${nickNames[rndNickName]} ${data[i].name} ${verbs[rndVerb]} ${data[i].winsInRow} games in a row at ${data[i].difficulty} difficulty`);
            console.log('                                        ');
        }
    }

}








class Field {
    constructor() {
        this.posVert = 0;
        this.posHor = 0;
        this.endPosVert = 0;
        this.endPosHor = 0;
        this.height = 0;
        this.width = 0
        this.field = [];
        this.isOver = false;
        this.arrWithHoles;
        this.playerStats;
    }

   

// Asks field size of the game

    askFieldSize(str) {
        prompt(`Hello, ${str}! To move around give the direction with W,A,S,D and hit Enter`)
        let userSize = prompt('Enter field size: ');
        while (!(userSize > 0)) {
            userSize = prompt('Please enter a number: ');
            Number(userSize)
        }   
        this.height = Number(userSize);
        this.width = Number(userSize);
    }

// Asks user difficulty

    askDifficulty() {
        let answer = prompt('Choose the difficulty: Easy, Medium or Hard: ');
        const regex = new RegExp('easy|medium|hard', 'i');
        while (!regex.test(answer)) {
            answer = prompt('Please choose a difficulty. Type: Easy, Medium or Hard: ');
            
            
        }
            
       
        return answer
        
    }
    
    evaluateAnswer(answer) {
        if (answer.toLowerCase() === 'easy') return 0.1;
        if (answer.toLowerCase() === 'medium') return 0.3;
        if (answer.toLowerCase() === 'hard') return 0.5;
        else {
            askDifficulty()
        }
    }

//Generates a 10 length array with holes based on chosen difficulty

    forGenerator(probability) {
        const forGeneratorArr = [];
        
        for(let i=0; i<10; i++) {
            forGeneratorArr.push(fieldCharacter);
            
        }
        const numOfHolesInArr = forGeneratorArr.length * probability;
        forGeneratorArr.fill(hole, 0, numOfHolesInArr);
    
        return forGeneratorArr;
    }
// Loops the game until finish condition is achieved
     gameLoop(){
        while (this.isOver === false) {
            styles.setStyles();
            this.print();
            this.gameProgress();
            
        }
        
    }
// The main function to start the game 
    gameInit() {
        styles.setStyles();
        const playerName = prompt('Enter your name: ')
        this.askFieldSize(playerName);
        const difficulty = this.askDifficulty();
        const probability = this.evaluateAnswer(difficulty);
        this.arrWithHoles = this.forGenerator(probability);
        this.generateField();
        this.playerStats = new Player(playerName, difficulty);
        
        this.gameLoop();
        
        
    }
// Handles the progress of the game

    gameProgress() {
        this.moveAround();
        
        if (this.isFinished()) {
            const answer = prompt('One more time? Type Yes or No: ');
            this.gameRestart(answer);
            this.isOver = true;
        } else {
            this.field[this.posVert][this.posHor] = pathCharacter; 
        }
    }

// Handles the moving logic

    moveAround() {
        let move = prompt('Your move is: ').toLowerCase();
        
        switch (move) {
            case 'w':
               this.posVert -= 1;
                break;
            case 's':
                this.posVert += 1;
                break;
            case 'd':
                this.posHor += 1;
                 break;
            case 'a':
                this.posHor -= 1;
                break;
            default:
                console.log('Enter W,A,S or D and hit Enter');
                this.moveAround();
                break;
        }
        
    }

// Checks whether the finish condition is achieved

    isFinished() {
        
        if (this.posVert < 0 || this.posHor < 0) {
            console.log('Oops, You fell out of the world!');
            this.playerStats.resetWin()
            return true
        }
            if (this.posVert > this.field.length - 1 || this.posHor > this.field[0].length - 1) {
            console.log('Oops, You fell out of the world!');
            this.playerStats.resetWin()
            return true
        }
        if (this.field[this.posVert][this.posHor] === hole) {
            console.log('You fell down in a hole');
            this.playerStats.resetWin()
            return true;
        }
        if (this.field[this.posVert][this.posHor] === hat) {
            console.log('Congratulations! You\'ve found the hat');
            this.playerStats.addWin();
            return true
        }
        
        
        
    }
//Restarts the game with the same user inputs if user types 'yes'

    gameRestart (answer) {
        if (answer.toLowerCase() === 'yes') {
            this.generateField();
            this.gameLoop();
    
        } else if (answer.toLowerCase() === 'no') {
            if (this.playerStats.isPlayerInDB()) {
                
                this.playerStats.checkPrevResults();
                appendData();
                console.log('..........................................................');
                this.playerStats.printLeaderBoard();
                console.log('..........................................................')
                prompt(`Your current result is ${this.playerStats.winsInRow} wins in a row. See you next time, ${this.playerStats.name}!`)

            } else {
                appendData(this.playerStats);
                console.log('..........................................................');
                this.playerStats.printLeaderBoard();
                console.log('..........................................................')
                prompt(`Your current result is ${this.playerStats.winsInRow} wins in a row. See you next time, ${this.playerStats.name}!`)
            }
        } else {
            let answer = prompt('Type yes or no: ');
            this.gameRestart(answer);
        }
    
    }




// Generates a random field with given size and difficulty

    generateField() {
        let generated = [];
        for(let i=0; i<this.height;i++) {
            let line = [];
            for(let j=0;j<this.width;j++) {
                let ind = randomNum(0, 10);
                line.push(this.arrWithHoles[ind]);
            };
            generated.push(line);
        }
        // Placing our character at random pos
        let startVertPos = randomNum(0, this.height);
        let startHorPos = randomNum(0, this.width)
        generated[startVertPos].splice(startHorPos, 1, pathCharacter);
        
        // Placing our har at a random pos
        let rndLine = randomNum(0, this.height);
        let rndPlace = randomNum(0, this.width);
        while (generated[rndLine][rndPlace] === pathCharacter) {
            rndLine = randomNum(0, this.height);
            rndPlace = randomNum(0, this.width);
        }; 
        generated[rndLine].splice(rndPlace, 1, hat);
        this.endPosVert = rndLine;
        this.endPosHor = rndPlace;
        this.posVert = startVertPos;
        this.posHor = startHorPos;
        
        if (this.isPlayable(generated) === false) {
            this.generateField();
        } else {
            for(let i=0; i<generated.length;i++){
                for(let j=0; j<generated[i].length;j++) {
                    generated[i][j] = generated[i][j].char;
                }
            }
            this.field = generated;
        }
        
        
        
        
        
    }

// Checks if a level is beatable by using A* algorithm
    isPlayable(generatedArr)  {
        
        const savedField = generatedArr;
        
        
        let startVert = this.posVert;
        let startHor = this.posHor;
       
        let endVert = this.endPosVert;
        let endHor = this.endPosHor;
       
        let start;
        let end;

        const openSet = [];
        const closedSet = [];
        
        class Spot {
            constructor (i,j, char) {
                this.vert = i;
                this.hor = j;
                this.f = 0;
                this.g = 0;
                this.h = 0;
                this.neighbors = [];
                this.previous = undefined;
                this.obstacle = false;
                this.char = char;
            }
            addNeighbors(arr) {
                let vertPos = this.vert;
                let horPos = this.hor;
                if (horPos < arr[vertPos].length - 1) {
                    this.neighbors.push(arr[vertPos][horPos + 1])
                }
                if (horPos > 0) {
                    this.neighbors.push(arr[vertPos][horPos - 1])
                }
                if (vertPos < arr.length - 1) {
                    this.neighbors.push(arr[vertPos + 1][horPos]);
                }
                if (vertPos > 0) {
                    this.neighbors.push(arr[vertPos - 1][horPos])
                }
            }
            
        }

        for(let i=0; i<savedField.length; i++) {
            for(let j=0; j<savedField[i].length; j++) {
                if (savedField[i][j] === hole) {
                    savedField[i][j] = new Spot(i,j, savedField[i][j]);
                    savedField[i][j].obstacle = true;
                } else {
                    savedField[i][j] = new Spot (i,j, savedField[i][j]);
                }
                
    
            }
        }
        for(let i=0; i<savedField.length; i++) {
            for(let j=0; j<savedField[i].length; j++) {
                savedField[i][j].addNeighbors(savedField); 
            }
        }
    
        
        start = savedField[startVert][startHor];
        end = savedField[endVert][endHor];
    
        openSet.push(start);
        while (openSet.length > 0) {
            let winner = 0;
    
            for(let i=0;i < openSet.length; i++) {
                if (openSet[i].f < openSet[winner].f) {
                    winner = i;
                }
            }
    
            let current = openSet[winner];
            
            if (current === end) {
                let path = []
                let temp = current;
                path.push(temp);
                while(temp.previous) {
                    path.push(temp.previous);
                    temp = temp.previous
                }
    
    
                
                
                return true
            }
            removeFromArr(openSet, current);
            closedSet.push(current)
    
            let neighborsOfSpot = current.neighbors;
            
            for (let i=0; i<neighborsOfSpot.length; i++) {
                let neighborOfSpot = neighborsOfSpot[i];
                if (!closedSet.includes(neighborOfSpot) && !neighborOfSpot.obstacle) {
                    let tempG = current.g + 1;
                    if (openSet.includes(neighborOfSpot)) {
                        if (tempG < neighborOfSpot.g) {
                        neighborOfSpot.g = tempG;
                    } 
                    } else {
                        neighborOfSpot.g = tempG;
                        openSet.push(neighborOfSpot)
                    }
    
                    neighborOfSpot.h = heuristics(neighborOfSpot, end);
                    neighborOfSpot.f = neighborOfSpot.g + neighborOfSpot.h;
                    
                }
    
            }

        } 
           
        
        
        return false

    }
// Prints the field to the terminal 

    print() {
        this.field.forEach(line => {
            
            console.log(line.join(''))
            
        })
    }
}


const game = new Field();

game.gameInit();





// const fs = require('fs');
// const path = require('path');
// const data = fs.readFileSync('data.json');
// const savedField = JSON.parse(data);

process.on('Uncaught error', (err) => {
    console.log(`There is an error: ${err}`);
    process.exit(1);
})
 


