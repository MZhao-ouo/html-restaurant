//同步金币
function show_money() {
    money.children[0].textContent = total_money;
}
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
    FlashNotice.children[0].children[0].textContent = s;
    show_predef("FlashNotice_id");
    setTimeout("hide_predef('FlashNotice_id')", 2250);
}
//页面的起始弹窗
function startup_pop() {
    // 遮罩
    show_predef("shadow_id", "dialog_id");
    let start_button = document.querySelector("#FWbutton");
    start_button.addEventListener("click", hide_predef("shadow_id", "dialog_id"));
}
//点击waiting头像，开始点餐
function order_start() {
    if (cus_number >= 4) {
        show_FlashNotice("没有空位了");
        return ;
    }
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
    let dishes = [];
    let checkboxes = document.getElementsByTagName("input");
    for (let checkbox of checkboxes) {
        if (checkbox.checked == true) {
            let chosen_dish = checkbox.parentNode.children[1];
            dishes.push(chosen_dish);
            let spend_money = chosen_dish.children[2].textContent;
            spend_money = Number(spend_money.replace("￥", ""));
            total_money += spend_money; 
            checkbox.checked = false;            
        }
    }
    add_customer(dishes);
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
//添加顾客
function add_customer(dishes) {
    customers[cus_number].children[0].style.backgroundImage = "url('./src/customer1.png')";

    for (let dish of dishes) {
        let dish_name = dish.children[0].textContent;
        let dish_price = Number(dish.children[2].textContent.replace("￥", ""));

        let order_tmp = document.createElement("div");
        order_tmp.setAttribute("class", "orders");
        let order_p = document.createElement("p");
        order_p.textContent = dish_name;
        order_tmp.append(order_p);
        customers[cus_number].children[1].append(order_tmp);
    }

    cus_number++;
    wait_number--;
    waiting_list.removeChild(waiting_list.children[0]);
}
//新到等位
function new_waiting() {
    if (wait_number >= 6) {
        return ;
    }
    let wait_tmp = document.createElement("span");
    wait_tmp.setAttribute("class", "waiting");
    wait_tmp.style.backgroundImage = "url(./src/customer7)";

    waiting_list.append(wait_tmp);
    wait_number++;
}
///////////////////////////////////////////////////////////////////////////////

startup_pop();

// 游戏数据初始化
total_money = 123;
cook_number = 1;
cus_number = 0;
wait_number = 0;

FlashNotice = document.getElementById("FlashNotice_id");
money = document.getElementById("money");
waiting_list = document.getElementsByClassName("waiting_list")[0];
customers = document.getElementsByClassName("customer");

order = document.querySelector(".waiting_list");
order.addEventListener("click", order_start);

cookadd = document.getElementById("cookadd");
cookadd.addEventListener("click", query_newcook);

setInterval(show_money, 1);
setInterval(new_waiting, 3000)
