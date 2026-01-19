# PRD: 인간-AI 협력 피지컬 컴퓨팅 교육 플랫폼 (Physical Computing Hybrid-Class)

| 문서 정보 | 내용 |
| --- | --- |
| **프로젝트명** | PhyCom-AI (피지컬 컴퓨팅 AI 협력 학습 시스템) |
| **작성자** | 정보 교사 (Assistant: Gemini) |
| **버전** | v1.0 |
| **개발 도구** | Python Web Framework (Google Antigravity/Anvil 등), Firebase |
| **AI 모델** | Helpy Pro Dragon API (Thinking Mode Enabled) |
| **대상** | 중학교 전학년 (정보 교과) |

---

## 1. 개요 및 목적 (Overview)

### 1.1. 배경

중학교 '컴퓨팅 시스템' 단원에서 피지컬 컴퓨팅의 구성요소(센서, 액추에이터)를 이해하고 설계하는 활동입니다. 학생 20~30명을 교사 1인이 지도해야 하는 환경에서, 물리적인 피드백의 한계를 극복하고 맞춤형 교육을 제공하기 위해 개발되었습니다.

### 1.2. 핵심 가치

* **하이브리드 피드백:** 단순 지식 확인 및 결과 피드백은 **AI 교사(Helpy AI)**가, 학습 부진 및 심층 지도가 필요한 학생은 **인간 교사**가 담당합니다.
* **시뮬레이션 기반:** 다양한 센서/액추에이터를 가상으로 체험하여 비용 및 물리적 제약을 극복합니다.
* **실시간 모니터링:** 교사는 대시보드를 통해 "도움이 필요한 학생"을 즉시 식별합니다.

### 1.3. 교육과정 성취기준

* **[9정01-02]** 피지컬 컴퓨팅의 개념을 이해하고, 생활 속에서 적용된 사례 조사를 통해 컴퓨팅 시스템의 필요성과 가치를 판단한다.
* **[9정01-03]** 문제 해결 목적에 맞는 피지컬 컴퓨팅 구성요소를 선택하여 시스템을 구상한다.

---

## 2. 사용자 시나리오 (User Stories)

### 2.1. 학생 (Student)

> "나는 센서와 액추에이터의 차이를 게임처럼 재미있게 배우고, 내가 만든 시스템 설계에 대해 AI 선생님에게 바로 피드백을 받고 싶다."

* 학번/이름으로 간편하게 로그인한다.
* 3단계(구분하기 -> 역할찾기 -> 문제해결) 미션을 순서대로 수행한다.
* 3단계 문제 해결 시, 내가 선택한 부품이 적절한지 AI에게 구체적인 이유와 함께 피드백을 받는다.

### 2.2. 교사 (Teacher)

> "나는 전체 학생의 진도율을 한눈에 파악하고, 진도가 뒤처지거나 어려워하는 학생에게 먼저 다가가서 도움을 주고 싶다."

* 대시보드에서 신호등 색상(적/황/녹)으로 학생들의 상태를 확인한다.
* 오랫동안 특정 단계에 머물러 있는(진도가 느린) 학생이 하이라이트 표시되면, 해당 학생에게 찾아가 직접 지도한다.

---

## 3. 상세 기능 요구사항 (Functional Requirements)

### 3.1. 프론트엔드 (학생용 웹)

**반응형 웹 (Mobile/Desktop)**

* **진입 화면 (Login)**
* 입력: 학번, 성명
* 기능: Firebase 인증 또는 익명 로그인 후 세션 생성


* **1단계: 센서 vs 액추에이터 구분 (Game)**
* UI: 화면 중앙에 부품 이미지가 뜨고 좌(센서)/우(액추에이터)로 스와이프 또는 버튼 클릭.
* DB: `Score_Stage1`에 점수 기록.


* **2단계: 센서 역할 찾기 (Matching)**
* UI: 센서 이미지와 기능 설명 텍스트 연결하기 (객관식 퀴즈 형태).
* DB: `Score_Stage2`에 점수 기록.


* **3단계: 실생활 문제 해결 (System Design with AI)**
* **시나리오:** 시스템이 랜덤하게 역할(예: "화재 감지 역할")을 부여 -> 학생은 이에 맞는 센서/액추에이터 선택 -> 제한 시간 내 제출.
* **AI 상호작용:** 학생의 선택 결과와 이유를 Helpy Pro Dragon API로 전송.
* **피드백 출력:** AI가 분석한 적합성 평가 및 조언을 채팅 말풍선 형태로 표시.
* DB: `Score_Stage3` 및 `AI_Feedback` 기록.



### 3.2. 백엔드 & AI (Logic)

#### 3.2.1. Helpy Pro Dragon API 통합

3단계 활동에서 학생의 설계 논리를 평가합니다.

* **Parameter:** `enable_thinking: True` (심층 추론 활성화)
* **Prompt Design (System):**
```text
당신은 중학교 정보 교과 'AI 보조 교사'입니다. 
학생이 특정 문제 상황에서 선택한 피지컬 컴퓨팅 부품(센서/액추에이터)이 적절한지 평가해 주세요.
정답이면 칭찬하고, 오답이면 그 이유와 힌트를 친절하게 설명하세요.
학생의 수준을 고려하여 이해하기 쉽게 설명해야 합니다.

```



#### 3.2.2. 데이터베이스 (Firebase Realtime DB 구조)

```json
{
  "students": {
    "20240101": {
      "name": "홍길동",
      "status": "yellow", // red: 미접속, yellow: 진행중, green: 완료
      "last_update": "timestamp",
      "stage": 2, // 현재 진행 단계
      "scores": {
        "s1": 80,
        "s2": 90,
        "s3": 0
      },
      "needs_help": true // 특정 시간 이상 지체 시 true
    }
  }
}

```

### 3.3. 교사 대시보드 (Teacher Dashboard)

* **실시간 현황판 (Grid View)**
* 학생 카드가 바둑판식으로 배열됨.
* **신호등 시스템:**
* 🔴 **빨간색:** 접속 전 / 시작 안 함.
* 🟡 **노란색:** 활동 진행 중 (현재 단계 표시).
* 🟢 **초록색:** 모든 활동 완료.




* **느린 학습자 강조 (Priority Alert)**
* 알고리즘: `(Current_Time - Last_Stage_Start_Time) > Threshold(예: 5분)` 인 경우.
* UI: 해당 학생 카드 테두리가 굵게 점멸(Blinking)하거나 상단에 별도 리스트로 "지도 필요 학생" 출력.



---

## 4. 콘텐츠 구성 (Database Assets)

학생들이 탐색할 웹 검색 기반 부품 리스트입니다.

| 구분 | 목록 (예시) |
| --- | --- |
| **센서 (20종)** | 초음파, 조도, 온습도, 적외선(IR), 소리, 가스, 토양수분, 기울기, 자이로, 가속도, 터치, 압력, 불꽃 감지, 심박, 컬러, 마그네틱(홀), 수위, 진동, 미세먼지, 동작감지(PIR) |
| **액추에이터 (10종)** | LED, RGB LED, 피에조 부저, 서보 모터, DC 모터, 스테핑 모터, 릴레이, LCD, OLED, 워터 펌프 |
| **컨트롤러** | 마이크로비트 (단일 가정) |

---

## 5. 기술 구현 명세 (Technical Implementation)

### 5.1. Helpy Pro Dragon API 호출 코드 (Python)

```python
import requests
import json

# API 설정
API_BASE_URL = "api.helpy.ai"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njg4MTQ5MjUsIm5iZiI6MTc2ODgxNDkyNSwiZXhwIjoxNzY5MDA3NTk5LCJrZXlfaWQiOiJkMTUzNTI3Mi1lMGY4LTQ1MzQtYTlhNi00MjQyMDIzNDYyZWMifQ.iL4hw8OhEdb2yowzyN7iWRkl2VUQMEKr7nLSTg4855Y"

def get_ai_feedback(student_task, student_selection):
    url = f"http://{API_BASE_URL}/v1/chat/completions"
    
    # 프롬프트 구성
    user_content = f"""
    상황: {student_task}
    학생 선택: {student_selection}
    
    위 선택이 문제 해결에 적합한지 평가하고 피드백을 주세요.
    """

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
            "enable_thinking": True # 추론 기능 활성화
        },
        "max_tokens": 1024
    }

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return "AI 선생님이 잠시 쉬고 있어요. 다시 시도해주세요."
    except Exception as e:
        print(f"API Error: {e}")
        return "연결 오류가 발생했습니다."

```

### 5.2. 개발 환경 설정

* **Google Antigravity (App Environment):** Python 기반 웹 앱 배포 환경 (Anvil 등 활용 권장).
* **Data Flow:**
1. 학생 Client -> (Action) -> Firebase DB Update.
2. 학생 Client (Stage 3) -> (Request) -> Server (Python) -> Helpy API -> (Response) -> Client.
3. 교사 Client -> (Listen) -> Firebase DB Change -> Dashboard Update.



---

## 6. 평가 및 기대 효과

* **효율성:** 교사는 반복적인 개념 설명이나 단순 정답 확인에서 벗어나, 도움이 절실한 학생에게 집중할 수 있습니다.
* **개별화:** 학생은 AI의 즉각적인 피드백을 통해 자기 주도적으로 학습 결손을 보완합니다.
* **교육적 가치:** 3단계 활동(Thinking Process)을 통해 단순 암기가 아닌, 상황에 맞는 시스템 구성 능력을 함양합니다.