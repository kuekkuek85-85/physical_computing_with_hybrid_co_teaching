from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import requests
import os
from pathlib import Path

app = FastAPI(title="PhyCom-AI Backend")

# 정적 파일 경로 설정
STATIC_DIR = Path(__file__).parent.parent / "dist"

# CORS 설정 (React 앱에서 접근 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helpy Pro Dragon API 설정
API_BASE_URL = "api.helpy.ai"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njg4MTQ5MjUsIm5iZiI6MTc2ODgxNDkyNSwiZXhwIjoxNzY5MDA3NTk5LCJrZXlfaWQiOiJkMTUzNTI3Mi1lMGY4LTQ1MzQtYTlhNi00MjQyMDIzNDYyZWMifQ.iL4hw8OhEdb2yowzyN7iWRkl2VUQMEKr7nLSTg4855Y"

class FeedbackRequest(BaseModel):
    task: str
    selectedSensor: str
    selectedActuator: str
    logic: str

@app.get("/")
def read_root():
    return {"message": "PhyCom-AI Backend API", "status": "running"}

@app.post("/api/feedback")
async def get_ai_feedback(request: FeedbackRequest):
    """
    학생의 피지컬 컴퓨팅 설계에 대한 AI 피드백을 제공합니다.
    """
    try:
        # Helpy Pro Dragon API 호출
        url = f"http://{API_BASE_URL}/v1/chat/completions"
        
        # 프롬프트 구성
        user_content = f"""상황: {request.task}
학생 선택:
- 센서: {request.selectedSensor}
- 액추에이터: {request.selectedActuator}
- 학생의 논리: {request.logic}

위 선택이 문제 해결에 적합한지 평가하고 친절하게 피드백을 주세요.
정답이면 칭찬하고, 오답이면 그 이유와 힌트를 친절하게 설명하세요.
학생의 수준을 고려하여 이해하기 쉽게 설명해야 합니다."""

        payload = {
            "model": "helpy-pro",
            "messages": [
                {
                    "role": "system",
                    "content": "당신은 중학생에게 피지컬 컴퓨팅을 가르치는 친절한 AI 선생님입니다."
                },
                {
                    "role": "user",
                    "content": user_content
                }
            ],
            "chat_template_kwargs": {
                "enable_thinking": True  # 추론 기능 활성화
            },
            "max_tokens": 1024
        }

        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        }

        print(f"Calling Helpy API: {url}")
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            feedback = data['choices'][0]['message']['content']
            return {"feedback": feedback, "success": True}
        else:
            print(f"API Error Response: {response.text}")
            # API 실패 시 Mock 응답 반환
            return get_mock_feedback(request)
            
    except requests.exceptions.Timeout:
        print("API Timeout - returning mock feedback")
        return get_mock_feedback(request)
    except Exception as e:
        print(f"API Error: {e}")
        return get_mock_feedback(request)

def get_mock_feedback(request: FeedbackRequest):
    """
    Helpy API가 작동하지 않을 때 사용할 Mock 피드백
    """
    sensor = request.selectedSensor
    actuator = request.selectedActuator
    
    # 정답 판별 로직
    if "동작 감지" in sensor or "PIR" in sensor:
        if "LED" in actuator:
            feedback = """정말 완벽한 설계예요! 👏 

사람이 움직이는 것을 감지하는 데는 PIR 센서(동작 감지 센서)가 아주 적합합니다. 
PIR 센서는 사람의 체온(적외선)을 감지하여 움직임을 알아낼 수 있어요.

그리고 전등 역할로 LED를 선택한 것도 훌륭합니다! 
LED는 밝기도 좋고 전력 소모도 적어서 현관등으로 완벽해요.

논리 설명도 아주 명확하네요! 이런 식으로 센서와 액추에이터를 조합하면 
실생활에서 정말 유용한 스마트 시스템을 만들 수 있답니다. 잘했어요! 🌟"""
        else:
            feedback = """좋은 시도예요! 😊

PIR 센서(동작 감지 센서) 선택은 완벽합니다! 사람의 움직임을 감지하는 데 최적이에요.

다만, 현관등을 만들려면 '빛'을 내는 부품이 필요하겠죠? 
지금 선택하신 액추에이터를 다시 한번 생각해보세요. 
어떤 부품이 빛을 낼 수 있을까요? 💡"""
    elif "조도" in sensor:
        feedback = """좋은 시도예요! 🤔

조도 센서는 주변의 밝기를 측정하는 센서예요. 
'어두울 때'라는 조건에는 맞지만, '사람이 서 있을 때'만 켜지게 하려면 
사람의 움직임을 감지하는 센서가 더 필요할 것 같아요.

힌트: 사람의 움직임을 감지할 수 있는 센서를 찾아보세요! 
센서 목록에서 '동작'이나 '움직임'과 관련된 센서를 찾아보면 어떨까요? 😊"""
    else:
        feedback = """음, 조금 더 생각해보면 좋을 것 같아요. 🤔

우리가 만들려는 것은 사람이 올 때만 켜지는 '현관등'이에요.

생각해볼 질문들:
1. 어떤 센서가 사람의 움직임을 가장 잘 알 수 있을까요?
2. 전등 역할을 할 수 있는 부품은 무엇일까요?

힌트: 센서 목록에서 '동작'이나 '움직임'과 관련된 것을 찾아보세요! 
그리고 액추에이터 목록에서 '빛'을 낼 수 있는 부품을 찾아보세요! 💡"""
    
    return {
        "feedback": feedback,
        "success": True,
        "note": "Mock 응답 (Helpy API 연결 실패)"
    }

# 정적 파일 서빙 (프론트엔드)
if STATIC_DIR.exists():
    # API 라우트를 제외한 모든 요청에 대해 정적 파일 제공
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """
        SPA (Single Page Application)를 위한 라우트
        API 경로가 아닌 모든 요청은 index.html로 리다이렉트
        """
        # API 경로는 제외
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")
        
        # 파일이 존재하면 해당 파일 반환
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        
        # 그 외에는 index.html 반환 (SPA 라우팅)
        index_path = STATIC_DIR / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
        
        raise HTTPException(status_code=404, detail="Frontend not built")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
