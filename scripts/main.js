import { GameController } from './GameController.js';


async function mainGame(gameHtmlWrapper) {
    const gameController = new GameController(gameHtmlWrapper);

    // gameController.initTeams(5);
    // gameController.teamFight();
    gameController.boardController.refreshInputs();
    gameController.loadFromLocalStorage();

    console.log(gameController);


    // const response = await fetch("https://rickandmortyapi.com/api/character/4");
    // const data = await response.json();
    // console.log(data)

    // console.log("End main game");

}
const gameWrapper = document.querySelector(".game-wrapper");
mainGame(gameWrapper);

