import React from 'react'
import Admin from './Admin';
import AddPackage from './AddPackage';
import AddDelivery from './AddDelivery';
import { Routes, Route } from 'react-router-dom';



function Index() {

    return (
        <Routes>
            <Route
                path=''
                element={<Admin />}
            />

            <Route
                path='add-package/:id'
                element={<AddPackage />}
            />

            <Route
                path='add-package'
                element={<AddPackage />}
            />

            <Route
                path='add-delivery'
                element={<AddDelivery />}
            />

            <Route
                path='add-delivery/:id'
                element={<AddDelivery />}
            />
        </Routes>
    )
}

export default Index
