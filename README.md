
# Realtime simple chat

Simple real-time chat application with chat rooms. 


## Tools that was used

* Front-end : [React](https://reactjs.org/)
* Backend : [Node](https://nodejs.dev/) and [Express](https://expressjs.com/)
* Database : [HarperDB](https://harperdb.io/)
* Real-time communication: [Socket.io](https://socket.io/docs/v3/)




## Screenshots
### Home page
![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)
### Main page
![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

## Installation

### If you want to try it localy:
```bash
    git clone <this porject>
```
... or simply download .zip file.



#### Project contains 2 folders [client] and [server]:
* First cd into [client] folder:

    ```bash
    $ cd REACT-MESSENGER-master/
    $ cd client/
    $ npm install
    $ npm start
    ```
app will opens on port http://localhost:3000 

* Then cd into [server] folder:
This folder will connect your front to back and let interract with DB and Socket.io

```bash
    $ cd REACT-MESSENGER-master/
    $ cd server/
    $ npm install
    $ npm run dev
 ```

* To be able to recive and send messages your have to make an acount on HarperDB.
    * Into [.env] file insert URL and PASSWORD from your claster.
