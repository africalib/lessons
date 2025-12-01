# Backend Heroku 배포 가이드

이 문서는 `backend` 폴더에서 직접 Heroku에 배포하는 방법을 안내합니다.

## 📋 사전 준비사항

1. Heroku CLI 설치: https://devcenter.heroku.com/articles/heroku-cli
2. Git 설치 확인
3. MongoDB Atlas 계정 및 클러스터 준비

## 🚀 배포 단계

### 1. Heroku 로그인
```bash
heroku login
```

### 2. backend 폴더로 이동
```bash
cd backend
```

### 3. Git 저장소 초기화 (처음 한 번만)
```bash
git init
```

### 4. Heroku 앱 생성
```bash
heroku create your-app-name
```
예: `heroku create quiz-backend-2024`

> 💡 앱 이름은 전 세계적으로 고유해야 합니다. 이미 사용 중인 이름이면 다른 이름을 사용하세요.

### 5. 환경 변수 설정

MongoDB Atlas 연결 정보를 설정합니다:
```bash
heroku config:set MONGODB_URI=mongodb+srv://lsh6166:lsh6166a@cluster0.xjgjk.mongodb.net/
heroku config:set DB_NAME=quiz
heroku config:set COLLECTION_NAME=quizzes
```

프론트엔드 URL 설정 (Vercel 배포 후):
```bash
heroku config:set FRONTEND_URL=https://your-app.vercel.app
```

JWT Secret 설정 (강력한 랜덤 문자열 사용):
```bash
heroku config:set JWT_SECRET=your-very-strong-secret-key-minimum-32-characters
```

모든 환경 변수 확인:
```bash
heroku config
```

### 6. 파일 커밋
```bash
git add .
git commit -m "Prepare for Heroku deployment"
```

### 7. Heroku에 배포
```bash
heroku git:remote -a your-app-name
git push heroku main
```

> ⚠️ 만약 `main` 브랜치가 아니라면:
> ```bash
> git push heroku HEAD:main
> ```

### 8. 배포 확인
```bash
# 앱 열기
heroku open

# 로그 확인
heroku logs --tail

# 앱 상태 확인
heroku ps
```

## 🔧 문제 해결

### 빌드 실패 시
```bash
# 상세 로그 확인
heroku logs --tail

# 빌드팩 확인
heroku buildpacks

# Node.js 빌드팩 명시적으로 설정
heroku buildpacks:set heroku/nodejs
```

### 환경 변수 확인/수정
```bash
# 모든 환경 변수 보기
heroku config

# 특정 환경 변수 확인
heroku config:get MONGODB_URI

# 환경 변수 수정
heroku config:set MONGODB_URI=new-value
```

### MongoDB 연결 문제
- MongoDB Atlas에서 IP 주소를 `0.0.0.0/0`으로 설정했는지 확인
- 데이터베이스 사용자 이름과 비밀번호 확인
- 연결 문자열 형식 확인: `mongodb+srv://username:password@cluster.mongodb.net/`

## 📝 참고사항

- `Procfile`이 `backend` 폴더에 있어야 합니다
- `package.json`의 `start` 스크립트가 `node app.js`인지 확인
- 환경 변수는 Heroku 대시보드에서도 설정/수정 가능합니다
- 배포 후 첫 요청은 느릴 수 있습니다 (Cold Start)

