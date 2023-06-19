import { numberBetween } from './utils.js';

export class Person {
    constructor(name, hp) {
        this.name = name
        this.hitPoints = hp;
        this.initHitpoints = hp
        this.type = this.__proto__.constructor.name;
        this.armor = null;
        this.agility = numberBetween(1, 10);
        this.imageURL = null;
    }

    getName() {
        return this.name;
    }

    isAlive() {
        return this.hitPoints > 0;
    }

    attack(target) {
        if (!(target instanceof Person)) {
            console.error("Target is not instance of Person")
            return
        }
        const damage = numberBetween(1, 10);
        target.hitPoints = target.hitPoints - damage;
    }
}


export class Hero extends Person {
    constructor(name, hp) {
        super(name, hp);
    }

    getName() {
        return "Hero: " + super.getName();
    }
}

export class Enemy extends Person {
    constructor(name, hp) {
        super(name, hp);
    }

    getName() {
        return "Enemy: " + super.getName();
    }
}

export const isPerson = element => element instanceof Person;
