import { useEffect } from 'react';
import { useState, useRef } from 'react'
import useAutosizeTextArea from './hooks/useAutoSizeTextArea';

const OpenAi = () => {
   const textAreaRef = useRef(null);
   const messageEndRef = useRef(null);
   const [chats, setChats] = useState([]);
   const [value, setValue] = useState('');

   useAutosizeTextArea(textAreaRef.current, value);

   const fetched = async (value) => {
      try {
         setChats([...chats, { type: 'user', message: value }])
         const response = await fetch('https://chatgptapi.vercel.app', {
            method: "post",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               message: value
            })
         })

         const data = await response.json();

         if(!data.err) return data
         else return { type: 'ai', message: data.err }
      } catch (err) {
         return {type: 'ai', message: "A server error has occurred. Please try again"}
      }
   }

   const press = async (e) => {
      e.preventDefault();
      setValue('')
      const result = await fetched(value);
      setChats((ch) => [...ch, { type: result.type, message: `${result.message}` }])
   }

   const onNewChat = () => {
      setChats([])
   }

   useEffect(() => {
      messageEndRef.current.scroll({ top: messageEndRef.current.clientHeight, behavior: "smooth" })
   }, [chats])
   return (
      <div className='container'>
         <div className='sidebar'>
            <div className='button' onClick={onNewChat}>+ New chat</div>
         </div>
         <div className="body">
            <div className="wrapper">
               <div className="main" ref={messageEndRef}>
                  <h3 className='title'>Hello, my name is <b>ChatGPT</b></h3>
                  <div className='message-list'>
                     {
                        chats.map((item, index) => (
                           <span className={item.type} style={{ whiteSpace: 'pre-wrap', lineHeight: '30px' }} key={index}>{item.message}</span>
                        ))
                     }
                  </div>
               </div>
               <div className="footer">
                  <form onSubmit={press} className="form">
                     <textarea
                        ref={textAreaRef}
                        type="text" 
                        placeholder='what you want to search'
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        rows={1}
                     />
                     <button className='btn button'>
                        <span>Send</span>
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </div>
   )
}

export default OpenAi