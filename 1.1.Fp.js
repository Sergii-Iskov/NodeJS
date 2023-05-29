function describeCity(csv, text) {
  const cities = csv
    .replaceAll("#", "")
    .split("\n")
    .filter((item) => /(\d{2,}\.\d{2,}\,){2}[а-яА-Яіїє\s]+\,\d+\,/i.test(item))
    .map((item) => {
      arr = item.split(",");
      city = { X: arr[0], Y: arr[1], name: arr[2], population: arr[3] };
      return city;
    })
    .sort((a, b) => b.population - a.population)
    .slice(0, 10)
    .reduce((obj, item) => {
      obj[item.name] = {};
      obj[item.name].population = item.population;
      obj[item.name].rating = Object.keys(obj).length;
      return obj;
    }, {});

  return Object.keys(cities).reduce(
    (text, key) =>
      text.replace(
        new RegExp(key, "gim"),
        `${key} (${cities[key].rating} место в ТОП-10 самых крупных городов Украины, население ${cities[key].population} человек)`
      ),
    text
  );
}

let csv = `44.38,34.33,Алушта,31440,
49.46,30.17,Біла Церква,200131,
49.54,28.49,Бердичів,87575,#некоммент
​
#
46.49,36.58,#Бердянськ,121692,
49.15,28.41,Вінниця,356665,
#45.40,34.29,Джанкой,43343,`;

let text = `Після монгольської навали центр економічного життя українських земель змістився у західні регіони, де постали такі міста як Львів, Луцьк, Меджибіж, Острог, Корець, Вінниця, Бар, Умань, Черкаси, Бердичів. Є ще одна Вінниця`;

console.log(describeCity(csv, text));
console.log("finish");
