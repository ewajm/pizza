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
  pizza.price = 0;
  pizza.price = this.sizePrices[this.pizzaSizes.indexOf(pizza.size)];
  pizza.price += pizza.meatToppings.length * 2;
  pizza.price += pizza.vegToppings.length;
  return pizza.price;
}

Store.prototype.getCustomerTotal = function(customer){
  customer.amtOwed = 0;
  if(customer.pizzas.length > 0){
    for(var i = 0; i < customer.pizzas.length; i++){
      customer.amtOwed += customer.pizzas[i].price;
    }
  } else {
    customer.amtOwed = 0;
  }
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
  var currentCustomer = new Customer("Name");
  createStoreDisplay(thisStore);
  $("form#orderForm").submit(function(event){
    event.preventDefault();
    var pizzaSize = $("#sizeSelect").val();
    var meatToppings = [];
    $("#meatBoxes input:checked").each(function(){
      meatToppings.push($(this).val().replace(/\-/g, " "));
    });
    var vegToppings = [];
    $("#vegBoxes input:checked").each(function(){
      vegToppings.push($(this).val().replace(/\-/g, " "));
    });
    var pizza = new Pizza(pizzaSize, meatToppings, vegToppings);
    currentCustomer.addPizza(pizza);
    $("#orderForm")[0].reset();
    $("#orderDisplay").append(createPizzaOutput(pizza, currentCustomer));
    updateTotal(thisStore, currentCustomer);
    $("button.editButton").last().click(function(){
      populateForm(pizza);
      var pizzaIndex = currentCustomer.pizzas.indexOf(pizza);
      currentCustomer.pizzas.splice(pizzaIndex, 1);
      $(this).parent().remove();
      updateTotal(thisStore, currentCustomer);
    });
  });

  function generateCheckboxes(selectItems, formID){
    selectItems.forEach(function(item){
      $("div#"+formID).append('<div class="checkbox"><label><input type="checkbox" value="' + item.replace(/\s/g, '-') + '" aria-label="...">' + item + '</label></div>');
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

  function createPizzaOutput(pizza, customer){
    var toppingOutput = "";
    pizza.meatToppings.forEach(function(topping){
      toppingOutput += topping + ", ";
    });
    pizza.vegToppings.forEach(function(topping){
      toppingOutput += topping + ", ";
    });
    toppingOutput = toppingOutput.replace(/(?:,\s)(?!(\w))/g, "");
    if(toppingOutput.length === 0){
      toppingOutput = "No toppings";
    }
    return '<p>' + pizza.size + ' Pizza - $' + thisStore.getPrice(pizza) + '.00<button type = "button" class="btn btn-danger editButton">Edit/Remove</button><br><span class = "toppings">' +  toppingOutput + '</span></p>';
  }

  function updateTotal(store, customer){
    $(".amtOwed").text("$" + store.getCustomerTotal(customer) + ".00");
  }

  function populateForm(pizza){
    $("#sizeSelect").val(pizza.size).prop('selected', true);
    pizza.meatToppings.forEach(function(topping){
          $("#meatBoxes input:checkbox[value="+ topping.replace(/\s/g, '-') + "]").prop('checked', true);
    });
    pizza.vegToppings.forEach(function(topping){
        $("#vegBoxes input:checkbox[value="+ topping.replace(/\s/g, '-') + "]").prop('checked', true);
    });
  }
});
