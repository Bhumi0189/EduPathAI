"use client"

import { useEffect, useRef } from "react"
import { useUser } from "./useUser"

export function useStudyTime() {
  const { user } = useUser()
  const userId = user?.id
  const pendingSecondsRef = useRef<number>(0)
  const lastTickRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!userId) return

    const channel = new BroadcastChannel('edupath-progress')

    const sendStudySeconds = async (seconds: number) => {
      if (!seconds || seconds <= 0) return
      try {
        const res = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, activityType: 'studyTime', data: { seconds } }),
          keepalive: true,
        })
        const json = await res.json()
        if (json && json.totalStudyHours !== undefined) {
          channel.postMessage({ type: 'studyTime', userId, totalStudyHours: json.totalStudyHours })
        }
      } catch (err) {
        // swallow errors; we'll retry on next interval
        console.error('Failed to send study time', err)
      }
    }

    const tick = () => {
      const now = Date.now()
      if (lastTickRef.current == null) {
        lastTickRef.current = now
        return
      }
      const deltaMs = now - lastTickRef.current
      lastTickRef.current = now
      // only count when document visible
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return
      // accumulate seconds
      pendingSecondsRef.current += Math.round(deltaMs / 1000)
      // send every 30 seconds of accumulated time
      if (pendingSecondsRef.current >= 30) {
        const toSend = pendingSecondsRef.current
        pendingSecondsRef.current = 0
        // fire-and-forget
        void sendStudySeconds(toSend)
      }
    }

    const start = () => {
      if (intervalRef.current != null) return
      lastTickRef.current = Date.now()
      // @ts-ignore setInterval in browser returns number
      intervalRef.current = window.setInterval(tick, 10000)
    }

    const stop = () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') start()
      else stop()
    }

    // start immediately if visible
    if (typeof document !== 'undefined') {
      if (document.visibilityState === 'visible') start()
      document.addEventListener('visibilitychange', onVisibility)
    }

    window.addEventListener('focus', start)
    window.addEventListener('blur', stop)

    const onBeforeUnload = () => {
      const seconds = pendingSecondsRef.current
      if (!seconds) return
      pendingSecondsRef.current = 0
      // try navigator.sendBeacon for unload-safe send
      try {
        const payload = JSON.stringify({ userId, activityType: 'studyTime', data: { seconds } })
        if (navigator && 'sendBeacon' in navigator) {
          navigator.sendBeacon('/api/progress', new Blob([payload], { type: 'application/json' }))
        } else {
          // fallback synchronous request
          const xhr = new XMLHttpRequest()
          xhr.open('POST', '/api/progress', false)
          xhr.setRequestHeader('Content-Type', 'application/json')
          try { xhr.send(payload) } catch (e) { /* ignore */ }
        }
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      stop()
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', start)
      window.removeEventListener('blur', stop)
      window.removeEventListener('beforeunload', onBeforeUnload)
      channel.close()
    }
  }, [userId])
}

export default useStudyTime
