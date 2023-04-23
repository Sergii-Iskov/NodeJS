let countID = 0;

function Product(
  name,
  description = "need more information",
  price,
  brand = "need more information",
  activeSize = "XL",
  quantity,
  images = []
) {
  this.ID = ++countID;
  this.reviewID = 0;
  this.name = name;
  this.description = description;
  this.price = price;
  this.brand = brand;
  this.sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  this.activeSize = activeSize;
  this.quantity = quantity;
  this.date = new Date();
  this.reviews = [];
  this.images = images;

  this.getID = function () {
    return this.ID;
  };
  this.setID = function (newID) {
    this.ID = newID;
  };

  this.getName = function () {
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

  this.addSize = function (newSize) {
    this.sizes.push(newSize);
  };

  this.deleteSize = function (someSize) {
    let index = this.sizes.indexOf(someSize);
    if (index >= 0) {
      this.sizes.splice(index, 1);
    }
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
    if (typeof newDate == "string") {
      this.date = new Date(Date.parse(newDate));
    } else if (typeof newDate == "number") {
      this.date = new Date(newDate);
    } else if (newDate instanceof Date) {
      this.date = newDate;
    }
  };

  this.getImages = function () {
    return this.images;
  };
  this.setImages = function (newImages) {
    this.images = newImages;
  };

  this.getImage = function (n = 0) {
    return n < this.images.length ? this.images[n] : "this image is absent";
  };

  this.addReview = function (
    author,
    comment,
    [service, price, value, quality]
  ) {
    this.reviewID++,
      this.reviews.push(
        new Rewiews(this.reviewID, author, comment, {
          service,
          price,
          value,
          quality,
        })
      );
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

  this.getAverageRating = function () {
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
  };
}

function Rewiews(ID, author, comment, { service, price, value, quality }) {
  return {
    ID: ID,
    author,
    date: new Date(),
    comment,
    rating: { service: service, price: price, value: value, quality: quality },
  };
}

let images = ["1", "2", "3"];

let pen = new Product("pen", "sink stick", 25, "Zito", "XL", 2500, images);

//                         ID
// console.log(pen.getID());
// pen.setID(1213);
// console.log(pen.getID());

//                        Name, Description, Price, Brand
// console.log(pen.getName());
// pen.setName("pen.M2");
// console.log(pen.getName());
// console.log(pen.getDescription());
// pen.setDescription("pen of your dream");
// console.log(pen.getDescription());
// console.log(pen.getPrice());
// pen.setPrice(28);
// console.log(pen.getPrice());
// console.log(pen.getBrand());
// pen.setBrand("UkrOboronPen");
// console.log(pen.getBrand());

//                       sizes, ActiveSize
// console.log(pen.sizes);
// pen.addSize("XXXXXXL");
// console.log(pen.sizes);
// pen.deleteSize("XL");
// console.log(pen.sizes);
// console.log(pen.getActiveSize());
// pen.setActiveSize("XXL");
// console.log(pen.getActiveSize());

//                        Quantity
// console.log(pen.getQuantity());
// pen.setQuantity(200);
// console.log(pen.getQuantity());

//                        Date
// console.log(pen.getDate());
// pen.setDate(1327611110417);
// console.log(pen.getDate());
// pen.setDate("2022-08-26T13:51:50.417-07:00");
// console.log(pen.getDate());
// pen.setDate(new Date());
// console.log(pen.getDate());

//                       Images
// console.log(pen.getImages());
// console.log(pen.getImage(2));
// console.log(pen.getImage(6));
// console.log(pen.getImage());
// pen.setImages(["one", "two", "three", "four"]);
// console.log(pen.getImages());

//                        Review, AverageRating
// pen.addReview("Serg", "Super!!!", [1, 2, 2, 2]);
// pen.addReview("Mama", "not bad", [4, 2, 1, 2]);
// pen.addReview("Natali", "no info", [3, 2, 3, 2]);
// pen.addReview("Maxon", "gav-gav", [5, 2, 4, 2]);
// console.log(pen.reviews);
// pen.deleteReview(2);
// console.log(pen.getReviewByID(5));
// console.log(pen.reviews);
// console.log(pen.getAverageRating());
// console.log(pen.reviews[1].rating);

let pencil = new Product("pencil", "black stick", 15, "Zito", "XL", 250);
let rubber = new Product("rubber", "not to eat!", 30, "Zito", "S", 2800);
let liner = new Product("liner", "20 cm long stick", 28, "Gita", "L", 2200);

let products = [];
products.push(pen);
products.push(pencil);
products.push(rubber);
products.push(liner);

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

let penArr = searchProducts(products, "pen");
console.log(penArr);
let stickArr = searchProducts(products, "stic*");
console.log(stickArr);

sortProducts(products, "price");
console.log(products);
sortProducts(products, "ID");
console.log(products);
sortProducts(products, "Name");
console.log(products);
