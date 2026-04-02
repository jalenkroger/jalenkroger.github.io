document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect & Mobile Menu
    const navbar = document.getElementById("navbar");
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    
    // Ensure navbar is "scrolled" if we are not at the top on load (and on subpages where it's already fixed)
    if (window.scrollY > 50 || document.body.classList.contains("subpage")) {
        navbar.classList.add("scrolled");
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50 || document.body.classList.contains("subpage")) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            if(navLinks.classList.contains("active")) {
                navbar.classList.add("scrolled"); // Force scrolled look when menu is open
            }
        });
    }

    // 2. Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Smooth Scrolling for anchor links (only hash links on current page)
    document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            
            const targetHref = this.getAttribute('href');
            
            // Allow the browser to handle full path links to different pages (like index.html#impact)
            const isLocalHash = targetHref.startsWith('#');
            if(!isLocalHash) return; 

            e.preventDefault();
            if(targetHref === '#') return;
            
            const targetElement = document.querySelector(targetHref);
            if(targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                if (navLinks.classList.contains("active")) {
                    navLinks.classList.remove("active");
                }
            }
        });
    });

    // Trigger reveal on load for elements already in viewport
    setTimeout(() => {
        document.querySelector(".hero-content").classList.add("active");
    }, 100);
});
