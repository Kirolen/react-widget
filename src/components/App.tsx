import { IStepPeriod } from "../types/data";
import { Widget } from "./widget/Widget";

const App = () => {
    const generateStepsData = (): IStepPeriod[] => {
        const now = new Date();
        const startDate = new Date(now.setHours(0, 0, 0, 0));
        const endDate = new Date(now.setHours(23, 59, 59, 999));

        const generatedData: IStepPeriod[] = [];
        let currentStartTime = startDate.getTime();

        while (currentStartTime < endDate.getTime()) {
            const periodDuration = getRandomDuration();
            let periodEndTime = currentStartTime + periodDuration;

            if (periodEndTime > endDate.getTime()) {
                periodEndTime = endDate.getTime();
            }
            
            const offsetMs = 3 * 60 * 60 * 1000; // 3 години в мілісекундах

            const periodStartDate = new Date(currentStartTime  + offsetMs);
            const periodEndDate = new Date(periodEndTime + offsetMs);

            const randomSteps = Math.floor(Math.random() * (800));

            generatedData.push({
                startDate: periodStartDate.toISOString(),
                endDate: periodEndDate.toISOString(),
                steps: randomSteps,
            });

            const gapDuration = getRandomGap();
            currentStartTime = periodEndTime + gapDuration;
        }

        console.log("Generated data:", generatedData);
        return generatedData;
    };

    const getRandomDuration = (): number => {
        const possibleDurations = [
            10 * 1000,    
            30 * 1000,    
            1 * 60 * 1000,   
            5 * 60 * 1000,    
            15 * 60 * 1000,  
            30 * 60 * 1000,   
            1 * 60 * 60 * 1000,  
            2 * 60 * 60 * 1000   
        ];
        return possibleDurations[Math.floor(Math.random() * possibleDurations.length)];
    };

    const getRandomGap = (): number => {
        const possibleGaps = [
            5 * 60 * 1000,   
            15 * 60 * 1000,   
            30 * 60 * 1000,   
            1 * 60 * 60 * 1000,   
            2 * 60 * 60 * 1000,   
            3 * 60 * 60 * 1000   
        ];
        return possibleGaps[Math.floor(Math.random() * possibleGaps.length)];
    };

    return <Widget stepData={generateStepsData()} />;
};

export { App };
