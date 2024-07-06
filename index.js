
// IMPORT DEFAULT FROM FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//SETTING DATABASE URL FROM FIREBASE
const appSettings = {
    databaseURL: "https://playground-879ae-default-rtdb.europe-west1.firebasedatabase.app"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListinDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    
    push(shoppingListinDB, inputValue); // SAVING THE DATA TO DATABASE

    clearInputFieldEl();

   // appendItemToShoppingListEl(inputValue) ;
    
})

onValue(shoppingListinDB, function(snapshot) {

    if (snapshot.exists()) { // to check if there is a snapshot record in firebase db
        let itemsArray = Object.entries(snapshot.val()) 
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
    
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
    // shoppingListEl.innerHTML += `<li>${itemValue}</li>`; // ADD NEW LI TO THE VERY BOTTOM OF EXISTING LI ELEMENTS
    let itemID = item[0];
    let itemValue = item[1];
    let newEL = document.createElement("li"); // Create li element
    newEL.textContent = itemValue;  // put a text value on the <li>value</li> element

    newEL.addEventListener("dblclick", function(){ //DELETE ITEM IF DOUBLE CLICK
        let itemToDeleteinDB = ref(database,`shoppingList/${itemID}`);
        remove(itemToDeleteinDB);
    })

    shoppingListEl.append(newEL); // put the li element into the parent elements which is the ul

}