if (!localStorage.getItem("username")) {
    alert("Access Denied. Please login to view this page.");
    window.location.replace("pages/login.html"); 
}
let userInfo = document.querySelector("#user_info")  //ul of th username in the navbar
let userData = document.querySelector("#user") // the a tag of the username in the navbar
let links = document.querySelector("#links") // the ul of the nav links in the navbar
const logoutbtn = document.querySelector("#logout");


    // User is logged in: Hide registration links, Show user interface 
if (localStorage.getItem("username")) {
    if (links) links.classList.add("hidden"); 
    if (userInfo) {
        userInfo.classList.remove("hidden"); 
        userInfo.classList.add("flex");
        if (userData) userData.innerHTML = localStorage.getItem("username");
    }
}

if (logoutbtn) {
    logoutbtn.addEventListener("click", (e) => {
        e.preventDefault(); 
        if (confirm("Are you sure you want to logout?")) {
             localStorage.removeItem("username");
             localStorage.removeItem("password");
             localStorage.removeItem("ProductsInCart"); 
             window.location.replace("./pages/login.html");
        }
    });
}
//  User Dropdown Toggle Logic
const userLink = document.querySelector("#user");
const userDropdown = document.querySelector("#user_dropdown");

if (userLink && userDropdown) {
    // 1. Toggle visibility when clicking the username link
    userLink.addEventListener("click", function(event) {
        event.preventDefault(); 
        userDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", function(event) {
        if (!userLink.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.classList.add("hidden");
        }
    });
}
// Toggle cart dropdown ....................................
let cartIcon = document.querySelector("#shopping_cart");
let cartDropdown = document.querySelector("#carts_products");
let cartItemsDiv = document.querySelector("#cart_items_list");


// display all the products in the index page................
let allProducts = document.querySelector("#products");
let cartcount = document.querySelector("#badge");

// Elements for Filtering
let searchInput = document.querySelector("#searchInput");
let categoryFilter = document.querySelector("#categoryFilter");

// Array to store items currently in the cart
// let cartItems = []; 
let cartItems = JSON.parse(localStorage.getItem("ProductsInCart")) || [];
//array of products to display in the index page
let products_list = [
    { id: 1, title: "One Piece", category: "shonen", price: 12.99, image: "../images/one_piece.jpg" },
    { id: 2, title: "Naruto", category: "shonen", price: 11.99, image: "../images/naruto.jpg" },
    { id: 3, title: "Bleach", category: "shonen", price: 12.50, image: "../images/bleach.jpg" },
    { id: 4, title: "Berserk", category: "seinen", price: 14.99, image: "../images/berserk.webp" },
    { id: 5, title: "Vinland Saga", category: "seinen", price: 22.99, image: "../images/Vinland Saga_.jpg" },
    { id: 6, title: "Sailor Moon", category: "shojo", price: 27.99 , image: "../images/Sailor Moon.jpg" },
    { id: 7, title: "Fruits Basket", category: "shojo", price: 24.99, image: "../images/Fruits Basket.jpg" },
    { id: 8, title: "FMA", category: "shonen", price: 11.50, image: "../images/Fullmetal Alchemist.jpg" },
    { id: 9, title: "Monster", category: "seinen", price: 19.99, image: "../images/Monster.jfif" },
    { id: 10, title: "Death Note", category: "thriller", price: 14.99, image: "../images/Death Note.jpg" },
    { id: 11, title: "Slam Dunk", category: "sports", price: 11.50, image: "../images/Slam Dunk.jpg" },
    { id: 12, title: "Haikyuu!!", category: "sports", price: 11.99, image: "../images/Haikyuu!!.jpg" },
    { id: 13, title: "A Silent Voice", category: "drama", price: 79.99, image: "../images/A Silent Voice.jpg" },
    { id: 14, title: "Your Lie in April", category: "drama", price: 12.99, image: "../images/Your Lie in April.jpg" },
    { id: 15, title: "Bakuman", category: "slice-of-life", price: 11.99, image: "../images/Bakuman.jpg" },
    { id: 16, title: "Hunter x Hunter", category: "adventure", price: 11.99, image: "../images/Hunter x Hunter.jpg" },
    { id: 17, title: "Erased", category: "thriller", price: 29.99 , image: "../images/Erased.jpg" },
     { id: 18, title: "Solo Leveling", category: "adventure", price: 20.00, image: "../images/Solo Leveling.jpg" },
    { id: 19, title: "Attack on Titan", category: "adventure", price: 12.99, image: "../images/Attack on Titan.jpg" },
    { id: 20, title: "Hero Academia", category: "action", price: 11.50, image: "../images/My Hero Academia.jpg" },
    { id: 21, title: "Jujutsu Kaisen", category: "action", price: 11.99, image: "../images/Jujutsu Kaisen.jpg" },
    { id: 22, title: "World Trigger", category: "adventure", price: 11.99, image: "../images/World Trigger.jpg" },
    { id: 23, title: "Ao Ashi", category: "sports", price: 13.99, image: "../images/Ao Ashi.jpg" },
    { id: 24, title: "Kimi ni Todoke", category: "slice-of-life", price: 11.99, image: "../images/Kimi ni Todoke.jpg" }
    
];

function displayitems(filteredList = products_list) {
    // Check if the container exists before attempting to write to it
    if (!allProducts) return;

    // Handle empty search results visually
    if (filteredList.length === 0) {
        allProducts.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center min-h-[300px] w-full text-center py-12 text-gray-500 italic font-sans">
            <i class="fa-solid fa-magnifying-glass text-3xl text-gray-300 mb-3"></i>
            <p class="text-base font-medium text-gray-400">No matching manga found.</p>
        </div>
        `;
        return;
    }

    const favorites = JSON.parse(localStorage.getItem("Favorites")) || [];
    
    let y = filteredList.map((product) => {
        const isFav = favorites.some(fav => fav.id === product.id);
        const heartClass = isFav ? "fa-solid text-[#9B2226]" : "fa-regular text-gray-400";

        return `
           <div class="flex w-full border border-[#ddd] h-[160px] text-left bg-white p-3 rounded shadow-sm overflow-hidden">
                <img src="${product.image}" class="w-1/3 h-full object-cover rounded" alt="${product.title}"> 
                
                <div class="flex-1 px-2 flex flex-col justify-center">
                    <h2 class="text-base -tracking-tighter text-[#9B2226] font-bold leading-tight truncate">${product.title}</h2> 
                    <p class="text-xs text-gray-400 font-sans mt-0.5">${product.category}</p> 
                    <span class="text-sm font-bold text-[#9B2226] block mt-1.5">$${product.price}</span> 
                </div>
                
                <div class="w-1/3 flex flex-col justify-between items-end">
                    <button onClick="addtoCart(${product.id})" class="bg-green-700 hover:bg-green-800 text-white font-sans text-[10px] font-semibold py-1.5 px-2 rounded transition whitespace-nowrap">Add to Cart</button> 
                    
                    <button onClick="toggleFavorite(${product.id}, this)" class="p-1 transition-transform active:scale-95 mb-0.5">
                        <i class="${heartClass} fa-heart cursor-pointer text-base hover:opacity-80 transition"></i>
                    </button>
                </div>
            </div> 
        `;
    }).join("");
    
    allProducts.innerHTML = y;
}

//   Filtering Logic Function
function filterProducts() {
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const selectedCategory = categoryFilter ? categoryFilter.value : "";

    //  IF BOTH CONTROLS ARE EMPTY: Immediately display all products
    if (searchText === "" && selectedCategory === "") {
        displayitems(products_list); 
        return; 
    }

    //  IF CONTROLS HAVE TEXT/VALUE: Filter the array normally
    const filteredResults = products_list.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "" || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // 3. Pass the results to displayitems. 
    displayitems(filteredResults);
}
//  Event Listeners for Live Interaction Updates
if (searchInput) {
    searchInput.addEventListener("input", filterProducts); 
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", filterProducts); 
}


function drawDropdownCartItems() {
    if (!cartItemsDiv) return;

    if (cartItems.length === 0) {
        cartItemsDiv.innerHTML = `<div id="empty_cart_msg" style="padding: 16px; text-align: center; font-size: 14px; color: #6b7280; font-style: italic;">No items found in the cart</div>`;
        return;
    }

    cartItemsDiv.innerHTML = cartItems.map((chosenitem) => {
        const itemQuantity = chosenitem.quantity || 1;
        const totalRowPrice = (chosenitem.price * itemQuantity).toFixed(2);
        
        return `
            <div class="cart_item" style="display: flex !important; align-items: center !important; justify-content: space-between !important; border-b: 1px solid #ddd !important; padding: 8px 0 !important; gap: 8px !important; width: 100% !important; box-sizing: border-box !important;">
                
                <!-- Fixed Bounding Box Image Thumbnail Frame Wrapper -->
                <div style="width: 45px !important; height: 60px !important; min-width: 45px !important; min-height: 60px !important; flex-shrink: 0 !important; overflow: hidden !important; border-radius: 4px !important;">
                    <img src="${chosenitem.image}" style="width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important;" alt="${chosenitem.title}">
                </div>
                
                <!-- Centered Inner Structural Description Context Info Layer -->
                <div style="flex: 1 !important; min-width: 0 !important; text-align: left !important; padding: 0 4px !important;">
                    <h3 style="font-size: 13px -tracking-tighter !important; font-weight: 700 !important; margin: 0 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; color: #1f2937 !important;">${chosenitem.title}</h3>
                    <span style="font-size: 12px !important; font-weight: 600 !important; color: #9B2226 !important; display: block !important; margin-top: 2px !important;">$${totalRowPrice}</span>
                </div>
                
                <!-- FIXED COUNTER PAD: Strict Explicit Widths and Row Layout Alignment -->
                <div style="display: flex !important; align-items: center !important; justify-content: center !important; background-color: #ffffff !important; border: 1px solid #d1d5db !important; border-radius: 4px !important; padding: 2px 4px !important; flex-shrink: 0 !important; gap: 6px !important;">
                    
                    <!-- Minus Button Symbol Node Link -->
                    <button onClick="changeQuantityDropdown(${chosenitem.id}, -1)" 
                            style="background: none !important; border: none !important; color: #4b5563 !important; font-weight: bold !important; font-size: 14px !important; cursor: pointer !important; padding: 0 4px !important; line-height: 1 !important; user-select: none !important;">
                        -
                    </button>
                    
                    <!-- Numeric Center Counter Value Frame Text Tag -->
                    <span style="font-size: 12px !important; font-weight: 700 !important; color: #111827 !important; min-width: 16px !important; text-align: center !important; display: inline-block !important; user-select: none !important;">
                        ${itemQuantity}
                    </span>
                    
                    <!-- Plus Button Symbol Node Link -->
                    <button onClick="changeQuantityDropdown(${chosenitem.id}, 1)" 
                            style="background: none !important; border: none !important; color: #4b5563 !important; font-weight: bold !important; font-size: 14px !important; cursor: pointer !important; padding: 0 4px !important; line-height: 1 !important; user-select: none !important;">
                        +
                    </button>
                    
                </div>

            </div>`;
    }).join("");
}

window.changeQuantityDropdown = function(product_Id, changeDirection) {
    let itemIndex = cartItems.findIndex(item => item.id === product_Id);
    
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = (cartItems[itemIndex].quantity || 1) + changeDirection;
        
        // Filter out array values entirely if decrement leads below zero
        if (cartItems[itemIndex].quantity <= 0) {
            cartItems.splice(itemIndex, 1);
        }
        
        // Sync storage memory mapping systems
        localStorage.setItem("ProductsInCart", JSON.stringify(cartItems));
        
        // Synchronize display views
        updateCartBadge();
        drawDropdownCartItems();
        
        // If drawCartItems is running on this specific page view context, update it too
        if (typeof drawCartItems === "function") {
            drawCartItems(cartItems);
        }
    }
};

function addtoCart(product_Id) {
    let chosenitem = products_list.find(p => p.id === product_Id);
    if (!chosenitem) return;

    let existingItem = cartItems.find(item => item.id === product_Id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Deep copy properties into array state tracking mapping lists
        cartItems.push({ ...chosenitem, quantity: 1 });
    }

    localStorage.setItem("ProductsInCart", JSON.stringify(cartItems));

    updateCartBadge();
    drawDropdownCartItems();
}

// 8. Single Click Listener Event Setup (FIXED)
if (cartIcon && cartDropdown) {
    cartIcon.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents click from bubbling up 
        cartDropdown.classList.toggle("hidden");
    });
}

// Updates total sum quantity on badge icon
function updateCartBadge() {
    if (!cartcount) return;
    const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    cartcount.textContent = totalItems;
    
    if (totalItems === 0) {
        cartcount.classList.add("hidden");
    } else {
        cartcount.classList.remove("hidden");
    }
}



// Toggle Favorite State Engine
window.toggleFavorite = function(product_Id, buttonElement) {
    // Assuming products_list is your global array containing all products on index page
    let chosenItem = products_list.find(p => p.id === product_Id);
    if (!chosenItem) return;

    let favorites = JSON.parse(localStorage.getItem("Favorites")) || [];
    let itemIndex = favorites.findIndex(item => item.id === product_Id);
    let icon = buttonElement.querySelector("i");

    if (itemIndex !== -1) {
        // Item is already favorited, remove it
        favorites.splice(itemIndex, 1);
        icon.className = "fa-regular fa-heart cursor-pointer text-base text-gray-400 hover:opacity-80 transition";
    } else {
        // Item is not favorited, add it
        favorites.push(chosenItem);
        icon.className = "fa-solid fa-heart cursor-pointer text-base text-[#9B2226] hover:opacity-80 transition";
    }

    localStorage.setItem("Favorites", JSON.stringify(favorites));
};



function updateFavoriteBadge() {
    const favorites = JSON.parse(localStorage.getItem("Favorites")) || [];
    if (favBadge) {
        favBadge.textContent = favorites.length;
        if (favorites.length === 0) {
            favBadge.classList.add("hidden");
        } else {
            favBadge.classList.remove("hidden");
        }
    }
}

function updateFavoriteBadge() {
    const favorites = JSON.parse(localStorage.getItem("Favorites")) || [];
    const badge = document.querySelector("#fav_badge"); // Ensure your navbar heart badge has this ID
    
    if (badge) {
        badge.textContent = favorites.length;
        // Optionally hide badge if empty
        if (favorites.length === 0) {
            badge.classList.add("hidden");
        } else {
            badge.classList.remove("hidden");
        }
    }
}

window.toggleFavorite = function(product_Id, buttonElement) {
    let chosenItem = products_list.find(p => p.id === product_Id);
    if (!chosenItem) return;

    let favorites = JSON.parse(localStorage.getItem("Favorites")) || [];
    let itemIndex = favorites.findIndex(item => item.id === product_Id);
    let icon = buttonElement.querySelector("i");

    // Add CSS Scale Animation Effect i created in the html file on Click
    icon.classList.add("animate-heartbeat");
setTimeout(() => icon.classList.remove("animate-heartbeat"), 400);

    if (itemIndex !== -1) {
        // Item is already favorited, remove it
        favorites.splice(itemIndex, 1);
        icon.className = "fa-regular fa-heart cursor-pointer text-base text-gray-400 hover:opacity-80 transition";
    } else {
        // Item is not favorited, add it
        favorites.push(chosenItem);
        icon.className = "fa-solid fa-heart cursor-pointer text-base text-[#9B2226] hover:opacity-80 transition";
    }

    localStorage.setItem("Favorites", JSON.stringify(favorites));
    
    // Sync Badge and Refresh Lists
    updateFavoriteBadge();
    if (typeof displayFavorites === "function") displayFavorites(); 
};

/**
 Clear All Favorites Button Logic
 */
window.clearAllFavorites = function() {
    if (confirm("Are you sure you want to clear your wishlist?")) {
        localStorage.removeItem("Favorites");
        
        // Sync navbar badge
        updateFavoriteBadge();
        
        // Refresh your product display layers to turn hearts gray
        if (typeof displayitems === "function") displayitems();
        if (typeof displayFavorites === "function") displayFavorites();
    }
};

// Run badge update once on initial script load to maintain state across reloads
document.addEventListener("DOMContentLoaded", updateFavoriteBadge);

// INITIAL STARTUP EXECUTION 
displayitems();
updateCartBadge();
drawDropdownCartItems();

