//LocalStorage
if(localStorage.hasOwnProperty("name")){
    location.href = "stamp.html";
    console.log("nameデータあり");
}

//ログインきっかけ
$("#login").on("click", function () {    

    //入力した名前を取得
    let username = $("#username").val();

    if(username === ""){
        alert("名前を入力してください");
    }else{

        //localstorageにセット
        localStorage.setItem("name", username);

        // 画面遷移
        location.href = "stamp.html";
    }

});