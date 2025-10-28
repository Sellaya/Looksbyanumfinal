import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

export default function BookingActionDropdown() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      id: "upload",
      label: "Upload Payment Screenshot",
      subtext: "Submit your Interac transfer receipt",
      path: "/interac-upload",
    },
    {
      id: "edit",
      label: "Edit Existing Booking",
      subtext: "Update your existing booking details",
      path: "/edit-booking",
    },
  ]

  const handleSelect = (path) => {
    setIsOpen(false)
    navigate(path)
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 open:bg-gray-200 text-gray-800 bg-white border border-gray-300 rounded-md hover:border-gray-700 hover:bg-gray-50 transition-all duration-200"
      >
        <span className="font-light">Options for Booked Services</span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleSelect(action.path)}
              className="w-full text-left px-4 py-3 bg-white hover:bg-gray-200 border-gray-200 hover:border-gray-200 transition-colors duration-150"
            >
              <div className="text-sm text-gray-800 font-light">{action.label}</div>
              <div className="text-xs text-gray-600 italic">{action.subtext}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
