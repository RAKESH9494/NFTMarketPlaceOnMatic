import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ethers } from 'ethers';
const SignUp = (props) =>{
    const [filelink,setFileLink] = useState();
    const [file,setFile] = useState(false);
    const [uploadstatus,setUploadS] = useState();
    const [uploadstatus1,setUploadS1] = useState();

    useEffect(()=>{
        const handler = async(e) =>{
          try{
            setUploadS("Please wait..")
            const formData = new FormData();
            formData.append("file",file);
            const redFile = await axios({
              method:"post",
              url:'https://api.pinata.cloud/pinning/pinFileToIPFS',
              data:formData,
              headers:{
                pinata_api_key :'5dfc50601737f72d83ec',
                pinata_secret_api_key:'97977aa1fb894984a34f889f0b95ada09f16f8be349c2632e00b5b8080d29452',
                "Content-Type":"multipart/form-data",
              }
            });
            const ImgHash =`https://ipfs.io/ipfs/${redFile.data.IpfsHash}`;
            setFileLink(ImgHash);
            setUploadS();
          }catch(e){
            alert("Unable to upload try again");
            console.log(e)
          }
        }
        file && handler();
    },[file])
    const onchangeHadler = async(e) =>{
        const data = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () =>{
          setFile(e.target.files[0]);
        };
    }
    const handler =async(e) =>{
        const Fname = document.querySelector("#FName").value;
        const Lname = document.querySelector("#LName").value;
        const pw = document.querySelector("#password").value;
        e.preventDefault();
        try{
            const amount ={value : ethers.utils.parseEther("0.00001")}
            const transaction = await props.contract.SignUp(Fname,Lname,filelink,props.account,pw,amount);
            setUploadS1("Please wait...")
            await transaction.wait()
            setUploadS1("")
            alert("Details submited successfull..")          
            window.location.reload();

            
        }catch(e){
            alert(e.reason)
            console.log(e)
            setUploadS1("");
        }
    }
return (
    <div>
        <center>
            <div class="signUpbox">
              <h2>SIGN UP</h2>
              <form class="form-group" onSubmit={handler}>
                <label>FIRST NAME</label>
                <input type="text" class="form-control" id="FName" required/>
                <label>LAST NAME</label>
                <input type="text" class="form-control" id="LName" required/>
                <label>Account</label>
                <input type="text" class="form-control" value={props.account} required/>
                <label>PASSWORD</label>
                <input type="password" class="form-control" id="password" required/><br/>
                <label>Profile</label><br/>
                <input type="file" onChange={onchangeHadler} required/><br/>
                <p>{uploadstatus}</p>
                <br/>
                <input type="submit" value={"SUBMIT"} class="btn btn-secondary" />&nbsp;
               </form>
               <button class="btn btn-secondary" onClick={()=>window.location.reload()}>CLOSE</button>&nbsp;
               <p>{uploadstatus1}</p>
           </div>
        </center>
    </div>
)}
 export default SignUp