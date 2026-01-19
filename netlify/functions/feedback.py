import json
import requests
from urllib.parse import parse_qs

# Helpy Pro Dragon API 설정
API_BASE_URL = "api.helpy.ai"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njg4MTQ5MjUsIm5iZiI6MTc2ODgxNDkyNSwiZXhwIjoxNzY5MDA3NTk5LCJrZXlfaWQiOiJkMTUzNTI3Mi1lMGY4LTQ1MzQtYTlhNi00MjQyMDIzNDYyZWMifQ.iL4hw8OhEdb2yowzyN7iWRkl2VUQMEKr7nLSTg4855Y"

def handler(event, context):
    """
    Netlify Function for AI feedback
    """
    # CORS 헤더
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    }
    
    # OPTIONS 요청 처리 (CORS preflight)
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    # POST 요청만 처리
    if event['httpMethod'] != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # 요청 본문 파싱
        body = json.loads(event['body'])
        task = body.get('task', '')
        selected_sensor = body.get('selectedSensor', '')
        selected_actuator = body.get('selectedActuator', '')
        logic = body.get('logic', '')
        
        # Helpy API 호출
        url = f"http://{API_BASE_URL}/v1/chat/completions"
        
        user_content = f"""상황: {task}
학생 선택:
- 센서: {selected_sensor}
- 액추에이터: {selected_actuator}
- 학생의 논리: {logic}

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
                "enable_thinking": True
            },
            "max_tokens": 1024
        }

        api_headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        }

        response = requests.post(url, json=payload, headers=api_headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            feedback = data['choices'][0]['message']['content']
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'feedback': feedback, 'success': True})
            }
        else:
            # API 실패 시 Mock 응답
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(get_mock_feedback(selected_sensor, selected_actuator))
            }
            
    except Exception as e:
        print(f"Error: {e}")
        # 오류 시 Mock 응답
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(get_mock_feedback(
                body.get('selectedSensor', ''),
                body.get('selectedActuator', '')
            ))
        }

def get_mock_feedback(sensor, actuator):
    """Mock 피드백 생성"""
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
