//生成随机数 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
  }
//同步金币
function show_money() {
    money.children[0].textContent = total_money;
    if (total_money < 0) {
        show_predef("shadow_id");
        show_FlashNotice("GAME OVER");
        gameover = 1;
        timeOff();
    }
}
//同步时间
function show_date() {
    let day = days % 7 + 1;
    let week = Math.floor(days / 7) + 1;
    date.children[0].textContent = `W${week} D${day}`;
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
    if (!gameover) {
        for (let id of ids) {
            prediv = document.getElementById(id);
            prediv.style.display = "none";        
        }        
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
    show_predef("shadow_id", "dialog_id");
    let start_button = document.querySelector("#FWbutton");
    start_button.addEventListener("click", ()=>{timeOn();hide_predef("shadow_id", "dialog_id")});
}
//点击waiting头像，开始点餐
function order_start() {
    if (cus_number >= 4) {
        show_FlashNotice("没有空位了");
        return ;
    }
    if (wait_number <= 0) {
        return ; 
    }
    let menu =          document.getElementById("menu");
    let menu_details =  document.getElementById("menu_details");
    show_predef("shadow_id", "menu_id");
    menu.children[0].style.backgroundImage = waiting_list.children[0].style.backgroundImage;
    menu_details.textContent = `${waiting_list.children[0].children[0].children[0].textContent}正在点菜`;

    confirm_button = document.getElementById("confirm-button");
    cancel_button = document.getElementById("cancel-button");
    
    confirm_button.removeEventListener("click", order_confirm);
    let maindishchoose = setInterval(()=>{ 
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
            spend_money = dishes_price[spend_money];
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
        let cross_icon = document.createElement("div");
        cross_icon.setAttribute("class", "cross_icon");
        cross_icon.textContent = "X"; 
        let cook_avatar = document.createElement("div");
        cook_avatar.setAttribute("class", "cook-avatar");
        let cooking_name = document.createElement("div");
        cooking_name.setAttribute("class", "cooking-name");
        let cooking_name_p = document.createElement("p");

        cooking_name.appendChild(cooking_name_p);
        new_cook.appendChild(cross_icon);
        new_cook.appendChild(cook_avatar);
        new_cook.appendChild(cooking_name);
        cookadd.before(new_cook);
        cook_number++;
        // 删除按钮
        cross_set.push(cross_icon);
        let current_corss = cross_set[cross_set.length-1];
        cross_set[cross_set.length-1].addEventListener("click", ()=>{rm_cook(current_corss)});

    } else {
        show_FlashNotice("您当前的金额不足以支付起新厨师的工资");
    }
    if (cook_number >= 6) {
        cookadd.style.display = "none";
    }
    query_hiden();
}
//解雇厨师
function rm_cook(cross_icon) {
    show_predef("shadow_id", "rmcook_id");
    let confirm_rmcook = document.getElementById("confirm-rmcook");
    let cancel_rmcook = document.getElementById("cancel-rmcook");

    confirm_rmcook.addEventListener("click", ()=>{
        let cook = cross_icon.parentNode;
        cook.parentNode.removeChild(cook);
        cook_number--;
        if (cook_number < 6) {
            cookadd.style.display = "initial";
        }
        hide_predef("shadow_id", "rmcook_id");   
    })
    cancel_rmcook.addEventListener("click", ()=>{
        hide_predef("shadow_id", "rmcook_id");
    })
}
//添加顾客
function add_customer(dishes) {
    for (let sit of customers) {
        if (sit.attributes["status"].value == "empty") {
            sit.setAttribute("status", "busy");
            sit.children[0].style.backgroundImage = waiting_list.children[0].style.backgroundImage;
            // 添加名字
            let cus_p = document.createElement("p");
            cus_p.textContent = waiting_list.children[0].children[0].children[0].textContent;
            let cus_name = document.createElement("div");
            cus_name.setAttribute("class", "cus_name");
            cus_name.appendChild(cus_p);
            sit.children[0].appendChild(cus_name);

            for (let dish of dishes) {
                let dish_name = dish.children[0].textContent;
                let dish_price = dishes_price[dish_name];
        
                let order_tmp = document.createElement("div");
                order_tmp.setAttribute("class", "orders");
                order_tmp.setAttribute("status", "waiting");
                let order_p = document.createElement("p");
                order_p.textContent = dish_name;
                order_tmp.append(order_p);
                sit.children[1].append(order_tmp);

                to_cook_list.push(dish_name);
            }
        
            cus_number++;
            wait_number--;
            waiting_list.removeChild(waiting_list.children[0]);

            setTimeout(()=>{
                cus_name.style = "transition:--progress 15000ms linear; --progress:100%";
            },100);

            table_timer[sit.attributes["id"].value] = setTimeout(()=>{
                if (!gameover) {
                    cus_name.style = "transition:--progress 460ms linear; --progress:0%";
                    rm_customer(sit);
                    show_FlashNotice("客人都等菜半天了，气冲冲地走了");                    
                }

            }, 15000);

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
    clearTimeout(table_timer[customer.attributes["id"].value]);
    // 优雅地移除所有子节点 https://developer.mozilla.org/zh-CN/docs/Web/API/Node/removeChild
    while (cusOrder.firstChild) {
        cusOrder.removeChild(cusOrder.firstChild);
    }
    while (cusAvatar.firstChild) {
        cusAvatar.removeChild(cusAvatar.firstChild);
    }
    cus_number--;
}
//新到等位
function new_waiting() {
    if (wait_number >= 6 || to_wait < 0) { return ; }
    let rand_num = getRandomIntInclusive(1, 7);
    if (have_come.includes(rand_num)) { return ; }

    let wait_tmp = document.createElement("span");
    wait_tmp.setAttribute("class", "waiting");
    let wait_str = waiting_names[rand_num-1];
    let wait_p = document.createElement("p");
    wait_p.textContent = wait_str;
    let wait_name = document.createElement("div");
    wait_name.setAttribute("class", "wait_name");

    let avatar_tmp = "./src/customer" + String(rand_num) + ".png";
    let bkColor = gradient_list[rand_num%5];
    // 格式化字符串 https://www.letianbiji.com/web-front-end/js-string-format.html
    wait_tmp.style.backgroundImage = `url(${avatar_tmp}), ${bkColor}`;

    wait_name.appendChild(wait_p);
    wait_tmp.appendChild(wait_name);
    waiting_list.append(wait_tmp);
    have_come.push(rand_num);
    wait_number++;
    to_wait--;

    setTimeout(()=>{
        wait_name.style = "transition: --progress 15000ms linear; --progress:100%";
    }, 100);

    setTimeout(()=>{
        if (waiting_list.children[0] == wait_tmp) {
            if (!gameover) {
                wait_name.style = "transition: --progress 460ms linear; --progress:0%";
                show_FlashNotice(`客人${wait_str}都排队半天了，气冲冲地走了`);
                waiting_list.removeChild(waiting_list.children[0]);
                wait_number--;
                order_cancel();                
            }
        }
    }, 15000);
}
// 检查是否有需要做的菜
function check_cook() {
    for (let dish of to_cook_list) {
        for (let cook of cooks) {
            if (cook.attributes["status"].value == "empty") {
                cook.setAttribute("status", "busy");
                to_cook_list.shift();

                cook.children[2].children[0].textContent = dish;
                cooking_fc(cook);
                return ;
            }
        }
    }
}
// 做菜
function cooking_fc(cook) {
    let dish = cook.children[2].children[0].textContent;
    let cooking_time = main_dish.includes(dish) ? 8000 : 4000 ;

    cook.children[2].style = `transition: --progress ${cooking_time}ms linear; --progress:100%; `;

    setTimeout(()=>{ 
        if (!gameover) {
            cook.children[2].children[0].textContent = "";
            cook.setAttribute("status", "empty");
            server(dish);
            cook.children[2].style = `transition: --progress ${460}ms linear; --progress:0%; `;
        }
    }, cooking_time);
}
// 上菜
function server(dish) {
    let eating_time = main_dish.includes(dish) ? 6000 : 3000;
    for (let sit of customers) {
        let dishes = sit.children[1].getElementsByClassName("orders");
        for (let order_dish of dishes) {
            if (order_dish.children[0].textContent == dish && order_dish.attributes["status"].value == "waiting") {
                let timerID = sit.attributes["id"].value;
                let cus_name = sit.children[0].children[0];
                clearTimeout(table_timer[timerID]);
                cus_name.style = "transition:--progress 460ms linear; --progress:20%";
                setTimeout(()=>{
                    cus_name.style = "transition:--progress 12000ms linear; --progress:100%";
                }, 100);
                table_timer[timerID] = setTimeout(()=>{
                    if (!gameover) {
                        cus_name.style = "transition:--progress 460ms linear; --progress:0%";
                        rm_customer(sit);
                        show_FlashNotice(`客人${cus_name.children[0].textContent}都等菜半天了，气冲冲地走了`); 
                    }
                }, 12000);

                order_dish.style = `transition: --progress ${eating_time}ms linear; --progress:100%;`
                order_dish.setAttribute("status", "eating");
                setTimeout(()=>{
                    if (!gameover) {
                        order_dish.parentNode.removeChild(order_dish);
                        order_dish.style = `transition: --progress ${460}ms linear; --progress:0%;`
                        if (sit.children[1].children.length == 0) {
                            rm_customer(sit);
                        }
                        // 付钱
                        for (let checkbox of checkboxes) {
                            if (checkbox.parentNode.children[1].children[0].textContent == dish) {
                                total_money += dishes_price[dish]; 
                            } 
                        } 
                    }
                }, eating_time);
                return true;
            }
        }
    }

    return false;
}
//新的一天
function newday() {
    days++;
    to_wait = getRandomIntInclusive(5,7);
    have_come = [];
    if (days % 7 == 0 && days != 0) {
        let salary = 100*cook_number;
        show_FlashNotice(`一周过去了，给厨师发工资 ${salary} ￥`);
        total_money -= salary;
    }
}
//时间流转
function timeOn() {
    ITV_money = setInterval(show_money, 1);
    ITV_date = setInterval(show_date, 1);
    ITV_wait = setInterval(new_waiting, 3000);
    ITV_cook = setInterval(check_cook, 100);
    ITV_newday = setInterval(newday, 35000);
}
//时间冻结
function timeOff() {
    clearInterval(ITV_money);
    clearInterval(ITV_date);
    clearInterval(ITV_wait);
    clearInterval(ITV_cook);
    clearInterval(ITV_newday);
}
///////////////////////////////////////////////////////////////////////////////

// 游戏数据初始化
days = -1;
total_money = 233;
cook_number = 1;
cus_number = 0;
wait_number = 0;
to_wait = 0;
to_cook_list = [];
have_come = [];
table_timer = {c1:0, c2:0, c3:0, c4:0};
cross_set = [];
gameover = 0;

waiting_names = ["Elon", "Tim", "Linus", "Jobs", "Craig", "Notch", "jeb_"]
main_dish = ["UL炖LI", "红烧HEAD", "酥炸ECharts", "炙烤CSS", "清蒸DIV"];
dishes_price = {凉拌SAN:6, 冷切DOM:4, UL炖LI:12, 红烧HEAD:15, 酥炸ECharts:18, 炙烤CSS:16, 清蒸DIV:12, 鲜榨flex:5, 小程序奶茶:6};
gradient_list = ["linear-gradient(to right, #ff2626 50%, #b20000 50%)",
                 "linear-gradient(to right, #80ff00 50%, #00b200 50%)",
                 "linear-gradient(to right, #ff9122 50%, #d96d00 50%)",
                 "linear-gradient(to right, #2693ff 50%, #006dd9 50%)",
                 "linear-gradient(to right, #ac91ff 50%, #7a4dff 50%)"];

date =          document.getElementById("date");
FlashNotice =   document.getElementById("FlashNotice_id");
money =         document.getElementById("money");
waiting_list =  document.getElementsByClassName("waiting_list")[0];
customers =     document.getElementsByClassName("customer");
cooks =         document.getElementsByClassName("cook");
checkboxes =    document.getElementsByTagName("input");

order = document.querySelector(".waiting_list");
order.addEventListener("click", order_start);

cookadd = document.getElementById("cookadd");
cookadd.addEventListener("click", query_newcook);

startup_pop();
newday();
