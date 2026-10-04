import DashboardPage from './components/DashboardPage/DashboardPage'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <DashboardPage />
    </ErrorBoundary>
  )
}

export default App
