// IMPORT DEFAULT FROM FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

//SETTING DATABASE URL FROM FIREBASE
const appSettings = {
    databaseURL: "https://playground-879ae-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListinDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const btnDeleteDone = document.getElementById("btnDelDone");
const btnDeleteAll = document.getElementById("btnDelAll");

addButtonEl.addEventListener("click", function() {
    addItem();
});

// Event listener for pressing Enter key in input field
inputFieldEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addItem(); // Call the addItem function directly
    }
});

// Define the addItem function
function addItem() {
    let inputValue = inputFieldEl.value;
    if (inputValue !== "") {
        let item = {
            value: inputValue,
            status: 0
        };
        push(shoppingListinDB, item); // Saving the data to the database
        clearInputFieldEl();
    }
}

// Update the add button event listener to use the addItem function
addButtonEl.addEventListener("click", addItem);


onValue(shoppingListinDB, function(snapshot) {
    if (snapshot.exists()) { // to check if there is a snapshot record in firebase db
        let itemsArray = Object.entries(snapshot.val());
        
        clearShoppingListEl();
        
        for (let i = 0; i < itemsArray.length; i++) {
            let itemID = itemsArray[i][0];
            let itemData = itemsArray[i][1];
            let itemStatus = itemData.status;
            let itemValue = itemData.value;
            
            appendItemToShoppingListEl(itemID, itemStatus, itemValue);
        }
    } else {
        shoppingListEl.innerHTML = "";
    }
});

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(itemID, itemStatus, itemValue) {
    let newEL = document.createElement("li"); // Create li element
    newEL.textContent = itemValue;  // put a text value on the <li>value</li> element
    
    if (itemStatus === 1) {
        newEL.classList.add("strikeThroughText");
    }

    newEL.addEventListener("dblclick", function() { // HANDLE DOUBLE CLICK
        let itemUpdateinDB = ref(database, `shoppingList/${itemID}`);
        
        if (itemStatus === 0) {
            update(itemUpdateinDB, { status: 1 });
            newEL.classList.add("strikeThroughText");
        }
    });

    shoppingListEl.append(newEL); // put the li element into the parent elements which is the ul
}



btnDeleteAll.addEventListener("click", function() {
    // Delete all items from Firebase
    let confirmDelete = confirm("Are you sure you want to delete all items?");
    if (confirmDelete) {
        remove(shoppingListinDB);
    }
    
});

btnDeleteDone.addEventListener("click", function() {
    // Delete items with status 1 from Firebase
    let confirmDelete = confirm("Are you sure you want to delete all done items?");
    if (confirmDelete) {
        let itemsToDelete = false;
        
        onValue(shoppingListinDB, function(snapshot) {
            if (snapshot.exists()) {
                let itemsArray = Object.entries(snapshot.val());
                
                for (let i = 0; i < itemsArray.length; i++) {
                    let itemID = itemsArray[i][0];
                    let itemData = itemsArray[i][1];
                    let currentItemStatus = itemData.status;
                    if (currentItemStatus === 1) {
                        itemsToDelete = true;
                        let shoppinglistDB = ref(database, `shoppingList/${itemID}`);
                        remove(shoppinglistDB);
                    }
                }

                if (!itemsToDelete) {
                    alert("No items with status 1 found.");
                }
            }
        }, { onlyOnce: true }); // Ensure the onValue listener is only called once
    }
   
});

