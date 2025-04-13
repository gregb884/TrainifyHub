import React, { useEffect, useState } from 'react';
import '@/app/contactCard.css';

const ContactCard = ({ language }) => {
    const [getInTouch, setGetInTouch] = useState('');
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sendMessage, setSendMessage] = useState('');

    useEffect(() => {
        switch (language) {
            case 'en':
                setGetInTouch('Get In Touch');
                setName('Name');
                setSubject('Subject');
                setMessage('Message');
                setSendMessage('Send Message');
                break;
            case 'pl':
                setGetInTouch('Skontaktuj się z nami');
                setName('Imię');
                setSubject('Temat');
                setMessage('Wiadomość');
                setSendMessage('Wyślij wiadomość');
                break;
            case 'de':
                setGetInTouch('Kontaktieren Sie uns');
                setName('Name');
                setSubject('Betreff');
                setMessage('Nachricht');
                setSendMessage('Nachricht senden');
                break;
            default:
                setGetInTouch('Get In Touch');
                setName('Name');
                setSubject('Subject');
                setMessage('Message');
                setSendMessage('Send Message');
        }
    }, [language]);

    return (
        <div className="form-card1">
            <div className="form-card2">
                <form className="form">
                    <p className="form-heading">{getInTouch}</p>

                    <div className="form-field">
                        <input required placeholder={name} className="input-field" type="text" />
                    </div>

                    <div className="form-field">
                        <input required placeholder="Email" className="input-field" type="email" />
                    </div>

                    <div className="form-field">
                        <input required placeholder={subject} className="input-field" type="text" />
                    </div>

                    <div className="form-field">
                        <textarea required placeholder={message} cols="30" rows="3" className="input-field"></textarea>
                    </div>

                    <button className="sendMessage-btn">{sendMessage}</button>
                </form>
            </div>
        </div>
    );
};

export default ContactCard;