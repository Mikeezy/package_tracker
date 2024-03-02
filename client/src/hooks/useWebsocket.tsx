import React, { useEffect } from 'react';
import { WebSocketClient, Options } from '@package-tracker/sdk'

const client = new WebSocketClient();

const useDelivery = () => {

    useEffect(() => {
        (async () => {

            const options: Options = {
                socketEndpoint: `${process.env.REACT_APP_WT_WS}`
            }

            client.configure(options)

        })()
    }, [])

    return { client }
}

export default useDelivery;