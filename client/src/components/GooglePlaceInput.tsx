/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';

export const loadScript = (id: string = "__hh__gma__") => {
    try {
        const getScript = document.getElementById(id);
        if(!getScript){
            const scriptCustom = document.createElement("script");
            scriptCustom.type = "text/javascript";
            scriptCustom.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_WT_GOOGLE_API_KEY}&libraries=places`;
            scriptCustom.id = id;
            scriptCustom.async = true;
            scriptCustom.defer = true;
    
            document.getElementsByTagName("head")[0].appendChild(scriptCustom);
        }
    } catch (error) {
        console.error(error);
    }
};

export const removeScript = (id: string = "__hh__gma__") => {
    try {
        const scripts = document.querySelectorAll("script[src*='maps.googleapis.com/maps-api-v3']");
        const scriptsPac = document.querySelectorAll("div[class*='pac-container']");

        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i]) {
                scripts[i]?.parentNode?.removeChild(scripts[i]);
            }
        }

        for (let i = 0; i < scriptsPac.length; i++) {
            if (scriptsPac[i]) {
                scriptsPac[i]?.parentNode?.removeChild(scriptsPac[i]);
            }
        }

        const scriptCustom = document.getElementById(id);

        if (scriptCustom) {
            scriptCustom?.parentNode?.removeChild(scriptCustom);
        }
    } catch (error) {
        console.error(error);
    }
};

interface GooglePlaceInputProps {
    value: string;
    afterPlaceChange: Function;
    onBlur: Function;
    onChange: Function;
    callback?: Function;
    types?: Array<string>;
    name?: string;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    fields?: Array<string>
    style?: Record<string, any>
    loadingScript?: boolean;
}

export default function GooglePlaceInput({
    value,
    name = "",
    disabled = false,
    types,
    afterPlaceChange,
    onChange,
    className = "",
    placeholder = "",
    style = {},
    fields = ["address_components", "formatted_address", "geometry"],
    onBlur,
    callback
}: GooglePlaceInputProps) {
    const autoCompleteRef = useRef<HTMLInputElement>(null);
    let autocomplete: any;

    useEffect(() => {

        try {
            const autoCompleteProcess = () => {
                const script = document.getElementById("__hh__gma__");
                if (script) {
                    if ((window as any)?.google?.maps?.places?.Autocomplete) {
                        autocomplete = new (window as any).google.maps.places.Autocomplete(
                            autoCompleteRef.current,
                            { types: types, componentRestrictions: { country: "TG" } }
                        );
                        autocomplete.setFields(fields);
                        autocomplete.addListener("place_changed", () =>
                            handlePlaceSelect(afterPlaceChange)
                        );

                        if(callback){
                            callback()
                        }
                    }
                } else {
                    setTimeout(() => {
                        autoCompleteProcess()
                    }, 500)
                }
            }

            autoCompleteProcess()

        } catch (error) {
            console.error(error);
        }

        return function () {
            if (autocomplete) {
                autocomplete.unbindAll();
            }
        }
    }, []);

    function handlePlaceSelect(afterPlaceChange: any) {
        const addressObject = autocomplete.getPlace();
        afterPlaceChange(addressObject);
    }

    return (
        <input
            ref={autoCompleteRef}
            onChange={(e) => onChange(e)}
            placeholder={placeholder}
            value={value}
            name={name}
            style={style}
            disabled={disabled}
            className={`w-full ${className}`}
            onBlur={() => onBlur()}
        />
    )
}