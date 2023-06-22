// 1. 

function getFirstWord(a : string) : number {
	return a.split(/ +/)[0].length;
}

// 2. 

function getUserNamings(a: { name: string; surname : string}
): { fullname: string; initials : string} {
  return { 
		fullname: a.name + " " + a.surname, 
		initials: a.name[0] + "." + a.surname[0] 
	};
}

// 3. 

// <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining>
function getAllProductNames(a: { products: { name: string }[]}) : string[] {
  return a?.products?.map(prod => prod?.name) || [];
}

// 4.1

// easy way is using 'as' keyword
// hard way is ?...
function hey(a: { name: Function, cuteness? : number, coolness? : number}) : string{
    return "hey! i'm " + a.name();
}
hey({name: () => "roma", cuteness: 100})
hey({name: () => "vasya", coolness: 100})

// 4.2
class Pet {
    protected _name: string;
    constructor(name: string) {
        this._name = name;
    }
    name(): string {
        return this._name;
    }
}

class Cat extends Pet{
    constructor(name: string, public redColor: boolean) {
        super(name);
        this.redColor = redColor;
    }
}

class Dog extends Pet{
    constructor(name: string, public height: number) {
        super(name);
        this.height = height;
    }
}

function hey2(abstractPet : Pet) : string{
    return "hey! i'm " + abstractPet.name();
}
let a = new Cat("myavchik", true)
let b = new Dog("gavchik", 333)
hey2(a)
hey2(b)

// 4.3
type CAT = {
    name: () => string;
    type: "cat";
    cuteness: number
}

type DOG = {
    name: () => string;
    type: "dog";
    coolness: number
}

function hey3(a : CAT | DOG) {
    return "hey! i'm " + a.name()
		 + (a.type === "cat" ? ("cuteness: "+a.cuteness) : ("coolness: "+a.coolness))
}
hey3({name: () => "roma", type: "cat", cuteness: 100})
hey3({name: () => "vasya", type: "dog", coolness: 100})

// 5.

// google for Record type
function stringEntries(a: Record<number, number>) : number[] {
   return Array.isArray(a) ? a : Object.keys(a)
}

// 6.

// you don't know Promises and async/await yet. Or do you? 
// ....can be hard, don't worry and SKIP if you do not know how to do it

async function world(a : number) : Promise<string>{
    return "*".repeat(a)
}
const hello = async () => {
   return await world(10)
}
hello().then(r => console.log(r)).catch(e => console.log("fail"))