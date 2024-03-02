import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Button, { ButtonType } from '../../components/Button';
import { DeliveryTypes, PackageTypes } from '@package-tracker/sdk'
import useDelivery from '../../hooks/useDelivery'
import usePackage from '../../hooks/usePackage'
import { Edit, Trash } from 'react-feather';
import { SUCCESS_MESSAGE } from '../../utils/constant';
import { toast } from 'react-toastify'
import { MessageType, messageService } from '../../utils/messageService'


export default function Admin() {
    const [loading, setLoading] = useState(true)
    const [packages, setPackages] = useState<PackageTypes.PackageInterface[]>([])
    const [deliveries, setDeliveries] = useState<DeliveryTypes.DeliveryInterface[]>([])
    const [deliveryDetailsFromWebsocket, setDeliveryDetailsFromWebsocket] = useState<DeliveryTypes.DeliveryInterface | null>(null)
    const navigate = useNavigate()
    const { client: packageClient } = usePackage()
    const { client: deliveryClient } = useDelivery()
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
        (async () => {
            try {
                await loadDatas()
            } catch (error) {
                console.error(error)
            }

            setLoading(false)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                if (deliveryDetailsFromWebsocket) {

                    if ([DeliveryTypes.DeliveryStatus.DELIVERED, DeliveryTypes.DeliveryStatus.FAILED].includes(deliveryDetailsFromWebsocket?.status)) {
                        await loadDatas()
                    } else {
                        const newDeliveries = deliveries.map((item: DeliveryTypes.DeliveryInterface) => {
                            if (item?.delivery_id === deliveryDetailsFromWebsocket?.delivery_id) {
                                return deliveryDetailsFromWebsocket
                            }
                            return item
                        })

                        setDeliveries(newDeliveries)
                    }

                }

            } catch (error) {
                console.log(error)
            }
        })()
    }, [deliveryDetailsFromWebsocket])

    const processPayload = (payload: DeliveryTypes.DeliveryInterface) => {
        setDeliveryDetailsFromWebsocket(payload)
    }

    const loadDatas = async () => {
        const [packages, deliveries] = await Promise.all([
            packageClient.getAllPackages({offset: 0, limit: 100}),
            deliveryClient.getAllDeliveries({offset: 0, limit: 100})
        ])

        setPackages(packages.data.data)
        setDeliveries(deliveries.data.data)
    }

    const removeItem = async (isPackage: boolean, id: string) => {
        if (isPackage) {
            try {
                await packageClient.deletePackage(id)
                const newPackages = packages.filter((item: PackageTypes.PackageInterface) => item.package_id !== id)
                setPackages(newPackages)
                toast.success(SUCCESS_MESSAGE, { hideProgressBar: true, })
            } catch (error) {
                console.error(error)
            }
        } else {
            try {
                await deliveryClient.deleteDelivery(id)
                await loadDatas()
                toast.success(SUCCESS_MESSAGE, { hideProgressBar: true, })
            } catch (error) {
                console.error(error)
            }
        }
    }

    return (
        <div className='w-full min-h-screen bg-[#d9ead3] p-8' >
            <div>
                <div className='flex flex-row items-center justify-between' >
                    <h1 className='text-2xl font-bold' >Package List</h1>
                    <Button title='Create Package' color={ButtonType.GreenBlack} onClick={(event: any) => {
                        event?.preventDefault();
                        navigate('/web-admin/add-package')
                    }} />
                </div>

                <div className='mt-6' >
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    Package Id
                                </th>
                                <th>
                                    Active Delivery Id
                                </th>
                                <th>
                                    Description
                                </th>
                                <th>
                                    From Name
                                </th>
                                <th>
                                    To Name
                                </th>
                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} >
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {packages.length === 0 ? (
                                        <tr>
                                            <td colSpan={6}>
                                                No data
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {packages.map((item: PackageTypes.PackageInterface, index: number) => (
                                                <tr key={index} >
                                                    <td>
                                                        {item.package_id}
                                                    </td>
                                                    <td>
                                                        {item.active_delivery_id}
                                                    </td>
                                                    <td>
                                                        {item.description}
                                                    </td>
                                                    <td>
                                                        {item.from_name}
                                                    </td>
                                                    <td>
                                                        {item.to_name}
                                                    </td>
                                                    <td>
                                                        <div className='w-full flex flex-row space-x-4 justify-center items-center' >
                                                            <Edit size={20} className='cursor-pointer' onClick={(event: any) => {
                                                                event?.preventDefault();
                                                                navigate(`/web-admin/add-package/${item.package_id}`)
                                                            }} />
                                                            <Trash size={20} className='cursor-pointer' onClick={(event: any) => {
                                                                event?.preventDefault();
                                                                removeItem(true, item.package_id)
                                                            }} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}

                        </tbody>
                    </table>
                </div>

            </div>

            <div className='mt-[50px]' >
                <div className='flex flex-row items-center justify-between' >
                    <h1 className='text-2xl font-bold' >Delivery List</h1>
                    <Button title='Create Delivery' color={ButtonType.GreenBlack} onClick={(event: any) => {
                        event?.preventDefault();
                        navigate('/web-admin/add-delivery')
                    }} />
                </div>

                <div className='mt-6' >
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    Delivery Id
                                </th>
                                <th>
                                    Package Id
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Pickup time
                                </th>
                                <th>
                                    Start time
                                </th>
                                <th>
                                    End time
                                </th>
                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} >
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {deliveries.length === 0 ? (
                                        <tr>
                                            <td colSpan={6}>
                                                No data
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {deliveries.map((item: DeliveryTypes.DeliveryInterface, index: number) => (
                                                <tr key={index} >
                                                    <td>
                                                        {item.delivery_id}
                                                    </td>
                                                    <td>
                                                        {item.package_id}
                                                    </td>
                                                    <td>
                                                        {item.status}
                                                    </td>
                                                    <td>
                                                        {item?.pickup_time ? moment(item.pickup_time).format('DD-MM-YYYY HH:mm:ss') : '--'}
                                                    </td>
                                                    <td>
                                                        {item?.start_time ? moment(item.start_time).format('DD-MM-YYYY HH:mm:ss') : '--'}
                                                    </td>
                                                    <td>
                                                        {item?.end_time ? moment(item.end_time).format('DD-MM-YYYY HH:mm:ss') : '--'}
                                                    </td>
                                                    <td>
                                                        <div className='w-full flex flex-row space-x-4 justify-center items-center' >
                                                            <Edit size={20} className='cursor-pointer mr-2' onClick={(event: any) => {
                                                                event?.preventDefault();
                                                                navigate(`/web-admin/add-delivery/${item.delivery_id}`)
                                                            }} />
                                                            <Trash size={20} className='cursor-pointer' onClick={(event: any) => {
                                                                event?.preventDefault();
                                                                removeItem(false, item.delivery_id)
                                                            }} />
                                                        </div>

                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}

                        </tbody>
                    </table>
                </div>

            </div>
        </div >
    )
}