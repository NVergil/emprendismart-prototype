document.addEventListener('DOMContentLoaded', () => {
    // Lógica de Navegación existente
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    const setActiveTab = (targetId) => {
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        const link = document.querySelector(`.nav-link[data-target="${targetId}"]`);
        const section = document.getElementById(targetId);

        if (link) link.classList.add('active');
        if (section) section.classList.add('active');
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('data-target');
            setActiveTab(targetId);
        });
    });

    // Estado inicial
    setActiveTab('content-module');

    // --- MÓDULO DE FINANZAS ---
    const transactionForm = document.querySelector('#finances-module .transaction-form');
    const transactionTableBody = document.querySelector('#finances-module tbody');
    const balanceDisplay = document.querySelector('.balance-display span');

    let balance = 300.00; // Saldo inicial
    const transactions = [ // Transacciones iniciales
        { date: '11/07/2025', description: 'Venta de 2 croissants', amount: 50.00, type: 'income' },
        { date: '10/07/2025', description: 'Compra de granos de café', amount: -120.00, type: 'expense' },
        { date: '10/07/2025', description: 'Venta de 1 Americano', amount: 35.00, type: 'income' },
        { date: '09/07/2025', description: 'Pago de servicio de luz', amount: -450.00, type: 'expense' },
        { date: '09/07/2025', description: 'Venta de 10 cafés', amount: 785.00, type: 'income' }
    ];

    const renderTransactions = () => {
        transactionTableBody.innerHTML = '';
        let currentBalance = 0;

        transactions.forEach(tx => {
            const row = document.createElement('tr');
            const amountClass = tx.amount > 0 ? 'income' : 'expense';
            const sign = tx.amount > 0 ? '+' : '';

            row.innerHTML = `
                <td>${tx.date}</td>
                <td>${tx.description}</td>
                <td class="${amountClass}">${sign}${Math.abs(tx.amount).toFixed(2)}</td>
            `;
            transactionTableBody.appendChild(row);
            currentBalance += tx.amount;
        });
        
        balance = currentBalance;
        balanceDisplay.textContent = `${balance.toFixed(2)}`;
        balanceDisplay.style.color = balance >= 0 ? 'var(--color-accent)' : 'var(--color-danger)';
    };

    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const descriptionInput = transactionForm.querySelector('input[type="text"]');
        const amountInput = transactionForm.querySelector('input[type="number"]');
        const typeSelect = transactionForm.querySelector('select');

        const description = descriptionInput.value;
        let amount = parseFloat(amountInput.value);
        const type = typeSelect.value;

        if (description && !isNaN(amount)) {
            if (type === 'Egreso') {
                amount = -amount;
            }

            const newTransaction = {
                date: new Date().toLocaleDateString('es-ES'),
                description: description,
                amount: amount
            };

            transactions.unshift(newTransaction); // Añadir al principio
            renderTransactions();

            descriptionInput.value = '';
            amountInput.value = '';
        }
    });
    
    // Calculadora de Precios
    const priceCalculatorForm = document.querySelector('#finances-module .card:last-child form');
    const priceSuggestionDisplay = document.querySelector('.price-suggestion span');

    priceCalculatorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const costInput = priceCalculatorForm.querySelector('input[type="number"]:first-child');
        const marginInput = priceCalculatorForm.querySelector('input[type="number"]:last-child');
        
        const cost = parseFloat(costInput.value);
        const margin = parseFloat(marginInput.value);

        if (!isNaN(cost) && !isNaN(margin) && margin < 100) {
            const suggestedPrice = cost / (1 - (margin / 100));
            priceSuggestionDisplay.textContent = `${suggestedPrice.toFixed(2)}`;
        } else {
            priceSuggestionDisplay.textContent = '$XX.XX';
        }
    });


    // --- MÓDULO DE INVENTARIO ---
    const productForm = document.querySelector('#inventory-module .transaction-form');
    const productList = document.querySelector('.product-list');

    const initialProducts = [
        { name: 'Café en grano', quantity: 10, unit: 'kg', lowStock: false },
        { name: 'Croissants', quantity: 25, unit: 'unidades', lowStock: false },
        { name: 'Leche de almendras', quantity: 2, unit: 'litros', lowStock: true },
        { name: 'Vasos de papel', quantity: 150, unit: 'unidades', lowStock: false }
    ];

    const renderProducts = () => {
        productList.innerHTML = '';
        initialProducts.forEach(p => {
            const listItem = document.createElement('li');
            if (p.lowStock) {
                listItem.classList.add('low-stock-item');
            }
            
            listItem.innerHTML = `
                <span>${p.name} - ${p.quantity} ${p.unit}</span>
                <div class="product-status">
                    ${p.lowStock ? '<span class="low-stock-alert">¡Bajo Stock!</span>' : ''}
                </div>
            `;
            productList.appendChild(listItem);
        });
    };

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = productForm.querySelector('input[type="text"]');
        const quantityInput = productForm.querySelector('input[type="number"]');
        const unitInput = productForm.querySelector('input[type="text"]:last-of-type');

        const name = nameInput.value;
        const quantity = parseInt(quantityInput.value);
        const unit = unitInput.value;

        if (name && !isNaN(quantity) && unit) {
            const newProduct = {
                name,
                quantity,
                unit,
                lowStock: quantity <= 5 // Ejemplo de umbral de bajo stock
            };
            initialProducts.unshift(newProduct);
            renderProducts();

            nameInput.value = '';
            quantityInput.value = '';
            unitInput.value = '';
        }
    });

    // Render inicial al cargar la página
    renderTransactions();
    renderProducts();
});