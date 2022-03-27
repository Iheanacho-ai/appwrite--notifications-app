import { useState, useEffect } from 'react';
import { Appwrite } from 'appwrite';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [theArray, setTheArray] = useState([]);
  const [response, setResponse] = useState('');

  const notify = (response) => {
    toast(response)
  };

  // Init your Web SDK
  const sdk = new Appwrite();

  sdk
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject('623e9f8f72ddf70330ba') // Your project ID
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
        sdk.subscribe('collections.623e9fa6d3bc9f4cc088.documents', response => {
          console.log(response, 'subscription response');
          setResponse(`The Appwrite ${response.event} event was called`)
      
          
        });
        
      } catch (error) {
        console.log(error, 'error')
      }

    }


  }, [])
  
  
  
  const listDocuments = async() => {
    try {
      
      let response = await sdk.database.listDocuments('623e9fa6d3bc9f4cc088');
      setTheArray(prevArray => [...prevArray, response.documents[0].$id])
    } catch (error) {
      console.log(error);
    }
  }
  
  
  const createDocument = async () => {

    try{
      await sdk.database.createDocument('623e9fa6d3bc9f4cc088', "unique()", {
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
        await sdk.database.deleteDocument('623e9fa6d3bc9f4cc088', documentID);
        listDocuments();

      } catch (error) {
        console.log(error)
        
      }
      
    } else {
      alert('database is empty')
    }
    
    
  }
      
      
    

  const updateDocument = async () => {
    if (theArray.length > 0) {
      try{
      
        let documentID = theArray[theArray.length - 1]
  
        await sdk.database.updateDocument('623e9fa6d3bc9f4cc088', documentID, {
          "message": "Bye World!"
        })
        listDocuments();
        
  
      }catch(error){
        console.log(error)
      }
    } else {
      alert('database is empty')
    }
    
  }


  useEffect(() => {
    notify(response);
  }, [response]);




  return (
    <div className="App">
      <button type='button' onClick={createDocument}>Create Document</button>
      <button type='button' onClick={updateDocument}>Update Document</button>
      <button type='button' onClick={deleteDocument}>Delete Document</button>
      <ToastContainer/>
    </div>
  );
}

export default App;
