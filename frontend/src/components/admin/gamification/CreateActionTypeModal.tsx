
import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreateActionTypeData } from "@/interfaces/gamification"

interface CreateActionTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateActionTypeData) => Promise<void>
  loading: boolean
}

export const CreateActionTypeModal = ({ isOpen, onClose, onSubmit, loading }: CreateActionTypeModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<{ label: string }>()
  const [generatedId, setGeneratedId] = useState("")

  const labelValue = watch("label", "")

  // Auto-generate ID when label changes
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value
    const id = label.toUpperCase().replace(/\s+/g, "_")
    setGeneratedId(id)
    setValue("label", label)
  }

  const handleFormSubmit = async (data: { label: string }) => {
    await onSubmit({
      label: data.label,
      id: generatedId,
    })
    reset()
    setGeneratedId("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Action Type</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              placeholder="e.g., Watch a video"
              {...register("label", { required: "Label is required" })}
              onChange={handleLabelChange}
            />
            {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label.message}</p>}
          </div>

          <div>
            <Label htmlFor="generatedId">Generated ID</Label>
            <Input
              id="generatedId"
              value={generatedId}
              readOnly
              className="bg-gray-50"
              placeholder="Auto-generated from label"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !labelValue.trim()}>
              {loading ? "Creating..." : "Create Action Type"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
