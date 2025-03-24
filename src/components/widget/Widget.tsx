import "../../styles/Widget.scss";
import React, { useState, useEffect, useMemo } from "react";
import { IStepPeriod } from "../../types/data";

interface WidgetProps {
    stepData: IStepPeriod[];
}

const Widget: React.FC<WidgetProps> = ({ stepData }) => {
    const [columnCount, setColumnCount] = useState<number>(12);
    const [toggleScroll, setToggleScroll] = useState<boolean>(false);
    const maxDailySteps = 8000;

    const currentTime = useMemo(() => new Date(), [])

    const dailySteps = useMemo(() => {
        if (!stepData.length || new Date(stepData[0].startDate) > currentTime || new Date(stepData[stepData.length - 1].endDate) < currentTime) {
            return 0;
        }

        let left = 0, right = stepData.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const periodStart = new Date(stepData[mid].startDate);
            const periodEnd = new Date(stepData[mid].endDate);

            if (currentTime >= periodStart && currentTime <= periodEnd) return stepData[mid].steps;
            else if (currentTime < periodStart) right = mid - 1;
            else left = mid + 1;
        }
        return 0;
    }, [stepData, currentTime]);

    const progressPercentage = Number(((dailySteps / maxDailySteps) * 100).toFixed(2));

    return (
        <div className="wrapper">
            <div className="steps-container">
                <h3>Steps</h3>
                <p className="daily-text">{dailySteps} <span>/ {maxDailySteps} steps</span></p>

                <div className="steps-chart">
                    {stepData.slice(0, columnCount).map((period, index) => {
                        const heightPercentage = Math.max((period.steps / maxDailySteps) * 100, 10);
                        const isCurrentPeriod = currentTime >= new Date(period.startDate) && currentTime <= new Date(period.endDate);

                        const isInactive = heightPercentage <= 10;

                        return (
                            <div key={index} className="column-wrapper">
                                {isCurrentPeriod && <span 
                                                        className="today-marker" 
                                                        style={{ top: `${isInactive ? 20 : -20 * (heightPercentage / 100)}px` }}>
                                                    ★</span>}
                                <div
                                    className={`step-column ${isInactive ? 'inactive' : ''} ${isCurrentPeriod ? 'today' : ''}`}
                                    style={{ height: `${isInactive ? 10 : heightPercentage}%` }}
                                ></div>
                            </div>
                        );
                    })}
                </div>

                <div className="progress-bar">
                    <div className="progress-percentage" style={{width: `${progressPercentage}%`}}></div>
                    <span className="percent-text">{progressPercentage}%</span>
                </div>

                <button className="toggle-range" onClick={() => setToggleScroll(!toggleScroll)}>
                    {toggleScroll ? "Hide change columns count" : "Open change columns count"}
                </button>

                {toggleScroll && (
                    <>
                        <input
                            type="range"
                            min="1"
                            max="24"
                            value={columnCount}
                            onChange={(e) => setColumnCount(Number(e.target.value))}
                        />
                        <p className="col-value">Columns count: {columnCount}</p>
                    </>
                )}

                <p className="date">Steps now</p>
            </div>
        </div>
    );
};

export { Widget };
