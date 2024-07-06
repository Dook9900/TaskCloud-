import React from 'react'
import Dashboard from '../../components/Dashboard/Dashboard';
import styles from './_dashboardPage.module.css'

const DashboardPage = () => {
  return (
    <div className={styles.dashboardContainer}>
        <Dashboard />
    </div>
  )
}

export default DashboardPage