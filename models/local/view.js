import fs from 'node:fs/promises'
import { join } from 'node:path'

export class viewModel {
  static async getResource ({ url }) {
    try {
      const response = await fs.readFile(join(process.cwd(), 'view', url))
      return response
    } catch {
      return false
    }
  }
}
