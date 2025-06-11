// This function will run once the entire HTML document is loaded.
function main() {
    'use strict';

    // --- 1. Get references to all necessary DOM elements ---
    const elements = {
        form: document.getElementById('invoice-form'),
        itemsContainer: document.getElementById('items-container'),
        addItemBtn: document.getElementById('add-item-btn'),
        printBtn: document.getElementById('print-btn'),
        resetBtn: document.getElementById('reset-btn'),
        
        // Input fields
        inputs: {
            sellerName: document.getElementById('seller-name'),
            sellerAddress: document.getElementById('seller-address'),
            sellerPhone: document.getElementById('seller-phone'),
            customerName: document.getElementById('customer-name'),
            customerAddress: document.getElementById('customer-address'),
            customerPhone: document.getElementById('customer-phone'),
            invoiceNumber: document.getElementById('invoice-number'),
            invoiceDate: document.getElementById('invoice-date'),
            deviceBrand: document.getElementById('device-brand'),
            deviceModel: document.getElementById('device-model'),
            discount: document.getElementById('discount-amount'),
            taxCheckbox: document.getElementById('tax-checkbox'),
            notes: document.getElementById('notes'),
            terms: document.getElementById('terms'),
            warranty: document.getElementById('warranty'),
        },

        // Preview fields
        previews: {
            sellerName: document.getElementById('preview-seller-name'),
            sellerAddress: document.getElementById('preview-seller-address'),
            sellerPhone: document.getElementById('preview-seller-phone'),
            customerName: document.getElementById('preview-customer-name'),
            customerAddress: document.getElementById('preview-customer-address'),
            customerPhone: document.getElementById('preview-customer-phone'),
            invoiceNumber: document.getElementById('preview-invoice-number'),
            invoiceDate: document.getElementById('preview-invoice-date'),
            deviceBrand: document.getElementById('preview-device-brand'),
            deviceModel: document.getElementById('preview-device-model'),
            itemsBody: document.getElementById('preview-items-body'),
            subtotal: document.getElementById('preview-subtotal'),
            discount: document.getElementById('preview-discount'),
            tax: document.getElementById('preview-tax'),
            total: document.getElementById('preview-total'),
            totalWords: document.getElementById('preview-total-words'),
            notes: document.getElementById('preview-notes'),
            terms: document.getElementById('preview-terms'),
            warranty: document.getElementById('preview-warranty'),
        }
    };

    // --- 2. Helper Functions ---
    const formatNumber = (num) => new Intl.NumberFormat('fa-IR').format(num);

    // --- 3. Core Functions ---
    function updatePreview() {
        // Update simple text fields
        elements.previews.sellerName.textContent = elements.inputs.sellerName.value || '[نام شرکت]';
        elements.previews.sellerAddress.textContent = elements.inputs.sellerAddress.value || '[آدرس]';
        elements.previews.sellerPhone.textContent = elements.inputs.sellerPhone.value || '[تلفن]';
        elements.previews.customerName.textContent = elements.inputs.customerName.value || '[نام مشتری]';
        elements.previews.customerAddress.textContent = elements.inputs.customerAddress.value || '[آدرس]';
        elements.previews.customerPhone.textContent = elements.inputs.customerPhone.value || '[تلفن]';
        elements.previews.invoiceNumber.textContent = elements.inputs.invoiceNumber.value || '[شماره]';
        elements.previews.deviceBrand.textContent = elements.inputs.deviceBrand.value || '[برند]';
        elements.previews.deviceModel.textContent = elements.inputs.deviceModel.value || '[مدل]';
        elements.previews.notes.textContent = elements.inputs.notes.value || '[شرح تعمیرات...]';
        elements.previews.terms.textContent = elements.inputs.terms.value || '[شرایط پرداخت...]';
        elements.previews.warranty.textContent = elements.inputs.warranty.value || '[گارانتی...]';
        
        // Update date field
        const dateValue = elements.inputs.invoiceDate.value;
        elements.previews.invoiceDate.textContent = dateValue ? new Intl.DateTimeFormat('fa-IR').format(new Date(dateValue)) : '[تاریخ]';

        // Update items table and calculate totals
        elements.previews.itemsBody.innerHTML = '';
        let subtotal = 0;
        const itemRows = elements.itemsContainer.querySelectorAll('.item-row');
        
        itemRows.forEach((row, index) => {
            const desc = row.querySelector('.item-desc').value || '';
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            const total = qty * price;
            subtotal += total;

            const previewRow = elements.previews.itemsBody.insertRow();
            previewRow.innerHTML = `<td>${index + 1}</td><td>${desc}</td><td>${formatNumber(qty)}</td><td>${formatNumber(price)}</td><td class="text-left font-medium">${formatNumber(total)}</td>`;
        });

        const discount = parseFloat(elements.inputs.discount.value) || 0;
        const taxEnabled = elements.inputs.taxCheckbox.checked;
        const amountAfterDiscount = subtotal - discount;
        const tax = taxEnabled ? Math.round(amountAfterDiscount * 0.09) : 0;
        const total = amountAfterDiscount + tax;

        elements.previews.subtotal.textContent = formatNumber(subtotal);
        elements.previews.discount.textContent = `(${formatNumber(discount)})`;
        elements.previews.tax.textContent = formatNumber(tax);
        elements.previews.total.textContent = formatNumber(total);
        // This part for converting number to words is complex and can be added back if needed.
        // For now, focusing on stability.
        elements.previews.totalWords.textContent = ''; 
    }

    function addItemRow() {
        const row = document.createElement('div');
        row.className = 'item-row grid grid-cols-12 gap-2 items-center';
        row.innerHTML = `<input type="text" class="form-input col-span-5 item-desc" placeholder="شرح کالا یا خدمات"><input type="number" class="form-input col-span-2 item-qty" placeholder="تعداد" min="1" value="1"><input type="number" class="form-input col-span-3 item-price" placeholder="قیمت واحد" min="0"><div class="col-span-2 text-center"><button type="button" class="btn-danger remove-item-btn">حذف</button></div>`;
        elements.itemsContainer.appendChild(row);
    }

    // --- 4. Event Listeners ---
    elements.form.addEventListener('input', updatePreview);

    elements.itemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            e.target.closest('.item-row').remove();
            updatePreview();
        }
    });
    
    elements.addItemBtn.addEventListener('click', () => {
        addItemRow();
        updatePreview();
    });
    
    elements.printBtn.addEventListener('click', () => window.print());
    
    elements.resetBtn.addEventListener('click', () => {
        elements.form.reset();
        elements.itemsContainer.innerHTML = '';
        addItemRow();
        updatePreview();
    });

    // --- 5. Initial State ---
    function initialize() {
        elements.inputs.invoiceDate.value = new Date().toISOString().split('T')[0];
        addItemRow();
        updatePreview();
    }

    initialize();
}

// Ensure the main function runs only after the page is fully loaded.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
