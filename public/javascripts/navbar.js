let openMenu = document.getElementById("openMenu");
let closeMenu = document.getElementById("closeMenu");
let hamburger = document.getElementById("hamburger");
let brand = document.querySelector(".brand");

openMenu.addEventListener("click", function() {
    hamburger.style.transform = `translateX(${0}px)`;
    window.innerWidth < 1200 ? hamburger.style.width = "100%" : hamburger.style.width = "28%";
});
closeMenu.addEventListener("click", function() {
    hamburger.style.transform = `translateX(${200}px)`;
    hamburger.style.width = "0%"
});

closeMenu.click();

brand.onclick = () => {
    window.location.href = '/';
};