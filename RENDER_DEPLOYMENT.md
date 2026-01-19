# Render 통합 배포 가이드

이 가이드는 프론트엔드와 백엔드를 Render에 **한 번에** 배포하는 방법을 안내합니다.

---

## 🚀 Render 통합 배포

### 배포 구조

- **하나의 Web Service**로 프론트엔드 + 백엔드 모두 배포
- FastAPI 서버가 정적 파일(React 빌드)도 함께 서빙
- 별도의 정적 호스팅 서비스 불필요

---

## 📝 배포 단계

### 1. GitHub 저장소 준비

코드를 GitHub에 푸시합니다:

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Render 계정 생성

1. https://render.com/ 접속
2. GitHub 계정으로 로그인

### 3. Web Service 생성

1. **Dashboard** → **New** → **Web Service** 클릭
2. GitHub 저장소 연결
3. 다음 설정 입력:

#### 기본 설정
- **Name**: `phycom-ai`
- **Region**: `Singapore` (또는 가까운 지역)
- **Branch**: `main`
- **Root Directory**: 비워두기 (프로젝트 루트)

#### 빌드 설정
- **Runtime**: `Python 3`
- **Build Command**:
  ```bash
  chmod +x build.sh && ./build.sh
  ```
- **Start Command**:
  ```bash
  cd server && python main.py
  ```

#### 환경 변수
**Environment Variables** 섹션에서 다음 변수 추가:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11` |
| `NODE_VERSION` | `18` |
| `API_BASE_URL` | `api.helpy.ai` |
| `API_KEY` | `your-helpy-api-key` |

### 4. 배포 시작

- **Create Web Service** 클릭
- 자동으로 빌드 및 배포 시작
- 5-10분 정도 소요

### 5. 배포 완료

배포가 완료되면 Render가 제공하는 URL로 접속:
- 예: `https://phycom-ai.onrender.com`

---

## 🔧 작동 원리

### 빌드 프로세스

1. **`build.sh` 실행**
   - npm으로 프론트엔드 의존성 설치
   - `npm run build`로 React 앱 빌드 → `dist/` 폴더 생성
   - pip으로 백엔드 의존성 설치

2. **서버 시작**
   - `python main.py` 실행
   - FastAPI 서버가 포트 8000에서 시작

### 요청 처리

- **`/api/*`**: 백엔드 API 엔드포인트
- **`/assets/*`**: 정적 파일 (CSS, JS, 이미지)
- **그 외 모든 경로**: `index.html` 반환 (SPA 라우팅)

---

## 📊 Firebase 설정

### 인증 도메인 추가

Firebase Console에서:
1. **Authentication** → **Settings** → **Authorized domains**
2. Render URL 추가: `phycom-ai.onrender.com`

### 보안 규칙 (프로덕션)

```json
{
  "rules": {
    "students": {
      "$studentId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

---

## 🔍 배포 확인

### 1. 프론트엔드 확인
- Render URL로 접속
- 로그인 화면이 보이는지 확인

### 2. 백엔드 API 확인
- `https://your-app.onrender.com/` 접속
- `{"message": "PhyCom-AI Backend API", "status": "running"}` 응답 확인

### 3. 전체 흐름 테스트
- 학생으로 로그인
- Stage 1, 2, 3 진행
- AI 피드백 정상 작동 확인
- 교사 대시보드 확인

---

## 🐛 문제 해결

### 빌드 실패

**증상**: 빌드 중 오류 발생

**해결**:
1. Render 로그 확인
2. `build.sh` 실행 권한 확인
3. Node.js 및 Python 버전 확인

### 정적 파일 404 오류

**증상**: CSS/JS 파일을 찾을 수 없음

**해결**:
1. `dist/` 폴더가 생성되었는지 확인
2. `npm run build` 로컬에서 테스트
3. `main.py`의 `STATIC_DIR` 경로 확인

### API 연결 실패

**증상**: AI 피드백이 작동하지 않음

**해결**:
1. 환경 변수 `API_KEY` 확인
2. Helpy API 상태 확인
3. Mock 피드백이 작동하는지 확인

---

## 💰 비용

- **Free Tier**: 월 750시간 무료 (충분함)
- **제한사항**: 
  - 15분 동안 요청이 없으면 서버 슬립 (첫 요청 시 재시작)
  - 재시작 시 30초~1분 소요

---

## 🔄 업데이트 배포

코드 변경 후:

```bash
git add .
git commit -m "Update: ..."
git push origin main
```

Render가 자동으로 감지하여 재배포합니다.

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] `build.sh` 파일 존재 및 실행 권한
- [ ] Firebase 설정값 확인
- [ ] Helpy API 키 준비
- [ ] GitHub 저장소 푸시 완료
- [ ] Render 계정 생성
- [ ] 환경 변수 모두 설정
- [ ] 배포 후 전체 흐름 테스트

---

## 🎉 완료!

이제 하나의 URL로 프론트엔드와 백엔드를 모두 사용할 수 있습니다!
