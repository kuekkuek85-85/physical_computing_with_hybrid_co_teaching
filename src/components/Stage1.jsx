import React, { useState, useEffect } from 'react';

const ITEMS = [
    { id: 1, name: '초음파 센서', type: 'sensor', img: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=200&h=200&fit=crop' },
    { id: 2, name: 'LED', type: 'actuator', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop' },
    { id: 3, name: '피에조 부저', type: 'actuator', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=200&fit=crop' },
    { id: 4, name: '조도 센서', type: 'sensor', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop' },
    { id: 5, name: '서보 모터', type: 'actuator', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop' },
    { id: 6, name: '온습도 센서', type: 'sensor', img: 'https://images.unsplash.com/photo-1590333746438-28350cc8ca51?w=200&h=200&fit=crop' },
];

function Stage1({ onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const currentItem = ITEMS[currentIndex];

    const handleChoice = (choice) => {
        const isCorrect = choice === currentItem.type;
        if (isCorrect) {
            setScore(s => s + 1);
            setFeedback({ type: 'success', text: '정답입니다! 👏' });
        } else {
            setFeedback({ type: 'error', text: '틀렸습니다. 다시 생각해봐요! 😢' });
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentIndex < ITEMS.length - 1) {
                setCurrentIndex(c => c + 1);
            } else {
                onComplete(score + (isCorrect ? 1 : 0));
            }
        }, 1000);
    };

    return (
        <div className="card fade-in" style={{ textAlign: 'center' }}>
            <h3>Stage 1: 센서 vs 액추에이터 구분하기</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>화면의 부품이 정보를 받아들이는 '센서'인지, 동작을 수행하는 '액추에이터'인지 맞춰보세요!</p>

            <div style={{ position: 'relative', height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '4px solid white'
                }}>
                    <img src={currentItem.img} alt={currentItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {feedback && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        background: feedback.type === 'success' ? 'var(--success)' : 'var(--error)',
                        color: 'white',
                        fontWeight: 'bold',
                        zIndex: 10
                    }}>
                        {feedback.text}
                    </div>
                )}
            </div>

            <h2 style={{ marginBottom: '30px' }}>{currentItem.name}</h2>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => handleChoice('sensor')} style={{ flex: 1, padding: '20px', fontSize: '1.2rem' }}>
                    ⬅️ 센서 (Input)
                </button>
                <button className="btn btn-success" onClick={() => handleChoice('actuator')} style={{ flex: 1, padding: '20px', fontSize: '1.2rem' }}>
                    액추에이터 (Output) ➡️
                </button>
            </div>

            <div style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>
                남은 문제: {ITEMS.length - currentIndex}
            </div>
        </div>
    );
}

export default Stage1;
