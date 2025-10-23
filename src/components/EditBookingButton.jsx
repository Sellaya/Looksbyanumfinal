import { useNavigate } from "react-router-dom"
import { PencilIcon } from "@heroicons/react/24/outline"

export default function EditBookingButton() {
  const navigate = useNavigate()

  const handleEditClick = () => {
    navigate("/edit-booking")
  }

  return (
    <button
      onClick={handleEditClick}
      className="flex items-center gap-2 w-full px-4 py-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-light transition-all duration-300"
    >
      <PencilIcon className="w-5 h-5 text-gray-600" />
      <span>Edit an Existing Booking</span>
    </button>
  )
}
