function test_function() {
    console.log(111)
    shadow = document.createElement("div")
    shadow.setAttribute("class", "shadow")
    document.body.appendChild(shadow)
}

function out_function() {
    shadow = document.querySelector(".shadow")
    shadow.parentNode.removeChild(shadow)
}

const test_button = document.querySelector(".FlashNotice")
test_button.addEventListener("mouseover", test_function)
test_button.addEventListener("mouseout", out_function)
