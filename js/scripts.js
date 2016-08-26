//<!-- Back End -->

//objects
function Store(name, place){
  this.name = name;
  this.place = place;
  this.meats = ["pepperoni", "sausage", "Canadian bacon", "actual bacon", "anchovies"];
  this.veggies = ["onions", "olives", "green peppers", "mushrooms", "tomatoes", "banana peppers", "jalapenos", "pineapple"];
  this.pizzaSizes = ["Large", "Medium", "Small"];
  this.sizePrices = [12, 9, 6];
}

Store.prototype.getPrice = function(pizza){
  pizza.price = this.sizePrices[this.pizzaSizes.indexOf(pizza.size)];
  pizza.price += pizza.meatToppings.length * 2;
  pizza.price += pizza.vegToppings.length;
  return pizza.price;
}

Store.prototype.getCustomerTotal = function(customer){
  customers.pizzas.forEach(function(pizza){
    customer.amtOwed += this.getPrice(pizza);
  });
  return customer.amtOwed;
}

function Pizza(size, meatToppings, vegToppings){
  this.size = size;
  this.meatToppings = meatToppings;
  this.vegToppings = vegToppings;
  this.price;
}

function Customer(name){
  this.name = name;
  this.pizzas = [];
  this.amtOwed = 0;
  this.address;
}

Customer.prototype.setAddress = function(addressString){
  this.address = addressString;
}

Customer.prototype.addPizza = function(pizza){
  this.pizzas.push(pizza);
}

//<!-- Front End  -->
$(document).ready(function(){
  var thisStore = new Store("Generic Pizza Place", "Generic");
  createStoreDisplay(thisStore);
  $("form#inputForm").submit(function(event){
    event.preventDefault();
  });

  function generateCheckboxes(selectItems, formID){
    selectItems.forEach(function(item){
      $("div#"+formID).append('<div class="checkbox"><label><input type="checkbox" value="' + item + '" aria-label="...">' + item + '</label></div>');
    });
  }

  function createStoreDisplay(store){
    store.pizzaSizes.forEach(function(size){
      $("select#sizeSelect").append("<option value='" + size + "'>" + size + "</option>");
    });
    generateCheckboxes(store.meats, "meatBoxes");
    generateCheckboxes(store.veggies, "vegBoxes");
    $(".place").text(store.place);
    $(".storeName").text(store.name);
  }
});
