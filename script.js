//显示预定义的block
function show_predef(...ids) {
    for (let id of ids) {
        prediv = document.getElementById(id);
        prediv.style.display = "initial";
    }
}
//隐藏预定义的block
function hide_predef(...ids) {
    for (let id of ids) {
        prediv = document.getElementById(id);
        prediv.style.display = "none";        
    }

}
//页面的起始弹窗
function startup_pop() {
    // 遮罩
    show_predef("shadow_id", "dialog_id");
    start_button = document.querySelector("#FWbutton");
    start_button.addEventListener("click", game_start);
}
//游戏开始，页面起始弹窗消失
function game_start() {
    hide_predef("shadow_id", "dialog_id");
}
//点击waiting头像，开始点餐
function order_start() {
    show_predef("shadow_id", "menu_id");
    confirm_button = document.getElementById("confirm-button");
    cancel_button = document.getElementById("cancel-button");
    confirm_button.addEventListener("click", order_confirm);
    cancel_button.addEventListener("click", order_cancel);
}
//取消订单
function order_cancel() {
    hide_predef("shadow_id", "menu_id");
}
//提交订单
function order_confirm() {
    let earned_money = 0;
    checkboxes = document.getElementsByTagName("input");
    for (let checkbox of checkboxes) {
        if (checkbox.checked == true) {
            total_money += 10; 
            checkbox.checked = false;            
        }

    }
    order_cancel();
    total_money += earned_money;
}
//增加厨师
function add_cook() {
    if (total_money >= 100) {
        total_money -= 100;
        new_cook = document.createElement("span");
        cookadd.before(new_cook);
        cook_number++;         
    }
    if (cook_number >= 6) {
        cookadd.removeEventListener("click", add_cook);
        cookadd.style.display = "none";
    }
}
//同步金币
function show_money() {
    money = document.getElementById("money");
    money.children[0].textContent = total_money;
}
///////////////////////////////////////////////////////////////////////////////

startup_pop();

// 游戏数据初始化
total_money = 123;
cook_number = 1;

order = document.querySelector(".waiting");
order.addEventListener("click", order_start);

cookadd = document.getElementById("cookadd");
cookadd.addEventListener("click", add_cook);

setInterval(show_money, 1);
