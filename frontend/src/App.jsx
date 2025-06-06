import { useState } from 'react'
import './App.css'
import DashboardLayout from './layouts/DashboardLayOut'
import { ConfigProvider } from 'antd';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const themeToken = {
    colorBgContainer: isDarkMode ? '#1a1a1a' : '#ffffff',
    colorText: isDarkMode ? '#ffffff' : '#000000',
    colorPrimary: isDarkMode ? '#00b96b' : '#1677ff',

     // เพิ่ม token สำหรับ Select
  colorBgElevated: isDarkMode ? '#2a2a2a' : '#ffffff',       // พื้นหลัง dropdown, popup
  //colorFillAlter: isDarkMode ? '#949494' : '#fafafa',     // พื้นหลัง input
  //optionActiveBg: isDarkMode ? '#949494' : '#949494', 
  optionSelectedColor: isDarkMode ? '#00b96b' : '#1677ff',
  };

  return (
    <ConfigProvider
      theme={
        {
          token: themeToken,
        }
      }>
      <DashboardLayout isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(prev => !prev)} />
    </ConfigProvider>
  )
}

export default App
