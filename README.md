# FindYourHatGame
## Terminal game (maze solver)

### Description

<p>
The main goal of the game is to make your way to a hat <span style="color: green; font-size: 20px">^</span> using directional moves and not to fall down in a hole <span style="color: green; font-size: 20px">O</span>

</p>

* To give the direction use WASD 
* At the start game asks the size of the game field. It expects numbers only. The field is always a square
* Game features 3 levels of difficulty (Easy, Medium, Hard). It affects the percentage of holes on a field
* Game has random field generator, if game restarts it generates new field of the same size and difficulty automatically
* Field generator A* Pathfinder algorithm to make sure the field is actually beatable
* To exit the game, simply hit CTRL + C (Windows) or type in No when game asks you to restart