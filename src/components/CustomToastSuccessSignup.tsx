import { PiThumbsUpFill } from "react-icons/pi";

export default function CustomToastSuccess() {
    return (
        <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-green-900 bg-green-100">
            <PiThumbsUpFill className="w-3 h-3" />
            <span>Successfully Created Account</span>
        </div>
    )
}