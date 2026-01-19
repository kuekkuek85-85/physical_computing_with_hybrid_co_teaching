# 배포 가이드

이 문서는 PhyCom-AI 플랫폼을 프로덕션 환경에 배포하는 방법을 안내합니다.

## 📦 배포 구조

- **프론트엔드**: Netlify (정적 호스팅)
- **백엔드**: Render / Railway / Heroku (Python 서버)
- **데이터베이스**: Firebase Realtime Database (이미 설정됨)

---

## 🚀 프론트엔드 배포 (Netlify)

### 1. Netlify 계정 준비

1. https://www.netlify.com/ 접속
2. GitHub 계정으로 로그인
3. "Add new site" → "Import an existing project" 선택

### 2. GitHub 연동

1. GitHub 저장소와 연동
2. 배포할 브랜치 선택 (예: `main`)

### 3. 빌드 설정

Netlify가 자동으로 `netlify.toml` 파일을 읽어 설정합니다:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### 4. 환경 변수 설정

Netlify 대시보드에서 **Site settings** → **Environment variables**로 이동하여 다음 변수를 추가:

```
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```

### 5. 배포

- "Deploy site" 클릭
- 자동으로 빌드 및 배포 진행
- 배포 완료 후 제공되는 URL로 접속

---

## 🐍 백엔드 배포 (Render 추천)

### 옵션 1: Render (무료 티어 제공)

1. **Render 계정 생성**: https://render.com/
2. **New Web Service** 선택
3. GitHub 저장소 연결
4. 설정:
   - **Name**: `phycom-ai-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r server/requirements.txt`
   - **Start Command**: `cd server && python main.py`
   - **Port**: `8000`

5. **Environment Variables** 추가:
   ```
   API_BASE_URL=api.helpy.ai
   API_KEY=your-helpy-api-key
   ```

6. **Deploy** 클릭

### 옵션 2: Railway

1. https://railway.app/ 접속
2. "New Project" → "Deploy from GitHub repo"
3. 저장소 선택 후 `server` 디렉토리 지정
4. 자동 배포 완료

### 옵션 3: Heroku

```bash
# Heroku CLI 설치 후
cd server
heroku create phycom-ai-backend
git push heroku main
```

---

## 🔗 프론트엔드-백엔드 연결

### 1. 환경 변수 파일 생성

프로젝트 루트에 `.env.production` 파일 생성:

```env
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```

### 2. Stage3.jsx 수정

백엔드 URL을 환경 변수에서 가져오도록 수정:

```javascript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const response = await fetch(`${BACKEND_URL}/api/feedback`, {
  method: 'POST',
  // ...
});
```

---

## ✅ 배포 체크리스트

### 프론트엔드
- [ ] `netlify.toml` 파일 확인
- [ ] Firebase 설정 확인 (실제 프로젝트 정보)
- [ ] 환경 변수 설정 (`VITE_BACKEND_URL`)
- [ ] 빌드 테스트 (`npm run build`)
- [ ] Netlify에 배포

### 백엔드
- [ ] `requirements.txt` 확인
- [ ] Helpy API 키 환경 변수 설정
- [ ] CORS 설정 확인 (Netlify URL 추가)
- [ ] Render/Railway에 배포
- [ ] API 엔드포인트 테스트

### Firebase
- [ ] 보안 규칙 설정 (프로덕션용)
- [ ] 인증 도메인에 Netlify URL 추가

---

## 🔒 프로덕션 보안 설정

### Firebase 보안 규칙 (프로덕션)

```json
{
  "rules": {
    "students": {
      "$studentId": {
        ".read": true,
        ".write": "auth != null || newData.exists()"
      }
    }
  }
}
```

### 백엔드 CORS 설정

`server/main.py`에서 Netlify URL 추가:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:5175",
        "https://your-netlify-app.netlify.app"  # 추가
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 배포 후 모니터링

1. **Netlify**: 빌드 로그 및 배포 상태 확인
2. **Render**: 서버 로그 및 성능 모니터링
3. **Firebase Console**: 데이터베이스 사용량 확인

---

## 🆘 문제 해결

### 빌드 실패
- `package.json`의 의존성 확인
- Node.js 버전 확인 (18 이상)

### API 연결 실패
- 백엔드 URL 환경 변수 확인
- CORS 설정 확인
- 백엔드 서버 상태 확인

### Firebase 연결 실패
- Firebase 설정값 확인
- 보안 규칙 확인
- 인증 도메인 설정 확인
