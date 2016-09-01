//<!-- Back End -->
/*
TODO: pre-made pizza menu? (with ability to edit in case you don't like peppers)
TODO: pizza for non-humans (aliens, robots, mermaids, vampires/the undead)
*/
var branches = ["Space", "Undersea", "Fantasy"];
var branchMeats = [["space pepperoni*", "space sausage*", "space madness*"], ["shark*", "kraken*"], ["dragon*", "gryphon*"]];
var branchVeggies = [["space onions*", "space olives*", "space green peppers*", "space mushrooms*", "vegan space madness*"] , ["red algae*", "kelp*", "sea grapes*"], ["slime mold*", "athelas*", "fruit of the lotus tree*"]];

//objects
function Store(name){
  this.name = name;
  this.place = "Generic";
  this.meats = ["pepperoni", "sausage", "Canadian bacon", "actual bacon", "anchovies"];
  this.veggies = ["onions", "olives", "green peppers", "mushrooms", "tomatoes", "banana peppers", "jalapenos", "pineapple"];
  this.pizzaSizes = ["Large", "Medium", "Small"];
  this.sizePrices = [12, 9, 6];
  this.placeIndex = -1;
}

Store.prototype.setBranch = function(placeIndex){
  this.place = branches[placeIndex];
  this.placeIndex = placeIndex;
  this.meats = branchMeats[placeIndex].concat(this.meats);
  this.veggies = branchVeggies[placeIndex].concat(this.veggies);
}

Store.prototype.getPrice = function(pizza){
  pizza.price = 0;
  pizza.price = this.sizePrices[this.pizzaSizes.indexOf(pizza.size)];
  pizza.price += pizza.checkPremiums(this.placeIndex);
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

Store.prototype.getDeliveryStatus = function(){
  var statusArray = ["delivered", "in limbo", "in space", "on the moon", "in Narnia", "in Middle-Earth", "in Atlantis", "in the Bermuda Triangle", "in a volcano", "somewhere", "in your heart", "RIGHT BEHIND YOU"];
  var randomNumber = Math.floor(Math.random() * statusArray.length);
  return statusArray[randomNumber];
};

function Pizza(size, meatToppings, vegToppings){
  this.size = size;
  this.meatToppings = meatToppings;
  this.vegToppings = vegToppings;
  this.price;
}

Pizza.prototype.checkPremiums = function(placeIndex){
  debugger;
  if(placeIndex < 0){
    return 0;
  } else {
    var premium = 0;
    for(var i = 0; i < this.meatToppings.length; i++){
      console.log(branchMeats[placeIndex] + " " + this.meatToppings[i]);
      if(branchMeats[placeIndex].indexOf(this.meatToppings[i] + "*") !== -1){
        premium++;
      }
    }
    for(var i = 0; i < this.vegToppings.length; i++){
      if(branchVeggies[placeIndex].indexOf(this.vegToppings[i] + "*") !== -1){
        premium++;
      }
    }
    return premium;
  }
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
  var thisStore = new Store("A Pizza Place");
  var currentCustomer = new Customer("User");
  createStoreDisplay(thisStore);

  //modal to get user info and choose branch runs on page load but page will run if not fully filled out by defaulting to generic branch + carryout
  $("#startModal").modal();

  $("input:radio[name=deliveryOption]").change(function(){
    $("#userAddress").parent().toggle();
    $("#userAddress").prop("required", function( i, val ) {
      return !val;
    });
  });

  //form submit function for user info form on page load
  $("form#userInfoForm").submit(function(event){
    event.preventDefault();
    currentCustomer.name = $("#userName").val();
    if($("#delivery").is(":checked")){
      currentCustomer.delivery = true;
      currentCustomer.setAddress($("#userAddress").val());
      $(".address").text(currentCustomer.address);
      $("#deliveryOrder").show();
      $("#carryoutOrder").hide();
    }
    var branch = parseInt($("#branchSelect").val());
    if(!isNaN(branch)){
      thisStore.setBranch(branch);
      createStoreDisplay(thisStore);
      $("#premiumWarning").show();
      $("body").removeClass().addClass(thisStore.place.toLowerCase());
    }
    $("#startModal").modal("hide");
  });

  //form submit for pizza order form
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
    $("#orderDisplay button.editButton").last().click(function(){
      $("#orderForm")[0].reset();
      populateForm(pizza);
      var pizzaIndex = currentCustomer.pizzas.indexOf(pizza);
      currentCustomer.pizzas.splice(pizzaIndex, 1);
      $(this).parents(".pizzaOutput").remove();
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
      currentCustomer.pizzas.forEach(function(pizza){
        $("#receiptDisplay").append(createPizzaOutput(pizza, currentCustomer));
      });
      $("#receiptDisplay button").remove();
      $("#orderSummary").html("<a href='#'>" + currentCustomer.pizzas.length + " pizza(s) totaling $" + thisStore.getCustomerTotal(currentCustomer) + ".00</a>");
      $("#orderSummary a").click(function(event){
        event.preventDefault();
        $("#receiptModal").modal();
      });
      $("#order").slideUp();
      $("#checkedOut").slideDown();
    } else {
      $("#orderWarning").show();
    }
  });

  $("#deliveryOrder button").click(function(){
    var deliveryStatus = thisStore.getDeliveryStatus();
    $("#deliveryStatus").append("<li>Your pizza is " + deliveryStatus + "</li>");
    if(deliveryStatus === "delivered"){
      $("#deliveryOrder button").prop("disabled", true);
      $("#deliveryStatus").after("<p>Didn't get your pizza? <span id='refund'>Click here</span> for our refund policy!");
      $("#refund").click(function(){
        alert("NO REFUNDS EVER");
      });
    }
  });

  function generateCheckboxes(selectItems, formID){
    selectItems.forEach(function(item){
      $("div#"+formID).append('<div class="checkbox"><label><input type="checkbox" value="' + item.replace(/\s/g, '-').replace(/\*/, '') + '" aria-label="...">' + item + '</label></div>');
    });
  }

  function createStoreDisplay(store){
    $("select#sizeSelect, #meatBoxes, #vegBoxes").empty();
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
    return '<div class="pizzaOutput"><div class="pizzaNPrice"><span>' + pizza.size + ' Pizza</span> <span>$' + thisStore.getPrice(pizza) + '.00</span><button type = "button" class="btn btn-danger editButton">Edit/Remove</button></div><div class = "toppings">' +  toppingOutput + '</div></div>';
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
