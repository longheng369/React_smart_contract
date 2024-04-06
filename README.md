1. make sure we have installed Metamask, Ganache and Node on our computer
   - https://metamask.io
   - https://archive.trufflesuite.com/ganache
   - https://nodejs.org/en
3. open Window powershell and run command ( npm install -g truffle )
4. git clone these code or copy code from these directory
5. change directory to smart_contract by running command ( cd smart_contract )
6. run command ( truffle migrate ) you will see some result shown in your terminal and you have to find contract address
7. copy the contract address and past it into react js project
   - into client directory you need to go to src/App.jsx
   - when you are staying on App.jsx you will see  <ToDoListComponent contractAddress={import.meta.env.VITE_CONTRACT_ADDRESS} />
   - replace ( import.meta.env.VITE_CONTRACT_ADDRESS ) with the contract address you have copied from truffle migrate
8. change directory to client using command line ( cd client )
9. run command ( npm run dev )
