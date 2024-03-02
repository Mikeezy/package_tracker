import React from 'react'
import classnames from 'classnames';

interface ButtonProps {
    title: string;
    color?: ButtonType;
    textColor?: string;
    disabled?: boolean;
    style?: any;
    onClick: (e: any) => void
}

export enum ButtonType {
    Blue,
    Orange,
    Green,
    GreenBlack,
    Red
}

export default function Button({ title, color = ButtonType.Green, disabled = false, onClick, textColor = "black", style = {} }: ButtonProps) {
    return (
        <div className={classnames(`w-auto px-4 py-2 border border-black rounded-[8px] shadow-sm flex items-center justify-center`, {
            "bg-[#6fa8dc]": color === ButtonType.Blue,
            "bg-[#ff9900]": color === ButtonType.Orange,
            "bg-[#93c47d]": color === ButtonType.Green,
            "bg-[#6aa84f]": color === ButtonType.GreenBlack,
            "bg-[#e06666]": color === ButtonType.Red,
            "cursor-not-allowed": disabled === true,
            "cursor-pointer": disabled === false,
        })}
            onClick={(event: any) => { 
                if (!disabled) {
                    onClick(event)
                }
             }}
            style={style}
        >
            <p className={`text-${textColor} text-[20px] leading-[30px]`} >{title}</p>
        </div>
    )
}