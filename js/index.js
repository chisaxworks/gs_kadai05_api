//LocalStorage
if(localStorage.hasOwnProperty("name")){
    location.href = "stamp.html";
    console.log("nameデータあり");
}

//ログインきっかけ
$("#login").on("click", function () {    

    if(username === ""){
        alert("名前を入力してください");
    }else{

        //入力した名前を取得
        let username = $("#username").val();

        // 日時取得
        let date = new Date;

        // オブジェクト作成
        const userInfo = {
            'username' : username,
            'createDate' : date
        }

        //localstorageにセット
        localStorage.setItem("name", JSON.stringify(userInfo));

        // 画面遷移
        location.href = "stamp.html";
    }

});