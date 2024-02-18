/**
Напишите функцию mapObject, которая
в чем-то очень похожа на функцию map для массивов.
​
Эта функция должна принимать объект джаваскрипта
и функцию transformer, которую нужно применить к каждому из полей того объекта, 
...а из результата применения функции transformer к каждому полю входящего объекта
собрать новый объект и вернуть его.
​
Так например можно будет замэппить объект типа 
{ "roma" : 5, "vasya": 2 } оценок студентов
на функцию вроде (x) => x > 2
чтобы получить объект 
{ "roma": true, "vasya": false } зачетов студентов
​
Понятное дело для описания сигнатуры mapObject надо будет юзать
1) дженерики с несколькими параметрами-типами
2) такую штуку как Record (globalThis.Record, если быть точным ;) )
 */

type objType<T> = Record<string, T>;

function mapObject<Input, Output>(
  obj: objType<Input>,
  transformer: (arg: Input) => Output
): objType<Output> {
  let newObject: objType<Output> = {};
  const x = Object.keys(obj).map((k) => {
    const elem = obj[k];
    newObject[k] = transformer(elem);
  });
  return newObject;
}

let list = { roma: 5, vasya: 2 }; // npm run startMap

const result1 = mapObject(list, (x) => x * 2);
console.log("x * 2 => " + result1);

const result2 = mapObject(list, (x) => x * 2);
console.log("x > 2 => " + result2);
