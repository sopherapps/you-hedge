interface IProps {
    imageUrl: string;
    height: string;
}

export default function Avatar({ imageUrl, height }: IProps) {
    return <div style={{ height }}>
        <img src={imageUrl} style={{ minHeight: "100%", borderRadius: "50%" }} />
    </div>
}