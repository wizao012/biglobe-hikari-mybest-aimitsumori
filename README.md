# A案：既存Cloudflare Pages差し替え用

公開は未実施です。このフォルダの中身を既存リポジトリの公開対象フォルダに配置します。GitHub Pagesへの新規公開は不要です。

## 引き継ぎ設定
- 元サイト：https://biglobe-hikari-mybest-aimitsumori.pages.dev/
- 送信完了：https://biglobe-hikari-mybest-aimitsumori.pages.dev/thanks
- 会社概要：/company
- プライバシーポリシー：/privacy
- GTM：GTM-T88QDFX3（全4ページに元と同じコードを設置）
- 公開GTM内のGA4：G-JSSG78FK7D
- 公開GTM内のClarity：xykr84u64r
- Zapier：元のCatch Hookを維持
- 送信成功時のdataLayerイベント：form_submit_cvを維持

元LPはthanks.htmlへ遷移し、Cloudflare Pagesにより/thanksに転送されていました。今回はthanks.htmlをルートに置き、最終URLの/thanksへ直接遷移します。ディレクトリ型thanks/index.htmlは配置しないでください。

## 計測はファイル側で対応済み
全ページに既存GTMを設置し、サンクスページで既存GA4（G-JSSG78FK7D）へgenerate_leadを送るコードを追加しています。現在の公開GTMの申込完了条件は/thanksに一致しないため、管理画面の変更なしで補います。Clarityも既存GTMから配信します。
GTM側で今後/thanksのgenerate_leadタグを有効にする場合は、本ファイルの同イベント送信を外し、二重計測を避けてください。
GA4でgenerate_leadがキーイベントとして登録済みであることは管理画面での確認が必要です。実際の計測結果は公開後に確認してください。

## 差し替え手順
1. 既存リポジトリをバックアップする。
2. Cloudflare Pagesの連携ブランチ・公開対象フォルダ・ビルド設定を確認する。
3. 公開予定時刻に本フォルダ内のファイルを公開対象へ配置する。index.htmlは公開対象の直下に置く。既存の_headers、_redirects、独自ドメイン設定等は内容を確認し、必要な設定を保持する。
4. 自動デプロイ後、トップ・/thanks・/company・/privacyが表示されることを確認する。
5. 担当者と調整したテスト申込で、Zapier受信だけでなくメール・転記など後続処理まで確認する。
6. GA4でgenerate_leadが記録されること、Clarityで記録されることを確認する。

計測タグ設置・リンク参照・JavaScript構文を確認済み。実際の申込送信、管理画面内の設定変更、公開は未実施です。

## フォルダ構成
HTML（index.html・thanks.html・company.html・privacy.html）は公開対象の直下、画像・CSS・JavaScriptはassetsフォルダにまとめています。assetsフォルダも一緒にアップロードしてください。サンクスページURLと計測設定・Zapier送信先は維持しています。
