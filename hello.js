function Product(
  name,
  description,
  price,
  brand,
  activeSize,
  quantity,
  date,
  images
) {
  return {
    ID: 1,
    name,
    description,
    price,
    brand,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    activeSize,
    quantity,
    date,
    // reviews: {
    //   ID,
    //   author,
    //   date,
    //   comment,
    //   rating,
    // },
    images,
    getID() {
      return this.ID;
    },
    setID(newID) {
      this.ID = newID;
    },
    getNameD() {
      return this.name;
    },
    setName(newName) {
      this.name = newName;
    },
    getDescription() {
      return this.description;
    },
    setDescription(newDescription) {
      this.description = newDescription;
    },
    getPrice() {
      return this.price;
    },
    setPrice(newPrice) {
      this.price = newPrice;
    },
    getBrand() {
      return this.brand;
    },
    setBrand(newBrand) {
      this.brand = newBrand;
    },
    getActiveSize() {
      return this.activeSize;
    },
    setActiveSize(newActiveSize) {
      this.activeSize = newActiveSize;
    },
    getQuantity() {
      return this.quantity;
    },
    setQuantity(newQuantity) {
      this.quantity = newQuantity;
    },
    getDate() {
      return this.date;
    },
    setDate(newDate) {
      this.date = newDate;
    },
    getImages() {
      return this.images;
    },
    setImages(newImages) {
      this.images = newImages;
    },
  };
}

let pen = new Product(
  "pen",
  "sink stock",
  25,
  "Zito",
  "XL",
  2500,
  "2023:04:09",
  []
);
// let pen = new product("pen");

console.log(pen.getID());
pen.setID(1213);
pen.ID = 2;
console.log(pen.getID());
