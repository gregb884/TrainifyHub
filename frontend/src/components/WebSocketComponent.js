import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { getUserId } from "@/utils/jwtDecode";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';


const apiUrl = process.env.NEXT_PUBLIC_API_NOTIFICATION;

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState(null);
    const stompClientRef = useRef(null);
    const hasFetchedNotifications = useRef(false);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 10;
    const arrowIntervalRef = useRef(null);

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) {
            console.error("Brak tokena, WebSocket nie może się połączyć.");
            return;
        }

        const userId = getUserId(token);
        setUserId(userId);

        const fetchUnreadNotifications = async () => {
            if (hasFetchedNotifications.current) return;
            hasFetchedNotifications.current = true;
            try {
                const response = await axios.get(`${apiUrl}/api/notifications/unread`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const newMessages = response.data.filter(notification =>
                    !messages.some(msg => msg.id === notification.id));

                const uniqueMessages = [...messages, ...newMessages].reduce((acc, current) => {
                    const exists = acc.find(item => item.id === current.id);
                    return exists ? acc : acc.concat([current]);
                }, []);

                setMessages(uniqueMessages);
                newMessages.forEach(notification => handleNotification(notification));
            } catch (error) {
                console.error('Error fetching unread notifications:', error);
            }
        };

        fetchUnreadNotifications();

        const connectWebSocket = () => {
            console.log("🔗 Próba połączenia z WebSocket...");

            const socket = new SockJS(`${apiUrl}/ws`);
            const stompClient = new Client({
                webSocketFactory: () => socket,
                connectHeaders: { Authorization: `Bearer ${token}` },
                debug: (msg) => console.log(`🔧 STOMP Debug: ${msg}`),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            stompClient.onConnect = () => {
                console.log("✅ Połączono z WebSocket!");
                reconnectAttempts.current = 0;

                stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
                    if (message.body) {
                        const newMessage = JSON.parse(message.body);

                        setMessages((prevMessages) => {
                            const uniqueMessages = [...prevMessages, newMessage].reduce((acc, current) => {
                                const exists = acc.find(item => item.id === current.id);
                                return exists ? acc : acc.concat([current]);
                            }, []);
                            handleNotification(newMessage);
                            return uniqueMessages;
                        });
                    }
                });
            };

            stompClient.onStompError = (frame) => {
                console.error("🚨 STOMP Błąd:", frame);
            };

            stompClient.onWebSocketClose = () => {
                console.warn("⚠️ WebSocket zamknięty, ponawianie połączenia...");
                if (reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current += 1;
                    setTimeout(() => stompClient.activate(), 5000);
                } else {
                    console.error("❌ Osiągnięto maksymalną liczbę prób ponownego połączenia.");
                }
            };

            stompClient.activate();
            stompClientRef.current = stompClient;
        };

        connectWebSocket();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    const CustomSmokeNotification = ({ message }) => (
        <div className="custom-toast">
            <div className="smoke-layer"></div>
            <div className="smoke-layer"></div>
            <div className="smoke-layer"></div>
            <div className="text-content">{message}</div>
        </div>
    );

    const CustomProgressNotification = ({ message }) => (
        <div className="custom-toast-pro">
            <div
                className="text-content"
                dangerouslySetInnerHTML={{
                    __html: message
                            .replace(/\/n/g, '<br />')
                            .replace(/arrowGreen/g, '<span class="arrow-right">&#8594;</span>')
                        + '<br />&#128640;&#128640;&#128640;&#128640;'
                }}
            />
        </div>
    );

    const CustomRegressNotification = ({ message }) => (
        <div className="custom-toast-regress">
            <div
                className="text-content"
                dangerouslySetInnerHTML={{
                    __html: message
                        .replace(/\/n/g, '<br />')
                }}
            />
        </div>
    );

    const CustomNewExerciseNotification = ({ message }) => (
        <div className="custom-toast-newExercise">
            <div className="layer">
                {[...Array(100)].map((_, i) => (
                    <div key={i} className="glass"></div>
                ))}
            </div>
            <div
                className="text-content"
                dangerouslySetInnerHTML={{
                    __html: message
                        .replace(/\/n/g, '<br />')
                }}
            />
        </div>
    );

    function generateArrows() {
        if (arrowIntervalRef.current) {
            return; // Jeśli interwał już działa, nie uruchamiaj nowego
        }

        const arrowContainer = document.querySelector('.arrow-container');
        if (!arrowContainer) return;

        function createArrow() {
            const arrow = document.createElement('div');
            arrow.classList.add('arrow');
            arrow.style.left = `${Math.random() * 100}%`;
            arrowContainer.appendChild(arrow);

            arrow.addEventListener('animationend', () => {
                arrow.remove();
            });
        }

        arrowIntervalRef.current = setInterval(createArrow, 100);

        setTimeout(() => {
            clearInterval(arrowIntervalRef.current);
            arrowIntervalRef.current = null;
        }, 5000);

        setTimeout(() => clearArrows(), 20000);
    }


    function generateArrowsRed() {
        if (arrowIntervalRef.current) {
            return; // Jeśli interwał już działa, nie uruchamiaj nowego
        }

        const arrowContainer = document.querySelector('.arrow-container');
        if (!arrowContainer) return;

        function createArrow() {
            const arrow = document.createElement('div');
            arrow.classList.add('arrowRed');
            arrow.style.left = `${Math.random() * 100}%`;
            arrowContainer.appendChild(arrow);

            arrow.addEventListener('animationend', () => {
                arrow.remove();
            });
        }

        arrowIntervalRef.current = setInterval(createArrow, 100);

        setTimeout(() => {
            clearInterval(arrowIntervalRef.current);
            arrowIntervalRef.current = null;
        }, 5000);

        setTimeout(() => clearArrows(), 2000);
    }

    function clearArrows() {
        const arrowContainer = document.querySelector('.arrow-container');
        if (arrowContainer) arrowContainer.innerHTML = '';

        if (arrowIntervalRef.current) {
            clearInterval(arrowIntervalRef.current);
            arrowIntervalRef.current = null;
        }
    }

    const handleNotification = (notification) => {
        const formattedMessage = notification.message.replace(/\n/g, '<br />');
        if (notification.message.startsWith("PRO")) {
            toast(
                <CustomProgressNotification message={notification.message.replace("PRO", "")} />,
                {
                    onClose: () => {
                        markAsRead(notification.id);
                        clearArrows();
                    },
                    className: "toast-pro",
                    transition: Slide,
                    autoClose: 5000,
                }
            );
            generateArrows();
        } else if (notification.message.startsWith("RE")) {
            toast(
                <CustomRegressNotification message={notification.message.replace("RE", "")} />,
                {
                    onClose: () => {
                        markAsRead(notification.id);
                        clearArrows();
                    },
                    className: "toast-regress",
                    transition: Slide,
                    autoClose: 5000,
                }
            );
            generateArrowsRed();
        }
        else if (notification.message.startsWith("NE")) {
            toast(
                <CustomNewExerciseNotification message={notification.message.replace("NE", "")} />,
                {
                    onClose: () => {
                        markAsRead(notification.id);
                    },
                    className: "toast-new",
                    transition: Slide,
                    autoClose: 5000,
                }
            );
        }

        else {
            toast.info(notification.message, {
                onClose: () => {
                    markAsRead(notification.id);
                    clearArrows();
                },
                className: "toast-default"  // Klasa CSS dla standardowego stylu
            });
        }
    };

    const markAsRead = async (notificationId) => {


        clearArrows()

        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            await axios.post(`${apiUrl}/api/notifications/mark-as-read?notificationId=${notificationId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== notificationId));

        } catch (error) {

            console.error('Error marking notification as read:', error);
        }
    };


    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastClassName={(context) =>
                    context?.message.startsWith("PRO") ? "toast-pro" :
                        context?.message.startsWith("NE") ? "toast-ne" :
                            "toast-regress"
                }
            />
            <div className="arrow-container"></div>
        </div>
    );
};

export default WebSocketComponent;