import React, { useState, useRef, useEffect } from 'react'
import Button from '../components/Button';
import useDelivery from '../hooks/useDelivery';
import usePackage from '../hooks/usePackage';
import { DeliveryTypes, PackageTypes } from '@package-tracker/sdk'
import { ERROR_MESSAGE } from '../utils/constant';
import { toast } from 'react-toastify'
import moment from 'moment';
import { MessageType, messageService } from '../utils/messageService'
import MapComponent from '../components/MapComponent';
import { Marker } from '@vis.gl/react-google-maps';
import Driver from '../assets/driver.svg';
import From from '../assets/from.svg';
import To from '../assets/to.svg';

export default function Tracker() {
    const [loading, setLoading] = useState<boolean>(false)
    const [packageId, setPackageId] = useState<string>('')
    const [packageDetail, setPackageDetail] = useState<PackageTypes.PackageInterface | null>(null)
    const [deliveryDetails, setDeliveryDetail] = useState<DeliveryTypes.DeliveryInterface | null>(null)
    const [deliveryDetailsFromWebsocket, setDeliveryDetailsFromWebsocket] = useState<DeliveryTypes.DeliveryInterface | null>(null)
    const { client } = useDelivery()
    const { client: packageClient } = usePackage()
    const subscription: any = useRef<any>(null)

    useEffect(() => {
        (async () => {
            subscription.current = messageService.getMessage().subscribe((message: any) => {
                switch (message.type) {
                    case MessageType.onDeliveryUpdate:
                        processPayload(message.payload)
                        break;
                    default:
                        break;
                }
            })
        })()

        return () => {
            subscription.current.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (deliveryDetailsFromWebsocket?.delivery_id === deliveryDetails?.delivery_id) {
            setDeliveryDetail(deliveryDetailsFromWebsocket)
        }
    }, [deliveryDetailsFromWebsocket])

    const processPayload = (payload: DeliveryTypes.DeliveryInterface) => {
        setDeliveryDetailsFromWebsocket(payload)
    }

    const handleChange = (event: any) => {
        setPackageId(event.target.value)
    }

    const search = async (event: any) => {
        try {
            event?.preventDefault();

            if (packageId) {
                setLoading(true)
                setPackageDetail(null)
                setDeliveryDetail(null)

                const packageData = await packageClient.getOnePackage(packageId)

                if (packageData.data) {
                    setPackageDetail(packageData.data)

                    if (packageData.data.active_delivery_id) {
                        const deliveryData = await client.getOneDelivery(packageData.data.active_delivery_id)
                        if (deliveryData.data) {
                            setDeliveryDetail(deliveryData.data)
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(`${(error as any)?.message ? (error as any).message : ERROR_MESSAGE}`, { hideProgressBar: true })
        }
        setLoading(false)
    }

    return (
        <div className='w-full h-screen bg-[#d9ead3] p-8 overflow-auto' >
            <div className='flex flex-row space-x-4 w-full mt-8 justify-center items-center' >
                <div className='grow md:grow-0 w-0 md:w-8/12' >
                    <input type="text" value={packageId} onChange={handleChange} placeholder='Enter Package ID' className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none w-full' />
                </div>

                <div className='w-[150px]' >
                    <Button title={loading ? "Processing..." : "Track"} disabled={loading || packageId.trim().length === 0} onClick={search} />
                </div>
            </div>

            <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8' >
                <div>
                    <div className='w-full' >
                        <h1 className='text-2xl font-bold' >Package Details</h1>

                        <div className='mt-6' >
                            <table className='custom-table' >
                                <tbody>
                                    <tr>
                                        <td>
                                            Package id
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.package_id}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            Active delivery id
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.active_delivery_id}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr >
                                        <td>
                                            Description
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <p className='break-words' >
                                                    {packageDetail.description}
                                                </p>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            Weight
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.weight} grams
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            Width
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.width} cm
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            Height
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.height} cm
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            Depth
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.depth} cm
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            From Name
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.from_name}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            From Address
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.from_address}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            From Location (Lat, Lng)
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.from_location.lat}, {packageDetail.from_location.lng}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            To Name
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.to_name}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            To Address
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.to_address}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            To Location  (Lat, Lng)
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {packageDetail.to_location.lat}, {packageDetail.to_location.lng}
                                                </>
                                            )}
                                        </td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='w-full mt-8' >
                        <h1 className='text-2xl font-bold' >Delivery Details</h1>

                        <div className='mt-6' >
                            <table className='custom-table' >
                                <tbody>
                                    <tr>
                                        <td>
                                            Delivery id
                                        </td>
                                        <td>

                                            {deliveryDetails === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {deliveryDetails.delivery_id}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    {/* <tr>
                                        <td>
                                            Package id
                                        </td>
                                        <td>

                                            {deliveryDetails === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {deliveryDetails.package_id}
                                                </>
                                            )}
                                        </td>
                                    </tr> */}

                                    <tr >
                                        <td>
                                            Status
                                        </td>
                                        <td>

                                            {deliveryDetails === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {deliveryDetails.status}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            Pickup time
                                        </td>
                                        <td>

                                            {deliveryDetails === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {deliveryDetails.pickup_time ? moment(deliveryDetails.pickup_time).format('DD-MM-YYYY HH:mm:ss') : '--'}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            Start time
                                        </td>
                                        <td>

                                            {deliveryDetails === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {deliveryDetails.start_time ? moment(deliveryDetails.start_time).format('DD-MM-YYYY HH:mm:ss') : '--'}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            End time
                                        </td>
                                        <td>

                                            {deliveryDetails === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {deliveryDetails.end_time ? moment(deliveryDetails.end_time).format('DD-MM-YYYY HH:mm:ss') : '--'}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            Location (Lat, Lng)
                                        </td>
                                        <td>

                                            {packageDetail === null ? (
                                                <>
                                                    --
                                                </>
                                            ) : (
                                                <>
                                                    {deliveryDetails?.location ? (
                                                        <>
                                                            {deliveryDetails?.location?.lat}, {deliveryDetails?.location?.lng}
                                                        </>
                                                    ) : (
                                                        <>
                                                            --
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className='w-full bg-[#cfe2f3]  rounded-lg h-[600px] flex items-center justify-center' >
                    <MapComponent
                        fullscreenControl={false}
                        zoomControl={false}
                        defaultCenter={{
                            lat: 6.1823154,
                            lng: 1.1642896
                        }}
                        mapZoom={10}
                    >
                        {deliveryDetails?.location && (
                            <Marker
                                icon={{
                                    url: Driver,
                                }}
                                zIndex={10}
                                position={{
                                    lat: deliveryDetails?.location?.lat,
                                    lng: deliveryDetails?.location?.lng
                                }}
                            />
                        )}

                        {packageDetail?.to_location && packageDetail?.from_location && (
                            <>
                                <Marker
                                    icon={{
                                        url: From
                                    }}
                                    position={{
                                        lat: packageDetail?.from_location?.lat,
                                        lng: packageDetail?.from_location?.lng
                                    }}
                                />
                                <Marker
                                    icon={{
                                        url: To
                                    }}
                                    position={{
                                        lat: packageDetail?.to_location?.lat,
                                        lng: packageDetail?.to_location?.lng
                                    }}
                                />
                            </>
                        )}
                    </MapComponent>
                </div>

            </div>
        </div>
    )
}