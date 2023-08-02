// getting the data from dom
let ids = [];
let candy = document.getElementById("candy-name");
let flavor = document.getElementById("flavor");
let price = document.getElementById("price");
let quantity = document.getElementById("quantity");
let form = document.getElementById("add-item");
let items = document.getElementById("items");

// adding the eventlistners
form.addEventListener("submit", addCandy);
items.addEventListener("click", buySomthing);
window.addEventListener("DOMContentLoaded", gettingCandyDetails);

/// on load of over dom adding the details to the page
function gettingCandyDetails() {
  axios
    .get(
      "https://crudcrud.com/api/eee789f4d71f444bafc280a5366d4dd7/candiesDetails"
    )
    .then((response) => {
      response.data.forEach((candyObj) => {
        ids.push(candyObj._id);
        displayCandies(candyObj);
      });
      console.log(ids);
    });
}

// adding the candy to the container with quantity
function addCandy(e) {
  e.preventDefault();
  // console.log(candy.value)
  let obj = {
    Candy: candy.value,
    Flavor: flavor.value,
    Price: price.value,
    Quantity: quantity.value,
  };
  axios
    .post(
      "https://crudcrud.com/api/eee789f4d71f444bafc280a5366d4dd7/candiesDetails",
      obj
    )
    .then((response) => {
      displayCandies(obj);
      ids.push(response.data._id);
    })
    .then(() => {
      candy.value = "";
      flavor.value = "";
      price.value = "";
      quantity.value = "";
    });
}

// display the data of the candies

function displayCandies(obj) {
  let item = document.createElement("li");
  item.classList.add("list-group-item");
  // item.appendChild(
  //   document.createTextNode(

  //     `Candy : ${obj.Candy}, Flavor : ${obj.Flavor}, Price : ${obj.Price} Quantity : ${obj.Quantity}`
  //   )
  // );
  // let buy3 = document.createElement("button");
  // buy3.classList = "btn btn-success btn-sm float-end buy-3 mx-1";
  // buy3.appendChild(document.createTextNode("Buy-3"));
  // let buy1 = document.createElement("button");
  // buy1.classList = "btn btn-success btn-sm float-end buy-1 mx-1";
  // buy1.appendChild(document.createTextNode("Buy-1"));
  // let buy2 = document.createElement("button");
  // buy2.classList = "btn btn-success btn-sm float-end buy-2 mx-1";
  // buy2.appendChild(document.createTextNode("Buy-2"));
  // item.appendChild(buy3);
  // item.appendChild(buy2);
  // item.appendChild(buy1);
  // items.appendChild(item);
  item.classList.add("list-group-item");
  items.innerHTML += `<li><span> Candy : ${obj.Candy}, </span><span>  Flavor : ${obj.Flavor},</span> <span>  Price : ${obj.Price},</span> <span class="Quantity">  Quantity : ${obj.Quantity}</span><button class="btn btn-success btn-sm float-end buy-3 mx-1">Buy-3</button><button class="btn btn-success btn-sm float-end buy-2 mx-1">Buy-2</button><button class="btn btn-success btn-sm float-end buy-1 mx-1">Buy-1</button></li>`;
}

// now impliment the but button
function buySomthing(e) {
  if (e.target.classList.contains("buy-1")) {
    let li = e.target.parentNode;
    let index = Array.from(li.parentNode.children).indexOf(li);
    console.log(index);
    let id = ids[index];
    axios
      .get(
        `https://crudcrud.com/api/eee789f4d71f444bafc280a5366d4dd7/candiesDetails/${id}`
      )
      .then((res) => {
        console.log(res.data);
        let obj = res.data;
        //  return new Promise((resolve ,reject)=>{
        if (obj.Quantity != 0) {
          obj.Quantity = obj.Quantity - 1;
          console.log(obj.Quantity);
          let obj1 = {
            Candy: obj.Candy,
            Flavor: obj.Flavor,
            Price: obj.Price,
            Quantity: obj.Quantity,
          };
          return obj1;
        } else {
          // what happen if i return the error and trow the error at here
          throw new Error("Candies are finished");
        }
      })
      .then((obj) => {
        axios
          .put(
            `https://crudcrud.com/api/eee789f4d71f444bafc280a5366d4dd7/candiesDetails/${id}`,
            obj
          )
          .then((res) => {
             displayCandies(obj);
            // let d = obj.Quantity
            // li.children[3].innerText = `Quantity: ${d}`;
            items.remove(li)
          })
          .catch((er) => console.log(er.message));
      })
      .catch((err) => console.log(err.message));
  }
  if (e.target.classList.contains("buy-2")) {

  }
  if (e.target.classList.contains("buy-3")) {
  }
}




