import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

function TeacherDashboard({ onBack }) {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const studentsRef = ref(db, 'students');

        // Firebase 실시간 리스너 설정
        const unsubscribe = onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const studentArray = Object.values(data);
                setStudents(studentArray);
            } else {
                setStudents([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'green': return '#4caf50';
            case 'yellow': return '#ffb74d';
            case 'red': return '#ef5350';
            default: return '#ddd';
        }
    };

    // 도움이 필요한 학생 판별 (5분 이상 같은 단계에 머물러 있는 경우)
    const needsHelp = (student) => {
        if (!student.stageStartTime || student.stage === 0 || student.stage >= 3) {
            return false;
        }
        const stageStartTime = new Date(student.stageStartTime);
        const now = new Date();
        const minutesElapsed = (now - stageStartTime) / 1000 / 60;
        return minutesElapsed > 5;
    };

    return (
        <div className="card fade-in" style={{ maxWidth: '1000px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>👨‍🏫 교사용 대시보드 (실시간 현황)</h2>
                <button onClick={onBack} className="btn" style={{ background: '#eee' }}>나가기</button>
            </div>

            {/* 도움 필요 학생 우선순위 알림 */}
            {students.filter(s => needsHelp(s)).length > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: 'white',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    animation: 'urgent-pulse 2s infinite',
                    boxShadow: '0 4px 15px rgba(250, 112, 154, 0.3)'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    <div>
                        <strong>도움이 필요한 학생: {students.filter(s => needsHelp(s)).length}명</strong>
                        <p style={{ fontSize: '0.9rem', marginTop: '5px', opacity: 0.9 }}>
                            5분 이상 같은 단계에 머물러 있는 학생들입니다. 우선적으로 지도해주세요.
                        </p>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {students.length === 0 ? (
                    <p>접속한 학생이 없습니다.</p>
                ) : (
                    students
                        // 도움 필요 학생을 먼저 정렬
                        .sort((a, b) => {
                            const aHelp = needsHelp(a);
                            const bHelp = needsHelp(b);
                            if (aHelp && !bHelp) return -1;
                            if (!aHelp && bHelp) return 1;
                            return 0;
                        })
                        .map(s => {
                            const isNeedingHelp = needsHelp(s);

                            // 경과 시간 계산
                            let elapsedMinutes = 0;
                            if (s.stageStartTime && s.stage > 0 && s.stage < 3) {
                                const stageStartTime = new Date(s.stageStartTime);
                                const now = new Date();
                                elapsedMinutes = Math.floor((now - stageStartTime) / 1000 / 60);
                            }

                            return (
                                <div key={s.id} style={{
                                    padding: '20px',
                                    borderRadius: '12px',
                                    border: isNeedingHelp ? '3px solid #fa709a' : `2px solid ${getStatusColor(s.status)}`,
                                    background: isNeedingHelp ? 'rgba(250, 112, 154, 0.05)' : 'white',
                                    position: 'relative',
                                    animation: isNeedingHelp ? 'pulse-glow 2s infinite, shake 0.5s ease-in-out 0s 3' : 'none',
                                    transition: 'all 0.3s ease',
                                    cursor: isNeedingHelp ? 'pointer' : 'default'
                                }}>
                                    {isNeedingHelp && (
                                        <>
                                            <div style={{
                                                position: 'absolute',
                                                top: '-12px',
                                                right: '-12px',
                                                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                boxShadow: '0 4px 12px rgba(250, 112, 154, 0.4)',
                                                animation: 'badge-bounce 1s infinite',
                                                zIndex: 10
                                            }}>
                                                🚨 도움 필요!
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                left: '10px',
                                                background: 'rgba(250, 112, 154, 0.9)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '8px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {elapsedMinutes}분 경과
                                            </div>
                                        </>
                                    )}
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: getStatusColor(s.status)
                                    }} />
                                    <h4 style={{ marginBottom: '5px', marginTop: isNeedingHelp ? '15px' : '0' }}>{s.name}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>학번: {s.id}</p>
                                    <div style={{ marginTop: '15px' }}>
                                        <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>진행 단계: Stage {s.stage}</div>
                                        <div style={{ width: '100%', height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(s.stage / 3) * 100}%`, height: '100%', background: getStatusColor(s.status) }} />
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                                        최근 업데이트: {new Date(s.lastUpdate).toLocaleTimeString()}
                                    </div>
                                </div>
                            );
                        })
                )}
            </div>

            <div style={{ marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h4>💡 교사 가이드</h4>
                <ul style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '20px' }}>
                    <li>🟢 초록색: 모든 미션을 완료한 학생입니다. 심화 과제를 부여할 수 있습니다.</li>
                    <li>🟡 노란색: 학습을 진행 중인 학생입니다.</li>
                    <li>🔴 빨간색: 접속이 끊겼거나 아직 시작하지 않은 학생입니다.</li>
                    <li>특정 단계에서 5분 이상 멈춰있는 학생은 카드가 떨리며 알림을 줍니다. (구현 예정)</li>
                </ul>
            </div>
        </div>
    );
}

export default TeacherDashboard;
