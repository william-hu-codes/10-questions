import { useEffect, useRef, useState } from "react"
import "./UploadWidget.css"

export default function UploadWidget({formData, setFormData}) {
    const cloudinaryRef = useRef()
    const widgetRef = useRef()
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: "dpwbyjgya",
            uploadPreset: "exs53mqa"
        }, function(error, result) {
            if (result.event === "success") {
                const newData = {...formData, image: result.info.url}
                setFormData(newData)
                setDisabled(true)
            }
            // console.log(result)

        })
    }, [])
    return (
        <section className="upload-widget-ctr">
            <button onClick={() => widgetRef.current.open()} disabled={disabled}>
                {disabled ? "Upload Successful" : "Upload Image"}
            </button>
        </section>
    )
}