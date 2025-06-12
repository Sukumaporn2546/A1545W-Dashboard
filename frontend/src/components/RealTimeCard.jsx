import React, { useEffect, useState } from 'react';
import { useTemperatureStore } from '../services/useTemperatureStore';

export const RealTimeCard = () => {

    const {
        currentData,
        setupWebSocket,
        closeWebSocket,
    } = useTemperatureStore();

    useEffect(() => {
        setupWebSocket();      // connect on mount
        return () => closeWebSocket(); // cleanup on unmount
    }, []);
    // const [currentData, setCurrentData] = useState({
    //     temperature: 25.35,
    //     humidity: 39.28,
    // });

    const getBorderColor = (status) => {
        switch (status) {
            case 'normal': return 'border-blue-400';
            case 'warning': return 'border-yellow-400';
            case 'critical': return 'border-red-500';
            default: return 'border-gray-400';
        }
    };

    const getTemperatureStatus = (temperature) => {
        if(temperature == 0 || temperature == null) return 'default';
        else if(temperature > 35) return 'critical';     // อุณหภูมิสูงเกินไป
        else if(temperature > 28) return 'warning'; // เริ่มสูง
        else return 'normal';
    };

    const getHumidityStatus = (humidity) => {
        // if (humidity < 30 || humidity > 85) return 'critical';
        // else if (humidity < 40 || humidity > 80) return 'warning';
        // else return 'normal';

        if(humidity == 0 || humidity == null) return 'default';
        else if(humidity < 30 || humidity > 85) return 'critical';    
        else if(humidity < 40 || humidity > 80) return 'warning'; 
        else return 'normal';
    };

    const StatCard = ({ title, value, unit, status }) => (
        <div className={`bg-white rounded-xl p-6 border-l-8 ${getBorderColor(status)} transition-shadow flex flex-col justify-between mb-8`}>
            <p className="text-sm font-normal text-gray-400">{title}</p>
            <div className="flex flex-1 items-center justify-center">
                <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold">{value}</span>
                    <span className="text-lg text-gray-500">{unit}</span>
                </div>
            </div>
        </div>
    );



    return (
        <>
            {/* Current Values */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <StatCard
                    title="Current Temperature"
                    value={currentData?.temperature ?? '--'}
                    //value={30}
                    unit="°C"
                    status={getTemperatureStatus(currentData.temperature)}
                    //status={getTemperatureStatus(30)}
                />
                <StatCard
                    title="Current Humidity"
                    value={currentData?.humidity ?? '--'}
                    // value={62.35}
                    unit="%"
                    status={getHumidityStatus(currentData.humidity)}
                    // status={getHumidityStatus(62.35)}
                />
            </div>

        </>

    );
};