//生成随机数 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
  }
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
    setTimeout("hide_predef('FlashNotice_id')", 2000);
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
    let menu = document.getElementById("menu");
    menu.children[0].style.backgroundImage = waiting_list.children[0].style.backgroundImage;

    confirm_button = document.getElementById("confirm-button");
    cancel_button = document.getElementById("cancel-button");
    
    confirm_button.removeEventListener("click", order_confirm);
    setInterval(()=>{
        for (let i=2; i<=6; i++) {
            if (checkboxes[i].checked == true) {
                confirm_button.addEventListener("click", order_confirm);
                confirm_button.style.backgroundImage = "linear-gradient(to bottom, #ffe699 50%, #ffd24d 50%)";
                confirm_button.children[0].style.color = "#8c6900"; 
                return ;
            }
        }
        confirm_button.removeEventListener("click", order_confirm); 
        confirm_button.style.backgroundImage = "linear-gradient(to bottom, #dddddd 50%, #aaaaaa 50%)";
        confirm_button.children[0].style.color = "grey";  
    })
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
    let dishes = [];
    for (let checkbox of checkboxes) {
        if (checkbox.checked == true) {
            let chosen_dish = checkbox.parentNode.children[1];
            dishes.push(chosen_dish);
            let spend_money = chosen_dish.children[2].textContent;
            spend_money = Number(spend_money.replace("￥", ""));
            // total_money += spend_money; 
            checkbox.checked = false;            
        }
    }

    add_customer(dishes);
    order_cancel();
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

        let new_cook = document.createElement("span");
        new_cook.setAttribute("status", "empty");
        new_cook.setAttribute("class", "cook");
        let cook_avatar = document.createElement("div");
        cook_avatar.setAttribute("class", "cook-avatar");
        let cooking_name = document.createElement("div");
        cooking_name.setAttribute("class", "cooking-name");
        let cooking_name_p = document.createElement("p");

        cooking_name.appendChild(cooking_name_p);
        new_cook.appendChild(cook_avatar);
        new_cook.appendChild(cooking_name);
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
    for (let sit of customers) {
        if (sit.attributes["status"].value == "empty") {
            sit.setAttribute("status", "busy");
            sit.children[0].style.backgroundImage = waiting_list.children[0].style.backgroundImage;

            for (let dish of dishes) {
                let dish_name = dish.children[0].textContent;
                let dish_price = Number(dish.children[2].textContent.replace("￥", ""));
        
                let order_tmp = document.createElement("div");
                order_tmp.setAttribute("class", "orders");
                let order_p = document.createElement("p");
                order_p.textContent = dish_name;
                order_tmp.append(order_p);
                sit.children[1].append(order_tmp);

                to_cook_list.push(dish_name);
            }
        
            cus_number++;
            wait_number--;
            waiting_list.removeChild(waiting_list.children[0]);

            return ;
        }
    }
}
//移除顾客
function rm_customer(customer) {
    let cusAvatar = customer.children[0];
    let cusOrder = customer.children[1];
    cusAvatar.style.backgroundImage = "linear-gradient(to right, #dddddd 50%, #aaaaaa 50%)";
    customer.setAttribute("status", "empty");
    // 优雅地移除所有子节点 https://developer.mozilla.org/zh-CN/docs/Web/API/Node/removeChild
    while (cusOrder.firstChild) {
        cusOrder.removeChild(cusOrder.firstChild);
    }
    cus_number--;
}
//新到等位
function new_waiting() {
    if (wait_number >= 6) {
        return ;
    }
    let wait_tmp = document.createElement("span");
    wait_tmp.setAttribute("class", "waiting");
    let rand_num = getRandomIntInclusive(1, 7);

    let avatar_tmp = "./src/customer" + String(rand_num) + ".png";
    let bkColor = "linear-gradient(to right, #ff2626 50%, #b20000 50%)"
    // 格式化字符串 https://www.letianbiji.com/web-front-end/js-string-format.html
    wait_tmp.style.backgroundImage = `url(${avatar_tmp}), ${bkColor}`;

    waiting_list.append(wait_tmp);
    wait_number++;
}
// 检查是否有需要做的菜
function check_cook() {
    for (let dish of to_cook_list) {
        for (let cook of cooks) {
            if (cook.attributes["status"].value == "empty") {
                cook.setAttribute("status", "busy");
                to_cook_list.shift();

                cook.children[1].children[0].textContent = dish;
                cooking_fc(cook);
                return ;
            }
        }
    }
}
// 做菜
function cooking_fc(cook) {
    let dish = cook.children[1].children[0].textContent;

    setTimeout(()=>{
        cook.children[1].children[0].textContent = "";
        cook.setAttribute("status", "empty");
        server(dish);
    }, 3000);
}
// 上菜
function server(dish) {
    for (let sit of customers) {
        let dishes = sit.children[1].getElementsByClassName("orders");
        for (let order_dish of dishes) {
            if (order_dish.children[0].textContent == dish) {
                order_dish.style.backgroundColor = "green";
                setTimeout(()=>{
                    order_dish.parentNode.removeChild(order_dish);
                    if (sit.children[1].children.length == 0) {
                        rm_customer(sit);
                    }
                    // 付钱
                    for (let checkbox of checkboxes) {
                        if (checkbox.parentNode.children[1].children[0].textContent == dish) {
                            total_money += Number(checkbox.parentNode.children[1].children[2].textContent.replace("￥", ""));
                        } 
                    }
                }, 1000);
                return true;
            }
        }
    }
    return false;
}
///////////////////////////////////////////////////////////////////////////////

startup_pop();

// 游戏数据初始化
total_money = 233;
cook_number = 1;
cus_number = 0;
wait_number = 0;
to_cook_list = [];
cooking_list = [];
cooked_list = [];

FlashNotice = document.getElementById("FlashNotice_id");
money = document.getElementById("money");
waiting_list = document.getElementsByClassName("waiting_list")[0];
customers = document.getElementsByClassName("customer");
cooks = document.getElementsByClassName("cook");
checkboxes = document.getElementsByTagName("input");

order = document.querySelector(".waiting_list");
order.addEventListener("click", order_start);

cookadd = document.getElementById("cookadd");
cookadd.addEventListener("click", query_newcook);

setInterval(show_money, 1);
setInterval(new_waiting, 3000);
setInterval(check_cook, 100);
