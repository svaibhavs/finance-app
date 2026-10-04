import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? 'Unknown error' }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '48px 32px',
          textAlign: 'center',
          color: '#b91c1c',
          fontFamily: '-apple-system, "Segoe UI", system-ui, sans-serif',
        }}>
          <h2 style={{ marginBottom: 8 }}>Dashboard unavailable</h2>
          <p style={{ color: '#57606a', fontSize: 14 }}>
            {this.state.message} — try refreshing the page.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
