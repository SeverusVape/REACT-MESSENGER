import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../../img/type.gif";

const Home = ({ username, setUsername, room, setRoom, socket }) => {
    const navigate = useNavigate();

    const joinRoom = () => {
        if (room !== "" && username !== "") {
            socket.emit("join_room", { username, room });
        }

        navigate("/chat", { replace: true });
    };

    return (
        <div className={styles.container}>
            <img src={logo} className={styles.banner} alt="logo" />
            <div className={styles.formContainer}>
                <h1>{`<> Codding_Den </>`}</h1>
                <input
                    className={styles.input}
                    placeholder="Username..."
                    onChange={(e) => setUsername(e.target.value)}
                />

                <select
                    className={styles.input}
                    onChange={(e) => setRoom(e.target.value)}
                >
                    <option>-- Select Room --</option>
                    <option value="javascript">JavaScript</option>
                    <option value="node">Node</option>
                    <option value="express">Express</option>
                    <option value="react">React</option>
                </select>

                <button className="btn btn-secondary" onClick={joinRoom}>
                    Join Room
                </button>
            </div>
        </div>
    );
};

export default Home;
