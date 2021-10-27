const toggleHamburguerMenu = ()=>{
    [...document.querySelectorAll("#layoutMenu > div > a")].map(e=>{
    if (e.classList.contains("hiddenMobile")) {
      e.classList.remove("hiddenMobile")
    }  
    else {
      e.classList.add("hiddenMobile")
    }
    });
    }
document.getElementById("hamburguerMenu").onclick = toggleHamburguerMenu