let countID = 0;

function Product(
  name,
  description,
  price,
  brand,
  activeSize,
  quantity,
  date,
  images = []
) {
  this.ID = ++countID;
  this.name = name;
  this.description = description;
  this.price = price;
  this.brand = brand;
  this.sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  this.activeSize = activeSize;
  this.quantity = quantity;
  this.date = date;
  this.reviews = [];
  this.images = images;

  this.getID = function () {
    return this.ID;
  };
  this.setID = function (newID) {
    this.ID = newID;
  };

  this.getNameD = function () {
    return this.name;
  };
  this.setName = function (newName) {
    this.name = newName;
  };

  this.getDescription = function () {
    return this.description;
  };
  this.setDescription = function (newDescription) {
    this.description = newDescription;
  };

  this.getPrice = function () {
    return this.price;
  };
  this.setPrice = function (newPrice) {
    this.price = newPrice;
  };

  this.getBrand = function () {
    return this.brand;
  };
  this.setBrand = function (newBrand) {
    this.brand = newBrand;
  };

  this.getActiveSize = function () {
    return this.activeSize;
  };
  this.setActiveSize = function (newActiveSize) {
    this.activeSize = newActiveSize;
  };

  this.getQuantity = function () {
    return this.quantity;
  };
  this.setQuantity = function (newQuantity) {
    this.quantity = newQuantity;
  };

  this.getDate = function () {
    return this.date;
  };
  this.setDate = function (newDate) {
    this.date = newDate;
  };

  this.getImages = function () {
    return this.images;
  };
  this.setImages = function (newImages) {
    this.images = newImages;
  };

  this.getImage = function (n = 0) {
    return this.images[n];
  };

  this.addReview = function (ID, author, date, comment, rating) {
    this.reviews.push(new Rewiews(ID, author, date, comment, rating));
  };
  this.getReviewByID = function (reviewID) {
    for (let obj of this.reviews) {
      if (obj.ID == reviewID) {
        return obj;
      }
    }
    return `no reviews with ID = ${reviewID}`;
  };
  this.deleteReview = function (reviewID) {
    let newRevies = [];
    for (let i = 0; i < this.reviews.length; i++) {
      if (this.reviews[i].ID != reviewID) {
        newRevies.push(this.reviews[i]);
      }
    }
    this.reviews = newRevies;
  };
}

function Rewiews(ID, author, date, comment, rating) {
  return {
    ID: ID,
    author,
    date,
    comment,
    rating,
  };
}

let images = ["one", "two", "three"];

let pen = new Product(
  "pen",
  "sink stock",
  25,
  "Zito",
  "XL",
  2500,
  "2023:04:09",
  images
);

console.log(pen.getID());
pen.setID(1213);
pen.ID = 2;
console.log(pen.getID());
pen.addReview(1, "Serg", "2023:04:13", "Super!!!", 5);
pen.addReview(2, "Mama", "2023:04:14", "not bad", 3);
pen.addReview(3, "Natali", "2023:04:13", "no info", 5);
pen.addReview(4, "Maxon", "2023:04:14", "gav-gav", 0);
console.log(pen.reviews);
pen.deleteReview(3);
console.log(pen.reviews);

console.log(pen.getReviewByID(5));
console.log(pen.getImage(2));
console.log(pen.getImage());
