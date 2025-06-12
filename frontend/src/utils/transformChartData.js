
// export const groupByDay = (data) => {
//     const grouped = {};

//     data.forEach(item => {
//         const dateKey = new Date(item.timestamp).toISOString().split('T')[0]; // '2024-06-04'
//         if (!grouped[dateKey]) grouped[dateKey] = [];
//         grouped[dateKey].push(item.value);
//     });

//     return Object.entries(grouped).map(([date, values]) => {
//         const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
//         return [new Date(date).getTime(), avg];
//     });
// };

// export const groupByMonth = (data) => {
//     const grouped = {};

//     data.forEach(item => {
//         const d = new Date(item.timestamp);
//         const monthKey = `${d.getFullYear()}-${d.getMonth()}`; // "2024-5"
//         if (!grouped[monthKey]) grouped[monthKey] = [];
//         grouped[monthKey].push(item.value);
//     });

//     return Object.entries(grouped).map(([month, values]) => {
//         const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
//         const [year, monthIndex] = month.split('-');
//         const date = new Date(year, monthIndex, 1);
//         return [date.getTime(), avg];
//     });
// };

export const getXAxisFormat = (pickerType) => {
    switch (pickerType) {
        case 'date':
            return 'HH:mm:ss'; //02:00
        case 'week':
            return 'ddd dd'; //Mon Tue dddd Monday 
        case 'month':
            return 'dd MMM'; //03 Jun
        case 'year':
            return 'MMM yyyy';  //Jun 2024
        case 'period':
            return 'dd MMM HH:mm'; // หรือจะปรับแบบ dynamic ก็ได้
        default:
            return 'HH:mm:ss'; 
    }
};
