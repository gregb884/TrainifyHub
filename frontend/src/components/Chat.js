import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {
    TextField, Button, List, ListItem, ListItemText, IconButton, Paper, Typography, Avatar, Box, Badge
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { getUserInfo } from "@/utils/jwtDecode";
import { useTranslation } from 'react-i18next';
import {useTheme} from "@mui/material/styles";
import MailIcon from '@mui/icons-material/Mail';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Chat = forwardRef(({ jwtToken }, ref) => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [recipient, setRecipient] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [connected, setConnected] = useState(false);
    const [open, setOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [newRecipient, setNewRecipient] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0); // Unread messages count
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const stompClient = useRef(null);
    const { t } = useTranslation('chat');
    const theme = useTheme();


    useEffect(() => {
        if (jwtToken) {
            const user = getUserInfo(jwtToken);
            setUsername(user.email);
            connect(jwtToken, user.email);
            fetchConversations();
            fetchUnreadCount();
        }
    }, [jwtToken]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (newRecipient) {
            handleNewRecipientSubmit();
        }
    }, [newRecipient]); //

    const connect = (token, username) => {
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_MESSENGER.replace(/\/$/, "")}/ws`);
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            debug: function (str) {
            },
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            onConnect: () => {
                setConnected(true);
                stompClient.current.subscribe(`/user/queue/messages/${username}`, onMessageReceived);
                stompClient.current.subscribe(`/user/queue/unreadCount`, (message) => {
                    const unreadCount = JSON.parse(message.body);
                    setUnreadCount(unreadCount);
                });
                stompClient.current.publish({
                    destination: '/app/chat.addUser',
                    body: JSON.stringify({ sender: username, type: 'JOIN' })
                });
            },
            onStompError: (frame) => {

            }
        });

        stompClient.current.activate();
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_MESSENGER}/api/messages/unreadCount`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            setUnreadCount(response.data);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const sendMessage = (event) => {
        event.preventDefault();
        if (stompClient.current && input.trim() && recipient) {
            const chatMessage = {
                sender: username,
                recipient: recipient,
                content: input,
                type: 'CHAT'
            };
            stompClient.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage)
            });
            setInput('');
        }
    };

    const onMessageReceived = (message) => {
        const messageData = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, messageData]);

        if (recipient === messageData.sender) {
            markMessageAsRead(messageData.sender, username);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_MESSENGER}/api/conversations`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchMessages = async (recipient, pageNumber = 0, append = false) => {
        try {
            const container = messagesContainerRef.current;
            const scrollPosition = container.scrollHeight - container.scrollTop;

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_MESSENGER}/api/messages`, {
                params: { recipient: recipient, page: pageNumber, size: 20 },
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            const newMessages = response.data.content.reverse();
            setHasMore(!response.data.last);

            if (append) {
                setMessages(prevMessages => [...newMessages, ...prevMessages]);

                setTimeout(() => {
                    container.scrollTop = container.scrollHeight - scrollPosition;
                }, 100);
            } else {
                setMessages(newMessages);
                scrollToBottom();
            }
            setPage(pageNumber);
            setChatOpen(true);

            fetchUnreadCount();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const loadMoreMessages = () => {
        if (hasMore) {
            fetchMessages(recipient, page + 1, true);
        }
    };

    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && hasMore) {
            loadMoreMessages();
        }
    };

    const handleClickOpen = () => {
        fetchConversations();
        setOpen(true);
    };

    const handleClose = async () => {
        if (recipient) {
            await fetchMessages(recipient, 0);
        }
        setOpen(false);
        setChatOpen(false);
        setRecipient('');
        setRecipientName('');
        setMessages([]);
        setPage(0);
        setNewRecipient('');
        fetchUnreadCount();
    };


    const handleCloseConversation = () => {
        setOpen(false); // Zamknij okno czatu

        setTimeout(() => {
            setChatOpen(false);
            setRecipient('');
            setRecipientName('');
            setMessages([]);
            setPage(0);
            setNewRecipient('');

            setOpen(true);
        }, 100); // Daj czas na zamknięcie i reset
    };

    const handleNewRecipientSubmit = () => {
        if (newRecipient.trim()) {
            setRecipient(newRecipient.trim());
            setRecipientName(newRecipient.trim());
            setChatOpen(true);
            setPage(0);
            fetchMessages(newRecipient, 0);
        }
    };

    useImperativeHandle(ref, () => ({
        handleExternalOpen(trainerUsername) {
            handleClickOpen();
            setNewRecipient(trainerUsername);
        }
    }));

    return (
        <div id="chatComponent">
            <IconButton  onClick={handleClickOpen} sx={{color: theme.palette.primary.main, position: 'fixed', bottom: 16, right: 16 }}>
                <Badge badgeContent={unreadCount} color="primary">
                    <ChatIcon />
                </Badge>
            </IconButton>
            {open && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: {md: '16' , xs: 10},
                        right: {md: '16' , xs: 7},
                        width: 360,
                        height: 500,
                        borderRadius: 4,
                        boxShadow: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: {md: 'rgba(0,0,0,0.9)', xs: 'rgba(0,0,0,1)'}
                    }}
                >
                    <Box sx={{ p: 2, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>

                        {recipientName === "" && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between', // Rozstawia elementy maksymalnie na boki
                                }}
                            >
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    {t('chat')}
                                </Typography>
                                <Button
                                    onClick={handleClose}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                    }}
                                >
                                    <CloseIcon />
                                </Button>
                            </Box>
                        )}

                        {recipientName !== "" && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Button
                                    onClick={handleCloseConversation}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                        minWidth: 0,
                                        padding: '12px',
                                        marginRight: '10px'
                                    }}
                                >
                                    <ArrowBackIcon fontSize="small" />
                                </Button>
                                <Typography variant="h6" sx={{ color: 'white', fontSize: '14px' }}>
                                    {t('chatWith')}{' '}
                                    {recipientName === 'TrainifyHubDE@gmail.com'
                                        ? 'TrainifyHub'
                                        : recipientName}
                                </Typography>
                                <Button
                                    onClick={handleClose}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                    }}
                                >
                                    <CloseIcon />
                                </Button>
                            </Box>

                        )}

                    </Box>
                    <Box ref={messagesContainerRef} sx={{ flex: 1, p: 2, overflowY: 'auto' }} onScroll={handleScroll}>
                        {!chatOpen ? (
                            <>
                                <Typography variant="h6" sx={{color : 'white'}} gutterBottom> {t('conversations')}</Typography>
                                <List>
                                    {conversations.map((conv, index) => {

                                        const isUnreadMessageFromOtherUser = !conv.read && conv.sender !== username;

                                        return (
                                            <ListItem
                                                key={index}
                                                button
                                                onClick={() => {
                                                    const selectedRecipient = conv.sender === username ? conv.recipient : conv.sender;
                                                    setRecipient(selectedRecipient);
                                                    setRecipientName(selectedRecipient);
                                                    setPage(0);
                                                    fetchMessages(selectedRecipient);
                                                }}
                                                sx={{
                                                    backgroundColor: isUnreadMessageFromOtherUser ? 'rgba(243,119,30,0.2)' : 'transparent',
                                                    borderRadius: '20px',
                                                    fontWeight: isUnreadMessageFromOtherUser ? 'bold' : 'normal',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Avatar
                                                    sx={{ bgcolor: theme.palette.secondary.main }}
                                                    alt={conv.sender}
                                                    src={
                                                        conv.imgUrl
                                                            ? `${process.env.NEXT_PUBLIC_API_PROFILE}${conv.imgUrl}`
                                                            : '/avatar-default-icon.png'
                                                    }
                                                />

                                                <ListItemText
                                                    primary={
                                                        (conv.sender === username ? conv.recipient : conv.sender) === 'TrainifyHubDE@gmail.com'
                                                            ? 'TrainifyHub'
                                                            : (conv.sender === username ? conv.recipient : conv.sender)
                                                    }
                                                    secondary={conv.content}
                                                    sx={{
                                                        marginLeft: 2,
                                                        '& .MuiListItemText-primary': { color: 'white' },
                                                        '& .MuiListItemText-secondary': { color: 'gray' },
                                                    }}
                                                />


                                                {isUnreadMessageFromOtherUser && (
                                                    <MailIcon sx={{ color: '#f50057', marginLeft: 'auto' }} />
                                                    )}
                                            </ListItem>
                                        );
                                    })}
                                </List>
                                <TextField
                                    label={t('newRecipient')}
                                    value={newRecipient}
                                    onChange={(e) => setNewRecipient(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    style={{ display: 'none' }}
                                />
                                <Button style={{ display: 'none' }} onClick={handleNewRecipientSubmit} variant="contained" color="primary"> {t('startChat')}</Button>
                            </>
                        ) : (
                            <>
                                <List sx={{ flex: 1, overflowY: 'auto' }}>
                                    {messages.map((msg, index) => (
                                        <ListItem key={index} sx={{ display: 'flex', justifyContent: msg.sender === username ? 'flex-end' : 'flex-start' }}>
                                            <Paper sx={{
                                                padding: 2,
                                                backgroundColor: msg.sender === username ? theme.palette.secondary.main : theme.palette.primary.main,
                                                color: msg.sender === username ? '#302c2c' : '#f4f3f3',
                                                borderRadius: 4,
                                                maxWidth: '60%',
                                            }}>
                                                <Typography sx={{
                                                    color: msg.sender === username ? '#f4f3f3' : '#302c2c'
                                                }} variant="body1">
                                                    {msg.content}
                                                </Typography>
                                            </Paper>
                                        </ListItem>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </List>
                                <form onSubmit={sendMessage}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                                        <TextField
                                            label= {t('typeMessage')}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            sx={{ flexGrow: 1, marginRight: 1}}
                                        />
                                        <IconButton type="submit" color="primary">
                                            <SendIcon />
                                        </IconButton>
                                    </Box>
                                </form>
                            </>
                        )}
                    </Box>

                </Box>
            )}
        </div>
    );
});

export default Chat;
