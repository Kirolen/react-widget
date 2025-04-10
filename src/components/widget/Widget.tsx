import styles from "./Widget.module.css";

import { useState, useEffect } from "react";
import { IStepPeriod } from "../../types/data";

interface WidgetProps {
    stepData: IStepPeriod[];
}

const maxDailySteps = 8000;
const currentTime = new Date();

const Widget = ({ stepData }: WidgetProps) => {
    const [columnCount, setColumnCount] = useState(12);
    const [toggleScroll, setToggleScroll] = useState(false);
    const [periods, setPeriods] = useState<{ startDate: string; endDate: string; totalSteps: number }[]>([]);

    const dailySteps = stepData.reduce((totalSteps, period) => totalSteps + period.steps, 0);
    const progressPercentage = Math.min(Number(((dailySteps / maxDailySteps) * 100).toFixed(2)), 100);
    const maxStepsPerPeriod = Math.max(...periods.map(p => p.totalSteps), maxDailySteps / columnCount);

    const getPeriodsWithSteps = (stepData: IStepPeriod[], splits: number) => {
        const offsetMs = 3 * 60 * 60 * 1000;

        const dayStart = new Date(currentTime);
        dayStart.setHours(0, 0, 0, 0);
        dayStart.setTime(dayStart.getTime()); 
        
        const dayEnd = new Date(currentTime);
        dayEnd.setHours(23, 59, 59, 999);
        dayEnd.setTime(dayEnd.getTime()); 
        const periodLength = (dayEnd.getTime() - dayStart.getTime()) / splits;
        const periods: { startDate: string; endDate: string; totalSteps: number }[] = [];

        for (let i = 0; i < splits; i++) {
            const startDate = new Date(dayStart.getTime() + (i * periodLength)+ offsetMs);
            const endDate = new Date(dayStart.getTime() + ((i + 1) * periodLength)  +offsetMs);

            const periodData = stepData.filter((period) => {
                const periodStart = new Date(period.startDate).getTime();
                const periodEnd = new Date(period.endDate).getTime();
                return (periodStart < endDate.getTime() && periodEnd > startDate.getTime());
            });

            let totalSteps = 0; 

            periodData.forEach((period) => {
                const periodStart = new Date(period.startDate).getTime();
                const periodEnd = new Date(period.endDate).getTime();
                const periodDuration = periodEnd - periodStart;
                let overlapRatio = 1;
    
                if (periodStart < startDate.getTime() && periodEnd > endDate.getTime()) {
                    overlapRatio = periodLength / periodDuration;
                } else if (periodStart < startDate.getTime()) {
                    overlapRatio = (periodEnd - startDate.getTime()) / periodDuration;
                } else if (periodEnd > endDate.getTime()) {
                    overlapRatio = (endDate.getTime() - periodStart) / periodDuration;
                }
    
                if (overlapRatio > 1) console.log(overlapRatio + " - " + period.steps)
                totalSteps += Math.floor(period.steps * overlapRatio);
            });

           
            periods.push({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                totalSteps,
            });
        }

        return periods;
    };

    useEffect(() => {
        setPeriods(getPeriodsWithSteps(stepData, columnCount));
    }, [stepData, columnCount]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.stepsContainer}>
                <h3>Steps</h3>
                <div className={styles.infoContainer}>
                    <p className={styles.dailyText}>
                        {dailySteps} <span>/ {maxDailySteps} steps</span>
                    </p>

                    <div className={styles.stepsChart}>
                        {periods.map((period, index) => {
                            const heightPercentage = Math.max((period.totalSteps / maxStepsPerPeriod) * 100, 10);
                            const isCurrentPeriod = currentTime >= new Date(period.startDate) && currentTime <= new Date(period.endDate);
                            const isInactive = heightPercentage <= 10;

                            return (
                                
                                <div
                                    className={`${styles.stepColumn} ${isInactive ? styles.inactive : ""} ${isCurrentPeriod ? styles.today : ""}`}
                                    style={{ height: `${isInactive ? 10 : heightPercentage}%` }}
                                > <p>{period.totalSteps}</p></div>
                                
                            );
                        })}
                    </div>
                </div>

                <div className={styles.progressBar}>
                    <div className={styles.progressPercentage} style={{ width: `${progressPercentage}%` }}></div>
                    <span className={styles.percentText}>{progressPercentage}%</span>
                </div>

                <div className={styles.contolePanel}>
                    <button className={styles.toggleRange} onClick={() => setToggleScroll(!toggleScroll)}>
                        {toggleScroll ? "Hide change columns count" : "Open change columns count"}
                    </button>

                    {toggleScroll &&
                        <div className={styles.colInfo}>
                            <input
                                type="range"
                                min="1"
                                max="24"
                                value={columnCount}
                                onChange={(e) => setColumnCount(Number(e.target.value))}
                            />
                        </div>
                    }

                    <p className={styles.date}>Steps now</p>
                </div>
            </div>
        </div>
    );
};

export { Widget };
