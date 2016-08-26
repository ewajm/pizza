//<!-- Back End -->

//objects
function Store(name, place){
  this.name = name;
  this.place = place;
  this.meats = ["pepperoni", "sausage", "Canadian bacon", "actual bacon", "anchovies"];
  this.veggies = ["onions", "olives", "green peppers", "mushrooms", "tomatoes", "banana peppers", "jalapenos", "pineapple"];
  this. sizes = ["Large", "Medium", "Small"];
  this.sizePrices = [12, 9, 6];
}

Store.prototype.getPrice = function(pizza){
  pizza.price = this.sizePrices[this.sizes.indexOf(pizza.size)];
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
  var thisStore = new Store("Generic Pizza Place", "Portland");
  $("form#inputForm").submit(function(event){
    event.preventDefault();

  });
});
