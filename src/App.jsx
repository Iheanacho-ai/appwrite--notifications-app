import { useState, useEffect } from 'react';
import { Appwrite } from 'appwrite';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [theArray, setTheArray] = useState([]);
  const [response, setResponse] = useState('Welcome!');

  const notify = (response) => {
    toast(response)
  };

  // Init your Web SDK
  const sdk = new Appwrite();

  sdk
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject('624390e727ad84962ae7') // Your project ID
  ;

  async function createAnonymousSession(){
    try{
        await sdk.account.createAnonymousSession();

    }catch(err){
        console.log(err)
    }
    
  }

  useEffect(()=> {
    createAnonymousSession();

    if(sdk.account.get !== null){
      try {
        sdk.subscribe('collections.62439bdfd0d07f61fe83.documents', response => {
          setResponse(`The Appwrite ${response.event} event was called`)
      
          
        });
        
      } catch (error) {
        console.log(error, 'error')
      }

    }


  }, [])
  
  
  
  const listDocuments = async() => {
    try {
      
      let response = await sdk.database.listDocuments('62439bdfd0d07f61fe83');
      response.documents.map(document => setTheArray(prevArray => [...prevArray, document.$id]) )
      
    } catch (error) {
      console.log(error);
    }
  }

  
  const createDocument = async () => {

    try{
      await sdk.database.createDocument('62439bdfd0d07f61fe83', "unique()", {
        "message": "Hello World!",
      });
     
      
      listDocuments()
      
      
    }catch(error){
      console.log(error)
    }
           
  }




  const deleteDocument = async () => {
    if (theArray.length > 0) {
      try {
        let documentID = theArray[theArray.length - 1]
        await sdk.database.deleteDocument('62439bdfd0d07f61fe83', documentID);
        listDocuments();

      } catch (error) {
        console.log(error)
        
      }
      
    } else {
      alert('database is empty')
    }
    
    
  }
      
      
    

  useEffect(() => {
    notify(response)
  }, [response])




  return (
    <div className="App">
      <button type='button' onClick={createDocument}>Create Document</button>
      <button type='button' onClick={deleteDocument}>Delete Document</button>
      <ToastContainer/>
    </div>
  );
}

export default App;
