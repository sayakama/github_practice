# GitHub Practice: チーム開発入門

GitHubを使ったことはあるけれど、チーム開発は初めての人向けの練習用プロジェクトです。React + TypeScript + Viteで小さなタスク管理Webアプリ「Team Quest Board」を育てながら、Issue → branch → commit → Pull Request → review → mergeを練習します。

## 練習手順

1. [配布元リポジトリ](https://github.com/hayashichiho/github_practice) の **Fork → Create fork** で自分のアカウントへForkする。
2. **自分のFork** を開き、**Settings → General → Features → Issues** にチェックを入れる。
3. **Actions** を開く。Forkしたworkflowの実行を有効にする画面が出たら **I understand my workflows, go ahead and enable them** などの有効化ボタンを押す。Actions自体が無効なら **Settings → Actions → General** で利用を許可する。
4. Actionsの左側で **「練習用Issueを登録」** を選び、**Run workflow → Branch: main → Run workflow** を押す。自分のForkの所有者として実行する。
5. 実行が緑のチェックになったら、同じForkの **Issues** を開く。課題Issueが登録されていることを確認する。
6. **Quest 1のセットアップから順番に進める。** 操作方法と学ぶ知識は各Questに記載しています。

原稿を更新した後は、mainを選んで **Run workflow** をもう一度実行すると、登録済みIssueのタイトル・本文も更新されます。残したいメモはIssueのコメントに書いてください。

今回はハッカソンに向けた1人での練習なので、PRの差分を自分で確認してmergeします。**実際のチーム開発では、他の人にレビューを依頼し、指摘への対応と承認を経てからmergeするのが基本です。**

[課題一覧・Issue登録で困ったとき](docs/issues/README.md)も参照してください。
