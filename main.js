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



// Getting size of a field from a user
const askFieldSize = () => {
    prompt('Hello! To move around give the direction with W,A,S,D and hit Enter')
    let userSize = prompt('Enter field size: ');
    while (!(userSize > 0)) {
        userSize = prompt('Please enter a number: ');
        Number(userSize)
    }   
    return [userSize]
}

// Inserting holes depending on difficulty using probabilities

const askDifficulty = () => {
    let answer = prompt('Choose the difficulty: Easy, Medium or Hard: ');
    const regex = new RegExp('easy|medium|hard', 'm');
    while (!regex.test(answer.toLowerCase())) {
        answer = prompt('Please choose a difficulty. Type: Easy, Medium or Hard: ');
        answer.toLowerCase();
        
    }
        
   
    return answer
    
}

const evaluateAnswer = (answer) => {
    if (answer === 'easy') return 0.1;
    if (answer === 'medium') return 0.3;
    if (answer === 'hard') return 0.4;
    else {
        askDifficulty()
    }
}
// Returning an array that will be used in generateField method

const forGenerator = (probability) => {
    const forGeneratorArr = [];
    
    for(let i=0; i<10; i++) {
        forGeneratorArr.push(fieldCharacter);
        
    }
    const numOfHolesInArr = forGeneratorArr.length * probability;
    forGeneratorArr.fill(hole, 0, numOfHolesInArr);

    return forGeneratorArr;
}

//Transforming moves to num values and saving it to the Intance we're now playing on

const moveAround = (move, obj) => {
    let vertical = obj.posVert;
    let horizontal = obj.posHor;
    if(move === 's') vertical++;
    if(move === 'w') vertical -= 1;
    if(move === 'd') horizontal ++;
    if(move === 'a') horizontal -= 1;
    return [vertical, horizontal];
}

//Generating random game field with user size

const gameField = (userInputs, arr) => {
    const genField = Field.generateField(userInputs, userInputs, arr);
    const field = new Field(genField[0]);
    field.posVert = genField[1];
    field.posHor = genField[2];
    return field
}


//Checking every move for a finish condition, if nothing happens it saves current pos to the Instance(Field)
const isFinished = (obj) => {
    let field = obj.field;
    let posVert = obj.posVert;
    let posHor = obj.posHor;
    if (posVert < 0 || posHor < 0) {
        console.log('Oops, You fell out of the world!');
        return
    }
        if (posVert > field.length - 1 || posHor > field[0].length - 1) {
        console.log('Oops, You fell out of the world!');
        return
    }
    if (field[posVert][posHor] === hole) {
        console.log('You fell down in a hole');
        return;
    }
    if (field[posVert][posHor] === hat) {
        console.log('Congratulations! You\'ve found the hat');
        return
    }
    
    
    return field[posVert][posHor] = pathCharacter;
}

// The main function to start the game 

const gameProgress = (obj) => {
    let input = prompt('Your move is :')
    input.toLowerCase();
    console.log(input)
    obj.posVert = moveAround(input, obj)[0];
    obj.posHor = moveAround(input, obj)[1];
    
       
    if (typeof isFinished(obj) !== 'string') {
        const answer = prompt('One more time? Type Yes or No: ');
        gameRestart(answer);
        obj.isOver = true;
    } else {
        obj.field[obj.posVert][obj.posHor] = isFinished(obj); 
    }
}


// Looping the game until finish condition is achieved

const gameLoop = (obj,diffArr ) => {
    while (obj.isOver === false) {
        obj.print();
        gameProgress(obj, diffArr);
        
    }
    
}

//Restarting the game with the same user inputs if user types 'yes'

const gameRestart = (answer) => {
    if (answer.toLowerCase() === 'yes') {
        const restartedGame = gameField(userSize)
        gameLoop(restartedGame);

    } else {
        console.log('See you next time!')
        return
    }

}


// Field class which stores position and prints the field. Also it randomly generates field with given inputs

class Field {
    constructor(field) {
        this.posVert = 0;
        this.posHor = 0;
        this.field = field;
        this.isOver = false;
       
    }

    static generateField(height, width) {
        let generated = [];
        
        for(let i=0; i<height;i++) {
            let line = [];
            for(let j=0;j<width;j++) {
                let ind = randomNum(0, difficultyArr.length);
                line.push(difficultyArr[ind]);
            };
            generated.push(line);
        }
        // Placing our character at random pos
        let startVertPos = randomNum(0, height);
        let startHorPos = randomNum(0, width)
        generated[startVertPos].splice(startHorPos, 1, pathCharacter);
        
        // Placing our har at a random pos
        let rndLine = randomNum(0, height);
        let rndPlace = randomNum(0, width);
        if(generated[rndLine][rndPlace] !== pathCharacter) {
            generated[rndLine].splice(rndPlace, 1, hat)
        } else {
            generated[randomNum(0, height)].splice(randomNum(0, width), 1, hat)
        }
        ;
        // Return field
        return [generated, startVertPos, startHorPos];
    }

    print() {
        this.field.forEach(line => {
            
            console.log(line.join(''))
            
        })
    }
}

styles.setStyles();
const userSize = askFieldSize();
const difficulty = askDifficulty();
const probability = evaluateAnswer(difficulty);
const difficultyArr = forGenerator(probability);
const game = gameField(userSize);

gameLoop(game);