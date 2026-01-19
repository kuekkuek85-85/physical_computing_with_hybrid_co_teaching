import React, { useState } from 'react';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';

function Login({ onLogin, onAdminLogin }) {
    const [name, setName] = useState('');
    const [id, setId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name && id) {
            // Firebase에 학생 초기 데이터 생성
            const studentRef = ref(db, `students/${id}`);
            await set(studentRef, {
                name,
                id,
                stage: 0,
                scores: { s1: 0, s2: 0, s3: 0 },
                lastUpdate: new Date().toISOString(),
                status: 'red',
                stageStartTime: new Date().toISOString()
            });

            onLogin({ name, id });
        }
    };

    return (
        <div className="card fade-in" style={{ maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>PhyCom-AI</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>
                인간-AI 협력 피지컬 컴퓨팅 교육 플랫폼
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>학번</label>
                    <input
                        type="text"
                        placeholder="예: 20401"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>이름</label>
                    <input
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                    학습 시작하기
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={onAdminLogin} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>
                    교사용 대시보드 접속
                </button>
            </div>
        </div>
    );
}

export default Login;
