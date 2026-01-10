
'use client'

import QRCode from 'react-qr-code'

interface QRCodeDisplayProps {
    value: string
    size?: number
}

export default function QRCodeDisplay({ value, size = 256 }: QRCodeDisplayProps) {
    return (
        <div style={{ height: "auto", margin: "0 auto", maxWidth: size, width: "100%" }}>
            <QRCode
                size={size}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={value}
                viewBox={`0 0 256 256`}
            />
        </div>
    )
}
