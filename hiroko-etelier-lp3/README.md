# Etelier ランディングページ

印象設計スタイリスト HIROKO のランディングページです。
LINE公式アカウントの友だち追加を主目的にしています。

## ファイル構成

```
index.html   … ページ本体
style.css    … デザイン
script.js    … アニメーション・計測・LINE URL反映
images/      … 画像を入れるフォルダ（後から追加）
```

## 1. LINE登録URLの設定（最重要）

`index.html` の下のほう、`window.ETELIER_CONFIG` の中を書き換えるだけで、
ページ内すべてのボタンに反映されます。

```js
window.ETELIER_CONFIG = {
  LINE_URL: "https://lin.ee/xxxxxxx",   // ← ここにLINEのURL
  GA4_ID:   "G-XXXXXXXXXX"              // ← GA4を使う場合だけ（空でもOK）
};
```

その他のリンク（Instagram・プライバシーポリシー・お問い合わせ）は
`index.html` 内の `[Instagram URL]` などを検索して直接置き換えてください。

## 2. 画像の入れ方

いまは画像部分がピンクの点線枠（プレースホルダー）になっています。
`images/` フォルダに写真を入れて、`index.html` の各枠を差し替えます。

差し替えたい枠は `data-slot="..."` で名前が付いています。例：

```html
<!-- 変更前 -->
<div class="img-frame ratio-3-4" data-slot="hero-hiroko">
  <span class="img-label">グレーのスーツ姿で笑うHIROKO</span>
</div>

<!-- 変更後 -->
<div class="img-frame ratio-3-4" data-slot="hero-hiroko">
  <img src="images/hero-hiroko.jpg" alt="グレーのスーツ姿で笑うHIROKO"
       width="900" height="1200" loading="eager">
</div>
```

枠の縦横比（ratio-3-4 など）は決まっているので、画像もその比率に近いものを推奨します。
顔や服が切れる場合は、そのimgに `style="object-position: top;"` などを足して調整できます。

### 画像スロット一覧

| data-slot | 使う場所 | 推奨比率 |
|---|---|---|
| hero-hiroko | ファーストビュー | 3:4（縦） |
| future-1〜3 | 未来カード3枚 | 4:5 |
| redefine-before / -after | 問題の再定義 | 4:5 |
| case1-after / case1-before | 変化事例1 | After 3:4 / Before 4:5 |
| case2-after / case2-before | 変化事例2 | After 3:4 / Before 4:5 |
| gift-phone | LINE特典・スマホ | 縦長 |
| gift-pl1〜5 | 特典・ポラロイド | 4:5 |
| profile-hiroko | プロフィール | 3:4（縦） |
| final-hiroko | 最終CTA | 3:4（縦） |

※ 使用許諾が確認できた顧客写真のみ掲載してください。
※ OGP画像は `images/ogp.jpg`（横長）を置いてください。

## 3. GitHub Pages での公開

1. GitHubの対象リポジトリに `index.html` `style.css` `script.js` と `images/` をアップロード
2. リポジトリの **Settings → Pages** を開く
3. **Source** を「Deploy from a branch」、Branch を `main` / `(root)` に設定して Save
4. 数分後、表示されるURLで公開されます

パスはすべて相対パス（`images/...`）なので、そのままGitHub Pagesで動きます。

## まだ差し替えが必要な項目（プレースホルダー）

- `[LINE登録URL]` … LINEのURL
- `[Instagram URL]` / `[プライバシーポリシーURL]` / `[問い合わせ先]`
- `［正式な税込価格］` … サービスセクションの料金
- `［お客様の声＝実際の感想を挿入］` … 事例1・2のお客様の声（実際の感想のみ）
- 各 `data-slot` の画像
