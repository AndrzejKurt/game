import { Enemy, Hero, isPerson, Person } from './Person.js';
import { numberBetween } from './utils.js';
import { BoardController } from './BoardController.js';

export const teamsConfig = {
    teamA: "teamA",
    teamB: "teamB",
    hitPointsRange: { min: 50, max: 150 }
}
export class GameController {
    constructor(gameHtmlWrapper) {
        this.teamA = [];
        this.teamB = [];

        this.boardController = new BoardController(gameHtmlWrapper, this.teamFight, this.clearTeams, this.teamA, this.teamB);

        this.boardController.randomButton.addEventListener("click", async () => {
            await this.createRandomPerson();
            this.boardController.refreshView();
            this.boardController.refreshInputs();
            localStorage.setItem(teamsConfig.teamA, JSON.stringify(this.teamA))
            localStorage.setItem(teamsConfig.teamB, JSON.stringify(this.teamB))

        });


    }

    loadFromLocalStorage() {
        const teamALocalStorage = localStorage.getItem(teamsConfig.teamA);
        const teamBLocalStorage = localStorage.getItem(teamsConfig.teamB);


        const teamA = JSON.parse(teamALocalStorage);
        const teamB = JSON.parse(teamBLocalStorage);

        if (teamA !== null) {
            teamA.forEach((member) => {
                const character = member.type === "Hero" ? new Hero(member.name, member.hitPoints) : new Enemy(member.name, member.hitPoints);
                character.agility = member.agility;
                character.imageURL = member.imageURL
                this.teamA.push(character);
            })
        }

        if (teamB !== null) {
            teamB.forEach((member) => {
                const character = member.type === "Hero" ? new Hero(member.name, member.hitPoints) : new Enemy(member.name, member.hitPoints);
                character.agility = member.agility;
                character.imageURL = member.imageURL
                this.teamB.push(character);
            })
        }
        this.boardController.refreshView();

    }

    initTeams(teamSize) {
        if (teamSize === undefined || typeof teamSize !== "number") {
            console.error("teamSize wrong value");
            return;
        }

        this.teamA = this.createTeam(Hero, teamSize);
        this.teamB = this.createTeam(Enemy, teamSize);
    }
    createTeam(race, numberOfMembers) {
        if (!(race.prototype instanceof Person)) {
            return console.error("race is not instance of Person")
        }
        const team = [];
        for (let i = 1; i <= numberOfMembers; i++) {
            const member = new race(`${i}`, 100);
            const name = member.constructor.name;
            member.name = `${name} ${i}`;
            team.push(member);
        }
        return team;
    }
    // Dodane values z inputu z boardcontroller + zabezpieczenie przed błedami by się przydało
    createRandomPerson = async () => {
        const datafromAPI = await fetchCharacter();
        const randomClass = [Enemy, Hero].sort(() => 0.5 - Math.random())[0];
        const randomTeamName = this.boardController.getTeamFromSelect();
        const randomName = datafromAPI.characterName;
        const nameFromInput = this.boardController.getName();
        const hpFromInput = this.boardController.getHitpoints();
        if (hpFromInput === null) return;

        const member = new randomClass(nameFromInput === null ? randomName : nameFromInput, hpFromInput);
        member.imageURL = datafromAPI.characterImageURL;
        randomTeamName === teamsConfig.teamA ? this.teamA.push(member) : this.teamB.push(member);
    }




    clearTeams = () => {
        this.teamA.splice(0 , this.teamA.length);
        this.teamB.splice(0 , this.teamB.length);
        localStorage.removeItem(teamsConfig.teamA);
        localStorage.removeItem(teamsConfig.teamB);
        this.boardController.refreshView();

    }

    teamFight = async () => {
        while (isTeamAlive(this.teamA) && isTeamAlive(this.teamB)) {
            const numberA = numberBetween(0, this.teamA.length - 1);
            const numberB = numberBetween(0, this.teamB.length - 1);
            const personA = this.teamA[numberA];
            const personB = this.teamB[numberB];
            if (personA.isAlive() && personB.isAlive()) {
                fight(personA, personB);
            }
            if (!personA.isAlive()) {
                this.teamA.splice(numberA, 1);
            }
            if (!personB.isAlive()) {
                this.teamB.splice(numberB, 1);
            }
            // console.log("teamA", this.teamA);
            // console.log("teamB", this.teamB);
            this.boardController.refreshView();
            await timeout(500);

        }
    }
}



const isTeamAlive = (team) => {
    return team.some(member => member.isAlive())
}

const fight = (personA, personB) => {
    if (!(isPerson(personA) || isPerson(personB))) {
        console.error("person A or B are not instance of Person");
        return
    }
    if (personA.isAlive() && personB.isAlive()) personA.attack(personB);
    if (personB.isAlive() && personA.isAlive()) personB.attack(personA);
    console.log(`${personA.getName()} has ${personA.hitPoints} HP`);
    console.log(`${personB.getName()} has ${personB.hitPoints} HP`);
}

const fetchCharacter = async () => {
    const id = numberBetween(1, 800);
    const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    const data = await response.json();
    const characterName = data.name;
    const characterImageURL = data.image;
    return { characterName, characterImageURL }
}


const timeout = async time => await new Promise((resolve) => setTimeout(resolve, time));

