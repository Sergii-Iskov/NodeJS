// tsc src/2.2.EventLoop.ts -t es2020

// 1. Используйте node-fetch чтобы сделать запрос await fetch("https://api.ipify.org?format=json"), получить ответ и вывести на экран свой айпи
fetch("https://api.ipify.org?format=json")
  .then((response) => response.json())
  .then((result) => console.log("2.2.1 : " + result.ip))
  .catch((error) => {
    console.error("2.2.1 : " + error);
  });

// 2. Напишите функцию по мотивам п.1., которая собственно возвращает ваш айпи.
async function myIP(url: string) {
  try {
    let response = await fetch(url);
    let json = await response.json();
    console.log("2.2.2 : " + json.ip);
  } catch (error) {
    console.error("2.2.2 : " + error);
  }
}

myIP("https://api.ipify.org?format=json");

// 3. Напишите функцию которая возвращает три имени, сделав параллельно три запроса на https://random-data-api.com/api/name/random_name
// a. воспользуйтесь async/await + Promise.all
type UserWithName = { name: string; [key: string]: string };

//            first variant
async function randomName1a() {
  let url = "https://random-data-api.com/api/name/random_name";
  const prArray = [fetch(url), fetch(url), fetch(url)];
  Promise.all(prArray)
    .then((responses) =>
      Promise.all(
        responses.map((responce) => responce.json() as Promise<UserWithName>)
      )
    )
    .then((users) =>
      users.forEach((user) => console.log("2.2.3a1 : " + user.name))
    )
    .catch((error) => console.error("2.2.3a1 : " + error));
}

randomName1a();

//            Second variant
function newPromice() {
  return new Promise(function (resolve, reject) {
    const result = fetch(
      "https://random-data-api.com/api/name/random_name"
    ).then((r) => r.json());
    if (result) {
      resolve(result);
    } else {
      reject(new Error());
    }
  });
}

async function randomName1b() {
  const prArray = [newPromice(), newPromice(), newPromice()];
  Promise.all(prArray)
    .then((users) =>
      users.forEach((user) =>
        console.log("2.2.3a2 : " + (user as UserWithName).name)
      )
    )
    .catch((error) => console.error("2.2.3a2 : " + error));
}

randomName1b();

// b. воспользуйтесь async/await но без Promise.all
async function singeName() {
  try {
    const newPromice = await fetch(
      "https://random-data-api.com/api/name/random_name"
    );
    const json = await newPromice.json();
    let name = json.name;
    console.log("2.2.3b : " + name);
  } catch (error) {
    console.error("2.2.3b : " + error);
  }
}

function randomName2() {
  singeName();
  singeName();
  singeName();
}

randomName2();

// c. воспользуйтесь чисто промисами, без async/await, без Promise.all .... это может быть сложно
function newJson() {
  return new Promise(function (resolve, reject) {
    const result = fetch(
      "https://random-data-api.com/api/name/random_name"
    ).then((r) => r.json());
    if (result) {
      resolve(result);
    } else {
      reject(new Error());
    }
  });
}

function randomName3() {
  for (let i = 0; i < 3; i++) {
    newJson()
      .then((json) => console.log("2.2.3c : " + (json as UserWithName).name))
      .catch((error) => console.error("2.2.3c : " + error));
  }
}

randomName3();

// 4. Напишите функцию , которая должна за минимальное количество запросов получить юзера женщину: https://random-data-api.com/api/users/random_user
// a.без async/await

function determineWoman1(n = 1) {
  let tempBool = true;
  let url = "https://random-data-api.com/api/users/random_user";

  fetch(url)
    .then((r) => r.json())
    .then((result) => {
      if (result.gender === "Female") {
        console.log(
          "2.2.4a : " +
            result.first_name +
            " " +
            result.last_name +
            `(times = ${n})`
        );
      } else determineWoman1(n + 1);
    })
    .catch((error) => console.error("2.2.4a : " + error));
}

determineWoman1();

// b.с async/await
async function determineWoman2() {
  let tempBool = true;
  let times = 0;
  try {
    while (tempBool) {
      times++;
      const newPromice = await fetch(
        "https://random-data-api.com/api/users/random_user"
      );
      const json = await newPromice.json();
      if (json.gender === "Female") {
        tempBool = false;
        console.log(
          "2.2.4b : " +
            json.first_name +
            " " +
            json.last_name +
            `(times = ${times})`
        );
      }
    }
  } catch (error) {
    console.error("2.2.4b : " + error);
  }
}

determineWoman2();

// 5. Есть функция №1, которая принимает коллбек, который будет вызван с параметром == ваш текущий айпи. Создайте функцию №2, которую можно евейтить, которая будет пользоваться функцией №1
function one() {
  return new Promise(function (resolve, reject) {
    const result = fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((param) => param.ip);
    if (result) {
      resolve(result);
    } else {
      reject(new Error());
    }
  });
}

async function two() {
  try {
    const param = await one();
    console.log("2.2.5 : " + param);
  } catch (error) {
    console.error("2.2.5 : " + error);
  }
}
two();

// 6. Есть функция №1, которую можно евейтить, которая вернет строку == ваш текущий айпи. Создайте функцию №2, которая должна использовать функцию №1 для получения вашего текущего айпи, и которая принимает на вход один параметр - функцию-коллбек, которая будет вызвана, когда айпи будет получен, с первым параметром равным этому айпи. Да, мы старались писать запутанно, но тут все чьотко.

async function first(): Promise<string> {
  return fetch("https://api.ipify.org?format=json")
    .then((r) => r.json())
    .then((param) => param.ip)
    .catch((error) => {
      throw new Error("Alert!!!");
      // console.error("2.2.6 : " + error);
    });
}

function second(somefunc: Function) {
  try {
    (somefunc() as Promise<string>).then((result) =>
      console.log("2.2.6 : " + result)
    );
  } catch (error) {
    console.error("2.2.6 : " + error);
  }
}

second(first);
