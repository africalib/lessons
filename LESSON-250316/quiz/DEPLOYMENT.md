# 배포 가이드

이 프로젝트는 프론트엔드를 Vercel에, 백엔드를 Heroku에 배포합니다.

## 📋 배포 전 준비사항

### 1. 환경 변수 설정

#### 프론트엔드 (Vercel)
Vercel 대시보드에서 다음 환경 변수를 설정하세요:
- `VITE_API_BASE_URL`: 백엔드 API URL (예: `https://your-app.herokuapp.com`)

#### 백엔드 (Heroku)
Heroku 대시보드에서 다음 환경 변수를 설정하세요:
- `MONGODB_URI`: MongoDB Atlas 연결 문자열 (예: `mongodb+srv://user:password@cluster.mongodb.net/`)
- `DB_NAME`: 데이터베이스 이름 (기본값: `quiz`)
- `COLLECTION_NAME`: 퀴즈 컬렉션 이름 (기본값: `quizzes`)
- `FRONTEND_URL`: 프론트엔드 URL (예: `https://your-app.vercel.app`)
- `JWT_SECRET`: JWT 토큰 암호화를 위한 비밀키 (강력한 랜덤 문자열 사용 권장)
- `PORT`: Heroku에서 자동으로 설정되므로 별도 설정 불필요

**중요**: 
- `JWT_SECRET`은 보안상 매우 중요하므로 강력한 랜덤 문자열을 사용하세요.
- `MONGODB_URI`는 마지막에 슬래시(`/`)를 포함하세요. 데이터베이스 이름은 자동으로 추가됩니다.

## 🚀 Vercel 배포 (프론트엔드)

1. Vercel에 로그인하고 새 프로젝트 생성
2. 프로젝트 루트를 `frontend` 폴더로 설정
3. 빌드 설정:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. 환경 변수 `VITE_API_BASE_URL` 설정 (Heroku 배포 후 URL)
5. 배포

## 🚀 Heroku 배포 (백엔드)

### 방법 1: backend 폴더에서 직접 배포 (권장)

1. **Heroku CLI 설치 및 로그인**
   ```bash
   heroku login
   ```

2. **backend 폴더로 이동**
   ```bash
   cd backend
   ```

3. **Git 저장소 초기화 (이미 초기화되어 있다면 생략)**
   ```bash
   git init
   ```

4. **Heroku 앱 생성**
   ```bash
   heroku create your-app-name
   ```
   예: `heroku create quiz-backend-app`

5. **MongoDB Atlas 설정**
   - MongoDB Atlas에서 클러스터 생성 및 연결 문자열 확인
   - IP 주소를 0.0.0.0/0으로 설정하여 모든 IP 허용

6. **환경 변수 설정**
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   heroku config:set DB_NAME=quiz
   heroku config:set COLLECTION_NAME=quizzes
   heroku config:set FRONTEND_URL=https://your-app.vercel.app
   heroku config:set JWT_SECRET=your-strong-secret-key-here
   ```

7. **파일 추가 및 커밋**
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   ```

8. **Heroku에 배포**
   ```bash
   heroku git:remote -a your-app-name
   git push heroku main
   ```
   또는 `main` 브랜치가 아닌 경우:
   ```bash
   git push heroku HEAD:main
   ```

9. **배포 확인**
   ```bash
   heroku open
   heroku logs --tail
   ```

### 방법 2: 루트에서 배포

1. 루트 디렉토리에서 Heroku 빌드팩 명시적으로 설정:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```
2. 환경 변수 설정 (위와 동일)
3. 배포:
   ```bash
   git push heroku main
   ```

## 📝 참고사항

- 프론트엔드와 백엔드는 별도로 배포되므로 CORS 설정이 중요합니다
- 환경 변수는 배포 후에도 수정 가능합니다
- MongoDB는 MongoDB Atlas를 사용하는 것을 권장합니다

