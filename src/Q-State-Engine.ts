import { useSyncExternalStore } from "react"

interface OptionRecord {
  cache: boolean
}

export class Q_StateEngine
  <T extends Record<string, any>, 
  O extends Partial<Record<keyof T, (raw: any) => any>>> 
{
  private listener: Set<() => void>
  private obj: T // Type-safe Map sesuai skema T
  private transformer: O
  private option?: OptionRecord

  constructor(state: T, transformer?: O, option?: OptionRecord) {
      this.obj = state
      this.transformer = transformer as any
      this.listener = new Set()
      this.option = option
  }

  private subsribe = (cb: any) => {
      this.listener.add(cb)
      return () => this.listener.delete(cb)
  }

  updateValue = <K extends keyof T>(key: K, func: (prev: T[K]) => T[K]) => {
      const executeFunc = func(this.obj[key])
      const transformData = (this.transformer && this.transformer[key]) 
        ? this.transformer[key](executeFunc) 
        : executeFunc
      // Kita ambil saja data hasil update jika data dari layer transformer nya undefined
      const finalData = transformData ?? executeFunc      
      this.obj[key] = finalData
      if(this.option?.cache) localStorage.setItem(key as string, JSON.stringify(this.obj[key]))
      this.listener.forEach(cb => cb())
  }

useQuantaState = <K extends keyof T>(key: K): [T[K]] => {
    const getCurrAfterRender = () => {
      if (this.option?.cache && typeof window !== "undefined") {
        const getcache = localStorage.getItem(key as string)
        if (getcache !== null && getcache !== 'undefined') {
          let dataFromCache = ''
            try {
              dataFromCache = JSON.parse(getcache)
            } catch {
              dataFromCache = this.obj[key]
            }
          if (dataFromCache !== this.obj[key]) {
            this.obj[key] = dataFromCache as any
          }
        }
      }
      return this.obj[key]
    }
    const defaultValue = null
    const syncSpecificData = useSyncExternalStore(
      this.subsribe,
      () => getCurrAfterRender(),
      () => defaultValue
    )
    return [syncSpecificData] as [T[K]]
  }
}