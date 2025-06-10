// Wait until the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get references to DOM elements
    const form = document.getElementById('invoice-form');
    const itemsContainer = document.getElementById('items-container');
    const addItemBtn = document.getElementById('add-item-btn');
    const allInputs = form.querySelectorAll('input, textarea');

    // --- Helper Functions ---

    /**
     * Formats a number to a Persian-locale string.
     * @param {number} num - The number to format.
     * @returns {string} The formatted number string.
     */
    const formatNumber = (num) => new Intl.NumberFormat('fa-IR').format(num);

    /**
     * Converts a number to its Persian word representation.
     * @param {number} num - The number to convert.
     * @returns {string} The number in words.
     */
    const numberToWords = (num) => {
        if (num === null || num === undefined) return '';
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

    // --- Core Functions ---

    /**
     * Updates the invoice preview with the current form data.
     */
    const updatePreview = () => {
        // Update seller, customer, and invoice details
        document.getElementById('preview-seller-name').textContent = document.getElementById('seller-name').value || '[نام شرکت]';
        document.getElementById('preview-seller-address').textContent = document.getElementById('seller-address').value || '[آدرس]';
        document.getElementById('preview-seller-phone').textContent = document.getElementById('seller-phone').value || '[تلفن]';
        document.getElementById('preview-seller-email').textContent = document.getElementById('seller-email').value || '[ایمیل]';
        document.getElementById('preview-seller-reg').textContent = document.getElementById('seller-reg').value || '[شماره ثبت]';
        document.getElementById('preview-customer-name').textContent = document.getElementById('customer-name').value || '[نام مشتری]';
        document.getElementById('preview-customer-address').textContent = document.getElementById('customer-address').value || '[آدرس]';
        document.getElementById('preview-customer-phone').textContent = document.getElementById('customer-phone').value || '[تلفن]';
        document.getElementById('preview-customer-id').textContent = document.getElementById('customer-id').value || '[کد اقتصادی]';
        document.getElementById('preview-invoice-number').textContent = document.getElementById('invoice-number').value || '[شماره]';
        const dateValue = document.getElementById('invoice-date').value;
        document.getElementById('preview-invoice-date').textContent = dateValue ? new Intl.DateTimeFormat('fa-IR').format(new Date(dateValue)) : '[تاریخ]';
        document.getElementById('preview-device-brand').textContent = document.getElementById('device-brand').value || '[برند]';
        document.getElementById('preview-device-model').textContent = document.getElementById('device-model').value || '[مدل]';
        document.getElementById('preview-device-serial').textContent = document.getElementById('device-serial').value || '[سریال]';
        
        // Update invoice items table
        const itemsPreviewBody = document.getElementById('preview-items-body');
        itemsPreviewBody.innerHTML = '';
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
            itemsPreviewBody.appendChild(previewRow);
        });

        // Calculate and update totals
        const discount = parseFloat(document.getElementById('discount-amount').value) || 0;
        const taxEnabled = document.getElementById('tax-checkbox').checked;
        const amountAfterDiscount = subtotal - discount;
        const tax = taxEnabled ? Math.round(amountAfterDiscount * 0.09) : 0;
        const total = amountAfterDiscount + tax;

        document.getElementById('preview-subtotal').textContent = formatNumber(subtotal);
        document.getElementById('preview-discount').textContent = `(${formatNumber(discount)})`;
        document.getElementById('preview-tax').textContent = formatNumber(tax);
        document.getElementById('preview-total').textContent = formatNumber(total);
        document.getElementById('preview-total-words').textContent = total > 0 ? numberToWords(total) + ' ریال' : '';

        // Update notes and terms
        document.getElementById('preview-notes').textContent = document.getElementById('notes').value || '[شرح تعمیرات...]';
        document.getElementById('preview-terms').textContent = document.getElementById('terms').value || '[شرایط پرداخت...]';
        document.getElementById('preview-warranty').textContent = document.getElementById('warranty').value || '[گارانتی...]';
    };
    
    /**
     * Adds a new item row to the form.
     */
    const addItemRow = () => {
        const row = document.createElement('div');
        row.className = 'item-row grid grid-cols-12 gap-2 items-center';
        row.innerHTML = `<input type="text" class="form-input col-span-5 item-desc" placeholder="شرح کالا یا خدمات"><input type="number" class="form-input col-span-2 item-qty" placeholder="تعداد" min="1" value="1"><input type="number" class="form-input col-span-3 item-price" placeholder="قیمت واحد" min="0"><div class="col-span-2 text-center"><button type="button" class="btn-danger remove-item-btn">حذف</button></div>`;
        itemsContainer.appendChild(row);
    };
    
    // --- Event Listeners ---

    // Event delegation for dynamically added/removed items
    itemsContainer.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('remove-item-btn')) {
            e.target.closest('.item-row').remove();
            updatePreview();
        }
    });

    itemsContainer.addEventListener('input', (e) => {
        if (e.target && (e.target.classList.contains('item-qty') || e.target.classList.contains('item-price') || e.target.classList.contains('item-desc'))) {
            updatePreview();
        }
    });
    
    // Listen for input on all static form fields
    allInputs.forEach(input => input.addEventListener('input', updatePreview));
    
    // Add item button click
    addItemBtn.addEventListener('click', () => {
        addItemRow();
        updatePreview();
    });
    
    // Action buttons
    document.getElementById('print-btn').addEventListener('click', () => window.print());
    document.getElementById('reset-btn').addEventListener('click', () => {
        form.reset();
        itemsContainer.innerHTML = '';
        addItemRow();
        updatePreview();
    });

    // --- Initial State ---
    // Set today's date and add one initial item row
    document.getElementById('invoice-date').value = new Date().toISOString().split('T')[0];
    addItemRow();
    updatePreview();
});
        
