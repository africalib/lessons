<script setup lang="ts">
import httpLib from "@/libs/httpLib";
import cookieLib from "@/libs/cookieLib";
import { useAccountStore } from "@/stores/account";

const accountStore = useAccountStore();

const logout = async () => {
  try {
    // バックエンドにログアウトリクエストを送信
    const res = await httpLib.post("/v1/api/auth/logout");

    if (res.status === 200) {
      // フロントエンドのクッキーからトークンを削除
      cookieLib.del("token");
      
      // アカウントストアの状態をリセット
      accountStore.loggedIn = false;
      accountStore.userId = "";
      accountStore.role = "";
      
      // ページをリロード
      window.location.reload();
    }
  } catch (error) {
    console.error("ログアウトエラー:", error);
    // エラーが発生してもクッキーと状態をクリア
    cookieLib.del("token");
    accountStore.loggedIn = false;
    accountStore.userId = "";
    accountStore.role = "";
    window.location.reload();
  }
};
</script>

<template>
  <header class="header-banner">
    <div class="container">
      <div class="header-top">
        <router-link to="/" class="logo">
          <span class="logo-icon">🧩</span>
          <span class="logo-text">Quiz</span>
        </router-link>
        <nav class="header-nav">
          <template v-if="accountStore.loggedIn">
            <button @click="logout" class="nav-link logout-btn">
              ログアウト
            </button>
          </template>
          <template v-else>
            <router-link to="/join" class="nav-link">
              会員登録
            </router-link>
            <router-link to="/login" class="nav-link login-btn">
              ログイン
            </router-link>
          </template>
        </nav>
      </div>
      <div class="header-actions">
        <router-link class="action-btn primary-btn" to="/quizzes">
          <span class="btn-icon">🎯</span>
          クイズを解く！
        </router-link>
        <router-link class="action-btn secondary-btn" to="/my-answers">
          <span class="btn-icon">📝</span>
          自分が解いたクイズ
        </router-link>
        <template v-if="accountStore.loggedIn && accountStore.role === 'admin'">
          <router-link class="action-btn info-btn" to="/admin/words">
            <span class="btn-icon">📚</span>
            単語管理
          </router-link>
          <router-link class="action-btn success-btn" to="/admin/word">
            <span class="btn-icon">➕</span>
            単語追加
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.logo-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.header-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: white;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.logout-btn {
  cursor: pointer;
  border: none;
  font-size: inherit;
}

.login-btn {
  background: rgba(255, 255, 255, 0.25);
  font-weight: 600;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: white;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  justify-content: center;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.primary-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.secondary-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.secondary-btn:hover {
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
}

.info-btn {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.info-btn:hover {
  background: linear-gradient(135deg, #38f9d7 0%, #43e97b 100%);
}

.success-btn {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.success-btn:hover {
  background: linear-gradient(135deg, #fee140 0%, #fa709a 100%);
}

.btn-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
