import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      categories: {
        find(): Promise<Category[]>
        findOne(id: string): Promise<Category | null>
      }
      questions: {
        findByCategory(id: string): Promise<Question[]>
      }
    }
  }
}
