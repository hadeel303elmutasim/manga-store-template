if (!localStorage.getItem("username")) {
    alert("Access Denied. Please login to view this page.");
    window.location.replace("./login.html"); // .replace prevents the user from clicking "Back" to return here
}
let userInfo = document.querySelector("#user_info")  //ul of th username in the navbar
let userData = document.querySelector("#user") // the a tag of the username in the navbar
let links = document.querySelector("#links") // the ul of the nav links in the navbar
let logoutbtn = document.querySelector("#logout");
const allProducts = document.querySelector("#products");
const cartIcon = document.querySelector("#shopping_cart");
const cartDropdown = document.querySelector("#carts_products");
const cartItemsDiv = document.querySelector("#cart_items_list");
const cartcount = document.querySelector("#badge");
// Target for the Wishlist grid and Navbar Favorite Badge specifically
const favoriteContainer = document.querySelector("#favorite_products");
const favBadge = document.querySelector("#fav_badge");   

    // User is logged in: Hide registration links, Show user interface 
if (localStorage.getItem("username")) { //if there is a username in the local storage then display the username in the navbar and hide the nav links
    if (links) {
        links.classList.add("hidden"); 
    
    } if  (userInfo) {
        userInfo.classList.remove("hidden"); 
        userInfo.classList.add("flex"); // Safely add flex layout here
        userData.innerHTML = localStorage.getItem("username");
    }
}
if (logoutbtn) {
    logoutbtn.addEventListener("click", (e) => {
        e.preventDefault(); // This prevents the browser from instantly following the href="login.html" link before the JavaScript has finished removing the item from storage.
       
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (confirmLogout) {
             localStorage.removeItem("username");
             localStorage.removeItem("password");
             localStorage.removeItem("cart"); 
             window.location.replace("./login.html"); // Redirect to login page after logout
        }
    })
}
//  User Dropdown Toggle Logic
const userLink = document.querySelector("#user");
const userDropdown = document.querySelector("#user_dropdown");

if (userLink && userDropdown) {
    // 1. Toggle visibility when clicking the username link
    userLink.addEventListener("click", function(event) {
        event.preventDefault(); // Stop page jumping to top due to href="#"
        userDropdown.classList.toggle("hidden");
    });

    // 2. UX Polish: Close the dropdown if the user clicks anywhere outside of it
    document.addEventListener("click", function(event) {
        if (!userLink.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.classList.add("hidden");
        }
    });
}

//  Array to store items currently in the cart & the favorites list, initialized from localStorage or as empty arrays if not present
let productsInCart = JSON.parse(localStorage.getItem("ProductsInCart")) || [];
let favoriteItems = JSON.parse(localStorage.getItem("Favorites")) || [];

// 5. Navigation Toggle Elements (FIXED: Simplified to prevent blank clicking blockages)
if (cartIcon && cartDropdown) {
    cartIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        cartDropdown.classList.toggle("hidden");
    });
}

//  for the cart dropdown to be displayed when the cart icon is clicked and the cart is not empty
function drawDropdownCartItems() {
    if (!cartItemsDiv) return;

    if (productsInCart.length === 0) {
        cartItemsDiv.innerHTML = `<div id="empty_cart_msg" style="padding: 16px; text-align: center; font-size: 14px; color: #6b7280; font-style: italic;">No items found in the cart</div>`;
        return;
    }

    cartItemsDiv.innerHTML = productsInCart.map((chosenitem) => {
        const itemQuantity = chosenitem.quantity || 1;
        const totalRowPrice = (chosenitem.price * itemQuantity).toFixed(2);
        
        return `
            <div class="cart_item" style="display: flex !important; align-items: center !important; justify-content: space-between !important; border-b: 1px solid #ddd !important; padding: 8px 0 !important; gap: 8px !important; width: 100% !important; box-sizing: border-box !important;">
                <div style="width: 45px !important; height: 60px !important; min-width: 45px !important; min-height: 60px !important; flex-shrink: 0 !important; overflow: hidden !important; border-radius: 4px !important;">
                    <img src="${chosenitem.image}" style="width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important;" alt="${chosenitem.title}">
                </div>
                <div style="flex: 1 !important; min-width: 0 !important; text-align: left !important; padding: 0 4px !important;">
                    <h3 style="font-size: 13px -tracking-tighter !important; font-weight: 700 !important; margin: 0 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; color: #1f2937 !important;">${chosenitem.title}</h3>
                    <span style="font-size: 12px !important; font-weight: 600 !important; color: #9B2226 !important; display: block !important; margin-top: 2px !important;">$${totalRowPrice}</span>
                </div>
                <div style="display: flex !important; align-items: center !important; justify-content: center !important; background-color: #ffffff !important; border: 1px solid #d1d5db !important; border-radius: 4px !important; padding: 2px 4px !important; flex-shrink: 0 !important; gap: 6px !important;">
                    <button onClick="changeQuantityDropdown(${chosenitem.id}, -1)" style="background: none !important; border: none !important; color: #4b5563 !important; font-weight: bold !important; font-size: 14px !important; cursor: pointer !important; padding: 0 4px !important; line-height: 1 !important; user-select: none !important;">-</button>
                    <span style="font-size: 12px !important; font-weight: 700 !important; color: #111827 !important; min-width: 16px !important; text-align: center !important; display: inline-block !important; user-select: none !important;">${itemQuantity}</span>
                    <button onClick="changeQuantityDropdown(${chosenitem.id}, 1)" style="background: none !important; border: none !important; color: #4b5563 !important; font-weight: bold !important; font-size: 14px !important; cursor: pointer !important; padding: 0 4px !important; line-height: 1 !important; user-select: none !important;">+</button>
                </div>
            </div>`;
    }).join("");
}

window.changeQuantityDropdown = function(product_Id, changeDirection) {
    let itemIndex = productsInCart.findIndex(item => item.id === product_Id);
    if (itemIndex !== -1) {
        productsInCart[itemIndex].quantity = (productsInCart[itemIndex].quantity || 1) + changeDirection;
        if (productsInCart[itemIndex].quantity <= 0) {
            productsInCart.splice(itemIndex, 1);
        }
        localStorage.setItem("ProductsInCart", JSON.stringify(productsInCart));
        syncAllCartViews();
    }
};


function drawCartItems(cartList) {
    const checkoutSummary = document.querySelector("#checkout_summary");
    const cartTotalPrice = document.querySelector("#cart_total_price");
    
    if (!allProducts) return; // Safely breaks if not running inside cartproducts webpage context

    if (cartList.length === 0) {
        allProducts.innerHTML = `<div id="empty_cart_msg" class="px-4 py-8 text-center text-base text-gray-500 italic">No items found in the cart</div>`;
        if (checkoutSummary) checkoutSummary.classList.add("hidden"); // Hide total box if cart becomes empty
        return;
    }

    allProducts.innerHTML = cartList.map((item) => {
        const itemQuantity = item.quantity || 1;
        const combinedRowPrice = (item.price * itemQuantity).toFixed(2);
        
        return ` 
            <div class="flex w-full border border-[#ddd] h-[160px] text-left bg-white p-3 rounded shadow-sm overflow-hidden mb-3">
                <img src="${item.image}" class="w-1/3 h-full object-cover rounded" alt="${item.title}"> 
                <div class="flex-1 px-2 flex flex-col justify-center">
                    <h2 class="text-base -tracking-tighter text-[#9B2226] font-bold leading-tight truncate">${item.title}</h2> 
                    <p class="text-xs text-gray-400 font-sans mt-0.5">${item.category}</p> 
                    <span class="text-sm font-bold text-[#9B2226] block mt-1.5">$${item.price} x ${itemQuantity}</span> 
                </div>
                <div class="w-1/4 flex flex-col justify-between items-end">
                    <button onClick="removeFromCart(${item.id})" class="bg-red-700 hover:bg-red-800 text-black font-sans text-[10px] font-semibold py-1.5 px-2 rounded transition whitespace-nowrap">
                        Remove Item <i class="fa-solid fa-trash-can"></i>
                    </button> 
                    <span class="text-sm font-bold text-gray-700 font-sans">Subtotal: $${combinedRowPrice}</span>
                </div>
            </div>`;
    }).join("");

    const grandTotal = cartList.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    if (cartTotalPrice) {
        cartTotalPrice.textContent = `$${grandTotal.toFixed(2)}`;
    }
    if (checkoutSummary) {
        checkoutSummary.classList.remove("hidden");
    }
}

//  Update the badging counts 
function updateCartBadge() {
    if (!cartcount) return;
     // Sum up all quantities in the cart
    const totalItems = productsInCart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    cartcount.textContent = totalItems;
    // Hide the badge if there are no items in the cart
    if (totalItems === 0) {
        cartcount.classList.add("hidden");
    } else {
        cartcount.classList.remove("hidden");
    }
}

//  Interactive Cart Actions 
function addtoCart(product_Id) {
    let chosenitem = products_list.find(p => p.id === product_Id);
    if (!chosenitem) return;    // Exit if item is not found

    // Check if the item is already inside the cart array 
    let existingItem = cartItems.find(item => item.id === product_Id);
    
    // If the item already exists in the cart, increase its quantity
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
         // Push the new item into our state tracking array if it doesn't already exist, with a quantity of 1
        cartItems.push({ ...chosenitem, quantity: 1 });
    }
    // Persist the updated cart state to localStorage
    localStorage.setItem("ProductsInCart", JSON.stringify(cartItems));

    updateCartBadge();
    drawDropdownCartItems();
}

//  Removal Action (Required by button onClick structural link) in the cartproducts page this removes the entire item row from checkout page and the cart dropdown even if it has a quantity greater than 1
window.removeFromCart = function(product_Id) {
    let itemIndex = productsInCart.findIndex(item => item.id === product_Id);
    if (itemIndex !== -1) {
        productsInCart.splice(itemIndex, 1); // Remove entire item row from checkout page and the cart dropdown even if it has a quantity greater than 1
       // Update localStorage and synchronize all cart views
        localStorage.setItem("ProductsInCart", JSON.stringify(productsInCart));
        syncAllCartViews();
    }
};


// Renders the Favorites list on the Cart page
function drawFavoriteItems() {
    const favoriteContainer = document.querySelector("#favorite_products");
    if (!favoriteContainer) return;

    // Fetch fresh local array records to ensure state variables do not crash
    let favoriteItems = JSON.parse(localStorage.getItem("Favorites")) || [];

    // Check for empty favorites 
    if (favoriteItems.length === 0) {
        favoriteContainer.innerHTML = `<div class="text-sm text-gray-400 italic py-4 col-span-full text-center">You haven't added any favorites yet.</div>`;
        return;
    }

    favoriteContainer.innerHTML = favoriteItems.map((item) => {
        return `
            <div class="flex w-full border border-[#ddd] h-[160px] text-left bg-white p-3 rounded shadow-sm overflow-hidden mb-3">
                <!-- 1/3 Width Image Box -->
                <img src="${item.image}" class="w-1/3 h-full object-cover rounded" alt="${item.title}"> 
                
                <!-- Centered Inner Info Content Area -->
                <div class="flex-1 px-2 flex flex-col justify-center">
                    <h2 class="text-base -tracking-tighter text-[#9B2226] font-bold leading-tight truncate">${item.title}</h2> 
                    <p class="text-xs text-gray-400 font-sans mt-0.5">${item.category}</p> 
                    <span class="text-sm font-bold text-[#9B2226] block mt-1.5">$${item.price}</span> 
                </div>
                
                <!-- Right Aligned Action Layer Controls -->
                <div class="w-1/4 flex flex-col justify-between items-end">
                    <!-- Move To Cart Action -->
                    <button onClick="moveFavToCart(${item.id})" class="bg-blue-600 hover:bg-blue-700 -tracking-tighter text-black font-sans text-[10px] font-semibold py-1.5 px-2 rounded transition whitespace-nowrap">
                        Move to Cart <i class="fa-solid fa-cart-shopping pl-0.5"></i>
                    </button> 
                    
                    <!-- Remove Favorite Action with Heart Beat Click Animation Link -->
                    <button onClick="removeFavoriteOnCartPage(${item.id}, this)" class="text-xs -tracking-tighter font-bold text-red-600 hover:text-red-800 transition py-1 px-1">
                        Remove <i class="fa-solid fa-heart-crack pl-0.5"></i>
                    </button>
                </div>
            </div>`;
    }).join("");
}


window.removeFavoriteOnCartPage = function(product_Id, buttonElement) {
    let favoriteItems = JSON.parse(localStorage.getItem("Favorites")) || [];
    favoriteItems = favoriteItems.filter(item => item.id !== product_Id);
    
    // Smoothly fade out the card from view immediately
    if (buttonElement) {
        let icon = buttonElement.querySelector("i");
        if (icon) {
            icon.classList.add("scale-150", "text-gray-400");
        }
        let card = buttonElement.closest(".flex"); 
        if (card) {
            card.style.transition = "all 0.3s ease";
            card.classList.add("opacity-0", "scale-95");
        }
    }

    setTimeout(() => {
        localStorage.setItem("Favorites", JSON.stringify(favoriteItems));
        
        updateFavoriteBadge(); 
        drawFavoriteItems();
        
        if (typeof syncAllCartViews === "function") syncAllCartViews();
    }, 300); 
};

// Move item from Favorites to Cart list ---
window.moveFavToCart = function(product_Id) {
    let favoriteItems = JSON.parse(localStorage.getItem("Favorites")) || [];
    let chosenItem = favoriteItems.find(item => item.id === product_Id);
    if (!chosenItem) return;

    let existingItem = productsInCart.find(item => item.id === product_Id);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        productsInCart.push({ ...chosenItem, quantity: 1 });
    }

    favoriteItems = favoriteItems.filter(item => item.id !== product_Id);
    
    localStorage.setItem("ProductsInCart", JSON.stringify(productsInCart));
    localStorage.setItem("Favorites", JSON.stringify(favoriteItems));
    
    syncAllCartViews();
};


//  Synchronize Navbar Heart Badge Counter

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

// --- Helper Function: Sync Navbar Heart Badge Counter ---
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

// --- Modified Toggle Function with Heart Beat Animation ---
window.toggleFavorite = function(product_Id, buttonElement) {
    let chosenItem = products_list.find(p => p.id === product_Id);
    if (!chosenItem) return;

    let favorites = JSON.parse(localStorage.getItem("Favorites")) || [];
    let itemIndex = favorites.findIndex(item => item.id === product_Id);
    let icon = buttonElement.querySelector("i");

    // Add CSS Scale Animation Effect on Click
    icon.classList.add("animate-heartbeat");
    setTimeout(() => icon.classList.remove("animate-heartbeat"), 400);

    if (itemIndex !== -1) {
        // Item is already favorited, remove it
        favorites.splice(itemIndex, 1);
        if (icon) {
            icon.className = "fa-regular fa-heart cursor-pointer text-base text-gray-400 hover:opacity-80 transition";
        }
    } else {
        // Item is not favorited, add it
        favorites.push(chosenItem);
        if (icon) {
            icon.className = "fa-solid fa-heart cursor-pointer text-base text-[#9B2226] hover:opacity-80 transition";
        }
    }

    localStorage.setItem("Favorites", JSON.stringify(favorites));
    
    // FORCE INSTANT UPDATES HERE:
    updateFavoriteBadge(); // Updates navbar badge number instantly
    
    // Re-render the visual blocks immediately so the page matches your localStorage data
    if (typeof displayitems === "function") displayitems(); 
    if (typeof displayFavorites === "function") displayFavorites();
    if (typeof drawFavoriteItems === "function") drawFavoriteItems(); 
};



// Clear All Favorites Button Logic

window.clearAllFavorites = function() {
    if (confirm("Are you sure you want to clear your wishlist?")) {
        localStorage.removeItem("Favorites");
        
        // 1. Force the HTML grid container to empty out immediately
        if (favoriteContainer) {
            favoriteContainer.innerHTML = `
                <div class="col-span-full text-center py-8 text-gray-500">
                    You haven't added any favorites yet.
                </div>
            `;
        }
        
        // 2. Sync navbar badge
        updateFavoriteBadge();
        
        // 3. Refresh other product view layers to turn hearts gray on the shop grid
        if (typeof displayitems === "function") displayitems();
        if (typeof displayFavorites === "function") displayFavorites();
    }
};

// Run badge update once on initial script load to maintain state across reloads
document.addEventListener("DOMContentLoaded", updateFavoriteBadge);

// Global view synchronization wrapper
function syncAllCartViews() {
    updateCartBadge();
    drawDropdownCartItems();
    drawCartItems(productsInCart);
     drawDropdownCartItems();
    drawFavoriteItems();
     updateFavoriteBadge()
}
// INITIAL STARTUP EXECUTION

syncAllCartViews();