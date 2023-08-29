/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';
import {AuthContext} from './AuthContext';
import Modal from './Modal.jsx';
import {Icon} from '@iconify/react';
import {checkLoginStatus} from './checkLogin.jsx';

function TransList() {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const {loggedIn, updateLoggedInStatus} = useContext(AuthContext);  // 使用 updateLoggedInStatus 而不是 setLoggedIn
    const [transData, setTransData] = useState([]);
    const [searchTranID, setSearchTranID] = useState('');
    const [searchedTrans, setSearchedTrans] = useState(null);
    const [genderStats, setGenderStats] = useState([]);
    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/api/check-auth');
            const data = await response.json();
            if (data.success) {
                updateLoggedInStatus(true);  // 更新 AuthContext 的 loggedIn 狀態
            } else {
                updateLoggedInStatus(false);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            updateLoggedInStatus(false);
        }
    };


    const fetchReplyData = () => {
        fetch('/api/reply')
            .then((response) => response.json())
            .then((data) => setTransData(data))
            .catch((error) => console.error('Error fetching reply data:', error));
    };

    const fetchGenderData = () => {
        fetch('/api/reply/gender')
            .then((response) => response.json())
            .then((data) => setGenderStats(data))
            .catch((error) => console.error('Error fetching gender data:', error));
    };
    genderStats.map((item) => console.log(item.NumberOfStudents))

    const fetchLongestReplyData = () => {
        fetch('/api/len')
            .then((response) => response.json())
            .then((data) => setTransData(data))
            .catch((error) => console.error('Error fetching longest reply data:', error));
    };

    useEffect(() => {
        fetchReplyData();
        fetchGenderData();
    }, []);


    const [newReply, setNewReply] = useState({
        Class: '',
        StudentID: '',
        Name: '',
        Gender: '',
        Content: '',
        UP_Date: '',
    });

    const addReply = (newReply) => {
        fetch('/api/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newReply),
        })
            .then((response) => response.json())
            .then((data) => {
                fetchReplyData();  // 重新載入資料
                setShowAlert(true);
            })
            .catch((error) => console.error('Error adding new reply:', error));
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const deleteTransaction = (tranID) => {
        fetch(`/api/reply/${tranID}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                fetchReplyData();  // 重新載入資料
                setShowDeleteAlert(true);
                setSearchedTrans(null);

            })
            .catch((error) => console.error('Error deleting transaction:', error));
        setTimeout(() => {
            setShowDeleteAlert(false);
        }, 3000);
    };


    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedTrans, setEditedTrans] = useState(null);

    const openEditModal = (trans) => {
        setEditedTrans(trans);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditedTrans(null);
        setEditModalOpen(false);
    };



    const updateReply = (ID) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        };

        fetch(`/api/reply/${ID}`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Failed to update reply');
                    throw new Error('Failed to update reply');
                }
            })
            .then(data => {
                // 如果有返回的資料，你可以在這裡使用它。
                fetchReplyData(); // 呼叫一個函數來重新載入資料
            })
            .catch(error => console.error('Error updating reply:', error));
    };
    const SearchupdateReply = (ID) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        };

        fetch(`/api/reply/${ID}`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();

                } else {
                    console.error('Failed to update reply');
                    throw new Error('Failed to update reply');
                }
            })
            .then(data => {
                // 如果有返回的資料，你可以在這裡使用它。
                fetchReplyData(); // 呼叫一個函數來重新載入資料
            })
            .catch(error => console.error('Error updating reply:', error));

        fetch(`/api/reply/${searchTranID}`)
            .then((response) => response.json())
            .then((data) => setSearchedTrans(data))
            .catch((error) => console.error('Error searching transaction:', error));
    };


    const searchTransaction = () => {
        if (!searchTranID) {
            return;
        }

        fetch(`/api/reply/${searchTranID}`)
            .then((response) => response.json())
            .then((data) => setSearchedTrans(data))
            .catch((error) => console.error('Error searching transaction:', error));
    };
    const fetchStarData = () => {
        fetch('/api/star')
            .then(response => response.json())
            .then(data => setTransData(data))
            .catch(error => console.error('Error fetching star data:', error));
    };

    return (
        <div className="container w-full mx-auto px-4 sm:px-6 lg:px-8">
            {!loggedIn ? (
                <p className="text-center text-red-600 text-4xl">請先登入方可使用所有功能謝謝</p>
            ) : (

                <div className="container m-4 rounded-lg border-4 border-gray-500 bg-gray-200 mx-auto  p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="m-4 font-bold text-2xl"><Icon icon="mdi:cloud-print"
                                                                     className=" text-green-500 inline text-4xl"/>靜態展回覆紀錄統計
                        </h1>
                        <div className="heard text-l font-bold flex m-2">
                            <p className="text-xl mr-4">人員統計:</p>
                            <p className="mr-4 text"><Icon icon="icon-park-solid:boy-one"
                                                           className="text-blue-500 inline text-xl"/>男生: {genderStats.find(item => item.Gender === '男性')?.NumberOfStudents || 0}
                            </p>
                            <p className="mr-4"><Icon icon="icon-park-solid:girl-one"
                                                      className="inline text-red-600 text-xl"/>女生: {genderStats.find(item => item.Gender === '女性')?.NumberOfStudents || 0}
                            </p>
                            <p className="mr-4"><Icon icon="raphael:people"
                                                      className="inline text-xl"/>總數: {genderStats.find(item => item.Gender === '總數')?.NumberOfStudents || 0}
                            </p>
                        </div>
                    </div>


                    <div className="flex flex-col md:flex-row justify-center items-center">
                        <div>

                            <button
                                className=" px-4 h-8 rounded-lg m-2   text-xl font-bold  bg-green-500/40 hover:bg-green-600 text-black hover:text-white"
                                onClick={searchTransaction}><Icon icon="tabler:search"
                                                                  className="text-yellow-400 text-2xl inline font-bold"/>單一序號查詢
                            </button>
                            <input
                                className="border-2 bg-white  w-28 h-8 text-center m-2 bg-gray-200 rounded-lg border-gray-300"
                                type="text"
                                placeholder="序號查詢"
                                value={searchTranID}
                                onChange={(e) => setSearchTranID(e.target.value)}
                            />

                            <button
                                className=" px-4 h-8 rounded-lg  text-xl font-bold   bg-green-500/40 hover:bg-green-600 text-black hover:text-white"
                                onClick={() => setSearchedTrans(null)}><Icon icon="uil:smile"
                                                                             className="text-yellow-400 text-2xl inline"/>顯示所有資料
                            </button>

                            <button
                                className=" px-4 m-2 h-8 rounded-lg  text-xl font-bold    bg-green-500/40 hover:bg-green-600 text-black hover:text-white"
                                onClick={fetchLongestReplyData}><Icon icon="noto-v1:ok-hand"
                                                                      className="text-yellow-400 inline"/>顯示字最多的
                            </button>
                            <button
                                className=" px-4 m-2 h-8 rounded-lg  text-xl font-bold   bg-green-500/40 hover:bg-green-600 text-black hover:text-white"
                                onClick={fetchStarData}><Icon icon="ant-design:star-filled"
                                                                      className="text-yellow-500 inline"/>優先顯示有標記的
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className=" min-w-full bg-white border-4 border-gray-500">
                            <thead>
                            <tr>
                                <th className="text-center border">標記</th>
                                <th className=" border ">序號</th>
                                <th className="py-2 px-2 border">班級</th>
                                <th className="py-2 px-2 border">學號</th>
                                <th className="py-2 px-4 border">姓名</th>
                                <th className=" border ">性別</th>
                                <th className="py-2 px-4 border">回覆說明</th>
                                <th className="py-2 px-4 border">填表單時間</th>
                                <th className="py-2 px-4 border">標記/刪除</th>
                            </tr>
                            </thead>
                            <tbody>
                            {searchedTrans ? (
                                <tr className="bg-gray-100">
                                    <td className="text-center mx-auto border">{searchedTrans.UP_User === 1 ? (
                                        <Icon icon="ant-design:star-filled" className="text-yellow-400" />
                                    ) : (
                                        ''
                                    )}</td>
                                    <td className="text-center border">{searchedTrans.ID}</td>
                                    <td className="py-2 px-4 border">{searchedTrans.Class}</td>
                                    <td className="py-2 px-4 border">{searchedTrans.StudentID}</td>
                                    <td className="py-2 px-4 border">{searchedTrans.Name}</td>
                                    <td className="py-2   w-10 text-center border">{searchedTrans.Gender}</td>
                                    <td className="py-2 px-2 w-1/2 border">{searchedTrans.Content}</td>
                                    <td className="py-2 px-4 border">{searchedTrans.UP_Date}</td>

                                    <td className="py-2 px-4 flex justify-center border">
                                        <button
                                            className="px-2.5 mr-4 h-8 rounded-lg text-xl font-bold text-white bg-green-500 hover:bg-green-700"
                                            onClick={() => SearchupdateReply(searchedTrans.ID)}>
                                            <Icon icon="mdi:account-star"/>
                                        </button>
                                        <button
                                            className="px-2.5 mr-4 h-8 rounded-lg text-xl font-bold text-white bg-red-500 hover:bg-red-700"
                                            onClick={() => deleteTransaction(searchedTrans.ID)}>
                                            <Icon icon="material-symbols:delete"/>
                                        </button>

                                    </td>
                                </tr>
                            ) : (
                                transData.map((trans, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                        <td className="text-center border"> {trans.UP_User === 1 ? (
                                            <Icon icon="ant-design:star-filled" className="text-yellow-400" />
                                        ) : (
                                            ''
                                        )}</td>
                                        <td className="text-center  border">{trans.ID}</td>
                                        <td className="py-2 px-4  border">{trans.Class}</td>
                                        <td className="py-2 px-4 border">{trans.StudentID}</td>
                                        <td className="py-2 px-4 border">{trans.Name}</td>
                                        <td className="py-2 w-10 text-center border">{trans.Gender}</td>
                                        <td className="py-2 px-2 w-1/2 border">{trans.Content}</td>
                                        <td className="py-2 px-4 border">{trans.UP_Date}</td>
                                        <td className="py-2 px-4 flex justify-center border">
                                            <button
                                                className="px-2.5 mr-4 h-8 rounded-lg text-xl font-bold text-white bg-green-500 hover:bg-green-700"
                                                onClick={() => updateReply(trans.ID)}>
                                                <Icon icon="mdi:account-star"/>
                                            </button>
                                            <button
                                                className="px-2.5 mr-4 h-8 rounded-lg text-xl font-bold text-white bg-red-500 hover:bg-red-700"
                                                onClick={() => deleteTransaction(trans.ID)}>
                                                <Icon icon="material-symbols:delete"/>
                                            </button>

                                            {showDeleteAlert && (
                                                <div
                                                    className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded shadow animate-slide-in-out">
                                                    刪除成功!
                                                </div>
                                            )}

                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>

                    </div>


                </div>
            )}
            <style>
                {`
                @keyframes slide-in-out {
                    0%, 100% { transform: translateX(120%); }
                    10%, 90% { transform: translateX(0); }
                }

                .animate-slide-in-out {
                    animation: slide-in-out 3s ease;
                }
                `}
            </style>
        </div>


    );


}

export default TransList;


