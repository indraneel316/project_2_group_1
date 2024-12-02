import React from 'react';

const ModalTabs = ({ tabsnew, activeTab, onChangeTab }
) => (
    <ul className="nav nav-tabs">
        {tabsnew.map((tab, index) => (
            <li className="nav-item" key={index}>
                <button
                    className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                    style={{ color: '#e74c3c', fontWeight:"600" }}
                    onClick={() => onChangeTab(tab)}
                >
                    {tab === 'photo' ? 'View Photo'
                        : tab === 'analysis' ? 'Photo Analysis'
                            : 'Recipe Suggestions'}
                </button>
            </li>
        ))}
    </ul>
);

export default ModalTabs;

