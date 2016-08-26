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
};

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
};

Store.prototype.getWaitTime = function(customer){
  var time = 30 * customer.pizzas.length;
  var hours = parseInt(time / 60);
  var minutes = time % 60;
  return [hours, minutes];
};

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
  this.delivery = false;
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
  var currentCustomer = new Customer("User");
  createStoreDisplay(thisStore);

  $("#startModal").modal();

  $("input:radio[name=deliveryOption]").change(function(){
    $("#userAddress").parent().toggle();
    $("#userAddress").prop("required", function( i, val ) {
      return !val;
    });
  });

  $("form#userInfoForm").submit(function(event){
    event.preventDefault();
    currentCustomer.name = $("#userName").val();
    if($("#delivery").is(":checked")){
      currentCustomer.delivery = true;
      currentCustomer.address = $("#userAddress").val();
      $(".address").text(currentCustomer.address);
      $("#deliveryOrder").show();
      $("#carryoutOrder").hide();
    }
    $("#startModal").modal("hide");
  });

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

  $("#checkoutButton").click(function(){
    if(currentCustomer.pizzas.length > 0){
      var waitTime = thisStore.getWaitTime(currentCustomer);
      var waitString = "";
      if(waitTime[0]){
        waitString += waitTime[0] + " hour(s) ";
      }
      if(waitTime[1]){
        waitString += waitTime[1] + " minutes";
      }
      $(".deliveryTime").text(waitString);
      $("#orderSummary").text(currentCustomer.pizzas.length + " pizza(s) totaling $" + thisStore.getCustomerTotal(currentCustomer) + ".00");
      $("#order").slideUp();
      $("#checkedOut").slideDown();
    } else {
      $("#orderWarning").show();
    }
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
