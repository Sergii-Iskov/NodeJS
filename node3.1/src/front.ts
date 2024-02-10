enum direction {
  plus = "plus",
  minus = "minus",
}

let command: direction;
let url = "http://localhost:3000/";

document.querySelector("#btn1")?.addEventListener("click", async function () {
  try {
    let command = direction.plus;
    let response = await fetch(url + command);
    let json = await response.json();
    console.log(json.result);
    document.querySelector("#Result")!.textContent = json.result;
  } catch (error) {
    console.error(error);
  }
});

document.querySelector("#btn2")?.addEventListener("click", async function () {
  try {
    let command = direction.minus;
    let response = await fetch(url + command);
    let json = await response.json();
    console.log(json.result);
    document.querySelector("#Result")!.textContent = json.result;
  } catch (error) {
    console.error(error);
  }
});
