import React from 'react';

const ModalTabs = ({ tabs, activeTab, onChangeTab }) => (
    <ul className="nav nav-tabs">
        {tabs.map((tab, index) => (
            <li className="nav-item" key={index}>
                <button
                    className={`nav-link ${activeTab === tab ? 'active' : ''}`}
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
