/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react'
import Button, { ButtonType } from '../components/Button';
import useDelivery from '../hooks/useDelivery';
import usePackage from '../hooks/usePackage';
import { DeliveryTypes, PackageTypes } from '@package-tracker/sdk'
import { ERROR_MESSAGE } from '../utils/constant';
import { toast } from 'react-toastify'
import moment from 'moment';
import { MessageType, messageService } from '../utils/messageService'
import useWebsocket from '../hooks/useWebsocket';
import MapComponent from '../components/MapComponent';
import { Marker } from '@vis.gl/react-google-maps';
import Driver_ from '../assets/driver.svg';
import From from '../assets/from.svg';
import To from '../assets/to.svg';

export default function Driver() {
    const [loading, setLoading] = useState<boolean>(false)
    const [deliveryId, setDeliveryId] = useState<string>('')
    const [packageDetail, setPackageDetail] = useState<PackageTypes.PackageInterface | null>(null)
    const [deliveryDetails, setDeliveryDetail] = useState<DeliveryTypes.DeliveryInterface | null>(null)
    const [deliveryDetailsFromWebsocket, setDeliveryDetailsFromWebsocket] = useState<DeliveryTypes.DeliveryInterface | null>(null)
    const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
    const { client } = useDelivery()
    const { client: packageClient } = usePackage()
    const { client: webSocketClient } = useWebsocket()
    const subscription: any = useRef<any>(null)

    useEffect(() => {
        let intervalId: any = null;
        (async () => {
            getMyPosition()

            intervalId = setInterval(() => {
                getMyPosition()
            }, 5000)

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
            clearInterval(intervalId);
            subscription.current.unsubscribe();
        }
    }, [])

    useEffect(() => {
        if (deliveryDetailsFromWebsocket?.delivery_id === deliveryDetails?.delivery_id) {
            setDeliveryDetail(deliveryDetailsFromWebsocket)
        }
    }, [deliveryDetailsFromWebsocket])

    useEffect(() => {
        if (currentLocation.lat && currentLocation.lng && deliveryDetails?.delivery_id && ![DeliveryTypes.DeliveryStatus.DELIVERED, DeliveryTypes.DeliveryStatus.FAILED].includes(deliveryDetails?.status)) {
            webSocketClient.locationChanged({
                delivery_id: deliveryDetails?.delivery_id,
                location: {
                    lat: currentLocation.lat,
                    lng: currentLocation.lng
                }
            })
            console.log("Location updated")
        }
    }, [currentLocation])

    const processPayload = (payload: DeliveryTypes.DeliveryInterface) => {
        setDeliveryDetailsFromWebsocket(payload)
    }

    const handleChange = (event: any) => {
        setDeliveryId(event.target.value)
    }

    const search = async (event: any) => {
        try {
            event?.preventDefault();

            if (deliveryId) {
                setLoading(true)
                setPackageDetail(null)
                setDeliveryDetail(null)

                const deliveryData = await client.getOneDelivery(deliveryId)

                if (deliveryData.data) {
                    setDeliveryDetail(deliveryData.data)

                    if (deliveryData.data.package_id) {
                        const packageData = await packageClient.getOnePackage(deliveryData.data.package_id)
                        if (packageData.data) {
                            setPackageDetail(packageData.data)
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

    const getMyPosition = () => {
        if (navigator.geolocation) {
            let timeoutVal = 10 * 1000 * 1000;
            navigator.geolocation.getCurrentPosition(
                myPosition,
                (error) => {
                    console.error('Error getting location:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: timeoutVal,
                    maximumAge: 0
                }
            );
        }
    }

    const myPosition = (position: any) => {
        setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        });
    }

    return (
        <div className='w-full h-screen bg-[#fce5cd] p-8 overflow-auto' >
            <div className='flex flex-row space-x-4 w-full mt-8 justify-center items-center' >
                <div className='grow md:grow-0 w-0 md:w-8/12' >
                    <input type="text" value={deliveryId} onChange={handleChange} placeholder='Enter Delivery ID' className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none w-full' />
                </div>

                <div className='w-[150px]' >
                    <Button title={loading ? "Processing..." : "Submit"} disabled={loading || deliveryId.trim().length === 0} onClick={search} />
                </div>
            </div>

            <div className='mt-6 grid grid-cols-1 lg:grid-cols-5 gap-4' >
                <div className='col-span-2' >
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

                                    <tr>
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
                                    </tr>

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

                <div className='w-full col-span-2 bg-[#cfe2f3] rounded-lg h-[600px] flex items-center justify-center' >
                    {currentLocation.lat !== 0 && currentLocation.lng !== 0 && (
                        <MapComponent
                            fullscreenControl={false}
                            zoomControl={false}
                            defaultCenter={{
                                lat: 6.1823154,
                                lng: 1.1642896
                            }}
                            mapZoom={10}
                        >
                            <Marker
                                icon={{
                                    url: Driver_
                                }}
                                zIndex={10}
                                position={{
                                    lat: currentLocation.lat,
                                    lng: currentLocation.lng
                                }}
                            />

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
                    )}
                </div>

                <div className='flex flex-col space-y-4' >
                    <Button title="Picked Up" disabled={deliveryDetails?.status ? deliveryDetails?.status !== DeliveryTypes.DeliveryStatus.OPEN : true} color={ButtonType.Blue} onClick={(event: any) => {
                        event?.preventDefault();
                        if (deliveryDetails?.delivery_id) {
                            webSocketClient.StatusChanged({ delivery_id: deliveryDetails?.delivery_id, status: DeliveryTypes.DeliveryStatus.PICKED_UP })
                        }
                    }} />

                    <Button title="In-Transit" disabled={deliveryDetails?.status ? deliveryDetails?.status !== DeliveryTypes.DeliveryStatus.PICKED_UP : true} color={ButtonType.Orange} onClick={(event: any) => {
                        event?.preventDefault();
                        if (deliveryDetails?.delivery_id) {
                            webSocketClient.StatusChanged({ delivery_id: deliveryDetails?.delivery_id, status: DeliveryTypes.DeliveryStatus.IN_TRANSIT })
                        }
                    }} />

                    <Button title="Delivered" disabled={deliveryDetails?.status ? deliveryDetails?.status !== DeliveryTypes.DeliveryStatus.IN_TRANSIT : true} color={ButtonType.GreenBlack} onClick={(event: any) => {
                        event?.preventDefault();
                        if (deliveryDetails?.delivery_id) {
                            webSocketClient.StatusChanged({ delivery_id: deliveryDetails?.delivery_id, status: DeliveryTypes.DeliveryStatus.DELIVERED })
                        }
                    }} />

                    <Button title="Failed" disabled={deliveryDetails?.status ? deliveryDetails?.status !== DeliveryTypes.DeliveryStatus.IN_TRANSIT : true} color={ButtonType.Red} onClick={(event: any) => {
                        event?.preventDefault();
                        if (deliveryDetails?.delivery_id) {
                            webSocketClient.StatusChanged({ delivery_id: deliveryDetails?.delivery_id, status: DeliveryTypes.DeliveryStatus.FAILED })
                        }
                    }} />
                </div>

            </div>
        </div>
    )
}