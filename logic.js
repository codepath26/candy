
let ids = [];

let candy = document.getElementById("candy-name");
let flavor = document.getElementById("flavor");
let price = document.getElementById("price");
let quantity = document.getElementById("quantity");
let form = document.getElementById("add-item");
let items = document.getElementById("items");
let alert1 = document.getElementById("alert")


// adding the eventlistners
form.addEventListener("submit", addCandy);
items.addEventListener("click", buySomthing);
window.addEventListener("DOMContentLoaded", gettingCandyDetails);

/// on load of over dom adding the details to the page
function gettingCandyDetails() {
  axios
    .get(
      "https://crudcrud.com/api/33d831562fea40a297815c4234f2823a/candiesDetails"
    )
    .then((response) => {
      response.data.forEach((candyObj,index) => {
        ids.push(candyObj._id);
        // if(candyObj.Quantity == 0){
        //   ids.splice(index,1);
        //   axios.delete(`https://crudcrud.com/api/33d831562fea40a297815c4234f2823a/candiesDetails/${candyObj._id}`).then(()=>{
        //   })
        // }
        displayCandies(candyObj);
      });
      console.log(ids);
    });
}

// adding the candy to the container with quantity
async function addCandy(e) {
  e.preventDefault();
  // console.log(candy.value)
  if(quantity.value == 0 || price.value == 0){
    alert1.classList.remove("d-none")
    alert1.classList.add("d-block")
    setTimeout(() => {
      alert1.remove();
    }, 2000);
  }else{

    let obj = {
      Candy: candy.value,
    Flavor: flavor.value,
    Price: price.value,
    Quantity: quantity.value,
  };
  await axios
  .post(
    "https://crudcrud.com/api/33d831562fea40a297815c4234f2823a/candiesDetails",
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
}

// display the data of the candies

function displayCandies(obj) {
  let item = document.createElement("li");
  item.classList.add("list-group-item");

  items.innerHTML += `<li class ="list-group-item mt-3"><span> Candy : ${obj.Candy}, </span><span>  Flavor : ${obj.Flavor},</span> <span>  Price : ${obj.Price},</span> <span class="Quantity">  Quantity : ${obj.Quantity}</span><button class="btn btn-success btn-sm float-end buy-3 mx-1">Buy-3</button><button class="btn btn-success btn-sm float-end buy-2 mx-1">Buy-2</button><button class="btn btn-success btn-sm float-end buy-1 mx-1">Buy-1</button></li>`;
}

// now impliment the but button
function buySomthing(e) {
  if (e.target.classList.contains("buy-1")) {
    remainningCandy(e,1,0);
  }
  if (e.target.classList.contains("buy-2")) {
    remainningCandy(e,2,1);
  }
  if (e.target.classList.contains("buy-3")) {
    remainningCandy(e,3,2);
  }
}


// impliment the remaining items list 
function remainningCandy (e,dec , limit){
  let li = e.target.parentNode;
  let index = Array.from(li.parentNode.children).indexOf(li);
  console.log(index);
  let id = ids[index];
  axios
    .get(
      `https://crudcrud.com/api/33d831562fea40a297815c4234f2823a/candiesDetails/${id}`
    )
    .then((res) => {
      console.log(res.data);
      let obj = res.data;
     
      if (obj.Quantity > limit) {
        obj.Quantity = obj.Quantity - dec;
        if(obj.Quantity === 0){
          items.removeChild(li);
          ids.splice(index,1);
          axios.delete(`https://crudcrud.com/api/33d831562fea40a297815c4234f2823a/candiesDetails/${id}`).then(()=>{
        
          })
        }
        console.log(obj.Quantity);
        let obj1 = {
          Candy: obj.Candy,
          Flavor: obj.Flavor,
          Price: obj.Price,
          Quantity: obj.Quantity,
        };
        return obj1;
      } 
       else {
        // what happen if i return the error and trow the error at here
          
          console.log(e.target)
        throw new Error("Candies are finished");
      }
    
    })
    .then((obj) => {
      if(obj.Quantity != 0){

        axios
        .put(
          `https://crudcrud.com/api/33d831562fea40a297815c4234f2823a/candiesDetails/${id}`,
          obj
          )
          .then(() => {
            let quantityElement =
            items.children[index].querySelector(".Quantity");
            quantityElement.textContent = `Quantity : ${obj.Quantity}`;
          });
        }
    })
    .catch((err) => console.log(err.message));

}