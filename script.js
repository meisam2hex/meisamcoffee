document.addEventListener('DOMContentLoaded', function() {
    const catalogView = document.getElementById('catalog-view');
    const backSection = document.getElementById('back-section');
    const backToCatalogBtn = document.getElementById('backToCatalogBtn');
    const productCards = document.querySelectorAll('.product-card');
    const closeDetailButtons = document.querySelectorAll('[data-action="close-detail"]');

    // تابع برای به‌روزرسانی سال کپی‌رایت فوتر
    function updateCopyrightYear() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
    updateCopyrightYear(); // فراخوانی تابع

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showView(viewToShow) {
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });

        if (viewToShow) {
            viewToShow.classList.add('active');
        }
        
        if (viewToShow === catalogView) {
            backSection.classList.remove('active');
        } else {
            backSection.classList.add('active');
        }
        scrollToTop();
    }

    function showProductDetail(productId) {
        const detailToShow = document.getElementById(productId + '-detail');
        showView(detailToShow);
        // اگر گالری برای این محصول وجود دارد، اولین تصویر بندانگشتی را فعال کن
        // این کار برای زمانی است که کاربر از یک محصول به محصول دیگر می‌رود یا صفحه رفرش می‌شود
        // و می‌خواهیم گالری در وضعیت اولیه صحیح باشد.
        if (detailToShow) {
            const gallery = detailToShow.querySelector('.product-gallery');
            if (gallery) {
                const firstThumbnail = gallery.querySelector('.thumbnail');
                const mainImage = gallery.querySelector('.main-image-container img');
                if (firstThumbnail && mainImage) {
                    mainImage.src = firstThumbnail.dataset.largeSrc;
                    mainImage.alt = firstThumbnail.alt;
                    // حذف active از همه و افزودن به اولی
                    gallery.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                    firstThumbnail.classList.add('active');
                }
            }
        }
    }

    function showCatalog() {
        showView(catalogView);
    }

    function initializeProductGallery(galleryElement) {
        const thumbnails = galleryElement.querySelectorAll('.thumbnail');
        const mainImage = galleryElement.querySelector('.main-image-container img');

        if (!mainImage || thumbnails.length === 0) {
            // console.warn("Gallery not fully initialized, main image or thumbnails missing in:", galleryElement);
            return;
        }

        thumbnails.forEach(thumbnail => {
            // برای جلوگیری از افزودن چندباره رویداد، ابتدا رویداد قبلی را (اگر وجود دارد) حذف می‌کنیم.
            // این کار ساده نیست بدون ذخیره کردن رفرنس تابع رویداد.
            // یک راه ساده‌تر این است که مطمئن شویم initializeProductGallery فقط یک بار برای هر گالری اجرا می‌شود.
            // یا از یک پرچم data-* استفاده کنیم.
            if (thumbnail.dataset.galleryInitialized) return; // اگر قبلا initialize شده، رد شو

            thumbnail.addEventListener('click', function() {
                mainImage.src = this.dataset.largeSrc;
                mainImage.alt = this.alt; 

                galleryElement.querySelector('.thumbnail.active').classList.remove('active');
                this.classList.add('active');
            });

            thumbnail.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    mainImage.src = this.dataset.largeSrc;
                    mainImage.alt = this.alt;
                    if(galleryElement.querySelector('.thumbnail.active')) {
                       galleryElement.querySelector('.thumbnail.active').classList.remove('active');
                    }
                    this.classList.add('active');
                }
            });
            thumbnail.dataset.galleryInitialized = 'true'; // علامت‌گذاری به عنوان initialize شده
        });
    }

    // مقداردهی اولیه تمام گالری‌های موجود در صفحه
    document.querySelectorAll('.product-gallery').forEach(gallery => {
        initializeProductGallery(gallery);
    });

    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.productId;
            if (productId) {
                showProductDetail(productId);
            }
        });
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); 
                const productId = card.dataset.productId;
                if (productId) {
                    showProductDetail(productId);
                }
            }
        });
    });

    closeDetailButtons.forEach(button => {
        button.addEventListener('click', showCatalog);
    });

    if (backToCatalogBtn) {
        backToCatalogBtn.addEventListener('click', showCatalog);
    }

    // انیمیشن اولیه کارت‌های محصول
    if (catalogView.classList.contains('active')) {
        const cardsToAnimate = catalogView.querySelectorAll('.product-card');
        cardsToAnimate.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150); 
        });
    }
});