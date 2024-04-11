"use client"

import { useContext } from 'react';
import { DictonaryContext } from '@futurebrand/contexts';

export function useDictionary () {
  const { dictionary } = useContext(DictonaryContext)
  return dictionary
}

