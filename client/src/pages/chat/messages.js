import styles from "./styles.module.css";
import { useState, useEffect, useRef } from "react";

const Messages = ({ socket }) => {
    const [messagesRecieved, setMessagesReceived] = useState([]);

    const messagesColumnRef = useRef(null);

    // Runs whenever a socket event is recieved from the server
    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(data);
            setMessagesReceived((state) => [
                ...state,
                {
                    message: data.message,
                    username: data.username,
                    __createdtime__: data.__createdtime__,
                },
            ]);
        });

        // Remove event listener on component unmount
        return () => socket.off("receive_message");
    }, [socket]);

    useEffect(() => {
        socket.on("last_100_messages", (last100messages) => {
            console.log("last_100_messages:", JSON.parse(last100messages));

            last100messages = JSON.parse(last100messages);
            // sorting messages
            last100messages = sortMessagesByDate(last100messages);
            setMessagesReceived((state) => [...last100messages, ...state]);
        });

        return () => socket.off("last_100_messages");
    }, [socket]);

    //Scroll to recent message
    useEffect(() => {
        messagesColumnRef.current.scrollTop =
            messagesColumnRef.current.scrollHeight;
    }, [messagesRecieved]);

    function sortMessagesByDate(messages) {
        return messages.sort(
            (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
    }

    // dd/mm/yyyy, hh:mm:ss
    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className={styles.messagesColumn} ref={messagesColumnRef}>
            {messagesRecieved.map((msg, i) => (
                <div className={styles.message} key={i}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <span className={styles.msgMeta}>{msg.username}</span>
                        <span className={styles.msgMeta}>
                            {formatDateFromTimestamp(msg.__createdtime__)}
                        </span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default Messages;
