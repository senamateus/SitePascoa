const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address"); 
const buttonCar = document.getElementById("add-to-cart-btn");

let cart = [];

//Abrindo a modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex";
})

//Fechando a modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
})

//Fechando a modal do carrinho
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
})

// Capturando todos os botões de adicionar ao carrinho
document.querySelectorAll("#add-to-cart-btn").forEach(button => {
    button.addEventListener("click", function(){
        // Encontrando os elementos relativos a ESTE botão
        const productCard = this.closest(".flex.flex-col.items-center");
        
        const select = productCard.querySelector("select[name='Selecione o tamanho']");
        const selectedOption = select.options[select.selectedIndex];

        const casca = productCard.querySelector("select[name='Selecione a casca']");
        const cascaselectedOption = casca.options[casca.selectedIndex];

        const quantidadeInput = productCard.querySelector("input[name='quantity']");
        const quantity = parseInt(quantidadeInput.value) || 1;

        if (selectedOption.disabled) {
            alert("Por favor, selecione um tamanho");
            return;
        }

        if (cascaselectedOption.disabled) {
            alert("Por favor, selecione uma casca");
            return;
        }

        const name = selectedOption.getAttribute("data-name");
        const price = parseFloat(selectedOption.getAttribute("data-price"));
        const cascadoOvo = cascaselectedOption.getAttribute("data-name");

        addToCart(name, price, cascadoOvo, quantity);
    });
});

// Função para adicionar ao carrinho
function addToCart(name, price, cascadoOvo, quantity) {
    const existingItem = cart.find(item => item.name === name && item.cascadoOvo === cascadoOvo);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, cascadoOvo, quantity });
    }

    updateCartModal();
}


//Atualizando o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)} a unidade</p>
                    <p>${item.cascadoOvo}</p>
                    <p>-------------------------------------------------------------------</p>
                </div>
            
             
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>

                <button class="add-from-cart-btn" data-name="${item.name}">
                    Adicionar
                </button>
              
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    })

//Adicionando o valor total do pedido
cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
});

//Mudando a quantidade de itens que mostra dentro () do footer do carrinho
cartCounter.innerHTML = cart.length;
}

//Função para remover itens do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
})

// Adicionar itens ao carrinho já dentro da modal
cartItemsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("add-from-cart-btn")) {
        const itemName = event.target.getAttribute("data-name");

        addItemCart(itemName);
    }
});

// Função para adicionar um item ao carrinho
function addItemCart(itemName) {
    const index = cart.findIndex(item => item.name === itemName);

    if (index !== -1) {
        const item = cart[index];

        // Aumenta a quantidade do item
        item.quantity += 1;
        updateCartModal(); // Atualiza a modal com as novas quantidades e valores
    }
}


function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index != -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}


// Finalizando o pedido
checkoutBtn.addEventListener("click", function(){
    if(cart.length === 0) return;

    // Calcular o valor total do pedido
    const totalOrderValue = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Criar a mensagem com os itens do carrinho
    const cartItems = cart.map((item) => {
        return(
            `*${item.name}*\n` +
            `*Quantidade:* ${item.quantity}\n` +
            `*Preço:* R$${item.price.toFixed(2)} a unidade\n` +
            `*Valor total:* R$${item.price.toFixed(2) * item.quantity.toFixed(2)}\n` +
            `----------------------------------`
        );
    }).join("\n");

    // Mensagem final, incluindo o valor total
    const message = encodeURIComponent(
        `Olá, gostaria de encomendar o(s) seguinte(s) ovo(s) de páscoa:\n\n` + 
        cartItems + 
        `\n*VALOR TOTAL DO PEDIDO:* R$${totalOrderValue.toFixed(2)}\n` +
        `*Observação do pedido*: ${addressInput.value || "Nenhuma observação"}`
    );

    const phone = "61995949137";

    // Enviar mensagem via WhatsApp
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Limpar o carrinho e atualizar o modal
    cart = [];
    updateCartModal();
});
