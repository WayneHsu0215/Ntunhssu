/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from "prop-types";
import {Icon} from "@iconify/react";
import {Link} from "react-router-dom";
import {logout} from "./logout.jsx";
const Layout = ({ children }) => {
    return (
        <div className="flex bg-gray-100 flex-col h-screen">
            <h1 className=" mt-12 mx-24 flex text-4xl  w-full font-semibold mb-4"><Icon className="text-4xl text-gray-500 text-3xl" icon="teenyicons:android-solid" />學生會表單編輯器</h1>

            {/*<nav className="w-full mx-auto flex justify-center  bg-gray-100 p-2">*/}
            {/*    <Link to="/TranList" className="mx-4">表單統整</Link>*/}
            {/*    <button onClick={logout} className="mx-4">登出</button>*/}
            {/*</nav>*/}

            <main className="bg-gray-100 flex-grow">{children}</main>

            <footer className="text-center p-2 bg-gray-100">版權所有 &copy; 北護學生會</footer>
        </div>
    );
};

export default Layout;
Layout.propTypes = {
    children: PropTypes.node.isRequired,
};