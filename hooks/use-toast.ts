import * as React from "react"
import { toast as toastManager } from "@/components/ui/toast"

export interface ToastProps {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
  type?: "success" | "info" | "warning" | "error" | "loading"
  timeout?: number
  action?: React.ReactNode
  [key: string]: any
}

export function toast({
  title,
  description,
  variant,
  type,
  ...props
}: ToastProps) {
  const toastType = type ?? (variant === "destructive" ? "error" : undefined)

  return toastManager.add({
    title,
    description,
    type: toastType,
    ...props,
  })
}

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => toastManager.close(toastId),
  }
}
