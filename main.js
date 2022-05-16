// Importing prompt and styles

const styles = require('./terminalCSS.js');
const prompt = require('prompt-sync')({sigint: true});


const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';


// Helper functions

const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}






class Field {
    constructor() {
        this.posVert = 0;
        this.posHor = 0;
        this.height = 0;
        this.width = 0
        this.field = [];
        this.isOver = false;
        this.arrWithHoles;
        
       
    }

// Asks field size of the game

    askFieldSize() {
        prompt('Hello! To move around give the direction with W,A,S,D and hit Enter')
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
        if (answer.toLowerCase() === 'hard') return 0.4;
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
        styles.setStyles()
        this.askFieldSize();
        const difficulty = this.askDifficulty();
        const probability = this.evaluateAnswer(difficulty);
        this.arrWithHoles = this.forGenerator(probability);
        this.generateField();
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
                console.log('This goes up');
                this.posVert -= 1;
                console.log(this.posVert)
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
            return true
        }
            if (this.posVert > this.field.length - 1 || this.posHor > this.field[0].length - 1) {
            console.log('Oops, You fell out of the world!');
            return true
        }
        if (this.field[this.posVert][this.posHor] === hole) {
            console.log('You fell down in a hole');
            return true;
        }
        if (this.field[this.posVert][this.posHor] === hat) {
            console.log('Congratulations! You\'ve found the hat');
            return true
        }
        
        
        
    }
//Restarts the game with the same user inputs if user types 'yes'

    gameRestart (answer) {
        if (answer.toLowerCase() === 'yes') {
            this.generateField();
            this.gameLoop();
    
        } else {
            console.log('See you next time!')
            return
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
        if(generated[rndLine][rndPlace] !== pathCharacter) {
            generated[rndLine].splice(rndPlace, 1, hat)
        } else {
            generated[randomNum(0, this.height)].splice(randomNum(0, this.width), 1, hat)
        }
        ;
        this.field = generated;
        this.posVert = startVertPos;
        this.posHor = startHorPos;
        
    }
// Prints the field to the terminal 

    print() {
        this.field.forEach(line => {
            
            console.log(line.join(''))
            
        })
    }
}


const game = new Field();

game.width = 20;
game.height = 20;
const arrHoles = game.forGenerator(0.4);

game.arrWithHoles = arrHoles;

const field = game.generateField();
game.print();

const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'starting', 'data.txt', 'utf8'), (err, data) => {
    if (err) {
        throw err
    }
    console.log(data);
})

fs.appendFile(path.join(__dirname, 'starting', 'data.txt'), field, (err) => {
    if (err) {
        throw err
    }
    
})





process.on('Uncaught error', (err) => {
    console.log(`There is an error: ${err}`);
    process.exit(1);
})