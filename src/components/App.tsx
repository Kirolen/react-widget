import React, { useState, useEffect } from "react";
import { IStepPeriod } from "../types/data";
import { Widget } from "./widget/Widget";

const App: React.FC = () => {
    const [stepData, setStepData] = useState<IStepPeriod[]>([]);

    const generateStepsData = (numOfPeriods: number, startDate: Date, endDate: Date): IStepPeriod[] => {
        const currentData = new Date();

        const generatedData: IStepPeriod[] = [];
        const totalMilliseconds = endDate.getTime() - startDate.getTime();
        const periodMilliseconds = Math.ceil(totalMilliseconds / numOfPeriods);
        

        for (let i = 0; i < numOfPeriods; ++i) {
            let periodStartDate = new Date(startDate.getTime() + i * periodMilliseconds);
            let periodEndDate = new Date(periodStartDate.getTime() + periodMilliseconds - 1);

            if (periodEndDate > endDate) {
                periodEndDate.setTime(endDate.getTime());
            }

            const isFuturePeriod = periodStartDate > currentData;
            const randomSteps = isFuturePeriod ? 0 : Math.floor(Math.random() * 8000);

            generatedData.push({
                startDate: new Date(periodStartDate.getTime() - periodStartDate.getTimezoneOffset() * 60000).toISOString(),
                endDate: new Date(periodEndDate.getTime() - periodEndDate.getTimezoneOffset() * 60000).toISOString(),
                steps: randomSteps,
            });
        }

        return generatedData;
    };

    const startDate = new Date('2025-03-10T08:00:00'); 
    const endDate = new Date('2025-03-27T08:00:00');
    const numOfPeriods = 24;

    useEffect(() => {
        const stepData = generateStepsData(numOfPeriods, startDate, endDate);
        setStepData(stepData);
    }, []);

    return <Widget stepData={stepData} />;
};

export { App };
