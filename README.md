# PhyCom-AI

인간-AI 협력 피지컬 컴퓨팅 교육 플랫폼

## 🎯 프로젝트 소개

중학교 정보 교과에서 피지컬 컴퓨팅을 효과적으로 학습할 수 있도록 설계된 하이브리드 교육 플랫폼입니다.

### 주요 기능

- ✅ **Firebase Realtime Database** 실시간 데이터 동기화
- ✅ **AI 피드백 시스템** (Helpy Pro Dragon API)
- ✅ **교사 대시보드** 실시간 학생 모니터링
- ✅ **도움 필요 알림** 자동 감지 및 강조
- ✅ **프리미엄 UI/UX** 글래스모피즘, 애니메이션

## 🚀 빠른 시작

### 로컬 개발

```bash
# 의존성 설치
npm install
pip install -r server/requirements.txt

# 프론트엔드 실행
npm run dev

# 백엔드 실행 (새 터미널)
cd server
python main.py
```

### 환경 변수 설정

`.env.local` 파일 생성:

```env
VITE_BACKEND_URL=http://localhost:8000
```

## 📦 배포

### Render 통합 배포 (권장)

프론트엔드 + 백엔드를 한 번에 배포:

1. GitHub에 푸시
2. Render에서 Web Service 생성
3. Build Command: `chmod +x build.sh && ./build.sh`
4. Start Command: `cd server && python main.py`

자세한 내용은 [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) 참조

### Netlify + Render 분리 배포

자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md) 참조

## 🔧 기술 스택

- **Frontend**: React 18, Vite 6
- **Backend**: Python, FastAPI, Uvicorn
- **Database**: Firebase Realtime Database
- **AI**: Helpy Pro Dragon API
- **Styling**: Vanilla CSS

## 📝 라이선스

MIT License

## 👥 기여

기여는 언제나 환영합니다!
