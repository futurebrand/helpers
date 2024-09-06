'use client'

import { smoothScrollTo } from '@futurebrand/utils'
import type React from 'react'
import { useEffect } from 'react'

interface Props {
  id: string
}

const Anchor: React.FC<Props> = ({ id }) => {
  useEffect(() => {
    const hash = window.location.hash
    if (hash === `#${id}`) {
      smoothScrollTo(id)
    }
  }, [id])

  return false
}

export default Anchor
