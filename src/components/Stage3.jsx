import React, { useState } from 'react';

const SCENARIO = {
    task: "밤늦게 집에 돌아올 때, 어두운 현관문 앞에서 사람이 서 있으면 자동으로 전등이 켜지는 시스템을 만들어보세요.",
    title: "스마트 현관등 만들기"
};

const PARTS = {
    sensors: ['초음파 센서', '조도 센서', '적외선(IR) 센서', '동작 감지(PIR) 센서', '소리 센서'],
    actuators: ['LED', '부저', '서보 모터', 'DC 모터', 'LCD']
};

function Stage3({ user, onComplete }) {
    const [selectedSensor, setSelectedSensor] = useState('');
    const [selectedActuator, setSelectedActuator] = useState('');
    const [logic, setLogic] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 환경 변수에서 백엔드 URL 가져오기
    // Netlify Functions: /.netlify/functions/feedback
    // 로컬 개발: http://localhost:8000/api/feedback
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
    const API_ENDPOINT = BACKEND_URL ? `${BACKEND_URL}/api/feedback` : '/.netlify/functions/feedback';

    const handleSubmit = async () => {
        setIsLoading(true);
        setFeedback('');

        try {
            // Python 백엔드 API 호출
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: SCENARIO.task,
                    selectedSensor,
                    selectedActuator,
                    logic
                })
            });

            const data = await response.json();

            if (data.success) {
                setFeedback(data.feedback);
                onComplete(100);
            } else {
                setFeedback(data.feedback || "AI 선생님과 연결하는 중 오류가 발생했습니다.");
            }

            setIsLoading(false);

        } catch (error) {
            console.error('API Error:', error);
            setFeedback("AI 선생님과 연결하는 중 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.");
            setIsLoading(false);
        }
    };

    return (
        <div className="card fade-in">
            <h3>Stage 3: 실생활 문제 해결 (AI 설계실)</h3>
            <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
                <strong>💡 미션: {SCENARIO.title}</strong>
                <p>{SCENARIO.task}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>센서 선택 (입력)</label>
                    <select
                        value={selectedSensor}
                        onChange={(e) => setSelectedSensor(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                    >
                        <option value="">센서를 골라주세요</option>
                        {PARTS.sensors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>액추에이터 선택 (출력)</label>
                    <select
                        value={selectedActuator}
                        onChange={(e) => setSelectedActuator(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                    >
                        <option value="">액추에이터를 골라주세요</option>
                        {PARTS.actuators.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>시스템 작동 논리 (왜 이렇게 설계했나요?)</label>
                <textarea
                    placeholder="예: PIR 센서로 사람의 움직임을 감지하면 LED를 켜도록 만들었습니다."
                    value={logic}
                    onChange={(e) => setLogic(e.target.value)}
                    style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
            </div>

            <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!selectedSensor || !selectedActuator || !logic || isLoading}
                style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}
            >
                {isLoading ? 'AI 선생님이 검토 중...' : 'AI 선생님께 제출하기'}
            </button>

            {feedback && (
                <div className="fade-in" style={{ marginTop: '20px', padding: '15px', background: '#fff9c4', borderRadius: '8px', border: '1px solid #fbc02d' }}>
                    <strong>🤖 AI 선생님의 피드백:</strong>
                    <p style={{ marginTop: '10px', lineHeight: '1.5' }}>{feedback}</p>
                </div>
            )}
        </div>
    );
}

export default Stage3;
