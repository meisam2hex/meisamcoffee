document.addEventListener('DOMContentLoaded', function () {
    // Price range slider update
    const priceRange = document.querySelector('#priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            const parent = this.closest('div');
            const label = parent.querySelector('label span:last-child');
            if(label) {
                // This is a simple display update. A real implementation would filter products.
                const formattedValue = new Intl.NumberFormat('fa-IR').format(this.value);
                label.textContent = `${formattedValue} تومان`;
            }
        });
    }

    // Product card hover effect is handled by CSS.
    // No extra JS needed for the current design.

    // Bootstrap Carousel initialization
    const testimonialCarousel = document.querySelector('#testimonialCarousel');
    if (testimonialCarousel) {
        new bootstrap.Carousel(testimonialCarousel, {
            interval: 5000,
            wrap: true
        });
    }

    // Bootstrap Tabs initialization
    const productTabs = document.querySelectorAll('#productTabs button');
    productTabs.forEach(tabEl => {
        tabEl.addEventListener('click', function (event) {
            event.preventDefault();
            const tab = new bootstrap.Tab(this);
            tab.show();
        });
    });

});
