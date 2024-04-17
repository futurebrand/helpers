"use server"

import { OptionsService } from "@futurebrand/services"

export async function loadGlobalOptions(locale: string) {
  const options = await OptionsService.instantiate(locale)
  return options
}