import React from 'react'
import { helloTesting } from '../api/TestingApiService'

const Home = () => {


    async function handleHelloTesting() {
        try {
            const response = await helloTesting();
            const data = await response.data;
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }


  return (
    <div>
        Home
        <button onClick={handleHelloTesting}>Call Hello</button>
        </div>
  )
}

export default Home