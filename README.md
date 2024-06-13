# ①課題番号-プロダクト名
- 6-Mapアプリ
- Google Map API（Maps JavaScript API）、Open Meteo API、Firebase（Cloud Firestore）、LocalStorageを利用

## ②課題内容（どんな作品か）

- 多良間島のスタンプラリー
    - 個人名を入れてもらうため最初に名前だけ入力してもらいます（index.html）
        - その情報はLocalStorageに保存されスタンプラリー画面（stamp.html）の右上に表示されます。
    - 多良間島の主要な観光スポットについて、左側には一覧とスタンプ部分、右側にはGoogle Mapを表示しています。
    - 左側の一覧について
        - スポット名をクリックすると下に概要の一文と写真が表示されます。hoverも効かせてます。
        - 円のところはスタンプエリアになっていて、確認アラートが出たのちチェックが入ります。一度チェックを入れると外せません。
    - 右側の地図について
        - 左側の一覧に対応する場所にピンを立てています。クリックすると吹き出しでスポット名が出ます。
        - 次のスポットをクリックすると、吹き出しは自動で閉じられます。
        - 一応今後現在地とも連携したいので現在地にも赤色でピンがつきます。
    - 左の一覧と右の地図の連動について
        - 左のスポット名をクリックすると地図の方も吹き出しが表示されます。
        - 右のピンをクリックすると左の一覧に色が付いて、写真が表示されます。
        - そのまま次のピンをクリックをすると一覧の方も前のものは写真が閉じられて次のものが開きます。
    - 画面リロード時は以前のスタンプの状態が再現されるようにしています
        - 初回に、名前を登録した日付をキーにfirestoreに全スポットFalseで設定
        - スタンプ（チェック）を入れる都度、firestoreに書き込み
        - リロード時にfirestoreのデータを読み込んでチェックをつけ直し
    - スタンプ画面の左下に日の出・日の入り時刻を入れています
        - 本来はお天気を入れたかったのですがWMO Code変換表を自分で作る必要があり時間の都合今回は見送り
    - 一応レスポンシブ対応です

## ③DEMO
- https://chisaxworks.github.io/gs_kadai05_api/

## ④作ったアプリケーション用のIDまたはPasswordがある場合

- ID: 今回なし
- PW: 今回なし

## ⑤工夫した点・こだわった点

- 使い勝手のよさで、左右の連動は必要だと思ったので、大変でしたが今回の工夫点です。
- 画面がリロードしてもそれまでの進捗がわかるようにfirestoreへデータを格納して、リロード時に再現するようにしたのもUX的な工夫点です。
    - スタンプラリー運用者が今誰がどれくらい使っているかが分かると良いと思いLocalStorageではなくFirebaseにしました。
    - また人数が増えても対応しやすいようRealtime Databeseではなく Cloud Firestoreで実装ししました

## ⑥難しかった点・次回トライしたいこと(又は機能)

- スタンプを現在地がスポットの近くに到着したら、入れられるようにしたいと思いますが、実証実験が必要なので今回は入れていません。
- 右のピンをクリックした時に左をスクロールする部分は、使い勝手的にどちらが良いか悩ましく、現状は入れていません。

## ⑦質問・疑問・感想、シェアしたいこと等なんでも

- 今回はかなり各公式ドキュメントにお世話になりました。公式ドキュメントから使い方を拾うやり方に慣れることができたと思います。
    - 最初にBing Map API、次にGoogle Map API（Maps JavaScript API）、Cloud Firestore...

- [参考記事]
    - Google MapのURLから拾って作ったピン（Google Map用語ではマーカー）がずれる問題はGeocordingを使って解決しました。
        - 記事→ https://qiita.com/0x50/items/2d440f5efba412c39f9d
        - Geocording→ https://www.geocoding.jp/
