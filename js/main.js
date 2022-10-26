// Form Elements
const elForm = document.querySelector(".pokemon-form");
const elSearchInput = elForm.querySelector(".pokemon-search-input");
const elSelect = elForm.querySelector(".pokemon-select");
const elList = document.querySelector(".pokemon-list");
const elFormBtn = document.querySelector(".pokemon-form-btn");
const elSortAZ = document.querySelector(".sortAZ");
const elSortWeight = document.querySelector(".sortWeight");
const elSortHeight = document.querySelector(".sortHeight");

const elTemplate = document.querySelector(".pokemon-template").content;
const fragment = new DocumentFragment()

// Modal Elements
const elModalTitle = document.querySelector(".pokemon-modal-title")
const elModalCandyCount = document.querySelector(".pokemon-candy-count")
const elModalSpawnChance = document.querySelector(".pokemon-spawn-chance")
const elModalAverageSpawns = document.querySelector(".pokemon-avg-spawns")
const elModalWeaknesses = document.querySelector(".pokemon-weaknesses ")

const pokemonTypeArr = [];

// Render Pokemon
function renderPokemon(pokemons, elRegExp){
    elList.innerHTML = "";
    for (const item of pokemons) {
        const clonedTemplate = elTemplate.cloneNode(true);
        clonedTemplate.querySelector(".pokemon-num").textContent = item.num;
        clonedTemplate.querySelector(".pokemon-image").src = item.img;
        
        // if(elRegExp.source !== "(?:)" && elRegExp){
        //     clonedTemplate.querySelector(".pokemon-name").innerHTML = item.name.replace(elRegExp,`<mark class="p-0 bg-warning">${elRegExp.source}</mark>`);
        // }else{
        // }
        clonedTemplate.querySelector(".pokemon-name").textContent = item.name;
        
        
        clonedTemplate.querySelector(".pokemon-weight").textContent = item.weight;
        clonedTemplate.querySelector(".pokemon-height").textContent = item.height;
        clonedTemplate.querySelector(".pokemon-candy-count").textContent = item.candy_count;
        clonedTemplate.querySelector(".pokemon-egg").textContent = `🥚: ${item.egg}`;
        clonedTemplate.querySelector(".pokemon-time").textContent = `Time: ${item.spawn_time}`;
        clonedTemplate.querySelector(".pokemon-more-info").dataset.id = item.id;
        
        
        fragment.appendChild(clonedTemplate)
    }
    elList.appendChild(fragment)
}
renderPokemon(pokemons);


// Modal Render Info
function showInfo(button){
    let elTarget = pokemons.find(item => item.id == button)
    
    // Modalkani yasimz
    elModalTitle.textContent = elTarget.name;
    elModalCandyCount.textContent = elTarget.candy_count;
    elModalSpawnChance.textContent = elTarget.spawn_chance;
    elModalAverageSpawns.textContent = elTarget.avg_spawns;
    elModalWeaknesses.textContent = elTarget.weaknesses.join(", ")
}

// Event Delegation
elList.addEventListener("click", function(evt){
    if(evt.target.matches(".pokemon-more-info")){
        showInfo(evt.target.dataset.id)
    }
})


// Search Pokemons
elForm.addEventListener("keyup", function(evt){
    evt.preventDefault();
    const elSearchInputValue = elSearchInput.value.trim();
    const elRegExp = new RegExp(elSearchInputValue, "gi")
    
    
    let findPoke = pokemons.filter(item =>{
        return item.name.match(elRegExp)
    })
    
    renderPokemon(findPoke, elRegExp.source)
})

// Select Pokemon type
function pokeType(arr, select){
    arr.forEach(item =>{
        const pokemonType = item.type;
        pokemonType.forEach(subitem =>{
            const types = subitem
            
            if(!pokemonTypeArr.includes(types)){
                pokemonTypeArr.push(types)
            }
        })
    })
    pokemonTypeArr.sort()
    
    pokemonTypeArr.forEach(item =>{
        const pokeOption = document.createElement("option")
        pokeOption.value = item;
        pokeOption.textContent = item;
        select.appendChild(pokeOption)
    })
    
    elFormBtn.addEventListener("click", function(evt){
        evt.preventDefault();
        const selectValue = select.value;
        const findType = pokemons.filter(item =>{
            console.log(item);
            return item.type.includes(selectValue)
        })
        renderPokemon(findType)
    })
}
pokeType(pokemons, elSelect)

// Sort From Alphabet
function sortAlphabet() {
    elSortAZ.addEventListener("click", function (evt) {
        if (evt.target.value == "az") {
            let sortitem = pokemons.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0));
            renderPokemon(sortitem);
        }
        if (evt.target.value == "za") {
            let sortitem = pokemons.sort((a, b) => b.name.charCodeAt(0) - a.name.charCodeAt(0));
            renderPokemon(sortitem);
        }
    });
}
sortAlphabet();

// Sort From Weight
function sortWeight() {
    elSortWeight.addEventListener("click", function (evt) {
        if (evt.target.value == "heavy") {
            let sortitem = pokemons.sort((a, b) => a.weight - b.weight);
            renderPokemon(sortitem);
        }
        if (evt.target.value == "light") {
            let sortitem = pokemons.sort((a, b) => b.weight - a.weight);
            renderPokemon(sortitem);
        }
    });
}
sortWeight();

// Sort From Height
function sortHeight() {
    elSortHeight.addEventListener("click", function (evt) {
        if (evt.target.value == "tallest") {
            let sortitem = pokemons.sort((a, b) => b.height - a.height);
            renderPokemon(sortitem);
        }
        if (evt.target.value == "smallest") {
            let sortitem = pokemons.sort((a, b) => a.height - b.height);
            renderPokemon(sortitem);
        }
    });
}
sortHeight();


