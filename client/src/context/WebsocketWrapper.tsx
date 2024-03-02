/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { DeliveryTypes } from '@package-tracker/sdk'
import { MessageType, messageService } from '../utils/messageService'
import useWebsocket from '../hooks/useWebsocket';

export interface IContext {
}

const defaultState: IContext = {
}

export const ChatContext = React.createContext<IContext>(defaultState)


const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

    const { client } = useWebsocket()

    useEffect(() => {
        (async () => {
            try {
                initSocket()

            } catch (error) {
                console.error(error)
            }
        })()

        return () => {
            client.closeSocket();
        }

    }, [])


    const initSocket = () => {
        client.initSocket({
            onConnected,
            onDisconnected,
            onDeliveryUpdate
        });
    }

    const onConnected = () => {
        console.log("Connected")
        messageService.sendMessage({ type: MessageType.Connected, payload: null })
    }

    const onDisconnected = () => {
        console.log("Disconnected")
        initSocket()
        messageService.sendMessage({ type: MessageType.Disconnected, payload: null })
    }

    const onDeliveryUpdate = (data: DeliveryTypes.DeliveryInterface) => {
        messageService.sendMessage({ type: MessageType.onDeliveryUpdate, payload: data })
    }

    const providerValues: IContext = {

    }

    return (
        <ChatContext.Provider value={providerValues} >
            {children}
        </ChatContext.Provider>
    )

}

export default WebSocketProvider
