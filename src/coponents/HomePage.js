import React from 'react';

function HomePage() {
    return (
        <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
            <h1>GST Report Creator</h1>
            <p>Select a page to continue.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
                <a
                    href="/monthlyCalculation"
                    style={{
                        padding: '10px 14px',
                        background: '#2ecc71',
                        color: '#fff',
                        borderRadius: '6px',
                        textDecoration: 'none'
                    }}
                >
                    Monthly Calculation
                </a>
                <a
                    href="/pivotTable"
                    style={{
                        padding: '10px 14px',
                        background: '#007bff',
                        color: '#fff',
                        borderRadius: '6px',
                        textDecoration: 'none'
                    }}
                >
                    Pivot Table
                </a>
            </div>
        </div>
    );
}

export default HomePage;
