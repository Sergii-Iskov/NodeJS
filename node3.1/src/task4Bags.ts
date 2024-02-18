// Скоро дадим вам функцию, но она немного багонутая.
// Попробуйте найти в ней все баги самостоятельно без запуска этого кода.
// Когда вы увидели все баги и готовы их исправлять, то сделайте это (НО НЕ НАДО ПЕРЕПИСЫВАТЬ С НУЛЯ :)) ),
// и когда будете уверены что функция работает ок - можете попробовать запустить ее и потестить.
// Перед запуском изучите, что ваш любимый редактор подсвечивает в коде.
// Нашел ли он какие-то ошибки?
// Если допустить, что все-таки вы пропустили ряд ошибок, то время протестировать тайпскрипт.
// 1) сложный этап. напишите нормальную тайпскриптовую сигнатуру функции
// (отдельно опишите тип первого аргумента в виде interface)
// 2) если не получилось, смотрите спойлер: https://pastebin.com/2nEJvk04
// 3) пользуясь силой тайпскрипта и описанной сигнатуры,
// найдите как можно больше ошибок, которых не нашли раньше.
// По мере фикса кода, обнаруживайте еще ошибки на шару в процессе кодинга,
// без запуска программы.
// результат скиньте @roman
// ... а вот и код багонутой функции:

interface obj {
  [key: string]: { cvalue: string | number | obj | undefined } | undefined;
}

function summ(a: obj): number {
  // npm run startBag
  const x = Object.keys(a).map((k) => {
    const elem = a[k];
    if (typeof elem === undefined) return 2021;
    else if (elem) {
      if (typeof elem.cvalue === "string") return +elem.cvalue || 2021;
      else if (typeof elem.cvalue === "number") return elem.cvalue;
      else return summ(elem.cvalue as obj);
    }
  });
  console.log(x);
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    sum += x[i]!;
  }
  return sum;
}

let example2 = {
  hello: { cvalue: 1 },
  world: { cvalue: { yay: { cvalue: "2" } } },
  world2: { cvalue: { yay: { cvalue: "bye" } } },
};

console.log("result example = " + summ(example2));

// Удачи найти все баги.
// Тут может быть проще все с нуля написать, но задача не об этом.
// А про то, как находить ошибки не напрягаясь.
// И про type narrowing:
// - про guards: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards
// - про truthiness narrowing: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#truthiness-narrowing
// - про control flow analysis: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#control-flow-analysis
// Дайте знать @roman про результаты.

// виявлені баги:
// function summ(a)  - відсутній тип першого аргумента
// if (typeof elem.cvalue === 'String') return +elem.cvalue || '2021'; - має бути "string" і 2021
// return summ(elem) - має бути return summ(elem.cvalue)
// return elem.сvalue; - в коді використано окремі літери кирилиці
// return summ; - має повертати return sum;
