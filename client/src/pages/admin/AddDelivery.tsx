import React, { useEffect, useState } from 'react'
import Button, { ButtonType } from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { PackageTypes } from '@package-tracker/sdk'
import useDelivery from '../../hooks/useDelivery';
import usePackage from '../../hooks/usePackage';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../../utils/constant';
import { toast } from 'react-toastify'

function AddDelivery() {
    const [loading, setLoading] = useState<boolean>(false)
    const [values, setValues] = useState<any>({
        package_id: '', 
    })
    const [packages, setPackages] = useState<PackageTypes.PackageInterface[]>([])
    const navigate = useNavigate()
    const { id } = useParams();
    const { client } = useDelivery()
    const { client: packageClient } = usePackage()

    useEffect(() => {
        (async () => {
            try {
                const infoGet = await packageClient.getAllPackages({ offset: 0, limit: 1000 })

                if (infoGet?.data.data.length > 0) {
                    setPackages(infoGet.data.data)
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                if (id) {
                    const data = await client.getOneDelivery(id)
                    if (data?.data) {
                        setValues({
                            package_id: data.data.package_id
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
                await client.updateDelivery(id, values)
            } else {
                await client.createDelivery(values)
            }
            toast.success(SUCCESS_MESSAGE, { hideProgressBar: true, })
            navigate('/web-admin')
        } catch (error) {
            console.log(error)
            toast.error(`${(error as any)?.message ? (error as any).message : ERROR_MESSAGE}`, { hideProgressBar: true })
        }
        setLoading(false)
    }

    return (
        <div className='w-full min-h-screen bg-[#d9ead3] p-8' >
            <div>
                <div className='flex flex-row items-center justify-between' >
                    <h1 className='text-2xl font-bold' >Delivery Form</h1>
                    <Button title='Go Back' color={ButtonType.GreenBlack} onClick={(event: any) => {
                        event?.preventDefault();
                        navigate('/web-admin')
                    }} />
                </div>

                <div className='mt-6 space-y-4' >
                    <div className='w-1/4 flex flex-col' >
                        <label htmlFor="package_id">Package id <span style={{ color: "red" }} >*</span></label>
                        <select name="package_id" id="package_id" value={values.package_id} className='grow p-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none' onChange={handleChange}>
                            <option value="">Please select a package</option>
                            {packages.map((item: PackageTypes.PackageInterface, index) => (
                                <option key={index} value={item.package_id}>{`${item.from_name} -> ${item.to_name}`}</option>
                            ))}
                        </select>
                    </div>


                    <div className='w-full flex items-center justify-end' >
                        <Button title={loading ? "Processing..." : "Submit"} color={ButtonType.GreenBlack} disabled={loading || values.package_id?.trim()?.length === 0} onClick={save} />
                    </div>


                </div>

            </div>
        </div>
    )
}

export default AddDelivery
