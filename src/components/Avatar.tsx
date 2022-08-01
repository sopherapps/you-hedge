interface IProps {
    imageUrl: string;
    height: string;
}

export default function Avatar({ imageUrl, height }: IProps) {
    return <div className="avatar" style={{ height, width: "auto" }}>
        <img src={imageUrl} style={{ height: "100%", borderRadius: "50%" }} alt="" />
    </div>
}