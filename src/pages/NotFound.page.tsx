import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="flex w-100vw h-100vh justify-center align-center">
            <h3 className="text-center">Not Found {":("}</h3>
            <p className="text-center">
                Go back <Link to="/">Home</Link>
            </p>
        </div>
    )
}