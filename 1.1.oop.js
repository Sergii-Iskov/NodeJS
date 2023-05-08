class AbstractProduct {
  static countID = 0;
  static arrID = [];
  reviewID = 0;

  constructor({
    name,
    description = "need more information",
    price,
    quantity,
    brand = "need more information",
    images = [],
  }) {
    if (this.constructor.name === "AbstractProduct") {
      throw new Error(
        `${this.constructor.name}: can not create instance of abstract class`
      );
    }
    this.ID = this.calculateID();
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.reviews = [];
    this.images = images;
    this.date = new Date();
    this.brand = brand;
  }

  // method for calculation of unique ID of new product
  calculateID() {
    AbstractProduct.countID++;
    if (AbstractProduct.arrID.indexOf(AbstractProduct.countID) != -1) {
      this.calculateID();
    } else {
      AbstractProduct.arrID.push(AbstractProduct.countID);
    }
    return AbstractProduct.countID;
  }

  getID() {
    return this.ID;
  }

  // method for change ID of some product. If new ID is already used, writes
  // message, else changes ID and does free old ID (deletes it from array of ID)
  setID(newID) {
    let arrIndex = AbstractProduct.arrID.indexOf(newID);
    if (arrIndex == -1) {
      let oldIDIndex = AbstractProduct.arrID.indexOf(this.ID);
      AbstractProduct.arrID.splice(oldIDIndex, 1);
      AbstractProduct.arrID.push(newID);
      this.ID = newID;
    } else {
      console.error(`Product with this ID = ${newID} is already exist`);
    }
  }

  getName() {
    return this.name;
  }

  setName(newName) {
    this.name = newName;
  }

  getDescription() {
    return this.description;
  }

  setDescription(newDescription) {
    this.description = newDescription;
  }

  getPrice() {
    return this.price;
  }

  setPrice(newPrice) {
    this.price = newPrice;
  }

  getBrand() {
    return this.brand;
  }

  setBrand(newBrand) {
    this.brand = newBrand;
  }

  getQuantity() {
    return this.quantity;
  }

  setQuantity(newQuantity) {
    this.quantity = newQuantity;
  }

  getDate() {
    return this.date;
  }

  setDate(newDate) {
    if (typeof newDate == "string") {
      this.date = new Date(Date.parse(newDate));
    } else if (typeof newDate == "number") {
      this.date = new Date(newDate);
    } else if (newDate instanceof Date) {
      this.date = newDate;
    }
  }

  getImages() {
    return this.images;
  }

  setImages(newImages) {
    this.images = newImages;
  }

  getImage(n = 0) {
    return n < this.images.length ? this.images[n] : "this image is absent";
  }

  addReview(author, comment, [service, price, value, quality]) {
    this.reviewID++,
      this.reviews.push(
        new Rewiews(this.reviewID, author, comment, {
          service,
          price,
          value,
          quality,
        })
      );
  }
  getReviewByID(reviewID) {
    for (let obj of this.reviews) {
      if (obj.ID == reviewID) {
        return obj;
      }
    }
    return `no reviews with ID = ${reviewID}`;
  }

  deleteReview(reviewID) {
    let newRevies = [];
    for (let i = 0; i < this.reviews.length; i++) {
      if (this.reviews[i].ID != reviewID) {
        newRevies.push(this.reviews[i]);
      }
    }
    this.reviews = newRevies;
  }

  getAverageRating() {
    let countReview = 0;
    let sum = 0;
    for (let review of this.reviews) {
      countReview++;
      let countRatingEl = 0;
      let sumEl = 0;
      for (let key in review.rating) {
        countRatingEl++;
        sumEl += review.rating[key];
      }
      sum += sumEl / countRatingEl;
    }
    return sum / countReview;
  }
  // method return info about all properties of Object
  getFullInformation() {
    return JSON.stringify(this, null, " ")
      .replaceAll(":", " -")
      .replaceAll('"', "");
    //   .replaceAll(",", " \n");
  }
  // method return info about Object only for first level of properties
  getFullInformation2() {
    let result = "";
    for (const key of Object.entries(this)) {
      result = result + key + "\n";
    }
    return result.replaceAll(",", " - ");
  }
  // method return info about Object only for first level of properties
  getFullInformation3() {
    let result = "";
    for (const key in this) {
      result = result + key + " - " + this[key] + "\n";
    }
    return result;
  }

  getPriceForQuantity(int) {
    if (typeof +int === "number" && !isNaN(+int)) {
      return "$" + int * this.getPrice();
    }
    return `${int} is not a number!!!`;
  }

  getOrSet(...property) {
    let prop = property[0].toLowerCase();
    if (this.hasOwnProperty(prop)) {
      if (property.length == 1) {
        return this[prop];
      } else if (property.length == 2) {
        this[prop] = property[1];
        return this[prop];
      } else {
        return "You must write only one or two arguments!!!";
      }
    } else return `${this.name} does not have property "${prop}"`;
  }
}

// function Rewiews(ID, author, comment, { service, price, value, quality }) {
//   return {
//     ID: ID,
//     author,
//     date: new Date(),
//     comment,
//     rating: { service: service, price: price, value: value, quality: quality },
//   };
// }

class Rewiews {
  constructor(ID, author, comment, { service, price, value, quality }) {
    this.ID = ID;
    this.author = author;
    this.date = new Date();
    this.comment = comment;
    this.rating = {
      service: service,
      price: price,
      value: value,
      quality: quality,
    };
  }
}

class Clothes extends AbstractProduct {
  constructor({ activeSize = "XL", material, color, ...rest }) {
    super(rest);
    this.sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    this.activeSize = activeSize;
    this.material = material;
    this.color = color;
  }

  addSize(newSize) {
    this.sizes.push(newSize);
  }

  deleteSize(someSize) {
    let index = this.sizes.indexOf(someSize);
    if (index >= 0) {
      this.sizes.splice(index, 1);
    }
  }

  getActiveSize() {
    return this.activeSize;
  }

  setActiveSize(newActiveSize) {
    this.activeSize = newActiveSize;
  }

  getMaterial() {
    return this.material;
  }

  setMaterial(newMaterial) {
    this.material = newMaterial;
  }

  getColor() {
    return this.color;
  }

  setColor(newColor) {
    this.color = newColor;
  }
}

class Electronics extends AbstractProduct {
  constructor({ warranty, power, ...rest }) {
    super(rest);
    this.warranty = warranty;
    this.power = power;
  }

  getWarranty() {
    return this.warranty;
  }

  setWarranty(newWarranty) {
    this.warranty = newWarranty;
  }

  getMaterial() {
    return this.power;
  }

  setPower(newPower) {
    this.power = newPower;
  }
}

let images = ["1", "2", "3"];

let hat = new Clothes({
  name: "hat",
  description: "sink stick",
  price: 25,
  quantity: 2500,
  brand: "Gita",
  images: images,
  color: "black",
  material: "cotton",
});

hat.setID(3);
// let pencil = new AbstractProduct(
//   name: "pencil",
//   description: "black stick",
//   price: 15,
//   brand: "Zito",
//   quantity: 250,
// );

let shirt = new Clothes({
  name: "shirt",
  description: "so small!",
  price: 30,
  quantity: 2800,
  brand: "Zito",
  color: "green",
  material: "cotton",
});

//                        Review, AverageRating
// hat.addReview("Serg", "Super!!!", [1, 2, 2, 2]);
// hat.addReview("Mama", "not bad", [4, 2, 1, 2]);
// hat.addReview("Natali", "no info", [3, 2, 3, 2]);
// hat.addReview("Maxon", "gav-gav", [5, 2, 4, 2]);
// console.log(hat.reviews);
// hat.deleteReview(2);
// console.log(hat.getReviewByID(5));
// console.log(hat.reviews);
// console.log(hat.getAverageRating());
// console.log(hat.reviews[1].rating);

//                         ID
// console.log("penID = " + pen.getID());
// console.log(AbstractProduct.arrID);
// // console.log("pencilID = " + pencil.getID());
// console.log(AbstractProduct.arrID);
// console.log("rubberID = " + rubber.getID());
// console.log(AbstractProduct.arrID);
// console.log(pen.getID());

//                        getFullInformation
// console.log(hat.getFullInformation());
// console.log(hat.getFullInformation2());
// console.log(hat.getFullInformation3());
// // console.log(rubber.getFullInformation());
// console.log(hat.getBrand());
// console.log(rubber.getBrand());

//                         getPriceForQuantity
// console.log(pen.getPriceForQuantity("ооо"));

let phone = new Electronics({
  name: "motorola",
  description: "so small!",
  price: 3000,
  quantity: 28,
  brand: "Moto",
  warranty: 2,
  power: 220,
});

// console.log(phone.getFullInformation());
// console.log(phone.getOrSet("power"));
console.log(phone.getOrSet("power", 500));
console.log(phone.getOrSet("powers"));

let products = [];
products.push(hat);
products.push(shirt);
products.push(phone);

function searchProducts(products, search) {
  if (search[search.length - 1] == "*") {
    search = search.substring(0, search.length - 1);
  }
  return products.filter(
    (item) => item.name.includes(search) || item.description.includes(search)
  );
}

function sortProducts(products, sortRule) {
  if (sortRule.toLowerCase() == "name") {
    products.sort((a, b) => {
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      if (a.name.toLowerCase() == b.name.toLowerCase()) return 0;
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    });
  } else if (sortRule.toUpperCase() == "ID") {
    products.sort((a, b) => a.ID - b.ID);
  } else if (sortRule.toLowerCase() == "price") {
    products.sort((a, b) => a.price - b.price);
  } else {
    console.log("You input wrong sortRule!!!");
  }
}

// let penArr = searchProducts(products, "tor");
// console.log(penArr);
// let stickArr = searchProducts(products, "sh*");
// console.log(stickArr);

// sortProducts(products, "price");
// console.log(products);
