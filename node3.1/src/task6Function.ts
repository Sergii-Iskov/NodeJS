// Напишите функцию, которая принимает:
// 1) некие данные предполагаемо типа Т, но возможно не со всеми полями
// 2) функцию-дополнятор, которая принимает такие штуки как из п.1,
//    а возвращает полноценный объект типа Т
// ... как вы поняли, саму функцию писать не надо :)
// нас интересует только ее сигнатура.

// об'єднана функція
function extendData<T>(
  data: Partial<T>,
  callbackFunction: (data: Partial<T>) => T
): T {
  return callbackFunction(data);
}

// окремі функції

interface Todo {
  title: string;
  description: string;
  author: string;
  creationDate: Date;
}

function cutTodo1(todo: Pick<Todo, "title" | "description">) {}
function cutTodo2(todo: Omit<Todo, "author" | "creationDate">) {}

interface shortTodo {
  title: string;
  description: string;
}

function expandTodo(
  todo: shortTodo,
  fieldsToAdd: Required<Omit<Todo, "title" | "description">>
) {
  return { ...todo, ...fieldsToAdd };
}

// Более сложный вариант:
// Напишите функцию, которая принимает:
// 1) некие данные предполагаемо типа Т (у которого поле id: string),
//    но возможно без поля id
// 2) функцию-дополнятор, которая принимает такие штуки как из п.1,
//    а возвращает полноценный объект типа Т
// ... как вы поняли, саму функцию писать не надо :)
// нас интересует только ее сигнатура.

// об'єднана функція

type DataWithOptionalId<T> = T & { id?: string };

function extendData2<T>(
  data: DataWithOptionalId<T>,
  callbackFunction: (data: DataWithOptionalId<T>) => T
): T {
  return callbackFunction(data);
}

// окремі функції

interface T2 {
  id?: string;
  title: string;
  description: string;
  author: string;
  creationDate: Date;
}

function func2(obj: T2) {}
function expandFunc2(obj: T2, fieldsToAdd: Required<Pick<T2, "id">>) {
  return { ...obj, ...fieldsToAdd };
}

// Последняя задача:
// Напишите сигнатуру функции, которая принимает
// - некий класс
// - количество
// ...а возвращает массив экземпляров этого класса
class Rectangle {
  w!: number;
  h!: number;
}
class Circle {
  radius!: number;
}

// сделайте норм сигнатуру тут.
// НЕТ, Rectangle|Circle это не вариант, надо сделать универсальную функцию
function shtamp<C>(SOMECLASS: { new (): C }, count: number): C[] {
  let a = [];
  for (let i = 0; i < count; i++) a.push(new SOMECLASS());

  return a;
}
let a: Rectangle[] = shtamp(Rectangle, 10);
let b: Circle[] = shtamp(Circle, 20);
