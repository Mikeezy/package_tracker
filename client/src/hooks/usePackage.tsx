import React, { useEffect } from 'react';
import { PackageClient, PackageTypes } from '@package-tracker/sdk'

const client = new PackageClient();

const usePackage = () => {

    useEffect(() => {
        (async () => {

            client.configure({
                baseURL: `${process.env.REACT_APP_WT_API}/api`
            })

        })()
    }, [])

    return { client, PackageTypes }
}

export default usePackage;