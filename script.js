const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");

        const icon = menuBtn.querySelector("i");

        if (navLinks.classList.contains("open")) {
            icon?.classList.remove("fa-bars");
            icon?.classList.add("fa-xmark");
        } else {
            icon?.classList.remove("fa-xmark");
            icon?.classList.add("fa-bars");
        }
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");

            const icon = menuBtn.querySelector("i");

            icon?.classList.remove("fa-xmark");
            icon?.classList.add("fa-bars");
        });
    });
}

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

let toastTimer;

function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) return;

    modal.classList.add("show");
    document.body.classList.add("modal-open");
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) return;

    modal.classList.remove("show");

    if (!document.querySelector(".modal.show")) {
        document.body.classList.remove("modal-open");
    }
}

function switchModal(currentModal, nextModal) {
    closeModal(currentModal);
    openModal(nextModal);
}

document.querySelectorAll(".open-login").forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();
        openModal("loginModal");
    });
});

document.querySelectorAll(".open-register").forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();
        openModal("registerModal");
    });
});

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal("loginModal");
        closeModal("registerModal");
    }
});

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        closeModal("loginModal");
        showToast("Login successful! Welcome back.");

        loginForm.reset();
    });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", event => {
        event.preventDefault();

        closeModal("registerModal");
        showToast("Account created successfully!");

        registerForm.reset();
    });
}

const heroSearch = document.getElementById("heroSearch");
const heroSearchBtn = document.getElementById("searchBtn");
const searchCategory = document.getElementById("searchCategory");

function performHeroSearch() {
    if (!heroSearch || !searchCategory) return;

    const query = heroSearch.value.trim();
    const category = searchCategory.value;

    if (!query && category === "all") {
        showToast("Please enter a service or choose a category.");
        heroSearch.focus();
        return;
    }

    const params = new URLSearchParams();

    if (query) {
        params.set("search", query);
    }

    if (category !== "all") {
        params.set("category", category);
    }

    window.location.href = `services.html?${params.toString()}`;
}

if (heroSearchBtn) {
    heroSearchBtn.addEventListener("click", performHeroSearch);
}

if (heroSearch) {
    heroSearch.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            performHeroSearch();
        }
    });
}

document.querySelectorAll(".popular-searches button").forEach(button => {
    button.addEventListener("click", () => {
        if (!heroSearch) return;

        heroSearch.value = button.dataset.search;

        if (searchCategory) {
            searchCategory.value = "all";
        }

        performHeroSearch();
    });
});

document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
        const category = card.dataset.category;

        if (!category) return;

        window.location.href =
            `services.html?category=${encodeURIComponent(category)}`;
    });
});

const filterButtons = document.querySelectorAll(".filter-btn");
const freelancerCards = document.querySelectorAll(".freelancer-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const filter = button.dataset.filter;

        freelancerCards.forEach(card => {
            if (filter === "all" || card.dataset.role === filter) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});

document.querySelectorAll(".favorite").forEach(button => {
    button.addEventListener("click", event => {
        event.stopPropagation();

        button.classList.toggle("liked");

        const icon = button.querySelector("i");

        if (!icon) return;

        if (button.classList.contains("liked")) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

            showToast("Freelancer added to favorites.");
        } else {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

            showToast("Removed from favorites.");
        }
    });
});

document.querySelectorAll(".view-profile").forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".freelancer-card");

        if (!card) return;

        const name = card.querySelector("h3")?.textContent.trim();

        if (!name) return;

        localStorage.setItem("selectedFreelancer", name);

        window.location.href = "profile.html";
    });
});

const servicesGrid = document.getElementById("servicesGrid");
const marketplaceSearch = document.getElementById("serviceSearch");
const marketplaceSearchBtn = document.getElementById("marketplaceSearchBtn");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");
const sortSelect = document.getElementById("sortSelect");
const clearFilters = document.getElementById("clearFilters");

let selectedSkill = "";

function filterServices() {
    if (!servicesGrid) return;

    const cards = Array.from(
        servicesGrid.querySelectorAll(".market-card")
    );

    const searchTerm = marketplaceSearch
        ? marketplaceSearch.value.toLowerCase().trim()
        : "";

    const selectedCategory =
        document.querySelector('input[name="category"]:checked');

    const category = selectedCategory
        ? selectedCategory.value
        : "All";

    let visibleCount = 0;

    cards.forEach(card => {

        const name = (card.dataset.name || "").toLowerCase();
        const title = (card.dataset.title || "").toLowerCase();
        const cardCategory = card.dataset.category || "";
        const skills = (card.dataset.skills || "").toLowerCase();

        const matchesSearch =
            !searchTerm ||
            name.includes(searchTerm) ||
            title.includes(searchTerm) ||
            cardCategory.toLowerCase().includes(searchTerm) ||
            skills.includes(searchTerm);

        const matchesCategory =
            category === "All" ||
            cardCategory === category;

        const matchesSkill =
            !selectedSkill ||
            skills.includes(selectedSkill.toLowerCase());

        if (matchesSearch && matchesCategory && matchesSkill) {
            card.style.display = "";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    if (resultCount) {
        resultCount.textContent =
            `Showing ${visibleCount} result${visibleCount !== 1 ? "s" : ""}`;
    }

    if (noResults) {
        noResults.style.display =
            visibleCount === 0 ? "block" : "none";
    }
}

if (marketplaceSearchBtn) {
    marketplaceSearchBtn.addEventListener("click", filterServices);
}

if (marketplaceSearch) {
    marketplaceSearch.addEventListener("input", filterServices);

    marketplaceSearch.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            filterServices();
        }
    });
}

document.querySelectorAll('input[name="category"]').forEach(input => {
    input.addEventListener("change", () => {
        filterServices();
    });
});

document.querySelectorAll(".skill-tags button").forEach(button => {
    button.addEventListener("click", () => {

        const skill = button.dataset.skill;

        if (selectedSkill === skill) {
            selectedSkill = "";
            button.classList.remove("active");
        } else {
            document.querySelectorAll(".skill-tags button").forEach(btn => {
                btn.classList.remove("active");
            });

            selectedSkill = skill;
            button.classList.add("active");
        }

        filterServices();
    });
});

if (sortSelect && servicesGrid) {

    sortSelect.addEventListener("change", () => {

        const cards = Array.from(
            servicesGrid.querySelectorAll(".market-card")
        );

        const sortType = sortSelect.value;

        cards.sort((a, b) => {

            const priceA = Number(a.dataset.price || 0);
            const priceB = Number(b.dataset.price || 0);

            const ratingA = Number(a.dataset.rating || 0);
            const ratingB = Number(b.dataset.rating || 0);

            if (sortType === "priceLow") {
                return priceA - priceB;
            }

            if (sortType === "priceHigh") {
                return priceB - priceA;
            }

            if (sortType === "rating") {
                return ratingB - ratingA;
            }

            return 0;
        });

        cards.forEach(card => {
            servicesGrid.appendChild(card);
        });

        filterServices();
    });
}

if (clearFilters) {

    clearFilters.addEventListener("click", () => {

        if (marketplaceSearch) {
            marketplaceSearch.value = "";
        }

        const allCategory =
            document.querySelector(
                'input[name="category"][value="All"]'
            );

        if (allCategory) {
            allCategory.checked = true;
        }

        if (sortSelect) {
            sortSelect.value = "default";
        }

        selectedSkill = "";

        document.querySelectorAll(".skill-tags button").forEach(button => {
            button.classList.remove("active");
        });

        filterServices();

        showToast("Filters cleared.");
    });
}

document.querySelectorAll(".favorite-btn").forEach(button => {

    button.addEventListener("click", event => {

        event.stopPropagation();

        button.classList.toggle("active");

        const icon = button.querySelector("i");

        if (!icon) return;

        if (button.classList.contains("active")) {

            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

            showToast("Added to favorites.");

        } else {

            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

            showToast("Removed from favorites.");
        }
    });
});

document.querySelectorAll(".profile-link").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;

        if (!name) return;

        localStorage.setItem("selectedFreelancer", name);

        window.location.href = "profile.html";
    });
});

document.querySelectorAll(".service-link").forEach(button => {

    button.addEventListener("click", () => {

        const service = button.dataset.service;

        if (!service) return;

        localStorage.setItem("selectedService", service);

        window.location.href = "service-details.html";
    });
});

const freelancerData = {

    "Ali Raza": {
        image: "https://i.pravatar.cc/300?img=12",
        role: "Professional Web Developer",
        rating: "4.9",
        reviews: "128 reviews",
        projects: "156",
        response: "1 hour",
        experience: "5+ Years",
        about: "I am a professional freelance developer focused on building modern, responsive and high-quality websites for businesses and startups. I specialize in creating clean user interfaces and reliable web experiences.",
        skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "UI/UX", "Web Development"]
    },

    "Sara Ahmed": {
        image: "https://i.pravatar.cc/300?img=47",
        role: "Professional Graphic Designer",
        rating: "4.8",
        reviews: "96 reviews",
        projects: "121",
        response: "2 hours",
        experience: "4+ Years",
        about: "I am a creative graphic designer specializing in logos, brand identities and visual content for businesses and modern startups.",
        skills: ["Logo Design", "Brand Identity", "UI/UX", "Photoshop", "Illustrator"]
    },

    "Hamza Khan": {
        image: "https://i.pravatar.cc/300?img=68",
        role: "Mobile App Developer",
        rating: "5.0",
        reviews: "74 reviews",
        projects: "98",
        response: "1 hour",
        experience: "4+ Years",
        about: "I build modern and scalable mobile applications with clean interfaces and smooth user experiences for Android and iOS platforms.",
        skills: ["React", "JavaScript", "Mobile Development", "UI Design", "API Integration"]
    },

    "Ayesha Malik": {
        image: "https://i.pravatar.cc/300?img=44",
        role: "Data Analyst",
        rating: "4.9",
        reviews: "81 reviews",
        projects: "113",
        response: "2 hours",
        experience: "5+ Years",
        about: "I help businesses transform raw data into useful insights through professional analysis, visualization and reporting.",
        skills: ["Python", "Data Analysis", "Excel", "Visualization", "Statistics"]
    },

    "Usman Tariq": {
        image: "https://i.pravatar.cc/300?img=11",
        role: "Digital Marketing Expert",
        rating: "4.7",
        reviews: "65 reviews",
        projects: "87",
        response: "3 hours",
        experience: "4+ Years",
        about: "I create practical digital marketing strategies that help businesses improve visibility, engagement and online growth.",
        skills: ["SEO", "Marketing", "Social Media", "Content Strategy", "Analytics"]
    },

    "Zain Abbas": {
        image: "https://i.pravatar.cc/300?img=53",
        role: "UI/UX Designer",
        rating: "4.8",
        reviews: "103 reviews",
        projects: "142",
        response: "1 hour",
        experience: "5+ Years",
        about: "I design modern, intuitive and user-focused interfaces for websites, dashboards and digital products.",
        skills: ["UI/UX", "Figma", "Wireframing", "Prototyping", "Design Systems"]
    },

    "Bilal Ahmed": {
        image: "https://i.pravatar.cc/300?img=60",
        role: "Python Developer",
        rating: "4.9",
        reviews: "92 reviews",
        projects: "134",
        response: "2 hours",
        experience: "5+ Years",
        about: "I develop reliable Python web applications with clean architecture, responsive interfaces and scalable functionality.",
        skills: ["Python", "Django", "HTML", "CSS", "JavaScript", "SQL"]
    },

    "Maham Noor": {
        image: "https://i.pravatar.cc/300?img=49",
        role: "Marketing Specialist",
        rating: "4.6",
        reviews: "57 reviews",
        projects: "79",
        response: "3 hours",
        experience: "3+ Years",
        about: "I help brands build stronger social media presence through engaging content and effective marketing campaigns.",
        skills: ["Social Media", "Marketing", "Content Creation", "Campaigns"]
    },

    "Hassan Ali": {
        image: "https://i.pravatar.cc/300?img=14",
        role: "Data Specialist",
        rating: "4.8",
        reviews: "69 reviews",
        projects: "104",
        response: "2 hours",
        experience: "4+ Years",
        about: "I specialize in business dashboards, data reporting and analytical solutions that help organizations make better decisions.",
        skills: ["Data Analysis", "Dashboards", "Excel", "SQL", "Visualization"]
    },

    "Fatima Khan": {
        image: "https://i.pravatar.cc/300?img=32",
        role: "Brand Designer",
        rating: "5.0",
        reviews: "88 reviews",
        projects: "126",
        response: "1 hour",
        experience: "5+ Years",
        about: "I create memorable brand identities that help businesses communicate their values through professional visual design.",
        skills: ["Brand Identity", "UI/UX", "Logo Design", "Typography"]
    },

    "Omar Shah": {
        image: "https://i.pravatar.cc/300?img=5",
        role: "Frontend Developer",
        rating: "4.7",
        reviews: "76 reviews",
        projects: "101",
        response: "2 hours",
        experience: "4+ Years",
        about: "I build modern frontend applications with responsive layouts, interactive interfaces and clean JavaScript code.",
        skills: ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design"]
    },

    "Noor Fatima": {
        image: "https://i.pravatar.cc/300?img=25",
        role: "Mobile Developer",
        rating: "4.9",
        reviews: "91 reviews",
        projects: "119",
        response: "1 hour",
        experience: "5+ Years",
        about: "I develop cross-platform mobile applications focused on performance, usability and modern design.",
        skills: ["React", "JavaScript", "Mobile Development", "API Integration"]
    }
};

const selectedFreelancer =
    localStorage.getItem("selectedFreelancer");

if (
    selectedFreelancer &&
    freelancerData[selectedFreelancer]
) {

    const data = freelancerData[selectedFreelancer];

    const profileName = document.getElementById("profileName");
    const profileRole = document.getElementById("profileRole");
    const profileImage = document.getElementById("profileImage");
    const profileRating = document.getElementById("profileRating");
    const profileReviews = document.getElementById("profileReviews");
    const profileAbout = document.getElementById("profileAbout");
    const profileProjects = document.getElementById("profileProjects");
    const profileStatRating = document.getElementById("profileStatRating");
    const profileResponse = document.getElementById("profileResponse");
    const profileExperience = document.getElementById("profileExperience");
    const profileSkills = document.getElementById("profileSkills");

    if (profileName) profileName.textContent = selectedFreelancer;
    if (profileRole) profileRole.textContent = data.role;
    if (profileImage) profileImage.src = data.image;
    if (profileRating) profileRating.textContent = data.rating;
    if (profileReviews) profileReviews.textContent = data.reviews;
    if (profileAbout) profileAbout.textContent = data.about;
    if (profileProjects) profileProjects.textContent = data.projects;
    if (profileStatRating) profileStatRating.textContent = `${data.rating}/5`;
    if (profileResponse) profileResponse.textContent = data.response;
    if (profileExperience) profileExperience.textContent = data.experience;

    if (profileSkills) {
        profileSkills.innerHTML = "";

        data.skills.forEach(skill => {
            const span = document.createElement("span");
            span.textContent = skill;
            profileSkills.appendChild(span);
        });
    }
}

const saveProfile = document.getElementById("saveProfile");

if (saveProfile) {

    saveProfile.addEventListener("click", () => {

        saveProfile.classList.toggle("saved");

        const icon = saveProfile.querySelector("i");

        if (saveProfile.classList.contains("saved")) {

            icon?.classList.remove("fa-regular");
            icon?.classList.add("fa-solid");

            showToast("Freelancer saved.");

        } else {

            icon?.classList.remove("fa-solid");
            icon?.classList.add("fa-regular");

            showToast("Freelancer removed from saved list.");
        }
    });
}

const contactFreelancer =
    document.getElementById("contactFreelancer");

if (contactFreelancer) {
    contactFreelancer.addEventListener("click", () => {
        showToast("Messaging feature coming soon.");
    });
}

const serviceData = {

    "Modern Responsive Website": {
        category: "Web Development",
        title: "Modern Responsive Website",
        price: "$80",
        rating: "4.9",
        reviews: "128 Reviews",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        seller: "Ali Raza",
        sellerRole: "Professional Web Developer",
        sellerImage: "https://i.pravatar.cc/100?img=12",
        description: "I will create a modern, professional and fully responsive website designed according to your requirements. The website will work smoothly across desktop, tablet and mobile devices. The service includes clean code, responsive layouts, modern UI design and optimized user experience."
    },

    "Professional Logo Design": {
        category: "Graphic Design",
        title: "Professional Logo Design",
        price: "$45",
        rating: "4.8",
        reviews: "96 Reviews",
        image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
        seller: "Sara Ahmed",
        sellerRole: "Professional Graphic Designer",
        sellerImage: "https://i.pravatar.cc/100?img=47",
        description: "I will create a professional and memorable logo that represents your brand identity. You will receive a modern design created according to your business requirements."
    },

    "Android & iOS Mobile App": {
        category: "Mobile Development",
        title: "Android & iOS Mobile App",
        price: "$150",
        rating: "5.0",
        reviews: "74 Reviews",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
        seller: "Hamza Khan",
        sellerRole: "Mobile App Developer",
        sellerImage: "https://i.pravatar.cc/100?img=68",
        description: "I will develop a modern mobile application with a clean interface and smooth user experience for Android and iOS platforms."
    },

    "Data Analysis & Visualization": {
        category: "Data Analysis",
        title: "Data Analysis & Visualization",
        price: "$95",
        rating: "4.9",
        reviews: "81 Reviews",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        seller: "Ayesha Malik",
        sellerRole: "Data Analyst",
        sellerImage: "https://i.pravatar.cc/100?img=44",
        description: "I will analyze your data and create professional visualizations and reports that help you understand important trends and business insights."
    },

    "SEO & Digital Marketing": {
        category: "Digital Marketing",
        title: "SEO & Digital Marketing",
        price: "$60",
        rating: "4.7",
        reviews: "65 Reviews",
        image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80",
        seller: "Usman Tariq",
        sellerRole: "Digital Marketing Expert",
        sellerImage: "https://i.pravatar.cc/100?img=11",
        description: "I will improve your online presence through professional SEO and digital marketing strategies designed to increase visibility and engagement."
    },

    "UI UX Website Design": {
        category: "Graphic Design",
        title: "UI UX Website Design",
        price: "$70",
        rating: "4.8",
        reviews: "103 Reviews",
        image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
        seller: "Zain Abbas",
        sellerRole: "UI/UX Designer",
        sellerImage: "https://i.pravatar.cc/100?img=53",
        description: "I will design a modern and user-friendly website interface focused on usability, visual hierarchy and an excellent user experience."
    },

    "Python Web Application": {
        category: "Web Development",
        title: "Python Web Application",
        price: "$120",
        rating: "4.9",
        reviews: "92 Reviews",
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
        seller: "Bilal Ahmed",
        sellerRole: "Python Developer",
        sellerImage: "https://i.pravatar.cc/100?img=60",
        description: "I will build a reliable Python web application with clean architecture, responsive interfaces and functionality tailored to your requirements."
    },

    "Social Media Marketing": {
        category: "Digital Marketing",
        title: "Social Media Marketing",
        price: "$55",
        rating: "4.6",
        reviews: "57 Reviews",
        image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1200&q=80",
        seller: "Maham Noor",
        sellerRole: "Marketing Specialist",
        sellerImage: "https://i.pravatar.cc/100?img=49",
        description: "I will create a professional social media marketing strategy to improve your brand awareness, engagement and online growth."
    },

    "Business Dashboard": {
        category: "Data Analysis",
        title: "Business Dashboard",
        price: "$110",
        rating: "4.8",
        reviews: "69 Reviews",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        seller: "Hassan Ali",
        sellerRole: "Data Specialist",
        sellerImage: "https://i.pravatar.cc/100?img=14",
        description: "I will create a professional business dashboard that transforms your data into clear and useful visual reports."
    },

    "Creative Brand Identity": {
        category: "Graphic Design",
        title: "Creative Brand Identity",
        price: "$90",
        rating: "5.0",
        reviews: "88 Reviews",
        image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1200&q=80",
        seller: "Fatima Khan",
        sellerRole: "Brand Designer",
        sellerImage: "https://i.pravatar.cc/100?img=32",
        description: "I will develop a creative brand identity that gives your business a professional and memorable visual presence."
    },

    "React Web Application": {
        category: "Web Development",
        title: "React Web Application",
        price: "$135",
        rating: "4.7",
        reviews: "76 Reviews",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        seller: "Omar Shah",
        sellerRole: "Frontend Developer",
        sellerImage: "https://i.pravatar.cc/100?img=5",
        description: "I will build a modern and interactive React web application with responsive layouts and clean frontend architecture."
    },

    "Cross Platform Mobile App": {
        category: "Mobile Development",
        title: "Cross Platform Mobile App",
        price: "$180",
        rating: "4.9",
        reviews: "91 Reviews",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
        seller: "Noor Fatima",
        sellerRole: "Mobile Developer",
        sellerImage: "https://i.pravatar.cc/100?img=25",
        description: "I will develop a high-quality cross-platform mobile application with a modern interface, responsive experience and reliable functionality."
    }
};

const selectedService =
    localStorage.getItem("selectedService");

if (
    selectedService &&
    serviceData[selectedService]
) {

    const data = serviceData[selectedService];

    const serviceImage = document.getElementById("serviceImage");
    const serviceCategory = document.getElementById("serviceCategory");
    const serviceTitle = document.getElementById("serviceTitle");
    const servicePrice = document.getElementById("servicePrice");
    const serviceRating = document.getElementById("serviceRating");
    const serviceReviews = document.getElementById("serviceReviews");
    const serviceDescription = document.getElementById("serviceDescription");
    const sellerImage = document.getElementById("sellerImage");
    const sellerName = document.getElementById("sellerName");
    const sellerRole = document.getElementById("sellerRole");

    if (serviceImage) {
        serviceImage.src = data.image;
        serviceImage.alt = data.title;
    }

    if (serviceCategory) {
        serviceCategory.textContent = data.category;
    }

    if (serviceTitle) {
        serviceTitle.textContent = data.title;
    }

    if (servicePrice) {
        servicePrice.textContent = data.price;
    }

    if (serviceRating) {
        serviceRating.textContent = data.rating;
    }

    if (serviceReviews) {
        serviceReviews.textContent = data.reviews;
    }

    if (serviceDescription) {
        serviceDescription.textContent = data.description;
    }

    if (sellerImage) {
        sellerImage.src = data.sellerImage;
        sellerImage.alt = data.seller;
    }

    if (sellerName) {
        sellerName.textContent = data.seller;
    }

    if (sellerRole) {
        sellerRole.textContent = data.sellerRole;
    }
}

const orderService =
    document.getElementById("orderService");

if (orderService) {
    orderService.addEventListener("click", () => {
        showToast("Order feature coming soon.");
    });
}

const messageSeller =
    document.getElementById("messageSeller");

if (messageSeller) {
    messageSeller.addEventListener("click", () => {
        showToast("Messaging feature coming soon.");
    });
}

const sellerProfile =
    document.getElementById("sellerProfile");

if (sellerProfile) {

    sellerProfile.addEventListener("click", () => {

        const service =
            serviceData[localStorage.getItem("selectedService")];

        if (!service) return;

        localStorage.setItem(
            "selectedFreelancer",
            service.seller
        );

        window.location.href = "profile.html";
    });
}

const serviceSearchParams =
    new URLSearchParams(window.location.search);

if (servicesGrid) {

    const urlSearch =
        serviceSearchParams.get("search");

    const urlCategory =
        serviceSearchParams.get("category");

    if (urlSearch && marketplaceSearch) {
        marketplaceSearch.value = urlSearch;
    }

    if (urlCategory) {

        const categoryInput =
            document.querySelector(
                `input[name="category"][value="${CSS.escape(urlCategory)}"]`
            );

        if (categoryInput) {
            categoryInput.checked = true;
        }
    }

    filterServices();
}

console.log("Skillora Freelancing Marketplace loaded successfully.");