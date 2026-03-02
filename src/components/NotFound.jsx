import React from 'react'

function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <button onClick={() => window.history.back()}>Go Back</button>
    </div>
  )
}

export default NotFound
