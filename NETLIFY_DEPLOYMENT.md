# Netlify 통합 배포 가이드

이 가이드는 프론트엔드와 백엔드를 **Netlify에 한 번에** 배포하는 방법을 안내합니다.

---

## 🚀 Netlify 통합 배포

### 배포 구조

- **정적 사이트**: React 빌드 파일
- **Netlify Functions**: Python 서버리스 함수 (백엔드 API)
- **Firebase**: Realtime Database

---

## 📝 배포 단계

### 1. GitHub 저장소 준비

코드를 GitHub에 푸시합니다:

```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### 2. Netlify 계정 생성

1. https://www.netlify.com/ 접속
2. GitHub 계정으로 로그인

### 3. 새 사이트 생성

1. **Add new site** → **Import an existing project** 클릭
2. **GitHub** 선택
3. 저장소 선택: `phycom-ai`
4. 배포 설정 확인:
   - **Branch**: `main`
   - **Build command**: `npm run build` (자동 감지)
   - **Publish directory**: `dist` (자동 감지)

### 4. 환경 변수 설정

**Site settings** → **Environment variables**에서 추가:

| Variable | Value |
|----------|-------|
| `API_BASE_URL` | `api.helpy.ai` |
| `API_KEY` | `your-helpy-api-key` |

### 5. 배포 시작

- **Deploy site** 클릭
- 자동으로 빌드 및 배포 시작
- 3-5분 정도 소요

### 6. 배포 완료

Netlify가 제공하는 URL로 접속:
- 예: `https://phycom-ai.netlify.app`

---

## 🔧 작동 원리

### Netlify Functions

- **경로**: `/.netlify/functions/feedback`
- **런타임**: Python 3.11
- **타임아웃**: 10초 (기본값)
- **메모리**: 1024MB

### 요청 흐름

1. 사용자가 Stage 3에서 AI 피드백 요청
2. 프론트엔드가 `/.netlify/functions/feedback` 호출
3. Netlify Function이 Helpy API 호출
4. 응답을 프론트엔드로 반환

---

## 📊 Firebase 설정

### 인증 도메인 추가

Firebase Console에서:
1. **Authentication** → **Settings** → **Authorized domains**
2. Netlify URL 추가: `phycom-ai.netlify.app`

### 보안 규칙

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
- Netlify URL로 접속
- 로그인 화면 확인

### 2. Functions 확인
- Netlify Dashboard → **Functions** 탭
- `feedback` 함수가 배포되었는지 확인

### 3. 전체 흐름 테스트
- 학생으로 로그인
- Stage 1, 2, 3 진행
- AI 피드백 정상 작동 확인

---

## 🐛 문제 해결

### Functions 오류

**증상**: AI 피드백이 작동하지 않음

**해결**:
1. Netlify Dashboard → **Functions** → **feedback** 클릭
2. 로그 확인
3. 환경 변수 설정 확인

### 빌드 실패

**증상**: 배포 중 오류 발생

**해결**:
1. Netlify 빌드 로그 확인
2. `package.json` 의존성 확인
3. Node.js 버전 확인 (18 이상)

### CORS 오류

**증상**: API 호출 시 CORS 오류

**해결**:
1. `netlify.toml`의 헤더 설정 확인
2. Functions 코드의 CORS 헤더 확인

---

## 💰 비용

- **Free Tier**:
  - 빌드 시간: 월 300분
  - Functions 실행: 월 125,000회
  - 대역폭: 월 100GB
- **충분함**: 교육용으로 충분한 무료 할당량

---

## 🔄 업데이트 배포

코드 변경 후:

```bash
git add .
git commit -m "Update: ..."
git push origin main
```

Netlify가 자동으로 감지하여 재배포합니다.

---

## ⚡ 장점

### Netlify 통합 배포의 장점:

1. ✅ **간편한 배포**: GitHub 푸시만으로 자동 배포
2. ✅ **무료 SSL**: HTTPS 자동 제공
3. ✅ **CDN**: 전 세계 빠른 속도
4. ✅ **자동 스케일링**: 트래픽 증가 시 자동 확장
5. ✅ **무료 티어**: 교육용으로 충분

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] `netlify/functions/feedback.py` 파일 존재
- [ ] `netlify/functions/requirements.txt` 파일 존재
- [ ] `netlify.toml` Functions 설정 확인
- [ ] Firebase 설정값 확인
- [ ] Helpy API 키 준비
- [ ] GitHub 저장소 푸시 완료
- [ ] Netlify 계정 생성
- [ ] 환경 변수 모두 설정
- [ ] 배포 후 전체 흐름 테스트

---

## 🎉 완료!

이제 Netlify 하나로 프론트엔드와 백엔드를 모두 관리할 수 있습니다!
