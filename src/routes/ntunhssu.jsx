import React, {useState} from 'react';
import {Icon} from '@iconify/react';
// import ntunhsT.png
import ntunhsT from './ntunhsT.png';
import {Helmet} from 'react-helmet';
/* eslint-disable no-unused-vars */
import Modal from './Modal.jsx';
import {checkLoginStatus} from './checkLogin.jsx';

const Ntunhssu = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [newReply, setNewReply] = useState({
        Class: '',
        StudentID: '',
        Name: '',
        Gender: '',
        Content: '',
        UP_User: '',
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
                setShowAlert(true);
                setNewReply({
                    Class: '',
                    StudentID: '',
                    Name: '',
                    Gender: '',
                    Content: '',
                    UP_User: '',
                });
            })
            .catch((error) => console.error('Error adding new reply:', error));
        setTimeout(() => {
            setShowAlert(false);
        }, 3000000);
    };

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedTrans, setEditedTrans] = useState(null);

    const openEditModal = () => {
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setShowAlert(false); // 關閉 Modal 時同時也關閉 showAlert
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Helmet>
                <title>北護學生會-靜態展</title>
            </Helmet>
            <header className="bg-blue-500/40 text-black/70 font-bold text-center p-4">
                <h1 className="text-2xl"><Icon icon="la:school" className="inline text-2xl"/>北護學生會</h1>
                Student Union of NTUNHS

            </header>

            <main className="p-4">
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">給新生的話</h2>
                    <div className="bg-white rounded-lg p-4 shadow">
                        <p>我們是北護學生會，歡迎你們加入北護大家庭，與我們一同開啟美好校園時光吧！</p>
                    </div>

                </section>
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">最新消息</h2>
                    <div className=" bg-white rounded-lg p-4 shadow">
                        <p className=" font-bold m-2 text-2xl">我們推出紀念衫囉!</p>
                        <p className=" font-bold m-2">新生在9/15前繳交學生會費即可免費領取一件</p>
                        <p className=" font-bold m-2">價格:</p>
                        <p className=" font-bold m-2">學生會會員:50/件</p>
                        <p className=" font-bold m-2">非會員:300/件</p>
                        <img className="border-2 border-black" src={ntunhsT} alt="北護校園景色"></img>
                        <p className=" font-bold m-2">有興趣的同學可以到學生會IG更多!</p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">靜態展回饋表單</h2>
                    <div className="bg-white rounded-lg p-4 shadow">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addReply(newReply);
                                openEditModal();
                            }}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-xl font-bold">性別</label>
                                <select
                                    onChange={(e) => setNewReply({...newReply, Gender: e.target.value})}
                                    value={newReply.Gender}
                                    id="gender"
                                    name="gender"
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">請選擇性別</option>
                                    <option value="男性">男性</option>
                                    <option value="女性">女性</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="isNewStudent" className="block text-xl font-bold">你是新生嗎</label>
                                <select
                                    onChange={(e) => setNewReply({...newReply, Class: e.target.value})}
                                    value={newReply.Class}
                                    id="isNewStudent" name="isNewStudent" className="w-full p-2 border rounded" required
                                >
                                    <option value="">請選擇</option>
                                    <option value="是">是</option>
                                    <option value="否">否</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="score" className="block text-xl font-bold">給今天的靜態展活動打個分數吧</label>
                                <select
                                    onChange={(e) => setNewReply({...newReply, StudentID: e.target.value})}
                                    value={newReply.StudentID}
                                    id="score" name="score" className="w-full p-2 border rounded" required
                                >
                                    <option value="">請選擇</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="interest" className="block text-xl font-bold">對學生會的紀念衫會有興趣嗎</label>

                                <label htmlFor="interest" className="block text-sm my-2">紀念衫為取代世子如林北護卡之試驗，如果銷售達到預期我們將每年推出不同款式。</label>


                                <select
                                    onChange={(e) => setNewReply({...newReply, Name: e.target.value})}
                                    value={newReply.Name}
                                    id="interest" name="interest" className="w-full p-2 border rounded" required
                                >
                                    <option value="">請選擇</option>
                                    <option value="是">有</option>
                                    <option value="否">沒有</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="message"
                                       className="block text-xl font-bold">有沒有任何建議可以提供給我們</label>
                                <textarea onChange={(e) => setNewReply({...newReply, Content: e.target.value})}
                                          value={newReply.Content} id="message" name="message"
                                          className="w-full h-24 p-2 border rounded" required/>
                            </div>
                            <button type="submit" className="bg-blue-500 text-xl font-bold text-white p-2 rounded">
                                送出
                            </button>
                        </form>

                    </div>
                </section>


                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">聯絡我們</h2>
                    <div className="bg-white rounded-lg p-4 shadow">
                        <a
                            href="https://www.instagram.com/ntunhssu_21/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" flex text-black underline mx-auto justify-center">
                            <Icon className="text-2xl mr-2" icon="skill-icons:instagram"/>關注我們的Instagram<Icon
                            className="text-2xl ml-2" icon="skill-icons:instagram"/>
                        </a>
                    </div>
                </section>
            </main>

            <footer className="bg-blue-500/40 text-black/50 font-bold text-white text-center p-2">
                <p>版權所有 &copy; 學生會</p>
            </footer>
            {showAlert && <Modal isOpen={editModalOpen} onClose={closeEditModal}>
                <div>
                    <img className="border-2 border-black" src={ntunhsT} alt="北護校園景色"></img>
                </div>
                <div className="m-4   text-center font-bold justify-center">將表單拿給攤位服務人員!
                    <p>希望你能在靜態展玩得開心~</p>
                    <p className="mt-4 ">最後記得支持我們的衣服喔!!!</p>
                    <a
                        href="https://www.instagram.com/p/CwCfxZ7LYd6/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" flex text-black underline mx-auto justify-center">
                        <Icon className="text-2xl mr-2" icon="skill-icons:instagram"/>點我可以跳到表單的詳細資訊喔!!<Icon
                        className="text-2xl ml-2" icon="skill-icons:instagram"/>
                    </a>
                </div>

            </Modal>}
        </div>

    );
};

export default Ntunhssu;
