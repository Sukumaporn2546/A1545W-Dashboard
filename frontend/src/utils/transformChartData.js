
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
            return 'dd MMM HH:mm'; 
        default:
            return 'HH:mm:ss'; 
    }
};
