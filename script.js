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
//显示FlashNotice
function show_FlashNotice(s) {
    FlashNotice = document.getElementById("FlashNotice_id");
    FlashNotice.children[0].children[0].textContent = s;
    show_predef("FlashNotice_id");
    setTimeout("hide_predef('FlashNotice_id')", 2250);
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
    confirm_button.removeEventListener("click", order_confirm);
    cancel_button.removeEventListener("click", order_cancel);
}
//提交订单
function order_confirm() {
    let earned_money = 0;
    checkboxes = document.getElementsByTagName("input");
    for (let checkbox of checkboxes) {
        if (checkbox.checked == true) {
            spend_money = checkbox.parentNode.children[1].children[2].textContent;
            spend_money = Number(spend_money.replace("￥", ""));
            total_money += spend_money; 
            checkbox.checked = false;            
        }
    }
    order_cancel();
    total_money += earned_money;
}
//招聘请求
function query_newcook() {
    show_predef("shadow_id", "newcook_id");
    confirm_newcook = document.getElementById("confirm-newcook");
    cancel_newcook = document.getElementById("cancel-newcook");
    confirm_newcook.addEventListener("click", add_cook);
    cancel_newcook.addEventListener("click", query_hiden);
}
//隐藏pop
function query_hiden() {
    hide_predef("shadow_id", "newcook_id");
    confirm_newcook.removeEventListener("click", add_cook);
    cancel_newcook.removeEventListener("click", query_hiden);
}
//增加厨师
function add_cook() {
    if (total_money >= 100) {
        total_money -= 100;
        new_cook = document.createElement("span");
        cookadd.before(new_cook);
        cook_number++;         
    } else {
        show_FlashNotice("您当前的金额不足以支付起新厨师的工资");
    }
    if (cook_number >= 6) {
        cookadd.style.display = "none";
    }
    query_hiden();
}
//同步金币
function show_money() {
    money = document.getElementById("money");
    money.children[0].textContent = total_money;
}
//添加顾客
function add_customer() {
    customers = document.getElementsByClassName("customer")
    customers[cus_number].children[0].style.backgroundImage = "url('./src/customer1.png')";
    cus_number++;
}
///////////////////////////////////////////////////////////////////////////////

startup_pop();

// 游戏数据初始化
total_money = 123;
cook_number = 1;
cus_number = 0;

order = document.querySelector(".waiting");
order.addEventListener("click", order_start);

cookadd = document.getElementById("cookadd");
cookadd.addEventListener("click", query_newcook);

setInterval(show_money, 1);
