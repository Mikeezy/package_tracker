import React, { useEffect } from 'react';
import { DeliveryClient, DeliveryTypes } from '@package-tracker/sdk'

const client = new DeliveryClient();

const useDelivery = () => {

    useEffect(() => {
        (async () => {

            client.configure({
                baseURL: `${process.env.REACT_APP_WT_API}/api`
            })

        })()
    }, [])

    return { client, DeliveryTypes }
}

export default useDelivery;