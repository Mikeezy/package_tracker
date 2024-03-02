import React from 'react'
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';


function Index() {
    const navigate = useNavigate()

    return (
        <div className='w-full h-screen flex flex-col items-center justify-center bg-green-300' >
            <div className='flex flex-row space-x-4' >
                <Button title='Web Tracker' onClick={(event: any) => {
                    event?.preventDefault();
                    navigate('/web-tracker')
                }} />

                <Button title='Web Driver' onClick={(event: any) => {
                    event?.preventDefault();
                    navigate('/web-driver')
                }} />

                <Button title='Web Admin' onClick={(event: any) => {
                    event?.preventDefault();
                    navigate('/web-admin')
                }} />
            </div>
        </div>
    )
}

export default Index
