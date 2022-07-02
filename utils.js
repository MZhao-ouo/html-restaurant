//显示预定义的block
export function show_predef(...ids) {
    for (let id of ids) {
        prediv = document.getElementById(id);
        prediv.style.display = "initial";
    }
}
//隐藏预定义的block
export function hide_predef(...ids) {
    for (let id of ids) {
        prediv = document.getElementById(id);
        prediv.style.display = "none";        
    }

}
//页面的起始弹窗
export function startup_pop() {
    // 遮罩
    show_predef("shadow_id", "dialog_id");
    start_button = document.querySelector("#FWbutton");
    start_button.addEventListener("click", game_start);
}
//游戏开始，页面起始弹窗消失
export function game_start() {
    hide_predef("shadow_id", "dialog_id");
}

