import React from 'react';

const LearnMoreButton: React.FC = () => {
    const handleLearnMoreClick = () => {
        window.open('/src/assets/Regles de fonctionnement FabLab_2023.pdf', '_blank');
    };

    return (
        <button
            onClick={handleLearnMoreClick}
            className="inline-flex items-center px-6 py-3 bg-black hover:bg-yellow-400 text-yellow-400 hover:text-black rounded-lg font-medium transition-colors"
    >
            Learn More
        </button>
    );
};

export default LearnMoreButton;