import * as React from "react"

const MOBILE_BREAKPOINT = 768
const DESKTOP_BREAKPOINT = 1024

export type ViewportDevice = "mobile" | "tablet" | "desktop"

type ViewportDeviceState = {
  device: ViewportDevice
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

function getViewportDevice(width: number): ViewportDevice {
  if (width < MOBILE_BREAKPOINT) {
    return "mobile"
  }

  if (width < DESKTOP_BREAKPOINT) {
    return "tablet"
  }

  return "desktop"
}

function getViewportDeviceState(): ViewportDeviceState {
  const device = getViewportDevice(window.innerWidth)

  return {
    device,
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop",
  }
}

export function useViewportDevice() {
  const [state, setState] = React.useState<ViewportDeviceState>(() => ({
    device: "desktop",
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }))

  React.useEffect(() => {
    const updateState = () => {
      setState(getViewportDeviceState())
    }

    updateState()
    window.addEventListener("resize", updateState)
    return () => window.removeEventListener("resize", updateState)
  }, [])

  return state
}

export function useIsMobile() {
  return useViewportDevice().isMobile
}

export function useIsTablet() {
  return useViewportDevice().isTablet
}

export function useIsDesktop() {
  return useViewportDevice().isDesktop
}
