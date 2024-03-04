import React, { useEffect, useState } from 'react'
import Button, { ButtonType } from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import usePackage from '../../hooks/usePackage';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../../utils/constant';
import { toast } from 'react-toastify'
import GooglePlaceInput from '../../components//GooglePlaceInput';
import { loadScript } from '../../components//GooglePlaceInput';

function AddPackage() {
    const [loading, setLoading] = useState<boolean>(false)
    const [values, setValues] = useState<any>({
        description: '',
        width: 0,
        height: 0,
        weight: 0,
        depth: 0,
        from_name: '',
        to_name: '',
    })
    const [fromLocation, setFromLocation] = useState<any>({
        from_address: '',
        from_location: {
            lat: 0,
            lng: 0
        }
    })
    const [toLocation, setToLocation] = useState<any>({
        to_address: '',
        to_location: {
            lat: 0,
            lng: 0
        }
    })
    const navigate = useNavigate()
    const { id } = useParams();
    const { client } = usePackage()

    useEffect(() => {
        //To load google map script
        loadScript()
      }, [])

    useEffect(() => {
        (async () => {
            try {
                if (id) {
                    const data = await client.getOnePackage(id)
                    if (data?.data) {
                        const { _id, package_id, active_delivery_id,from_address,from_location, to_address, to_location,...rest } = data.data
                        setValues(rest as any)
                        setFromLocation({
                            from_address,
                            from_location
                        })
                        setToLocation({
                            to_address,
                            to_location
                        })
                    } else {
                        navigate('/web-admin')
                    }
                }

            } catch (error) {
                console.log(error)
                toast.error(`${(error as any)?.message ? (error as any).message : ERROR_MESSAGE}`, { hideProgressBar: true })
            }
        })()
    }, [id])

    const handleChange = (event: any) => {
        const { name, value } = event.target
        setValues({ ...values, [name]: value })
    }

    const save = async (event: any) => {
        try {
            event?.preventDefault()
            setLoading(true)
            if (id) {
                await client.updatePackage(id, {...values, ...fromLocation, ...toLocation})
            } else {
                await client.createPackage({...values, ...fromLocation, ...toLocation})
            }
            toast.success(SUCCESS_MESSAGE, { hideProgressBar: true, })
            navigate('/web-admin')
        } catch (error) {
            console.log(error)
            toast.error(`${(error as any)?.message ? (error as any).message : ERROR_MESSAGE}`, { hideProgressBar: true })
        }
        setLoading(false)
    }

    const handleBlur = (isFrom: boolean = true) => {
        if (isFrom) {
            if (values.from_address?.trim()?.length > 0 && (values.from_location?.lat === 0 || values.from_location?.lng === 0)) {
                setFromLocation({
                    ...fromLocation,
                    from_location: {
                        lat: 0,
                        lng: 0
                    }
                })
            } else if (values.from_address?.trim()?.length === 0) {
                setFromLocation({
                    ...fromLocation,
                    from_location: {
                        lat: 0,
                        lng: 0
                    }
                })
            }
        } else {
            if (values.to_address?.trim()?.length > 0 && (values.to_location?.lat === 0 || values.to_location?.lng === 0)) {
                setToLocation({
                    ...toLocation,
                    to_location: {
                        lat: 0,
                        lng: 0
                    }
                })
            } else if (values.to_address?.trim()?.length === 0) {
                setToLocation({
                    ...toLocation,
                    to_location: {
                        lat: 0,
                        lng: 0
                    }
                })
            }
        }
    }

    const handleAfterPlaceChanged = (addressObject: any, isFrom: boolean = false) => {
        if (isFrom) {
            setFromLocation({
                from_address: addressObject.formatted_address,
                from_location: {
                    lat: addressObject.geometry?.location.lat(),
                    lng: addressObject.geometry?.location.lng()
                }
            })

        } else {
            setToLocation({
                to_address: addressObject.formatted_address,
                to_location: {
                    lat: addressObject.geometry?.location.lat(),
                    lng: addressObject.geometry?.location.lng()
                }
            })

        }
    }

    return (
        <div className='w-full min-h-screen bg-[#d9ead3] p-8' >
            <div>
                <div className='flex flex-row items-center justify-between' >
                    <h1 className='text-2xl font-bold' >Package Form</h1>
                    <Button title='Go Back' color={ButtonType.GreenBlack} onClick={(event: any) => {
                        event?.preventDefault();
                        navigate('/web-admin')
                    }} />
                </div>

                <div className='mt-6 space-y-4' >
                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="description">Description <span style={{ color: "red" }} >*</span></label>
                        <textarea id="description" name="description" value={values.description} onChange={handleChange} cols={5} className='grow p-2 resize-none border border-gray-300 rounded-md focus:ring-0 focus:outline-none' />
                    </div>

                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="weight">Weight (grams)<span style={{ color: "red" }} >*</span></label>
                        <input id="weight" name="weight" value={values.weight} onChange={handleChange} type="number" className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none' placeholder='Package Name' />
                    </div>
                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="width">Width (cm)<span style={{ color: "red" }} >*</span></label>
                        <input id="width" name="width" value={values.width} onChange={handleChange} type="number" className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none' placeholder='Package Name' />
                    </div>
                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="height">Height (cm)<span style={{ color: "red" }} >*</span></label>
                        <input id="height" name="height" value={values.height} onChange={handleChange} type="number" className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none' placeholder='Package Name' />
                    </div>
                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="depth">Depth (cm)<span style={{ color: "red" }} >*</span></label>
                        <input id="depth" name="depth" value={values.depth} onChange={handleChange} type="number" className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none' placeholder='Package Name' />
                    </div>

                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="from_name">From Name <span style={{ color: "red" }} >*</span></label>
                        <input id="from_name" name="from_name" value={values.from_name} onChange={handleChange} type="text" className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none' />
                    </div>

                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="from_address">From Address <span style={{ color: "red" }} >*</span></label>
                        <GooglePlaceInput
                            name="from_address"
                            types={['establishment']}
                            afterPlaceChange={(addressObject: any) => handleAfterPlaceChanged(addressObject, true)}
                            value={fromLocation.from_address}
                            onChange={(event: any) => { 
                                setFromLocation({
                                    ...fromLocation,
                                    from_address: event.target.value
                                })
                             }}
                            className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none'
                            onBlur={() => handleBlur(true)}
                        />
                    </div>

                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="from_location">From Location <span style={{ color: "red" }} >*</span></label>
                        <div className='flex flex-row space-x-2' >
                            <input id="from_location" name="from_location.lat" disabled={true} value={fromLocation.from_location.lat}  type="number" className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none w-1/2' />
                            <input id="from_location" name="from_location.lng" disabled={true} value={fromLocation.from_location.lng} type="number" className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none w-1/2' />
                        </div>
                    </div>

                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="to_name">To Name <span style={{ color: "red" }} >*</span></label>
                        <input id="to_name" name="to_name" value={values.to_name} onChange={handleChange} type="text" className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none' />
                    </div>

                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="to_address">To Address <span style={{ color: "red" }} >*</span></label>
                        <GooglePlaceInput
                            name="to_address"
                            types={['establishment']}
                            afterPlaceChange={(addressObject: any) => handleAfterPlaceChanged(addressObject, false)}
                            value={toLocation.to_address}
                            onChange={(event: any) => { 
                                setToLocation({
                                    ...toLocation,
                                    to_address: event.target.value
                                })
                             }}
                            className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none'

                            onBlur={() => handleBlur(false)}
                        />
                    </div>

                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="to_location">To Location <span style={{ color: "red" }} >*</span></label>
                        <div className='flex flex-row space-x-2' >
                            <input id="to_location" name="to_location.lat" disabled={true} value={toLocation.to_location.lat} type="number" className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none w-1/2' />
                            <input id="to_location" name="to_location.lng" disabled={true} value={toLocation.to_location.lng} type="number" className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none w-1/2' />
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-end' >
                        <Button title={loading ? "Processing..." : "Submit"} color={ButtonType.GreenBlack} disabled={loading} onClick={save} />
                    </div>


                </div>

            </div>
        </div>
    )
}

export default AddPackage
