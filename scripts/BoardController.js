import { Person } from './Person.js';
import { teamsConfig } from './GameController.js';
import { numberBetween } from './utils.js';

export class BoardController {
    constructor(gameHtmlWrapper, startBattleCallback, endGameCallback, teamA, teamB) {

        this.gameHtmlWrapper = gameHtmlWrapper;
        this.teamAHtmlWrapper = this.gameHtmlWrapper.querySelector("#teamA-wrapper");
        this.teamBHtmlWrapper = this.gameHtmlWrapper.querySelector("#teamB-wrapper");



        this.startButton = gameHtmlWrapper.querySelector("#button-start-game");
        this.clearButton = gameHtmlWrapper.querySelector("#button-clear-game");
        this.randomButton = gameHtmlWrapper.querySelector("#button-random");
        this.teamSelectDropdown = gameHtmlWrapper.querySelector("#select-team");
        this.nameInput = this.gameHtmlWrapper.querySelector("#input-name");
        this.hitPointsInput = this.gameHtmlWrapper.querySelector("#input-hitPoints");


        this.startButton.addEventListener("click", startBattleCallback);
        this.clearButton.addEventListener("click", endGameCallback);
        this.hitPointsInput.addEventListener("change", this.onChangeHpInput);
        // this.randomButton.addEventListener("click", createRandomCharacter);

        this.teamA = teamA;
        this.teamB = teamB;

    }

    getTeamFromSelect = () => {
        return this.teamSelectDropdown.value;
    }

    getName = () => {
        const name = this.nameInput.value;
        if (name.trim() === "") {
            console.error("Name is empty");
            return null;
        }
        return name;
    }

    getHitpoints = () => {
        const minHp = teamsConfig.hitPointsRange.min;
        const maxHp = teamsConfig.hitPointsRange.max;
        const hp = this.hitPointsInput.value;
        if (hp < minHp && hp > maxHp) {
            console.error("Hp is out of range", teamsConfig.hitPointsRange);
            return null;
        }
        return hp;
    }

    refreshInputs = () => {
        this.nameInput.value = "";
        this.hitPointsInput.value = numberBetween(teamsConfig.hitPointsRange.min, teamsConfig.hitPointsRange.max);
        const currentTeam = this.getTeamFromSelect();
        const newTeam = currentTeam === teamsConfig.teamA ? teamsConfig.teamB : teamsConfig.teamA;
        this.teamSelectDropdown.value = newTeam;
        RPGUI.set_value(this.teamSelectDropdown, newTeam);
    }


    createCharacterHtml = (character) => {
        if (!(character instanceof Person)) {
            console.error(`Character is not instance of class Person `, character);
            return null;
        }

        const wrapper = document.createElement("div");
        wrapper.classList.add("character-card", "rpgui-container", "framed-golden");

        const characterDataHtml = `
                <div class="image"><img src="${character.imageURL}"></div>
                <div class='name'>Name: <h4>${character.getName()}</h4></div>
                <div class='hp'>Hit points: <h4>${character.hitPoints}</h4></div>
                <div class='agility'>Agility: <h4>${character.agility}</h4></div>
                <div class='weapon-name'>Weapon Name: <h4>...</h4></div>
        `;

        const progressBarWrapper = document.createElement("div");
        const progressBarLabel = document.createElement("label");
        progressBarLabel.innerText = "Hit points: ";
        const progressBar = document.createElement("div");
        progressBar.classList.add("rpgui-progress", "red")
        progressBarWrapper.appendChild(progressBarLabel);
        progressBarWrapper.appendChild(progressBar);
        RPGUI.create(progressBar, "progress")
        const currentPercentHitPoints = (character.hitPoints / character.initHitpoints)
        RPGUI.set_value(progressBar, currentPercentHitPoints);
        wrapper.innerHTML = characterDataHtml;
        wrapper.appendChild(progressBarWrapper)
        return wrapper;
    }

    renderTeam = (team, teamName) => {
        if (!Array.isArray(team)) {
            console.error("team is not array ", team);
            return null;
        }

        const htmlTarget = teamName === teamsConfig.teamA ? this.teamAHtmlWrapper : this.teamBHtmlWrapper;
        htmlTarget.innerHTML = "";

        team.forEach(member => {
            const memberHtml = this.createCharacterHtml(member);
            if (memberHtml !== null) {
                htmlTarget.appendChild(memberHtml);
            }
        });

    }

    onChangeHpInput = (e) => {
        const currentHp = e.target.value;
        if (currentHp < teamsConfig.hitPointsRange.min) {
            e.target.value = teamsConfig.hitPointsRange.min;
        }
        if (currentHp > teamsConfig.hitPointsRange.max) {
            e.target.value = teamsConfig.hitPointsRange.max;
        }

    }

    refreshView = () => {
        this.renderTeam(this.teamA, teamsConfig.teamA);
        this.renderTeam(this.teamB, teamsConfig.teamB)
    }


}


// <div class='character-card rpgui-container framed-golden'>
//     <div class="image"><img src=".."></div>
//     <div class='name'>Name: <h4>---</h4></div>
//     <div class='hp'>Hit points: <h4>---</h4></div>
//     <div class='strength'>Strength: <h4>---</h4></div>
//     <div class='weapon-name'>Weapon Name: <h4>---</h4></div>
//     <label>Red bar:</label>
//     <div class='rpgui-progress red'></div>
//
//     <label>Blue bar:</label>
//     <div class='rpgui-progress blue'></div>
// </div>
