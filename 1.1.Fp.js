function describeCity(text) {
  return text
    .split("\n")
    .filter((item) => item.length >= 4)
    .map(parseRow)
    .sort((a, b) => b.population - a.population)
    .slice(0, 10)
    .reduce((obj, item) => {
      obj[item.name] = {};
      obj[item.name].population = item.population;
      obj[item.name].rating = Object.keys(obj).length;
      return obj;
    }, {});
}
const parseRow = (item) => {
  arr = item.replace("#", "").split(",");
  city = { X: arr[0], Y: arr[1], name: arr[2], population: arr[3] };
  return city;
};

let text = `44.38,34.33,Алушта,31440,
49.46,30.17,Біла Церква,200131,
49.54,28.49,Бердичів,87575,#некоммент
​
#
46.49,36.58,#Бердянськ,121692,
49.15,28.41,Вінниця,356665,
#45.40,34.29,Джанкой,43343,`;

console.log(describeCity(text));
console.log("finish");
