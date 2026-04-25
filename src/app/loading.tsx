import React from 'react'

import { PulseLoader } from "react-spinners"

export default function Loading() {
  return (
  <div className="flex items-center justify-center h-100">
      <PulseLoader
  color="#00A63E"
  margin={5}
  size={15}
  speedMultiplier={1}
/>
  </div>
  )
}

