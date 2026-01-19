import React, { useState } from 'react';

const QUESTIONS = [
    { id: 1, sensor: '초음파 센서', description: '물체와의 거리를 측정해요.' },
    { id: 2, sensor: '조도 센서', description: '주변의 밝기를 감지해요.' },
    { id: 3, sensor: '온습도 센서', description: '공기 중의 온도와 습도를 알려줘요.' },
    { id: 4, sensor: '적외선(IR) 센서', description: '장애물이 있는지 감지하거나 리모컨 신호를 받아요.' },
];

function Stage2({ onComplete }) {
    const [matches, setMatches] = useState({}); // { description_id: sensor_id }
    const [score, setScore] = useState(0);

    const handleMatch = (descId, sensorId) => {
        setMatches(prev => ({ ...prev, [descId]: sensorId }));
    };

    const checkResults = () => {
        let currentScore = 0;
        QUESTIONS.forEach(q => {
            if (matches[q.id] === q.id.toString()) {
                currentScore += 25;
            }
        });
        setScore(currentScore);
        onComplete(currentScore);
    };

    const isAllMatched = Object.keys(matches).length === QUESTIONS.length;

    return (
        <div className="card fade-in">
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Stage 2: 센서 역할 찾기</h3>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>
                왼쪽의 설명에 알맞은 센서를 오른쪽에서 골라 연결해 보세요.
            </p>

            {QUESTIONS.map(q => (
                <div key={q.id} style={{ display: 'flex', gap: '20px', marginBottom: '15px', alignItems: 'center' }}>
                    <div style={{ flex: 1, padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '5px solid var(--primary)' }}>
                        {q.description}
                    </div>
                    <div style={{ flex: 1 }}>
                        <select
                            onChange={(e) => handleMatch(q.id, e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                            value={matches[q.id] || ""}
                        >
                            <option value="">센서 선택...</option>
                            {QUESTIONS.map(option => (
                                <option key={option.id} value={option.id}>{option.sensor}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                    className="btn btn-primary"
                    onClick={checkResults}
                    disabled={!isAllMatched}
                    style={{ opacity: isAllMatched ? 1 : 0.5 }}
                >
                    정답 확인 및 다음 단계로
                </button>
            </div>
        </div>
    );
}

export default Stage2;
