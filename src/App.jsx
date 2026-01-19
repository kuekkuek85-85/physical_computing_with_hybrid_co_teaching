import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue, set, update } from 'firebase/database';
import Login from './components/Login';
import Stage1 from './components/Stage1';
import Stage2 from './components/Stage2';
import Stage3 from './components/Stage3';
import TeacherDashboard from './components/TeacherDashboard';

function App() {
    const [user, setUser] = useState(null);
    const [currentStage, setCurrentStage] = useState(0); // 0: Login, 1, 2, 3: Stages, 4: Dashboard
    const [scores, setScores] = useState({ s1: 0, s2: 0, s3: 0 });

    // Firebase synchronization
    useEffect(() => {
        if (user) {
            const studentRef = ref(db, `students/${user.id}`);

            // Initial data update
            update(studentRef, {
                name: user.name,
                id: user.id,
                stage: currentStage,
                scores: scores,
                lastUpdate: new Date().toISOString(),
                status: currentStage === 3 ? 'green' : (currentStage === 0 ? 'red' : 'yellow')
            });
        }
    }, [user, currentStage, scores]);

    const handleLogin = (userData) => {
        setUser(userData);
        setCurrentStage(1);
    };

    const nextStage = () => {
        setCurrentStage((prev) => {
            const newStage = prev + 1;
            // 단계 변경 시 stageStartTime 업데이트
            if (user) {
                const studentRef = ref(db, `students/${user.id}`);
                update(studentRef, {
                    stageStartTime: new Date().toISOString()
                });
            }
            return newStage;
        });
    };

    const updateScore = (stage, score) => {
        setScores(prev => ({ ...prev, [stage]: score }));
    };

    return (
        <div className="App">
            {currentStage === 0 && <Login onLogin={handleLogin} onAdminLogin={() => setCurrentStage(4)} />}

            {currentStage > 0 && currentStage < 4 && (
                <div className="stepper-container fade-in">
                    <header style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h2>PhyCom-AI 학습관</h2>
                        <p>{user?.name} 학생 (학번: {user?.id})</p>
                    </header>
                    <div className="stepper">
                        <div className={`step ${currentStage >= 1 ? (currentStage > 1 ? 'completed' : 'active') : ''}`}>1</div>
                        <div className={`step ${currentStage >= 2 ? (currentStage > 2 ? 'completed' : 'active') : ''}`}>2</div>
                        <div className={`step ${currentStage >= 3 ? (currentStage > 3 ? 'completed' : 'active') : ''}`}>3</div>
                    </div>
                </div>
            )}

            {currentStage === 1 && <Stage1 onComplete={(score) => { updateScore('s1', score); nextStage(); }} />}
            {currentStage === 2 && <Stage2 onComplete={(score) => { updateScore('s2', score); nextStage(); }} />}
            {currentStage === 3 && <Stage3 user={user} onComplete={(score) => { updateScore('s3', score); alert('모든 미션을 완료했습니다!'); }} />}
            {currentStage === 4 && <TeacherDashboard onBack={() => setCurrentStage(0)} />}
        </div>
    );
}

export default App;
