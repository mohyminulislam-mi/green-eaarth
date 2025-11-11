let totalPrice = 0;

// ------ Loader Control ------
function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}

// --------- API  Categories fetch  ---------
function loadCategories() {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      displayCategories(data.categories);
    });
}

// --------- Display Categories ---------
function displayCategories(categories) {
  const container = document.getElementById("categories");
  container.innerHTML = "";
  categories.forEach((category) => {
    const selectBtnDiv = document.createElement("div");
    selectBtnDiv.className = "w-full";
    selectBtnDiv.innerHTML = `
      <button id="categoryBtn${category.id}"
        onclick="loadClickData(${category.id})"
        class="btn bg-[#F0FDF4] border-none w-full hover:bg-green-600 hover:text-white mt-3 text-base">
        ${category.category_name}
      </button>
    `;
    container.appendChild(selectBtnDiv);
  });
}

// --------- Category by id Click data ---------
function loadClickData(id) {
  showLoader();
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const categoriesAllBtn = document.querySelectorAll("#categories button");
      categoriesAllBtn.forEach((btn) => {
        btn.classList.remove("bg-green-600", "text-white");
        btn.classList.add("bg-[#F0FDF4]", "text-black");
      });
      const clickedBtn = document.getElementById(`categoryBtn${id}`);
      clickedBtn.classList.remove("bg-[#F0FDF4]", "text-black");
      clickedBtn.classList.add("bg-green-600", "text-white");

      displayPlantCards(data.plants || data.data);
      hideLoader();
    })
    .catch((err) => {
      console.error("Data Loading Error! read this - ", err);
      hideLoader();
    });
}

// --------- All Plants data fetch ---------
function PlantsData() {
  showLoader();
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      displayPlantCards(data.plants);
      hideLoader();
    })
    .catch((err) => {
      console.error("Plants Fetch Error! read this - ", err);
      hideLoader();
    });
}

// --------- Fetch All Plants ---------
function displayPlantCards(plants) {
  const cardDiv = document.getElementById("cards-data");
  cardDiv.innerHTML = "";
  const cartContainer = document.getElementById("prices");

  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.className = "card h-110 bg-white shadow";
    card.innerHTML = `
          <figure class="w-full p-2">
              <img src="${plant.image}" class="rounded-xl object-cover" />
           </figure>
          <div class="card-body">
              <h2 class="card-title mb-1 text-lg font-bold">${plant.name}</h2>
              <p class="mb-3">${plant.description}</p>
              <div class="mb-3 flex justify-between items-center">
                <button
                   class="btn btn-xs modal-btn text-[#15803D] bg-[#DCFCE7] rounded-xl border-none text-sm">${plant.category}
                </button>
               <span class="text-xs">৳${plant.price}</span>
              </div>
              <div class="card-actions">
               <button class="btn bg-green-700 text-white w-full rounded-xl add-to-cart">Add to Cart</button>
              </div>
          </div>
    `;
    cardDiv.appendChild(card);
    // ------------- Modal-Box here ---
    const modalBtn = card.querySelector(".modal-btn");
    modalBtn.addEventListener("click", () => openModal(plant));

    // ---------- Add to Cart Event ----------
    const addToBtn = card.querySelector(".add-to-cart");
    addToBtn.addEventListener("click", () => addToCart(plant, cartContainer));
  });
}

// ------------- Modal-Box Control here ---
function openModal(plant) {
  const modal = document.getElementById("plantbox");
  document.getElementById("modal-title").innerText = plant.name;
  document.getElementById("modal-image").src = plant.image;
  document.getElementById("modal-description").innerText = plant.description;
  document.getElementById("modal-price").innerText = `Price: ৳${plant.price}`;
  document.getElementById(
    "modal-category"
  ).innerText = `Category: ${plant.category}`;
  modal.showModal();
}

function closeModal() {
  document.getElementById("plantbox").close();
}

// ---------- Add to cart items ----------
function addToCart(plant, cartContainer) {
  const cartItem = document.createElement("div");
  cartItem.className =
    "bg-[#F0FDF4] p-2 w-full flex items-center justify-between mb-3";

  cartItem.innerHTML = `
    <div class="flex flex-col">
      <span class="font-semibold">${plant.name}</span>
      <span>৳${plant.price}</span>
    </div>
    <div>
      <button class="remove-items text-red-600 cursor-pointer text-2xl">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `;

  cartContainer.appendChild(cartItem);
  updateTotal(plant.price);

  const removeItems = cartItem.querySelector(".remove-items");
  removeItems.addEventListener("click", () => {
    cartItem.remove();
    updateTotal(-plant.price);
  });
}

// ---------- Total Price ----------
function updateTotal(amount) {
  totalPrice += amount;
  if (totalPrice < 0) totalPrice = 0;
  document.getElementById("total-price").innerText = totalPrice;
}

// ------------- function callls here ---
loadCategories();
PlantsData();
