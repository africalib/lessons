https://ls23.up.railway.app/

# 📚 単語クイズアプリケーション  
管理者が単語を登録し、ユーザーがクイズ形式でその単語を解答するAPIベースの単語クイズアプリケーションです。

## 🧩 主な機能

### 🔐 認証  
- 会員登録：`POST /v1/api/auth/join`  
- ログイン：`POST /v1/api/auth/login`  
- ログアウト：`POST /v1/api/auth/logout`  

### 📚 単語管理（管理者向け）  
- 単語リスト取得：`GET /v1/api/admin/words`  
- 単語詳細取得：`GET /v1/api/admin/words/{id}`  
- 単語登録：`POST /v1/api/admin/words`  
- 単語編集：`PUT /v1/api/admin/words/{id}`  
- 単語削除：`DELETE /v1/api/admin/words/{id}`  

### 🎮 クイズ機能（ユーザー向け）  
- クイズ取得：`GET /v1/api/quizzes/random`  
- クイズ回答提出：`POST /v1/api/quizzes/{id}/answers`  
- ユーザーのクイズ提出履歴取得：`GET /v1/api/users/{userId}/submissions`  

## 🛠️ 技術スタック  
- バックエンドフレームワーク：**Express.js**  
- フロントエンドテンプレートエンジン：**Vue.js**  
- データベース：**MongoDB Atlas**（クラウドベースのNoSQL）  
- 使用言語：**TypeScript**
