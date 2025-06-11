// Wait for the entire HTML document to be loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Get references to all necessary DOM elements ---
    // This makes the code cleaner and easier to debug.
    const form = document.getElementById('invoice-form');
    const itemsContainer = document.getElementById('items-container');
    const addItemBtn = document.getElementById('add-item-btn');
    const printBtn = document.getElementById('print-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Input fields
    const sellerNameInput = document.getElementById('seller-name');
    const sellerAddressInput = document.getElementById('seller-address');
    const sellerPhoneInput = document.getElementById('seller-phone');
    const customerNameInput = document.getElementById('customer-name');
    const customerAddressInput = document.getElementById('customer-address');
    const customerPhoneInput = document.getElementById('customer-phone');
    const invoiceNumberInput = document.getElementById('invoice-number');
    const invoiceDateInput = document.getElementById('invoice-date');
    const deviceBrandInput = document.getElementById('device-brand');
    const deviceModelInput = document.getElementById('device-model');
    const discountInput = document.getElementById('discount-amount');
    const taxCheckbox = document.getElementById('tax-checkbox');
    const notesInput = document.getElementById('notes');
    const termsInput = document.getElementById('terms');
    const warrantyInput = document.getElementById('warranty');

    // Preview fields
    const previewSellerName = document.getElementById('preview-seller-name');
    const previewSellerAddress = document.getElementById('preview-seller-address');
    const previewSellerPhone = document.getElementById('preview-seller-phone');
    const previewCustomerName = document.getElementById('preview-customer-name');
    const previewCustomerAddress = document.getElementById('preview-customer-address');
    const previewCustomerPhone = document.getElementById('preview-customer-phone');
    const previewInvoiceNumber = document.getElementById('preview-invoice-number');
    const previewInvoiceDate = document.getElementById('preview-invoice-date');
    const previewDeviceBrand = document.getElementById('preview-device-brand');
    const previewDeviceModel = document.getElementById('preview-device-model');
    const previewItemsBody = document.getElementById('preview-items-body');
    const previewSubtotal = document.getElementById('preview-subtotal');
    const previewDiscount = document.getElementById('preview-discount');
    const previewTax = document.getElementById('preview-tax');
    const previewTotal = document.getElementById('preview-total');
    const previewTotalWords = document.getElementById('preview-total-words');
    const previewNotes = document.getElementById('preview-notes');
    const previewTerms = document.getElementById('preview-terms');
    const previewWarranty = document.getElementById('preview-warranty');

    // --- 2. Helper Functions ---

    const formatNumber = (num) => new Intl.NumberFormat('fa-IR').format(num);

    const numberToWords = (num) => {
        if (num === null || isNaN(num)) return '';
        num = Math.round(num);
        const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
        const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
        const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
        const hundreds = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
        const thousands = ['', 'هزار', 'میلیون', 'میلیارد'];

        function convertLessThanOneThousand(n) {
            if (n === 0) return '';
            if (n < 10) return ones[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' و ' + ones[n % 10] : '');
            return hundreds[Math.floor(n / 100)] + (n % 100 !== 0 ? ' و ' + convertLessThanOneThousand(n % 100) : '');
        }

        if (num === 0) return 'صفر';
        let word = '';
        let i = 0;
        while (num > 0) {
            if (num % 1000 !== 0) {
                word = convertLessThanOneThousand(num % 1000) + ' ' + thousands[i] + (word ? ' و ' : '') + word;
            }
            num = Math.floor(num / 1000);
            i++;
        }
        return word.trim();
    };

    // --- 3. Core Functions ---

    const updatePreview = () => {
        // Update static text fields
        previewSellerName.textContent = sellerNameInput.value || '[نام شرکت]';
        previewSellerAddress.textContent = sellerAddressInput.value || '[آدرس]';
        previewSellerPhone.textContent = sellerPhoneInput.value || '[تلفن]';
        previewCustomerName.textContent = customerNameInput.value || '[نام مشتری]';
        previewCustomerAddress.textContent = customerAddressInput.value || '[آدرس]';
        previewCustomerPhone.textContent = customerPhoneInput.value || '[تلفن]';
        previewInvoiceNumber.textContent = invoiceNumberInput.value || '[شماره]';
        previewDeviceBrand.textContent = deviceBrandInput.value || '[برند]';
        previewDeviceModel.textContent = deviceModelInput.value || '[مدل]';
        previewNotes.textContent = notesInput.value || '[شرح تعمیرات...]';
        previewTerms.textContent = termsInput.value || '[شرایط پرداخت...]';
        previewWarranty.textContent = warrantyInput.value || '[گارانتی...]';
        
        const dateValue = invoiceDateInput.value;
        previewInvoiceDate.textContent = dateValue ? new Intl.DateTimeFormat('fa-IR').format(new Date(dateValue)) : '[تاریخ]';

        // Update items table and calculate totals
        previewItemsBody.innerHTML = '';
        let subtotal = 0;
        const itemRows = itemsContainer.querySelectorAll('.item-row');
        
        itemRows.forEach((row, index) => {
            const desc = row.querySelector('.item-desc').value;
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            const total = qty * price;
            subtotal += total;

            const previewRow = document.createElement('tr');
            previewRow.innerHTML = `<td>${index + 1}</td><td>${desc || ''}</td><td>${formatNumber(qty)}</td><td>${formatNumber(price)}</td><td class="text-left font-medium">${formatNumber(total)}</td>`;
            previewItemsBody.appendChild(previewRow);
        });

        const discount = parseFloat(discountInput.value) || 0;
        const taxEnabled = taxCheckbox.checked;
        const amountAfterDiscount = subtotal - discount;
        const tax = taxEnabled ? Math.round(amountAfterDiscount * 0.09) : 0;
        const total = amountAfterDiscount + tax;

        previewSubtotal.textContent = formatNumber(subtotal);
        previewDiscount.textContent = `(${formatNumber(discount)})`;
        previewTax.textContent = formatNumber(tax);
        previewTotal.textContent = formatNumber(total);
        previewTotalWords.textContent = total > 0 ? numberToWords(total) + ' ریال' : '';
    };

    const addItemRow = () => {
        const row = document.createElement('div');
        row.className = 'item-row grid grid-cols-12 gap-2 items-center';
        row.innerHTML = `<input type="text" class="form-input col-span-5 item-desc" placeholder="شرح کالا یا خدمات"><input type="number" class="form-input col-span-2 item-qty" placeholder="تعداد" min="1" value="1"><input type="number" class="form-input col-span-3 item-price" placeholder="قیمت واحد" min="0"><div class="col-span-2 text-center"><button type="button" class="btn-danger remove-item-btn">حذف</button></div>`;
        itemsContainer.appendChild(row);
    };

    // --- 4. Event Listeners ---

    // Listen for any input changes on the entire form
    form.addEventListener('input', updatePreview);

    // Specifically handle clicks inside the items container (for remove buttons)
    itemsContainer.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('remove-item-btn')) {
            e.target.closest('.item-row').remove();
            updatePreview(); // Update preview after removing a row
        }
    });
    
    // Add item button click
    addItemBtn.addEventListener('click', () => {
        addItemRow();
        updatePreview();
    });
    
    // Action buttons
    printBtn.addEventListener('click', () => window.print());
    resetBtn.addEventListener('click', () => {
        form.reset();
        itemsContainer.innerHTML = '';
        addItemRow(); // Add one row back after clearing
        updatePreview();
    });

    // --- 5. Initial State ---
    
    // Set today's date
    invoiceDateInput.value = new Date().toISOString().split('T')[0];
    
    // Add one initial item row
    addItemRow();
    
    // Run preview once to initialize the view
    updatePreview();
});
