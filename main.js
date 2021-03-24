var wallet = 0;
var incomes = 0;
var expenses = 0;
var uids = [];
var walletElement = document.getElementById("wallet");
var allIncomesElement = document.getElementById("allIncomes");
var allExpensesElement = document.getElementById("allExpenses");

function addIncoming() {
  var income_name = document.getElementById("income_name");
  var income_value = document.getElementById("income_value");
  var income_list = document.getElementById("income_list");
  var income_item = document.createElement("div");
  var income_listElement = document.createElement("p");
  var income_deleteButton = document.createElement("button");
  var income_editButton = document.createElement("button");
  
  generateUid(income_listElement);
  assingDeleteEventToElement(
    income_deleteButton, 
    income_listElement.getAttribute('id'),
    'income'
  );
  
  income_deleteButton.innerHTML = 'x';
  income_editButton.innerHTML = "Edytuj";
  
  income_listElement.dataset.value = parseFloat(income_value.value)
  income_listElement.dataset.name = income_name.value
  income_listElement.innerHTML+= `<span>${income_name.value} - ${parseFloat(income_value.value)} zł</span>`;
  //income_listElement.innerHTML+= income_name.value + " - ";
  //income_listElement.innerHTML+= parseFloat(income_value.value) + " zł ";
  //income_list.appendChild(income_listElement);
  
  income_listElement.appendChild(income_deleteButton);
  income_listElement.appendChild(income_editButton);
  income_item.appendChild(income_listElement);
  income_list.appendChild(income_item);
  
  income_editButton.addEventListener('click', function() {
    editElement(income_item, 'income')
  })
  
  updateWallet(income_value.value, 'income');
  resetNewForm(income_name, income_value);
}

function addExpense() {
  var expenses_name = document.getElementById("expenses_name");
  var expenses_value = document.getElementById("expenses_value");
  var expenses_list = document.getElementById("expenses_list");
  var expenses_item = document.createElement("div");
  var expenses_listElement = document.createElement("p");
  var expenses_deleteButton = document.createElement("button");
  var expenses_editButton = document.createElement("button");
  
  generateUid(expenses_listElement);
  assingDeleteEventToElement(
    expenses_deleteButton, 
    expenses_listElement.getAttribute('id'),
    'expense'
  );
  
  expenses_deleteButton.innerHTML = 'x';
  expenses_editButton.innerHTML = "Edytuj";
  
  expenses_listElement.dataset.value = parseFloat(expenses_value.value)
  expenses_listElement.dataset.name = expenses_name.value
  expenses_listElement.innerHTML+= `<span>${expenses_name.value} - ${parseFloat(expenses_value.value)} zł</span>`;
  
  expenses_listElement.appendChild(expenses_deleteButton);
  expenses_listElement.appendChild(expenses_editButton);
  expenses_item.appendChild(expenses_listElement);
  expenses_list.appendChild(expenses_item);
  
  
  
  expenses_editButton.addEventListener('click', function() {
    editElement(expenses_item, 'expense')
  })

  updateWallet(expenses_value.value, 'expense');
  resetNewForm(expenses_name, expenses_value);
}

function resetNewForm(name, amount) {
  name.value = "";
  amount.value = "";
}

function updateWallet(value, typeOfValue) {
  // console.log('robimy update portfela o: ', value)
  // console.log('przed update incomes wynosi:  ', incomes)
  // console.log('przed update expenses wynosi:  ', expenses)
  // console.log('przed update wallet wynosi:  ', wallet)
  typeOfValue === 'income' ? (incomes += parseFloat(value)) : (expenses += parseFloat(value));
  // console.log('po update incomes wynosi:  ', incomes)
  // console.log('po update expenses wynosi:  ', expenses)
  wallet = incomes  - expenses;
  // console.log('po update wallet wynosi:  ', wallet)
  allIncomesElement.innerHTML = "Suma przychodów: " + incomes + " zł";
  allExpensesElement.innerHTML = "Suma wydatków: " + expenses + " zł";
  walletElement.innerHTML = wallet + " zł";
}

// Generuje unikalny id. Przypisuje uid danemu elementowi
function generateUid( element ) {
  var uid = Math.floor(Math.random() * 100000000);
  if (uids.includes(uid)) {
    throw new Error('istnieje już taki ID');
  } else {
    uids.push(uid);
    element.setAttribute('id', uid);
  }
}

// przypisanie funkcji usuwania danemu elementowi
function assingDeleteEventToElement(element, uid, typeOfValue) {
  element.addEventListener('click', function() {
     var elementToBeDeleted = document.getElementById(uid);
     updateWallet(-elementToBeDeleted.dataset.value, typeOfValue)
     elementToBeDeleted.remove();
     const index = uids.indexOf(uid);
     if (index > -1) {
       uids.splice(index, 1);
     }
  })
}


function editElement(element, typeOfValue) {
  // structure looks like this:
  // <div> <p> <button> <button> </p> </div>
  // element == <div>
  
  // hide <p> while editing the item
  var expenses_or_incomings_list = element.childNodes[0]; // <p>
  expenses_or_incomings_list.style.display = "none";
  
  // create new DOM nodes
  var editElementGroup = document.createElement('div');
  var editElementNameInput = document.createElement('input');
  var editElementValueInput = document.createElement('input');
  var editElementButton = document.createElement('button');
  var editElementButtonCancel = document.createElement('button');
  
  // populate nodes with data
  editElementButton.innerHTML = "Zapisz"
  editElementButtonCancel.innerHTML = "Anuluj" 
  editElementNameInput.value = expenses_or_incomings_list.dataset.name;
  editElementValueInput.value = expenses_or_incomings_list.dataset.value;
  
  // add nodes to DOM
  editElementGroup.appendChild(editElementNameInput);
  editElementGroup.appendChild(editElementValueInput);
  editElementGroup.appendChild(editElementButton);
  editElementGroup.appendChild(editElementButtonCancel);
  element.appendChild(editElementGroup)
  
  // add event listeners to buttons
  // "Zapisz"
  editElementButton.addEventListener('click', function(e) {
    if (typeOfValue == 'expense') {
      console.log('stara wartosc: ', editElementValueInput.value)
      console.log('nowa wartosc:', expenses_or_incomings_list.dataset.value)
      expenses -= (expenses_or_incomings_list.dataset.value - editElementValueInput.value)
      wallet -= editElementValueInput.value - expenses_or_incomings_list.dataset.value
      allExpensesElement.innerHTML = "Suma wydatków: " + expenses + " zł";
      walletElement.innerHTML = wallet + " zł";
    } else {
      console.log('stara wartosc: ', editElementValueInput.value)
      console.log('nowa wartosc:', expenses_or_incomings_list.dataset.value)
      incomes -= (expenses_or_incomings_list.dataset.value - editElementValueInput.value)
      wallet += editElementValueInput.value - expenses_or_incomings_list.dataset.value
      allIncomesElement.innerHTML = "Suma wydatków: " + incomes + " zł";
      walletElement.innerHTML = wallet + " zł";
    }
    
    expenses_or_incomings_list.childNodes[0].innerHTML = `${editElementNameInput.value} - ${editElementValueInput.value}`;
    expenses_or_incomings_list.dataset.name = editElementNameInput.value
    expenses_or_incomings_list.dataset.value = editElementValueInput.value
    
    editElementGroup.remove()
    expenses_or_incomings_list.style.display = "block";
  })
  
  // "Anuluj"
  editElementButtonCancel.addEventListener('click', function(e) {
    editElementGroup.remove()
    expenses_or_incomings_list.style.display = "block";
  })
}

