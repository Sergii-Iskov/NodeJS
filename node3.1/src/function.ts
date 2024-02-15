// Есть функция. Она принимает некий объект А, у которого есть поля со значениями
// - или undefined
// - или объекта с одним полем cvalue, который
//      либо undefined
//      либо по типу равный
//           либо строке,
//           либо числу,
//           либо ссылке на объект по своей структуре/описанию подобный описываемому объекту А.
// ...Функция должна вернуть сумму "значений" поля cvalue всех полей объекта, притом,
// - если у очередного элемента поле сvalue - это число,
//   то просто добавляем это число.
// - если у очередного элемента поле сvalue - это строка,
//   то просто конвертим строку в число и добавляем.
// - если у очередного элемента поле cvalue - это объект подобный корневому,
//   то добавляем сумму его полей (привет рекурсия)
// - если мы натыкаемся на undefined, или же если cvalue был строкой которая по факту не являлась адекватным числом -
//   то тогда значением будет 2022.

type objB = {
  cvalue: string | number | objA | undefined; // npm run startF
};

interface objA {
  [key: string]: undefined | objB;
}

function func1(obj: objA): number {
  let result: number = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      if (typeof element === "undefined") {
        result += 2022;
      } else {
        if (element && typeof element.cvalue === "number") {
          result += element.cvalue;
        } else if (element && typeof element.cvalue === "string") {
          if (!Number.isNaN(+element.cvalue)) result += +element.cvalue;
          else result += 2022;
        } else if (element && typeof element.cvalue === "undefined") {
          result += 2022;
        } else {
          result += func1(element.cvalue as objA);
        }
      }
    }
  }
  return result;
}

let object1: objB = { cvalue: "undefined" };

let object2: objB = { cvalue: "10" };

let object3: objB = { cvalue: "ten" };

let secondObject: objA = {
  pole1: object1,
  pole2: object3,
};

let object4: objB = { cvalue: secondObject }; // 4044

let object5: objB = { cvalue: 8 };

let firstObject: objA = {
  pole1: object1, // 2022
  pole2: object2, // 10
  pole3: object3, // 2022
  pole4: object4, // 4044
  pole5: object5, // 8
};

let res = func1(firstObject);
console.log("result = " + res);
