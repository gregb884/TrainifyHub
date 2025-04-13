import React, { useState, useRef, useLayoutEffect } from 'react';
import '../app/globals.css';

const CustomPicker = ({ onRepetitionsChange, onWeightChange, initialRepetitions = 1, initialWeight = 1 }) => {
    const [selectedRepetitions, setSelectedRepetitions] = useState(initialRepetitions);
    const [selectedWeight, setSelectedWeight] = useState(initialWeight);

    const repetitions = Array.from({ length: 50 }, (_, i) => i + 1);
    const weights = Array.from({ length: 100 }, (_, i) => i - 1);

    const pickerRefReps = useRef(null);
    const pickerRefWeight = useRef(null);
    let scrollTimeout = useRef(null);

    const handleScroll = (event, type) => {
        const picker = event.target;
        const pickerHeight = picker.clientHeight;
        const itemHeight = 40;
        const scrollMiddle = picker.scrollTop + pickerHeight / 2;
        const index = Math.floor(scrollMiddle / itemHeight);

        if (type === 'repetitions') {
            const newRepetitions = repetitions[Math.max(0, Math.min(repetitions.length , index))];
            setSelectedRepetitions(newRepetitions);
            onRepetitionsChange(newRepetitions);
        } else if (type === 'weight') {
            const newWeight = weights[Math.max(0, Math.min(weights.length , index))];
            setSelectedWeight(newWeight);
            onWeightChange(newWeight);
        }

        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        scrollTimeout.current = setTimeout(() => {
            snapToCenter(type);
        }, 50);
    };

    const snapToCenter = (type) => {
        const picker = type === 'repetitions' ? pickerRefReps.current : pickerRefWeight.current;
        const itemHeight = 40;
        const scrollTop = picker.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        const newScrollTop = index * itemHeight;
        picker.scrollTo({ top: newScrollTop, behavior: 'smooth' });
    };

    useLayoutEffect(() => {
        const scrollToSelected = () => {
            if (pickerRefReps.current && pickerRefWeight.current) {
                const repsIndex = repetitions.indexOf(initialRepetitions);
                const weightIndex = weights.indexOf(initialWeight);

                if (repsIndex === -1 || weightIndex === -1) return;

                const itemHeight = 40;

                pickerRefReps.current.scrollTop = repsIndex * itemHeight;
                pickerRefWeight.current.scrollTop = weightIndex * itemHeight;
            }
        };

        // Użyj setTimeout z opóźnieniem 0, aby upewnić się, że DOM jest gotowy
        setTimeout(scrollToSelected, 0);
    }, [initialRepetitions, initialWeight]);

    return (
        <div className="custom-picker-container">
            <div className="custom-picker">
                <div
                    className="picker-column"
                    ref={pickerRefReps}
                    onScroll={(e) => handleScroll(e, 'repetitions')}
                >
                    {repetitions.map((rep, index) => (
                        <div
                            key={index}
                            className={`picker-item ${rep === selectedRepetitions ? 'selected' : ''}`}
                        >
                            {rep}
                        </div>
                    ))}
                </div>
                <div
                    className="picker-column"
                    ref={pickerRefWeight}
                    onScroll={(e) => handleScroll(e, 'weight')}
                >
                    {weights.map((weight, index) => (
                        <div
                            key={index}
                            className={`picker-item ${weight === selectedWeight ? 'selected' : ''}`}
                        >
                            {weight} kg
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomPicker;