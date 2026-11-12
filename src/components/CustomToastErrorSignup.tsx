import { PiXCircleFill } from "react-icons/pi";

export default function CustomToastError() {
    return (
        <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100">
            <PiXCircleFill className="w-3 h-3" />
            <span>Something Went Wrong</span>
        </div>
    )
}